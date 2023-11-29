import { auth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from './firebase.js';

onAuthStateChanged(auth, (user) => {
    const pathName = window.location.pathname;
    const isLoginPage = pathName === '/index.html' || pathName === '/';

    if (user) {
        console.log('Usuário autenticado:', user);
        if (isLoginPage) {
            window.location.href = 'portal.html';
        }
    } else if (!isLoginPage) {
        window.location.href = 'index.html';
    }
});