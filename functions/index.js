/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

const serviceAccount = require("./squad13-7ae1e-firebase-adminsdk-z2jp9-888b50dd2c.json");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Gera URLs de download direto para todos os arquivos em um caminho específico dentro do bucket do Storage.
 * @param {string} bucketName Nome do bucket do Storage.
 * @param {string} folderPath Caminho da pasta dentro do bucket.
 * @return {Promise<string[]>} Uma promessa que resolve com uma lista de URLs de download direto.
 */
async function generateDownloadUrls(bucketName, folderPath) {
  const bucket = admin.storage().bucket(bucketName);
  const [files] = await bucket.getFiles({prefix: folderPath});

  const urls = files.map((file) => {
    if (file.name.endsWith("/")) {
      // Pula diretórios
      return null;
    }

    // Gera a URL pública do arquivo
    const url = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(file.name)}`;
    return url;
  });

  return urls.filter((url) => url !== null); // Filtra os valores null do resultado final
}


// Função unificada para obter documentos Firestore e URLs de imagens
exports.getFirestoreDocs = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const bucketName = "squad13-7ae1e.appspot.com";
      const docRef = admin.firestore().collection("cards").doc("h84fnjrGnt4S4HHGQTAb");
      const linkYoutubePromise = admin.firestore().collection("outros-itens-landing-page").doc("link-nosso-conteudo").get();

      // Promessas para obter os URLs das imagens da comunidade e do fórum
      const comunidadeUrlsPromise = generateDownloadUrls(bucketName, "img-comunidade/");
      const forumUrlsPromise = generateDownloadUrls(bucketName, "img-forum/");
      const docSnapshot = docRef.get();
      const aulasAbertasUrlsPromise = generateDownloadUrls(bucketName, "carousels/aulas-abertas/");
      const aulasPilulasUrlsPromise = generateDownloadUrls(bucketName, "carousels/aulas-pilulas/");
      const cursosSnapshot = await admin.firestore().collection("cursos").get();
      const cursosData = cursosSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          sigla: data.sigla,
          nome: data.nome, // Captura o campo "nome" do documento
          resumo: data.resumo, // Captura o campo "resumo" do documento
          carrosselImg: data.imgCarrossel,
        };
      });

      const [
        doc,
        aulasAbertasUrls,
        aulasPilulasUrls,
        comunidadeUrls,
        forumUrls,
        youtubeDocSnapshot, // Obtenha o snapshot do documento para o link do YouTube
      ] = await Promise.all([
        docSnapshot,
        aulasAbertasUrlsPromise,
        aulasPilulasUrlsPromise,
        comunidadeUrlsPromise,
        forumUrlsPromise,
        linkYoutubePromise, // Adicione a promessa do link do YouTube aqui
      ]);

      let linkYoutube = null;
      if (youtubeDocSnapshot.exists) {
        const youtubeDocData = youtubeDocSnapshot.data();
        linkYoutube = youtubeDocData.linkYoutube; // Supondo que o campo no documento seja 'linkYoutube'
      } else {
        console.log("No YouTube link document found");
      }

      if (!doc.exists) {
        response.status(404).json({error: "No document found!"});
        return;
      }

      const docData = doc.data();
      const cardsEquipe = docData["cards-equipe"];
      const cardsValidacao = docData["cards-validacao"];

      if (!cardsEquipe || !cardsValidacao) {
        response.status(404).json({error: "No cards array found!"});
        return;
      }

      response.status(200).json({
        cardsEquipe,
        cardsValidacao,
        aulasAbertasUrls,
        aulasPilulasUrls,
        comunidadeUrls, // Adicionado aqui
        forumUrls, // Adicionado aqui
        linkYoutube,
        cursos: cursosData, // Adicionado o link do YouTube aqui
      });
    } catch (error) {
      console.error("Error processing request:", error);
      response.status(500).json({error: "Error processing request", details: error.message});
    }
  });
});


// Função para obter um documento específico da coleção "cursos" pelo ID
exports.getCursoById = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      // Obtém o ID do curso a partir dos parâmetros da requisição
      const cursoId = request.query.id;

      if (!cursoId) {
        response.status(400).json({error: "Missing course ID"});
        return;
      }

      const docRef = admin.firestore().collection("cursos").doc(cursoId);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        response.status(404).json({error: "Course not found"});
        return;
      }

      const cursoData = docSnapshot.data();

      response.status(200).json(cursoData);
    } catch (error) {
      console.error("Error fetching course:", error);
      response.status(500).json({error: "Error fetching course", details: error.message});
    }
  });
});
