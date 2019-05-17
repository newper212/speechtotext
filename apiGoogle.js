var stream = require('stream');

const {Storage} = require('@google-cloud/storage');
const GOOGLE_CLOUD_PROJECT_ID = 'my-project-1525791452214'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'acceso.json'; // Replace with the path to the downloaded private key

const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient();

const gcs = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });


 function transcribirGoogle(varReq)
{

    return new Promise(function(resolve, reject) {

    console.log('entro a subir');
    const file = varReq.file
    var bufferStream = new stream.PassThrough();
    const encoded =  varReq.file.buffer.toString('base64')
    bufferStream.end(Buffer.from(encoded, 'base64'));
    var myBucket = gcs.bucket('pruebafalabella');
    var archivo = myBucket.file(file.originalname);

    bufferStream.pipe(archivo.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            custom: 'metadata'
          }
        },
        public: true,
        validation: "md5"
      }))
      .on('error', function(err) {console.log(err); })
      .on('finish', function(data) {
        
          (async () => {
          let audio = {
           uri: 'gs://pruebafalabella/'+file.originalname,
           };

          
         let config = {
           languageCode: 'es-ES'
         };
         let request = {
           audio: audio,
           config: config,
         };

   const [operation] = await client.longRunningRecognize(request);

   const [response] = await operation.promise();
   const transcription = response.results
     .map(result => result.alternatives[0].transcript)
    
     var textoConcatenado='';
     transcription.forEach(function(value){
       textoConcatenado=textoConcatenado+value +' '
     });
  
  /* var json = JSON.stringify({ 
     success: transcription, 
     status: 200
   });
*/
var json=textoConcatenado;
   //console.log('valor json: '+json);
   // return json;
   return resolve(json)
          })()
        
      });

    })
}

module.exports.transcribirGoogle=transcribirGoogle