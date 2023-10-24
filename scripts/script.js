// script.js
import { auth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from './firebase.js';
//import do bootstra


function LogarComFirebase() {
    
    const email = document.querySelector('input[name="email"]').value;
    const senha = document.querySelector('input[name="senha"]').value;

    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            // A persistência de sessão agora está configurada. A próxima tentativa de login
            // será persistida na sessão atual.
            return signInWithEmailAndPassword(auth, email, senha);
        })
        .then((userCredential) => {
            // Logado com sucesso.
            const user = userCredential.user;
            console.log(user);
            alert("Logado com sucesso!");
            window.location.href = "portal.html";
        })
        .catch((error) => {
            // Houve um erro no login.
            alert("Erro ao logar!");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
}

document.addEventListener('click', function (event) {
    if (event.target.id == 'logar') {
        LogarComFirebase();
    }
});

function LogoutOnClick() {
    auth.signOut().then(() => {
        alert("Deslogado com sucesso!");
        window.location.href = "index.html";
    }).catch((error) => {
        alert("Erro ao deslogar!");
        console.log(error);
    });
}

document.addEventListener('click', function (event) {
    if (event.target.id == 'logout-button') {
        LogoutOnClick();
    }
});

const editar_curso = 1
const editar_carrossel = 2
const editar_equipe = 3
let item_ativo = 1
let menu_lateral = document.getElementById("menu-editar-cursos");

document.addEventListener("click", function (e) {
    if (e.target.id == "dashboard") {
        item_ativo = 0
        menu_lateral.style.display = "none"
    }
    if (e.target.id == "editar-curso") {
        item_ativo = 1
        menu_lateral.style.display = "block"
    }
    if (e.target.id == "editar-carrossel") {
        item_ativo = 2
        menu_lateral.style.display = "none"
    }
    if (e.target.id == "editar-equipe") {
        item_ativo = 3
        menu_lateral.style.display = "none"
    }
    if (item_ativo == editar_curso) {
        menu_lateral.style.display = "block"
    }
    else {
        menu_lateral.style.display = "none"
    }
})

const add_curso = 1
const editar_curso_lateral = 2
const remover_curso = 3
let item_ativo_lateral = 1
let menu_lateral_edit = document.getElementById("menu-editar-cursos");

document.addEventListener("click", function (e) {
    if (e.target.id == "dashboard") {
        item_ativo = 0
        menu_lateral.style.display = "none"
    }
    if (e.target.id == "editar-curso") {
        item_ativo = 1
        menu_lateral.style.display = "block"
    }
    if (e.target.id == "editar-carrossel") {
        item_ativo = 2
        menu_lateral.style.display = "none"
    }
    if (e.target.id == "editar-equipe") {
        item_ativo = 3
        menu_lateral.style.display = "none"
    }
    if (item_ativo == editar_curso) {
        menu_lateral.style.display = "block"
    }
    else {
        menu_lateral.style.display = "none"
    }
})



