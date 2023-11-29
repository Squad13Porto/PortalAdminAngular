import { getDocs, arrayUnion, db, addDoc, collection, getDoc, updateDoc, doc, getFirestore, deleteObject, getDownloadURL, listAll, auth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence, storage, ref, uploadBytes } from './firebase.js';


/***************/
/*NAVGEGAÇÃO ENTRE TELAS*/
/***************/

/*            <div class="menu-lateral" id="menu-editar-diversos">
                <div class="menu-lateral-item" id="menu-lateral-link-conteudo">Alterar link video</div>
                <div class="menu-lateral-item" id="menu-lateral-img-comunidade">Imagem da comunidade</div>
                <div class="menu-lateral-item" id="menu-lateral-img-forum">Imagem do forum</div>
            </div>
            */
document.addEventListener('DOMContentLoaded', function () {
    const secoes = {
        'menu-lateral-add-equipe': 'display-add-equipe',
        'menu-lateral-editar-equipe': 'display-editar-equipe',
        'menu-lateral-remover-equipe': 'display-remover-equipe',
        'menu-lateral-add-card-validacao': 'display-add-card-validacao',
        'menu-lateral-editar-card-validacao': 'display-editar-card-validacao',
        'menu-lateral-remover-card-validacao': 'display-remover-card-validacao',
        'menu-lateral-link-conteudo': 'display-link-conteudo',
        'menu-lateral-img-comunidade': 'display-img-comunidade',
        'menu-lateral-img-forum': 'display-img-forum'
    };

    Object.keys(secoes).forEach(function (menuId) {
        const displayId = secoes[menuId];
        document.getElementById(menuId).addEventListener('click', function () {
            Object.values(secoes).forEach(function (secId) {
                const section = document.getElementById(secId);
                section.style.display = secId === displayId ? 'block' : 'none';
            });
        });
    });
});

/***************/
/*Visualização de fotos*/
/***************/

function previewImage(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

document.getElementById('retrato-equipe').addEventListener('change', previewImage('retrato-equipe', 'preview-retrato-equipe'));
document.getElementById('retrato-equipe-edit').addEventListener('change', previewImage('retrato-equipe-edit', 'preview-retrato-equipe-edit'));
document.getElementById('retrato-validacao').addEventListener('change', previewImage('retrato-validacao', 'preview-retrato-validacao'));
document.getElementById('retrato-card-edit').addEventListener('change', previewImage('retrato-card-edit', 'preview-retrato-card-edit'));
document.getElementById('img-comunidade').addEventListener('change', previewImage('label-img-comunidade', 'preview-img-comunidade'));
document.getElementById('img-forum').addEventListener('change', previewImage('label-img-forum', 'preview-img-forum'));

/***************/
/*REFERÊNCIAS AO BANCO DE DADOS E STORAGE*/
/***************/
const dbRef = doc(db, 'cards', 'h84fnjrGnt4S4HHGQTAb');
const storageRef = ref(storage);


/***************/
/*FUNÇÕES GERAIS*/
/***************/
function getFieldValue(id) {
    return document.getElementById(id).value.trim();
}

function getFileInput(id) {
    const fileInput = document.getElementById(id);
    return fileInput.files[0];
}

async function uploadImage(storageReference, filePath, file) {
    const imageRef = ref(storageReference, `${filePath}/${file.name}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
}

async function getDocumentData(documentReference) {
    const docSnap = await getDoc(documentReference);
    return docSnap.exists() ? docSnap.data() : null;
}

async function updateDocumentArray(documentReference, arrayField, data) {
    await updateDoc(documentReference, { [arrayField]: data });
}

function displayAlert(message, isError = false) {
    console[isError ? 'error' : 'log'](message);
    alert(message);
}

// Função para remover uma imagem do Firebase Storage
function extrairNomeImagem(url) {
    const matches = url.match(/%2F(.*?)\?/);
    if (matches && matches.length > 1) {
        return matches[1].replace(/%20/g, ' '); // substitui %20 (espaço) por um espaço real
    }
    return null;
}





function setupEditForm(type, data) {
    if (type === 'membro') {
        document.getElementById('nome-equipe-edit').value = data.nome;
        document.getElementById('titulacao-edit').value = data.titulacao;
        document.getElementById('preview-retrato-equipe-edit').src = data.imagem;
        document.getElementById('preview-retrato-equipe-edit').style.display = 'block';
        document.getElementById('nome-equipe-edit').disabled = false;
        document.getElementById('titulacao-edit').disabled = false;
        document.getElementById('label-retrato-equipe-edit').style.display = 'block';
    } else if (type === 'card') {
        document.getElementById('nome-card-edit').value = data.nome;
        document.getElementById('profissao-card-edit').value = data.profissao;
        document.getElementById('comentario-edit').value = data.comentario;
        document.getElementById('preview-retrato-card-edit').src = data.imagem;
        document.getElementById('preview-retrato-card-edit').style.display = 'block';
        document.getElementById('nome-card-edit').disabled = false;
        document.getElementById('profissao-card-edit').disabled = false;
        document.getElementById('comentario-edit').disabled = false;
        document.getElementById('label-retrato-card-edit').style.display = 'block';
    }
}
function getEditFormData(type) {
    if (type === 'membro') {
        return {
            nome: getFieldValue('nome-equipe-edit'),
            titulacao: getFieldValue('titulacao-edit'),
            imagem: getFileInput('retrato-equipe-edit')
        };
    } else if (type === 'card') {
        return {
            nome: getFieldValue('nome-card-edit'),
            profissao: getFieldValue('profissao-card-edit'),
            comentario: getFieldValue('comentario-edit'),
            imagem: getFileInput('retrato-card-edit')
        };
    }
}
async function removerImagem(nomeImagem, caminhoBaseImagem) {
    if (!nomeImagem) return;


    const imagemRef = ref(storageRef, `${caminhoBaseImagem}/${nomeImagem}`);
    try {
        await deleteObject(imagemRef);
        console.log('Imagem deletada com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
    }
}


/***************/
/*EVENT LISTENERS*/
/***************/

/*****************************************************************/
/*****************************************************************/
// Adicionar item
/*****************************************************************/
/*****************************************************************/

async function adicionarItem(collection, fileInputId, data, alertSuccess, alertError) {
    const file = getFileInput(fileInputId);

    if (!file || Object.values(data).some(value => !value)) {
        displayAlert("Preencha todos os campos e selecione uma imagem!");
        return;
    }

    try {
        const imageUrl = await uploadImage(storageRef, collection, file);
        const item = { ...data, imagem: imageUrl };

        const dbData = await getDocumentData(dbRef);
        const items = dbData ? (dbData[collection] || []) : [];
        items.push(item);

        await updateDocumentArray(dbRef, collection, items);
        displayAlert(alertSuccess);
        window.location.reload();
    } catch (error) {
        console.error(error);
        displayAlert(alertError, true);
    }
}

// Adicionar membro da equipe
document.getElementById("adicionar-equipe").addEventListener("click", () => {
    document.getElementById("adicionar-equipe").disabled = true;
    const nome = getFieldValue("nome-equipe");
    const titulacao = getFieldValue("titulacao");
    adicionarItem('cards-equipe', 'retrato-equipe', { nome, titulacao }, "Membro da equipe adicionado com sucesso!", "Erro ao adicionar membro da equipe. Tente novamente mais tarde.");
});
// Adicionar card de validação
document.getElementById('adicionar-validacao').addEventListener('click', () => {
    document.getElementById("adicionar-validacao").disabled = true;
    const nome = getFieldValue('nome-validacao');
    const profissao = getFieldValue('profissao-validacao');
    const comentario = getFieldValue('comentario');
    adicionarItem('cards-validacao', 'retrato-validacao', { nome, profissao, comentario }, 'Card de validação adicionado com sucesso!', 'Erro ao adicionar card de validação. Tente novamente mais tarde.');
});



/*****************************************************************/
/*****************************************************************/
// Carregar membros existentes para edição
/*****************************************************************/
/*****************************************************************/
async function carregarOpcoesParaAcao(idMenu, idSelect, colecaoDB, acao, mensagemErro, mensagemNaoEncontrado) {
    document.getElementById(idMenu).addEventListener('click', async () => {
        const select = document.getElementById(idSelect);
        try {
            const data = await getDocumentData(dbRef);
            const items = data ? data[colecaoDB] : null;

            if (items && items.length > 0) {
                select.innerHTML = `<option value="none">Selecione um item para ${acao}</option>`;
                items.forEach((item, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = item.nome;
                    select.appendChild(option);
                });
            } else {
                displayAlert(mensagemNaoEncontrado);
            }
        } catch (error) {
            console.error(error);
            displayAlert(mensagemErro, true);
        }
    });
}

// Carregar membros da equipe para edição
carregarOpcoesParaAcao('menu-lateral-editar-equipe', 'select-equipe-existente', 'cards-equipe', 'editar', 'Erro ao carregar membros da equipe. Tente novamente mais tarde.', 'Nenhum membro da equipe encontrado.');

// Carregar cards de validação para edição
carregarOpcoesParaAcao('menu-lateral-editar-card-validacao', 'select-validacao-existente', 'cards-validacao', 'editar', 'Erro ao carregar cards de validação. Tente novamente mais tarde.', 'Nenhum card de validação encontrado.');

// Carregar membros da equipe para remoção
carregarOpcoesParaAcao('menu-lateral-remover-equipe', 'select-equipe-existente-remover', 'cards-equipe', 'remover', 'Erro ao carregar membros da equipe. Tente novamente mais tarde.', 'Nenhum membro da equipe encontrado.');

// Carregar cards de validação para remoção
carregarOpcoesParaAcao('menu-lateral-remover-card-validacao', 'select-card-existente-remover', 'cards-validacao', 'remover', 'Erro ao carregar cards de validação. Tente novamente mais tarde.', 'Nenhum card de validação encontrado.');




/*****************************************************************/
/*****************************************************************/
// Carregar dados do item selecionado para edição
/*****************************************************************/
/*****************************************************************/
async function carregarDadosParaEdicao(idButton, idSelect, colecaoDB, type) {
    document.getElementById(idButton).addEventListener('click', async () => {
        const select = document.getElementById(idSelect);
        const index = select.value;

        if (index === 'none') {
            displayAlert(`Por favor, selecione um item para editar.`);
            return;
        }

        try {
            const data = await getDocumentData(dbRef);
            if (data && data[colecaoDB]) {
                const items = data[colecaoDB];
                const item = items[index];
                if (item) {
                    setupEditForm(type, item);
                } else {
                    displayAlert('Item não encontrado no índice especificado!');
                }
            } else {
                displayAlert(`Documento não encontrado ou campo "${colecaoDB}" ausente!`);
            }
        } catch (error) {
            console.error(error);
            displayAlert('Erro ao carregar dados. Tente novamente mais tarde.', true);
        }
    });
}

// Carregar dados do membro da equipe para edição
carregarDadosParaEdicao('carregar-dados-pessoa', 'select-equipe-existente', 'cards-equipe', 'membro');

// Carregar dados do card de validação para edição
carregarDadosParaEdicao('carregar-dados-card', 'select-validacao-existente', 'cards-validacao', 'card');


/*********************************************/
/*********************************************/
/******* Salvar um item em edicao*****/
/*********************************************/
/*********************************************/

async function salvarEdicao(idButton, idSelect, colecaoDB, type, pathImagem) {
    document.getElementById(idButton).addEventListener('click', async () => {
        document.getElementById(idButton).disabled = true;
        const select = document.getElementById(idSelect);
        const index = select.value;

        if (index === 'none') {
            displayAlert(`Por favor, selecione um ${type} para editar.`);
            return;
        }

        const formData = getEditFormData(type);

        try {
            const data = await getDocumentData(dbRef);
            if (data && data[colecaoDB]) {
                const items = data[colecaoDB];
                let itemAntigo = items[index];
                let imageUrl = itemAntigo.imagem;

                if (formData.imagem) {

                    if (itemAntigo.imagem) {
                        const nomeImagemAntiga = extrairNomeImagem(itemAntigo.imagem);
                        await removerImagem(nomeImagemAntiga, pathImagem);
                    }

                    imageUrl = await uploadImage(storageRef, pathImagem, formData.imagem);
                }

                const itemEditado = { ...itemAntigo, ...formData, imagem: imageUrl };
                items[index] = itemEditado;
                await updateDocumentArray(dbRef, colecaoDB, items);

                displayAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} editado com sucesso!`);
                window.location.reload();
            } else {
                displayAlert(`Documento não encontrado ou campo "${colecaoDB}" ausente!`);
            }
        } catch (error) {
            console.error(error);
            displayAlert(`Erro ao editar ${type}. Tente novamente mais tarde.`, true);
        }
    });
}

// Salvar edição do membro da equipe
salvarEdicao('salvar-edicao-equipe', 'select-equipe-existente', 'cards-equipe', 'membro', 'cards-equipe');



// Salvar edição do card de validação
salvarEdicao('salvar-edicao-card', 'select-validacao-existente', 'cards-validacao', 'card', 'cards-validacao');



/*********************************************/
/********** Remover um item *********/
/*********************************************/


// Função atualizada para remover um item e sua imagem associada
async function removerItemEImagem(idButton, idSelect, colecaoDB, tipoItem, caminhoBaseImagem) {
    document.getElementById(idButton).addEventListener('click', async () => {

        document.getElementById(idButton).disabled = true;
        const select = document.getElementById(idSelect);
        const index = select.value;

        if (index === 'none') {
            displayAlert(`Por favor, selecione um ${tipoItem} para remover.`);
            return;
        }

        try {
            const data = await getDocumentData(dbRef);
            const items = data ? data[colecaoDB] : null;
            if (items) {
                const itemRemovido = items.splice(index, 1)[0];
                await updateDocumentArray(dbRef, colecaoDB, items);

                // Remover a imagem do Storage
                if (itemRemovido.imagem) {
                    const nomeImagem = extrairNomeImagem(itemRemovido.imagem);
                    await removerImagem(nomeImagem, caminhoBaseImagem);
                }

                displayAlert(`${tipoItem.charAt(0).toUpperCase() + tipoItem.slice(1)} removido com sucesso!`);
                document.getElementById(idButton).disabled = false;
                window.location.reload();
            } else {
                displayAlert(`Documento não encontrado ou lista de ${tipoItem}s vazia!`);
            }
        } catch (error) {
            console.error(error);
            displayAlert(`Erro ao remover ${tipoItem}. Tente novamente mais tarde.`, true);
        }
    });
}


removerItemEImagem('remover-equipe', 'select-equipe-existente-remover', 'cards-equipe', 'membro', 'cards-equipe');


removerItemEImagem('remover-card', 'select-card-existente-remover', 'cards-validacao', 'card', 'cards-validacao');


/*********************************************/
/********** Atualizar link do video do nosso conteudo *********/
/*********************************************/


async function enviarLinkYoutube() {
    const linkInput = document.getElementById('link-youtube');
    const linkYoutube = linkInput.value;

    if (linkYoutube) {
        try {

            const docRef = doc(db, 'outros-itens-landing-page', 'link-nosso-conteudo');

            await updateDoc(docRef, {
                linkYoutube: linkYoutube
            });
            alert('Link do YouTube atualizado com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar o link do YouTube:', error);
        }
    } else {
        alert('Nenhum link do YouTube fornecido!');
    }
}


const editarLinkButton = document.getElementById('editar-link-youtube');
editarLinkButton.addEventListener('click', enviarLinkYoutube);


/*********************************************/
/********** Atualizar imagens da comunidade e forum *********/
/*********************************************/
async function removerTodasImagens(caminhoBaseImagem) {
    const listRef = ref(storage, caminhoBaseImagem);

    try {
        const res = await listAll(listRef);
        for (const fileRef of res.items) {
            await deleteObject(fileRef);
        }
    } catch (error) {
        console.error('Erro ao listar ou excluir imagens:', error);
    }
}

async function editarImagem(event, tipo) {
    event.preventDefault();

    const config = {
        'comunidade': {
            inputId: 'img-comunidade',
            previewId: 'preview-img-comunidade',
            caminhoBaseImagem: 'img-comunidade',
            nomeImagem: 'comunidade.jpg'
        },
        'forum': {
            inputId: 'img-forum',
            previewId: 'preview-img-forum',
            caminhoBaseImagem: 'img-forum',
            nomeImagem: 'forum.jpg'
        }
    };

    const { inputId, previewId, caminhoBaseImagem, nomeImagem } = config[tipo];
    const fileInput = document.getElementById(inputId);
    const fileList = fileInput.files;

    if (fileList.length > 0) {
        const imagem = fileList[0];
        await removerTodasImagens(caminhoBaseImagem);
        const nomeParaNovaImagem = nomeImagem;
        const novaImagemRef = ref(storage, `${caminhoBaseImagem}/${nomeParaNovaImagem}`);

        try {
            await uploadBytes(novaImagemRef, imagem);
            alert('Nova imagem enviada com sucesso!');
            const downloadURL = await getDownloadURL(novaImagemRef);
            console.log(`URL da imagem: ${downloadURL}`);
            const previewImage = document.getElementById(previewId);
            previewImage.src = downloadURL;
            previewImage.style.display = 'block';
        } catch (error) {
            console.error('Erro ao enviar a nova imagem:', error);
        }
    } else {
        alert('Nenhum arquivo selecionado para upload.');
    }
}

document.getElementById('editar-img-comunidade').addEventListener('click', (event) => editarImagem(event, 'comunidade'));
document.getElementById('editar-img-forum').addEventListener('click', (event) => editarImagem(event, 'forum'));


/*********************************************/
/********** add curso novo *********/
/*********************************************/

document.getElementById('add-curso-novo').addEventListener('click', function () {
    
    
});
