import { getDocs, arrayUnion, db, addDoc, collection, getDoc, updateDoc, doc, getFirestore, deleteObject, getDownloadURL, listAll, auth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence, storage, ref, uploadBytes } from './firebase.js';


/***************/
/*NAVGEGAÇÃO ENTRE TELAS*/
/***************/
document.addEventListener('DOMContentLoaded', function () {
    const secoes = {
        'menu-lateral-add-equipe': 'display-add-equipe',
        'menu-lateral-editar-equipe': 'display-editar-equipe',
        'menu-lateral-remover-equipe': 'display-remover-equipe',
        'menu-lateral-add-card-validacao': 'display-add-card-validacao',
        'menu-lateral-editar-card-validacao': 'display-editar-card-validacao',
        'menu-lateral-remover-card-validacao': 'display-remover-card-validacao'
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
document.getElementById('retrato-equipe').addEventListener('change', function (e) {
    const input = e.target;
    const preview = document.getElementById('preview-retrato-equipe');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
});
document.getElementById('retrato-equipe-edit').addEventListener('change', function (e) {
    const input = e.target;
    const preview = document.getElementById('preview-retrato-equipe-edit');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
});
/***************/
/*REFERÊNCIAS AO BANCO DE DADOS E STORAGE*/
/***************/
const dbRef = doc(db, 'cards', 'h84fnjrGnt4S4HHGQTAb');

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

async function uploadImage(file) {
    const storageRef = ref(storage, `fotos-equipe/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

async function getTeamMembers() {
    const docSnap = await getDoc(dbRef);
    return docSnap.exists() ? docSnap.data()['cards-equipe'] : null;
}

async function updateTeamMembers(members) {
    await updateDoc(dbRef, { 'cards-equipe': members });
}

function displayAlert(message, isError = false) {
    console[isError ? 'error' : 'log'](message);
    alert(message);
}

function setupEditForm(member) {
    document.getElementById('nome-equipe-edit').value = member.nome;
    document.getElementById('titulacao-edit').value = member.titulacao;
    document.getElementById('preview-retrato-equipe-edit').src = member.imagem;
    document.getElementById('preview-retrato-equipe-edit').style.display = 'block';
    document.getElementById('nome-equipe-edit').disabled = false;
    document.getElementById('titulacao-edit').disabled = false;
    document.getElementById('label-retrato-equipe-edit').style.display = 'block';
}

/***************/
/*EVENT LISTENERS*/
/***************/

/*****************************************************************/
/*****************************************************************/
// Adicionar membro à equipe
/*****************************************************************/
/*****************************************************************/

document.getElementById("adicionar-equipe").addEventListener("click", async () => {
    console.log("Botão clicado!");

    const nome = getFieldValue("nome-equipe");
    const titulacao = getFieldValue("titulacao");
    const file = getFileInput("retrato-equipe");

    if (!nome || !titulacao || !file) {
        displayAlert("Preencha todos os campos e selecione uma imagem!");
        return;
    }

    try {
        const imageUrl = await uploadImage(file);
        const novoMembro = { nome, titulacao, imagem: imageUrl };
        const members = (await getTeamMembers()) || [];
        members.push(novoMembro);
        await updateTeamMembers(members);
        displayAlert("Membro da equipe adicionado com sucesso!");
        window.location.reload();
    } catch (error) {
        displayAlert("Erro ao adicionar membro da equipe. Tente novamente mais tarde.", true);
    }
});

/*****************************************************************/
/*****************************************************************/
// Carregar membros existentes para edição
/*****************************************************************/
/*****************************************************************/

document.getElementById('menu-lateral-editar-equipe').addEventListener('click', async () => {
    const select = document.getElementById('select-equipe-existente');
    try {
        const members = await getTeamMembers();
        if (members) {
            select.innerHTML = '<option value="none">Selecione um membro para editar</option>';
            members.forEach((member, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = member.nome;
                select.appendChild(option);
            });
        } else {
            displayAlert('Nenhum membro da equipe encontrado.');
        }
    } catch (error) {
        displayAlert('Erro ao carregar membros da equipe. Tente novamente mais tarde.', true);
    }
});

/*****************************************************************/
/*****************************************************************/
// Carregar membros existentes para REMOÇÃO
/*****************************************************************/
/*****************************************************************/

document.getElementById('menu-lateral-remover-equipe').addEventListener('click', async () => {
    const select = document.getElementById('select-equipe-existente-remover');
    try {
        const members = await getTeamMembers();
        if (members) {
            select.innerHTML = '<option value="none">Selecione um membro para remover</option>';
            members.forEach((member, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = member.nome;
                select.appendChild(option);
            });
        } else {
            displayAlert('Nenhum membro da equipe encontrado.');
        }
    } catch (error) {
        displayAlert('Erro ao carregar membros da equipe. Tente novamente mais tarde.', true);
    }
});

/*****************************************************************/
/*****************************************************************/
// Carregar dados do membro selecionado para edição
/*****************************************************************/
/*****************************************************************/

document.getElementById('carregar-dados-pessoa').addEventListener('click', async () => {
    const select = document.getElementById('select-equipe-existente');
    const index = select.value;

    if (index === 'none') {
        displayAlert('Por favor, selecione um membro para editar.');
        return;
    }

    try {
        const members = await getTeamMembers();
        if (members) {
            const member = members[index];
            setupEditForm(member);
        } else {
            displayAlert('Documento não encontrado!');
        }
    } catch (error) {
        displayAlert('Erro ao carregar dados do membro. Tente novamente mais tarde.', true);
    }
});
/*********************************************/
/*********************************************/
/******* Salvar edição do membro da equipe*****/
/*********************************************/
/*********************************************/

document.getElementById('salvar-edicao-equipe').addEventListener('click', async () => {
    const select = document.getElementById('select-equipe-existente');
    const index = select.value;

    if (index === 'none') {
        displayAlert('Por favor, selecione um membro para editar.');
        return;
    }

    const nomeEditado = getFieldValue('nome-equipe-edit');
    const titulacaoEditada = getFieldValue('titulacao-edit');
    const file = getFileInput('retrato-equipe-edit');

    try {
        const members = await getTeamMembers();
        if (members) {
            let imageUrl = members[index].imagem;
            if (file) {
                imageUrl = await uploadImage(file);
            }
            const membroEditado = { ...members[index], nome: nomeEditado, titulacao: titulacaoEditada, imagem: imageUrl };
            members[index] = membroEditado;
            await updateTeamMembers(members);
            displayAlert('Membro da equipe editado com sucesso!');
            window.location.reload();
        } else {
            displayAlert('Documento não encontrado!');
        }
    } catch (error) {
        displayAlert('Erro ao editar membro da equipe. Tente novamente mais tarde.', true);
    }
});

/*********************************************/
/********** Remover membro da equipe *********/
/*********************************************/
document.getElementById('remover-equipe').addEventListener('click', async () => {
    const select = document.getElementById('select-equipe-existente-remover');
    const index = select.value;

    if (index === 'none') {
        displayAlert('Por favor, selecione um membro para remover.');
        return;
    }

    try {
        const members = await getTeamMembers();
        if (members) {
            members.splice(index, 1);
            await updateTeamMembers(members);
            displayAlert('Membro da equipe removido com sucesso!');
            window.location.reload();
        } else {
            displayAlert('Documento não encontrado!');
        }
    } catch (error) {
        displayAlert('Erro ao remover membro da equipe. Tente novamente mais tarde.', true);
    }
});





