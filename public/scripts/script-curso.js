import {setDoc, getDocs, arrayUnion, db, addDoc, collection, getDoc, updateDoc, doc, getFirestore, deleteObject, getDownloadURL, listAll, auth, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence, storage, ref, uploadBytes } from './firebase.js';


function changeFrame(targetFrameId) {
    const frames = document.querySelectorAll('.box-painel');
    frames.forEach(frame => frame.style.display = 'none');
    document.getElementById(targetFrameId).style.display = 'block';
}

// Event listener para botões de navegação
document.querySelectorAll('.navigation').forEach(button => {
    button.addEventListener('click', function () {
        const targetFrameId = 'addcurso-' + this.getAttribute('data-target');
        changeFrame(targetFrameId);
    });
});




// Array para armazenar os benefícios
let beneficios = [];

// Referências para elementos HTML
const inputBeneficio = document.querySelector('.beneficio');
const selectBeneficios = document.querySelector('.lista-beneficios');
const btnAdicionar = document.querySelector('#btn-add-beneficio'); // Certifique-se de que este seletor está correto
const btnRemover = document.querySelector('#btn-rmv-beneficio'); // Ajuste conforme necessário

// Definir o máximo de caracteres para o input de benefício
inputBeneficio.setAttribute('maxlength', '100');

// Adicionar benefício
btnAdicionar.addEventListener('click', () => {
    const beneficio = inputBeneficio.value.trim();
    // Verificar se o benefício não está vazio, é único, e se o número de itens é menor que 3
    if (beneficio && !beneficios.includes(beneficio) && beneficios.length < 3) {
        beneficios.push(beneficio);
        const novaOption = document.createElement('option');
        novaOption.textContent = beneficio;
        novaOption.value = beneficio;
        selectBeneficios.appendChild(novaOption);
        inputBeneficio.value = ''; // Limpar o campo após adicionar
    }
});

// Remover benefício
btnRemover.addEventListener('click', () => {
    const beneficioSelecionado = selectBeneficios.value;
    if (beneficioSelecionado) {
        beneficios = beneficios.filter(b => b !== beneficioSelecionado);
        selectBeneficios.removeChild(selectBeneficios.querySelector(`option[value="${beneficioSelecionado}"]`));
    }
});

let oQueVaiAprender = [];

const inputAprender = document.getElementById('oqueVaiAprender');
const selectAprender = document.getElementById('lista-itens');
const btnAddAprender = document.getElementById('btn-add-aprender');
const btnRmvAprender = document.getElementById('btn-rmv-aprender');

btnAddAprender.addEventListener('click', () => {
    const item = inputAprender.value.trim();

    if (item && oQueVaiAprender.length < 8) {
        oQueVaiAprender.push(item);
        const novaOption = document.createElement('option');
        novaOption.textContent = item;
        novaOption.value = item;
        selectAprender.appendChild(novaOption);

        inputAprender.value = ''; // Limpar o input
    }
});

btnRmvAprender.addEventListener('click', () => {
    const selectedItem = selectAprender.value;
    oQueVaiAprender = oQueVaiAprender.filter(item => item !== selectedItem);

    // Atualizar o select
    selectAprender.innerHTML = '<option value="0">Lista do que irá aprender</option>';
    oQueVaiAprender.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectAprender.appendChild(option);
    });
});

let evidencias = [];

const dropdownEvidencias = document.getElementById('dropdown-evidencias');
const btnAddEvidencia = document.getElementById('btn-add-evidencia');
const btnRmvEvidencia = document.getElementById('btn-rmv-evidencia');

btnAddEvidencia.addEventListener('click', () => {
    const nomeAluno = document.querySelector('.text-nome-aluno').value.trim();
    const comentarioAluno = document.querySelector('.text-comentario-aluno').value.trim();

    if (nomeAluno && comentarioAluno && evidencias.length < 8) {
        const novaEvidencia = { nomeAluno, comentarioAluno };
        evidencias.push(novaEvidencia);

        updateEvidenciasUI();
    }
});

btnRmvEvidencia.addEventListener('click', () => {
    const selectedIndex = dropdownEvidencias.selectedIndex;
    if (selectedIndex > 0) { // Ignora o primeiro item de "placeholder"
        evidencias.splice(selectedIndex - 1, 1); // Ajusta o índice para o array
        updateEvidenciasUI();
    }
});

function updateEvidenciasUI() {
    dropdownEvidencias.innerHTML = '<option value="-1">Aqui estará a lista das evidencias cadastradas</option>';
    evidencias.forEach((e, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${e.nomeAluno}: ${e.comentarioAluno}`;
        dropdownEvidencias.appendChild(option);
    });
}


let itensModulo1 = [];
let itensModulo2 = [];
let itensModulo3 = [];
let itensModulo4 = [];



function adicionarItem(modulo, inputId, selectId, arrayItens) {
    const inputItem = document.getElementById(inputId);
    const item = inputItem.value.trim();

    if (item && arrayItens.length < 9) {
        arrayItens.push(item);
        atualizarSelect(selectId, arrayItens);

        inputItem.value = ''; // Limpar o input
    }


}

function removerItem(selectId, arrayItens) {
    const select = document.getElementById(selectId);
    const selectedIndex = select.selectedIndex;
    if (selectedIndex > 0) {
        arrayItens.splice(selectedIndex - 1, 1);
        atualizarSelect(selectId, arrayItens);
    }
}

function atualizarSelect(selectId, arrayItens) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="0">Itens do módulo</option>';
    arrayItens.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

// Event listeners para Módulo 1
document.getElementById('add-img-modulo1').addEventListener('click', () => adicionarItem(1, 'itens-modulo-1', 'lista-itens-1', itensModulo1));
document.getElementById('rmv-img-modulo1').addEventListener('click', () => removerItem('lista-itens-1', itensModulo1));

// Event listeners para Módulo 2
document.getElementById('add-img-modulo2').addEventListener('click', () => adicionarItem(2, 'itens-modulo-2', 'lista-itens-2', itensModulo2));
document.getElementById('rmv-img-modulo2').addEventListener('click', () => removerItem('lista-itens-2', itensModulo2));

// Event listeners para Módulo 3
document.getElementById('add-img-modulo3').addEventListener('click', () => adicionarItem(3, 'itens-modulo-3', 'lista-itens-3', itensModulo3));
document.getElementById('rmv-img-modulo3').addEventListener('click', () => removerItem('lista-itens-3', itensModulo3));

// Event listeners para Módulo 4
document.getElementById('add-img-modulo4').addEventListener('click', () => adicionarItem(4, 'itens-modulo-4', 'lista-itens-4', itensModulo4));
document.getElementById('rmv-img-modulo4').addEventListener('click', () => removerItem('lista-itens-4', itensModulo4));


const storageRef = ref(storage);
async function uploadImageAndGetURL(storageReference, fileInputId, filePath) {
    const fileInput = document.querySelector(fileInputId);
    const file = fileInput.files[0];
    const imageRef = ref(storageReference, `${filePath}${file.name}`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
}

document.getElementById('add-curso-novo').addEventListener('click', async function () {
    const sigla = document.querySelector('.sigla').value.trim();
    const prioridade = document.querySelector('.prioridade').value.trim();
    const nome = document.querySelector('.nome').value.trim();
    const resumo = document.querySelector('.resumo').value.trim();
    const segmentacao = document.querySelector('.segmentacao').value.trim();

    const promessa = document.querySelector('.promessa').value.trim();

    const pertencimento = document.querySelector('.pertencimento').value.trim();
    const solucao = document.querySelector('.solucao').value.trim();
    const linkVideo = document.querySelector('.link-video').value.trim();
    const horasCertificado = document.querySelector('.horas-certificado').value.trim();
    const qtdAulas = document.querySelector('.qtd-aulas').value.trim();
    const qtdModulos = document.querySelector('.qtd-modulos').value.trim();
    const nomeProfessor1 = document.querySelector('#nome-professor1').value.trim();
    const titulacaoProfessor1 = document.querySelector('#titulacao-professor1').value.trim();

    const nomeProfessor2 = document.querySelector('#nome-professor2').value.trim();
    const titulacaoProfessor2 = document.querySelector('#titulacao-professor2').value.trim();

    const nomeProfessor3 = document.querySelector('#nome-professor3').value.trim();
    const titulacaoProfessor3 = document.querySelector('#titulacao-professor3').value.trim();

    const nomeProfessor4 = document.querySelector('#nome-professor4').value.trim();
    const titulacaoProfessor4 = document.querySelector('#titulacao-professor4').value.trim();


    const professor1 = { 'nomeProf': nomeProfessor1, 'titulos': titulacaoProfessor1, 'retrato': await uploadImageAndGetURL(storageRef, '#professor-1', 'professores/') };
    const professor2 = { 'nomeProf': nomeProfessor2, 'titulos': titulacaoProfessor2, 'retrato': await uploadImageAndGetURL(storageRef, '#professor-2', 'professores/') };
    const professor3 = { 'nomeProf': nomeProfessor3, 'titulos': titulacaoProfessor3, 'retrato': await uploadImageAndGetURL(storageRef, '#professor-3', 'professores/') };
    const professor4 = { 'nomeProf': nomeProfessor4, 'titulos': titulacaoProfessor4, 'retrato': await uploadImageAndGetURL(storageRef, '#professor-4', 'professores/') };
    const professores = [professor1, professor2, professor3, professor4];

    const preco = document.querySelector('.preco').value.trim();
    const parcela = document.querySelector('.parcela').value.trim();



    let nomeModulo1 = document.getElementById('modulo-1').value.trim();

    let nomeModulo2 = document.getElementById('modulo-2').value.trim();
    let nomeModulo3 = document.getElementById('modulo-3').value.trim();
    let nomeModulo4 = document.getElementById('modulo-4').value.trim();

    let modulos = [
        { 'nomeModulo': nomeModulo1, 'itensModulo': itensModulo1, 'imgModulo': await uploadImageAndGetURL(storageRef, '#foto-modulo-1', 'modulos/') },
        { 'nomeModulo': nomeModulo2, 'itensModulo': itensModulo2, 'imgModulo': await uploadImageAndGetURL(storageRef, '#foto-modulo-2', 'modulos/') },
        { 'nomeModulo': nomeModulo3, 'itensModulo': itensModulo3, 'imgModulo': await uploadImageAndGetURL(storageRef, '#foto-modulo-3', 'modulos/') },
        { 'nomeModulo': nomeModulo4, 'itensModulo': itensModulo4, 'imgModulo': await uploadImageAndGetURL(storageRef, '#foto-modulo-4', 'modulos/') },
    ];

    const imagCarrossellURL = await uploadImageAndGetURL(storageRef, '#img-do-carrossel', 'carrossel');
    const imgSegmentacaoURL = await uploadImageAndGetURL(storageRef, '#img-segmentacao', 'segmentacao');
    const imgPromessaURL = await uploadImageAndGetURL(storageRef, '#img-promessa', 'promessa');



    const curso = {
        sigla, //nome do documento
        prioridade, //int
        nome, //string
        resumo, //string
        segmentacao, //tring
        imgSegmentacao: imgSegmentacaoURL, //imagem no storage e armazenar download url no firestore
        promessa, //string
        beneficios, //string
        imgPromessa: imgPromessaURL, //imagem no storage e armazenar download url no firestore
        imgCarrossel: imagCarrossellURL, //imagem no storage e armazenar download url no firestore
        evidencias, //objeto
        pertencimento, //string
        solucao, //string
        oQueVaiAprender, // string
        linkVideo, //string
        horasCertificado, //int
        qtdAulas, //int
        modulos, //objeto
        qtdModulos, //int
        professores, //objeto
        preco, //string
        parcela, //string
    }
    // Adicionar ao Firestore

    try {
        const docRef = await setDoc(doc(db, "cursos", sigla), curso); // Usa 'setDoc' com 'doc' e o ID personalizado
        console.log("Documento escrito com ID: ", sigla);
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
    }

    console.log(curso);
});


document.getElementById('teste').addEventListener('click', async function () {

    console.log(await uploadImageAndGetURL(storageRef, '#professor-2', 'professores/'));

});

