/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

const serviceAccount = require("D:\\Projetos\\UNIT\\Porto Digital\\SQUAD13-COLETIVA\\PortalAdminAngular\\squad13-7ae1e-firebase-adminsdk-z2jp9-36b6ccbdbc.json");

/* eslint-disable max-len */

const functions = require("firebase-functions");

const admin = require("firebase-admin");

const cors = require("cors")({origin: true});


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),

});


/**

 * Gera URLs assinadas para todos os arquivos em um caminho específico dentro do bucket do Storage.

 * @param {string} bucketName Nome do bucket do Storage.

 * @param {string} folderPath Caminho da pasta dentro do bucket.

 * @return {Promise<string[]>} Uma promessa que resolve com uma lista de URLs assinadas.

 */

async function generateSignedUrls(bucketName, folderPath) {
  const bucket = admin.storage().bucket(bucketName);

  const [files] = await bucket.getFiles({prefix: folderPath});


  const urls = await Promise.all(

      files

          .filter((file) => {
            // Filtra arquivos para garantir que eles sejam imagens verificando a extensão do arquivo

            return /\.(jpg|jpeg|png|gif)$/i.test(file.name);
          })

          .map(async (file) => {
            // Pula a geração de URL assinada para diretórios

            if (file.name.endsWith("/")) {
              return null; // Retorna null para diretórios
            }


            const [url] = await file.getSignedUrl({

              action: "read",

              expires: "03-09-2491", // Use uma data de expiração adequada

            });


            // Criar um objeto URL para manipular componentes da URL de forma conveniente

            const urlObject = new URL(url);


            // Remover o parâmetro GoogleAccessId da query string

            urlObject.searchParams.delete("GoogleAccessId");

            urlObject.searchParams.delete("Signature"); // Remova também o parâmetro de assinatura, se necessário

            urlObject.searchParams.delete("Expires"); // Remova também o parâmetro de expiração, se necessário


            // Retorna a URL modificada como uma string

            return urlObject.href;
          }),

  );


  // Filtra os valores null do resultado final para remover diretórios

  return urls.filter((url) => url !== null);
}


// Função unificada para obter documentos Firestore e URLs de imagens

/* eslint-disable no-undef */

/* eslint-disable max-len */

exports.getFirestoreDocs = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const bucketName = "squad13-7ae1e.appspot.com";

      const docRef = admin.firestore().collection("cards").doc("h84fnjrGnt4S4HHGQTAb");

      const linkYoutubePromise = admin.firestore().collection("outros-itens-landing-page").doc("link-nosso-conteudo").get();


      // Promessas para obter os URLs das imagens da comunidade e do fórum

      const comunidadeUrlsPromise = generateSignedUrls(bucketName, "img-comunidade/");

      const forumUrlsPromise = generateSignedUrls(bucketName, "img-forum/");


      const docSnapshot = docRef.get();

      const aulasAbertasUrlsPromise = generateSignedUrls(bucketName, "carousels/aulas-abertas/");

      const aulasPilulasUrlsPromise = generateSignedUrls(bucketName, "carousels/aulas-pilulas/");


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

        linkYoutube, // Adicionado o link do YouTube aqui

      });
    } catch (error) {
      console.error("Error processing request:", error);

      response.status(500).json({error: "Error processing request", details: error.message});
    }
  });
});
