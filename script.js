import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GithubAuthProvider();

signInWithPopup(auth, provider)
  .then((result) => {
    // Авторизация успешна
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  })
  .catch((error) => {
    // Обработка ошибок
    const errorCode = error.code;
    const errorMessage = error.message;
  });
