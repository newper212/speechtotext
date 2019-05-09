const express = require('express')
const bodyParser= require('body-parser')
const multer  = require('multer')
storage = multer.memoryStorage();
const upload = multer({ storage : storage })
const app = express()

var stream = require('stream');
var bufferStream = new stream.PassThrough();

const {Storage} = require('@google-cloud/storage');
const GOOGLE_CLOUD_PROJECT_ID = 'my-project-1525791452214'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'D:/BitPerfect/SAGA FALABELLA/NODEJS/speechtoText/acceso.json'; // Replace with the path to the downloaded private key

const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient();

const gcs = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });

  



app.use(express.static(__dirname + '/public/'))
 
//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});
 

app.post('/uploadfile', upload.single('filePhoto'), (req, res, next) => {
   console.log('entro fileupload');  
   var bufferStream = new stream.PassThrough();
    const file = req.file
    console.log(1);
    console.log('inicio valor file');
    console.log(file);
    console.log('fin valor file');
      const encoded =  req.file.buffer.toString('base64')
      console.log(2);
      //console.log(encoded);
     bufferStream.end(Buffer.from(encoded, 'base64'));
     console.log(3);
     var myBucket = gcs.bucket('pruebafalabella');
     console.log(4);
     var archivo = myBucket.file(file.originalname);
     console.log(5);
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
         //console.log(data);
           console.log('final');
           (async () => {
          console.log('asdsadsada');
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

            console.log('7675675');
            console.log(request);
            const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      //.join('\n');
    console.log(`Transcription: ${transcription}`);
    //res.send('asdsadasda');
    var json = JSON.stringify({ 
      success: transcription, 
      status: 200
    });
    //res.end('{"success" : "Updated Successfully", "status" : 200}');
    //res.end(`{"success" : "${transcription}", "status" : 200}`);
    res.end(json);
          console.log('2');
           })()
         //  res.redirect('/');
       console.log('1');
       //res.end(`{"success" : "${transcription}", "status" : 200}`);
         // The file upload is complete.
       });


     if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
      }
       // res.write(200);
       //res.end();
       //res.end('{"success" : "Updated Successfully", "status" : 200}');
       console.log('retorno');
      
       
       
       
      
    })

app.listen(3000, () => console.log('Server started on port 3000'));