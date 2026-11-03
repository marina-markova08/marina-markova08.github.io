// Импортируем необходимые модули Firebase через CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Конфигурация для вашего проекта jaba-01
const firebaseConfig = {
  apiKey: "AIzaSyDLyUJ0GmuJJbdUwk1cPYot984AQWDzMi4", // Получите в настройках проекта в консоли
  authDomain: "jaba-01.firebaseapp.com",
  projectId: "jaba-01",
  storageBucket: "jaba-01.firebasestorage.app",
  messagingSenderId: "582903193533",
  appId: "1:582903193533:web:a8361f325c45037def3cd4" // Получите в настройках проекта в консоли
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

// Получаем элементы интерфейса
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

// Обработчик кнопки входа
loginBtn.addEventListener("click", async () => {
  try {
    userInfo.innerText = "Вход...";
    await signInWithPopup(auth, provider); // Запуск всплывающего окна GitHub
  } catch (error) {
    console.error("Ошибка:", error);
    userInfo.innerText = "Ошибка входа: " + error.message;
  }
});

// Обработчик кнопки выхода
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Отслеживание состояния пользователя
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Пользователь вошел
    userInfo.innerHTML = `
      <h3>Добро пожаловать, ${user.displayName || "Пользователь"}!</h3>
      <p>Email: ${user.email || "Скрыт"}</p>
      <img src="${user.photoURL}" width="100" alt="Аватар">
    `;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    // Пользователь вышел
    userInfo.innerHTML = "<p>Вы не авторизованы.</p>";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
