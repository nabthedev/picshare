// script.js

const API_URL = "http://localhost:3000"; // Change this if your backend uses a different port

window.onload = () => {
  const token = getToken();
  if (token) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("upload-section").style.display = "block";
    fetchImages();
  }
};

async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    saveToken(data.token);
    location.reload();
  } else {
    alert("Login failed");
  }
}

async function register() {
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.message === "User registered") {
    alert("Registered! Now login.");
  } else {
    alert("Registration failed");
  }
}

async function uploadImage() {
  const title = document.getElementById("image-title").value;
  const description = document.getElementById("image-desc").value;
  const file = document.getElementById("image-file").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/images/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData,
  });

  if (res.ok) {
    alert("Image uploaded!");
    fetchImages();
  } else {
    alert("Upload failed.");
  }
}

async function fetchImages() {
  const res = await fetch(`${API_URL}/api/images`);
  const images = await res.json();

  const list = document.getElementById("image-list");
  list.innerHTML = "";
  images.forEach(img => {
    const div = document.createElement("div");
    div.classList.add("image-card");
    div.innerHTML = `
      <strong><a href="/image/${img._id}">${img.title}</a></strong><br>
      <img src="${API_URL}/${img.imagePath}" alt="${img.title}">
      <p>${img.description}</p>
      <small>By ${img.author} on ${new Date(img.uploadDate).toLocaleString()}</small>
    `;
    list.appendChild(div);
  });
}

function logout() {
  clearToken();
  location.reload();
}
