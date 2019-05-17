var sdk = require("microsoft-cognitiveservices-speech-sdk");
var stream = require('stream');
var fs = require("fs");
const request = require('request');
const { Readable } = require('stream');
const stream2 = new Readable();


// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = "1b824e88a457427fba60db47ca398c11";
var serviceRegion = "eastus"; // e.g., "westus"
var filename = "YourAudioFile.wav"; // 16000 Hz, Mono

// create the push stream we need for the speech sdk.

var pushStream2 = sdk.AudioInputStream.createPushStream();

function transcribirAzure(req)
{

    return new Promise(function(resolve, reject) {
    var pushStream = sdk.AudioInputStream.createPushStream();
    var bufferStream = new stream.PassThrough();
    const file = req.file
    const encoded =  req.file.buffer.toString('base64')
    bufferStream.end(Buffer.from(encoded, 'base64'));

  
   bufferStream.on('data',function cass(data){
    pushStream.write(data);
  }).on('end', function() {
    pushStream.close();
  });
    var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = "es-MX";

// create the speech recognizer.
var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
var textoConcatenado='';
// start the recognizer and wait for a result.

recognizer.startContinuousRecognitionAsync(
  function () {
    //console.log('termino part2');
  }, 
  function (err) {
  console.trace("err - " + err);
  });
  
  // The event recognized signals that a final recognition result is received.
  recognizer.recognized = function(s, e){
   // console.log('arte');
  /*console.log('---------1');
  console.log(e.privResult);
  console.log('------2')*/
  //console.log(e.privResult.privText);
  textoConcatenado=textoConcatenado+e.privResult.privText +' '
  //console.log('recognized text', e.result.text);
  //s.speechEndDetected()

  s.speechEndDetected = (s,e) => {
   
    s.stopContinuousRecognitionAsync(
      function () {
       // console.log('finalizo todo');
        //console.log(textoConcatenado);
       // s.close();
        return resolve(textoConcatenado);
      }, 
      function (err) {
      console.trace("err - " + err);
      });
};

  
  
  };

  //recognizer.sessionStopped
/*
  recognizer.sessionStopped(
    function () {
      console.log('finalizo la session');
    }, 
    function (err) {
    console.trace("err - " + err);
    });

    recognizer.speechEndDetected(
      function () {
        console.log('finalizo la session');
      }, 
      function (err) {
      console.trace("err - " + err);
      });*/
  //recognizer.speechEndDetected
 



  
  //recognizer.stopContinuousRecognitionAsync


/*recognizer.recognizeOnceAsync(
  function (result) {
   
    console.log('resultado movistar')
    console.log(result);
    console.log('fin resultado movistar');
    recognizer.close();
    recognizer = undefined;
    texto=result.privText.toString();
    return resolve(texto);
  },
  function (err) {
    console.trace("err - " + err);

    recognizer.close();
    recognizer = undefined;
    return resolve('error en azure');
  });*/
 
    })
}

module.exports.transcribirAzure=transcribirAzure