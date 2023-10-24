function LogarComFirebase() {
    const email = document.querySelector('input[name="email"]').value;
    const senha = document.querySelector('input[name="senha"]').value;

    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);
            alert("Logado com sucesso!");
        })
        .catch((error) => {
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
