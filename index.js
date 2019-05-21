const express = require('express')
const bodyParser= require('body-parser')
const multer  = require('multer')
storage = multer.memoryStorage();
const upload = multer({ storage : storage })
const app = express()
const googleSpeech=require('./apiGoogle');
const ibmSpeech=require('./apiBluemix');
const azureSpeech=require('./apiAzure');

var stream = require('stream');
var bufferStream = new stream.PassThrough();

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

  



app.use(express.static(__dirname + '/public/'))

 
//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});
 

app.post('/uploadfile', upload.single('filePhoto'), (req, res, next) => {
  req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
  
  
    var valorApi=req.body.valorApi;
    const file = req.file
    var json;
    var arr = {
      success: [],
      status:200
    };
  
    (async () => {
    
   /* if(valorApi=='GOOGLE API')  
    json= await googleSpeech.transcribirGoogle(req);
    else
    json= await ibmSpeech.transcribirBluemix(req);
*/
//console.log('entro');
    //Promise.all([googleSpeech.transcribirGoogle(req), ibmSpeech.transcribirBluemix(req),azureSpeech.transcribirAzure(req)]).then(function(values) {
      //Promise.all([azureSpeech.transcribirAzure(req)]).then(function(values) {
  Promise.all([googleSpeech.transcribirGoogle(req), "valor2","valor3"]).then(function(values) {
      console.log('resultado');
      //console.log(values);
      //arr.success.push(values);
     // arr.push(JSON.parse(values));
     var resultadofinal = JSON.stringify({ 
      success: ['valor1','valor2','valor3'], 
      status: 200
    });
      console.log('---resltado final del index---');
      console.log(resultadofinal);
      console.log('------fin rsultado final index-----');
      res.end(resultadofinal);
    }).catch(function(value){console.log('error en la llamada');});
   
    //console.log('paso');
    if (!file) {
       const error = new Error('Please upload a file')
       error.httpStatusCode = 400
       return next(error)
     }
     console.log('devolverv valor');
     
     
    })()
    
    
      
       
       
       
      
    })

app.listen(process.env.port || 8080, () => console.log('Server started on port 3000')).timeout=600000;
