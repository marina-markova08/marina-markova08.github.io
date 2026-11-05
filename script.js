import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Импортируем необходимые модули Firebase через CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Конфигурация для вашего проекта jaba-01
const firebaseConfig = {
  apiKey: "AIzaSyDLyUJ0GmuJJbdUwk1cPYot984AQWDzMi4", // Получите в настройках проекта в консоли
  authDomain: "jaba-01.firebaseapp.com",
  databaseURL: "https://jaba-01-default-rtdb.firebaseio.com",
  projectId: "jaba-01",
  storageBucket: "jaba-01.firebasestorage.app",
  messagingSenderId: "582903193533",
  appId: "1:582903193533:web:a8361f325c45037def3cd4" // Получите в настройках проекта в консоли
};
const googleProvider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("googleLoginBtn");

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();
const db = getDatabase(app);

// Получаем элементы интерфейса
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

async function saveUserToDatabase(user) {
  const userRef = ref(db, 'users/' + user.uid);
  try {
    await set(userRef, {
      uid: user.uid,
      displayName: user.displayName || "Пользователь",
      email: user.email || "Скрыт",
      photoURL: user.photoURL || "",
      lastLogin: Date.now()
    });
    console.log("Данные пользователя успешно сохранены в Realtime Database!");
  } catch (error) {
    console.error("Ошибка сохранения данных в БД:", error);
  }
}

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
googleLoginBtn.addEventListener("click", async () => {
  try {
    userInfo.innerText = "Вход...";
    await signInWithPopup(auth, googleProvider);
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
    saveUserToDatabase(user);
    
    userInfo.innerHTML = `
      <h3>Добро пожаловать, ${user.displayName || "Пользователь"}!</h3>
      <p>Email: ${user.email || "Скрыт"}</p>
      <img src="${user.photoURL}" width="100" alt="Аватар">
    `;
    loginBtn.style.display = "none";
    googleLoginBtn.style.display = "none"; // Скрываем Google кнопку
    logoutBtn.style.display = "inline-block";
  } else {
    userInfo.innerHTML = "<p>Вы не авторизованы.</p>";
    loginBtn.style.display = "inline-block";
    googleLoginBtn.style.display = "inline-block"; // Показываем Google кнопку
    logoutBtn.style.display = "none";
  }
});
