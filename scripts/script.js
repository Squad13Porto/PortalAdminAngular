// script.js
import {getDocs, arrayUnion, db, addDoc, collection, getDoc, updateDoc, doc, getFirestore, deleteObject, getDownloadURL, listAll, auth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence, storage, ref, uploadBytes } from './firebase.js';

//import do bootstra


/******************************************************************************/
/* Código de script GERAL DO PPAINEL */
/******************************************************************************/



function LogarComFirebase() {
    const email = $('input[name="email"]').val();
    const senha = $('input[name="senha"]').val();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    $('#logar').prop('disabled', true);
    $('#spinner').show();

    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, senha);
        })
        .then((userCredential) => {
            console.log(userCredential.user);
            alert("Logado com sucesso!");
            window.location.href = "portal.html";
        })
        .catch((error) => {
            alert("Erro ao logar!");
            console.log(error.code);
            console.log(error.message);
        })
        .finally(() => {
            $('#logar').prop('disabled', false);
            $('#spinner').hide();
        });
}


$(document).ready(function () {
    $('#logar').on('click', LogarComFirebase);

    $(document).on('keydown', function (event) {
        if (event.key === 'Enter') {
            LogarComFirebase();
        }
    });
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

document.getElementById('dashboard').addEventListener('click', () => {
    window.location.href = 'portal.html'
})
document.getElementById('editar-curso').addEventListener('click', () => {
    window.location.href = 'editar_curso.html'
})
document.getElementById('editar-carrossel').addEventListener('click', () => {
    window.location.href = 'editar_carrossel.html'
})
document.getElementById('editar-cards').addEventListener('click', () => {
    window.location.href = 'editar_equipe.html'
})

/******************************************************************************/
/* Código para o carrossel de imagens */
/******************************************************************************/


document.addEventListener('DOMContentLoaded', function () {
    const addImagemDiv = document.getElementById('add-imagem');
    const removerImagemDiv = document.getElementById('remover-imagem');
    const addImagensDiv = document.getElementById('display-add-imagem');
    const removerImagensDiv = document.getElementById('display-remover-imagem');

    addImagemDiv.addEventListener('click', function () {
        addImagensDiv.style.display = 'block';
        removerImagensDiv.style.display = 'none';

    });

    removerImagemDiv.addEventListener('click', function () {
        addImagensDiv.style.display = 'none';
        removerImagensDiv.style.display = 'block';

    });
});


//add imagens
document.getElementById("selecionar-foto").addEventListener("change", function () {
    const fileInput = this;
    const imagePreview = document.getElementById("image-preview");

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Imagem selecionada" />';
        }

        reader.readAsDataURL(fileInput.files[0]);
    } else {
        imagePreview.innerHTML = '<span>Pré-visualização da imagem</span>';
    }
});



document.getElementById('saveButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('selecionar-foto');
    const select = document.getElementById('select-carrossel');
    const selectedOption = select.value;

    if (!fileInput.files.length) {
        alert('Por favor, selecione um arquivo para fazer upload.');
        return;
    }

    const file = fileInput.files[0];
    let path = 'carousels/';

    if (selectedOption === 'aulas-abertas') {
        path += 'aulas-abertas/';
    } else if (selectedOption === 'aulas-pilulas') {
        path += 'aulas-pilulas/';
    } else {
        alert('Por favor, selecione um carrossel válido.');
        return;
    }

    path += file.name;
    const storageRef = ref(storage, path);

    try {
        await uploadBytes(storageRef, file);
        alert('Upload feito com sucesso!');
    } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro no upload. Por favor, tente novamente.');
    }
});


// remover imagens

function ExibirImagensAulasAbertas() {
    const storageRef = ref(storage, 'carousels/aulas-abertas');
    const listRef = ref(storage, 'carousels/aulas-abertas');
    const imageArea = document.getElementById('image-area');
    const exibirImagensButton = document.getElementById('exibir-imagens');

    imageArea.innerHTML = '';

    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                getDownloadURL(itemRef)
                    .then((url) => {
                        const card = document.createElement('div');
                        card.className = 'image-card';

                        const img = document.createElement('img');
                        img.src = url;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'delete-btn';
                        deleteBtn.textContent = 'Deletar';
                        deleteBtn.onclick = async () => {
                            try {
                                await deleteObject(itemRef);
                                alert('Imagem deletada com sucesso!');
                                card.remove();
                            } catch (error) {
                                console.error('Erro ao deletar imagem:', error);
                                alert('Erro ao deletar imagem. Por favor, tente novamente.');
                            }
                        }

                        card.appendChild(img);
                        card.appendChild(deleteBtn);
                        imageArea.appendChild(card);
                    })
                    .catch((error) => {
                        console.error('Erro ao obter URL de download:', error);
                    });
            });
        })
        .catch((error) => {
            console.error('Erro ao listar arquivos:', error);
        });
}

function ExibirImagensAulasPilulas() {
    const storageRef = ref(storage, 'carousels/aulas-pilulas');
    const listRef = ref(storage, 'carousels/aulas-pilulas');
    const imageArea = document.getElementById('image-area');
    const exibirImagensButton = document.getElementById('exibir-imagens');

    imageArea.innerHTML = '';

    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                getDownloadURL(itemRef)
                    .then((url) => {
                        const card = document.createElement('div');
                        card.className = 'image-card';

                        const img = document.createElement('img');
                        img.src = url;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'delete-btn';
                        deleteBtn.textContent = 'Deletar';
                        deleteBtn.onclick = async () => {
                            try {
                                await deleteObject(itemRef);
                                alert('Imagem deletada com sucesso!');
                                card.remove();
                            } catch (error) {
                                console.error('Erro ao deletar imagem:', error);
                                alert('Erro ao deletar imagem. Por favor, tente novamente.');
                            }
                        }

                        card.appendChild(img);
                        card.appendChild(deleteBtn);
                        imageArea.appendChild(card);
                    }
                    )
                    .catch((error) => {
                        console.error('Erro ao obter URL de download:', error);
                    });
            }
            );
        }
        )
        .catch((error) => {
            console.error('Erro ao listar arquivos:', error);
        });
}



function ExibirGrupoDeImagensAoClick() {
    const select = document.getElementById('select-carrossel-remover');
    const selectedOption = select.value;

    if (selectedOption === 'aulas-abertas') {
        ExibirImagensAulasAbertas();
    } else if (selectedOption === 'aulas-pilulas') {
        ExibirImagensAulasPilulas();
    } else {
        alert('Por favor, selecione um carrossel válido.');
        return;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const exibirImagensButton = document.getElementById('exibir-imagens');
    exibirImagensButton.addEventListener('click', ExibirGrupoDeImagensAoClick);
});




/******************************************************************************/
/* Código para os cards da landing page */
/******************************************************************************/

