const express = require('express')
const bodyParser= require('body-parser')
const multer  = require('multer')
storage = multer.memoryStorage();
const upload = multer({ storage : storage })
const app = express()
const googleSpeech=require('./apiGoogle');
const ibmSpeech=require('./apiBluemix');

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
  req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
  
  
    var valorApi=req.body.valorApi;
    const file = req.file
    var json;
    (async () => {
    
    if(valorApi=='GOOGLE API')  
    json= await googleSpeech.transcribirGoogle(req);
    else
    json= await ibmSpeech.transcribirBluemix(req);
      
    if (!file) {
       const error = new Error('Please upload a file')
       error.httpStatusCode = 400
       return next(error)
     }

     res.end(json);
     
    })()
    
    
      
       
       
       
      
    })

app.listen(process.env.port || 8081, () => console.log('Server started on port 3000'));