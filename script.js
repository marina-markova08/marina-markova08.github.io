// Импортируем get для чтения данных
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GithubAuthProvider, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLyUJ0GmuJJbdUwk1cPYot984AQWDzMi4",
  authDomain: "jaba-01.firebaseapp.com",
  databaseURL: "https://jaba-01-default-rtdb.firebaseio.com",
  projectId: "jaba-01",
  storageBucket: "jaba-01.firebasestorage.app",
  messagingSenderId: "582903193533",
  appId: "1:582903193533:web:a8361f325c45037def3cd4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

// Новые элементы для отображения жаб
const maneSection = document.getElementById("maneSection");
const frogsContainer = document.getElementById("frogsContainer");

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
  } catch (error) {
    console.error(error);
  }
}

// 1. Добавляем функцию автоматического заполнения базы данных (сидинг)
async function seedFrogsIfEmpty() {
  const frogsRef = ref(db, 'frogs');
  try {
    const snapshot = await get(frogsRef);
    if (!snapshot.exists()) {
      console.log("База данных пуста! Записываем начальные данные о жабах...");
      await set(frogsRef, {
        jaba1: {
          title: "Жаба в сковородке",
          image: "https://cs14.pikabu.ru/post_img/big/2022/05/05/1/1651703655174390434.png",
          description: "Посмотрите на прекрасную широкую улыбку этой жабы! А на её блестящие круглые глазки! Она выглядит очень радостной."
        },
        jaba2: {
          title: "Жабка на соломке",
          image: "https://зоопарк.екатеринбург.рф/upload/resize_cache/iblock/bab/ldvjynno0fflrg19qa2wffxgv9f2sdaq/550_550_1/aga.JPG",
          description: "Посмотрите на это маленькое создание! Ей постелили мягкую, свежую соломку, и ей очень удобно."
        }
      });
    }
  } catch (error) {
    console.error("Ошибка при проверке/записи жаб:", error);
  }
}

// 2. Функция для загрузки жаб на страницу
async function loadFrogs() {
  frogsContainer.innerHTML = "Загрузка жаб...";
  try {
    const frogsRef = ref(db, 'frogs');
    const snapshot = await get(frogsRef);
    if (snapshot.exists()) {
      const frogsData = snapshot.val();
      let html = "";
      Object.values(frogsData).forEach(frog => {
        html += `
          <div class="frog">
            <img src="${frog.image}" alt="${frog.title}">
            <h1>${frog.title}</h1>
            <h3>${frog.description}</h3>
          </div>
        `;
      });
      frogsContainer.innerHTML = html;
    } else {
      frogsContainer.innerHTML = "В базе данных пока нет жаб.";
    }
  } catch (error) {
    console.error("Ошибка загрузки жаб:", error);
    frogsContainer.innerHTML = "Не удалось загрузить жаб.";
  }
}

// 3. Обновленный обработчик изменения состояния авторизации
onAuthStateChanged(auth, async (user) => {
  if (user) {
    saveUserToDatabase(user);
    
    // Сначала проверяем/заполняем базу данных, затем выводим данные на экран!
    await seedFrogsIfEmpty();
    await loadFrogs();
    
    userInfo.innerHTML = `
      <h3>Добро пожаловать, ${user.displayName || "Пользователь"}!</h3>
      <img src="${user.photoURL}" width="100" style="border-radius: 50%;">
    `;
    
    loginBtn.style.display = "none";
    googleLoginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    maneSection.style.display = "block"; // Показываем блок с жабами
  } else {
    userInfo.innerHTML = "<p>Вы не авторизованы.</p>";
    loginBtn.style.display = "inline-block";
    googleLoginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    maneSection.style.display = "none"; // Скрываем блок
  }
});

// Обработчики кнопок входа/выхода
loginBtn.addEventListener("click", () => signInWithPopup(auth, githubProvider));
googleLoginBtn.addEventListener("click", () => signInWithPopup(auth, googleProvider));
logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    saveUserToDatabase(user);
    loadFrogs(); // Загружаем жаб после входа! [1]
    
    userInfo.innerHTML = `
      <h3>Добро пожаловать, ${user.displayName || "Пользователь"}!</h3>
      <img src="${user.photoURL}" width="100" style="border-radius: 50%;">
    `;
    
    loginBtn.style.display = "none";
    googleLoginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    maneSection.style.display = "block"; // Показываем блок с жабами!
  } else {
    userInfo.innerHTML = "<p>Вы не авторизованы.</p>";
    loginBtn.style.display = "inline-block";
    googleLoginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    maneSection.style.display = "none"; // Скрываем блоки
  }
});
