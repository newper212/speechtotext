const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var stream = require('stream');
var fs = require('fs');

function transcribirBluemix(req)
{
    return new Promise(function(resolve, reject) {

    var bufferStream = new stream.PassThrough();
    const file = req.file
    const encoded =  req.file.buffer.toString('base64')
    
    bufferStream.end(Buffer.from(encoded, 'base64'));

    const speechToText = new SpeechToTextV1({
        iam_apikey: 'Pnv6lyVgmrRzEA4KS8-zEo_EqnEljDrJ8RmVKkblHywt',
        url: 'https://stream.watsonplatform.net/speech-to-text/api'
      });

    var params = {
        continuous: true,
        timestamps: true,
        content_type: 'audio/wav',
        keywords: [
           "México",
           "Grecia",
           "diciembre",
           "Roberto",
           "Madrid",
           "fin de semana"
          ],
        keywords_threshold: 0.01,
        audio: bufferStream,
        word_alternatives_threshold: 0.01,
         model:'es-ES_NarrowbandModel',
         smart_formatting: true
        
      };

      console.log('valor 1');
      speechToText.recognize(params)
      .then(speechRecognitionResults => {
        var resultado=JSON.stringify(speechRecognitionResults,null,2);
        var valorJson=JSON.parse(resultado);
        console.log('valor 2');
        var textoConcatenado='';
        valorJson.results.forEach(function(value){
          textoConcatenado=textoConcatenado+value.alternatives[0].transcript +' '
        });
        console.log('valor 3');
       // console.log(textoConcatenado);
       var json = JSON.stringify({ 
        success: textoConcatenado, 
        status: 200
      });
      console.log('valor 4');
      return resolve(json)
    
      })
      .catch(err => {
        console.log('error:', err);
      });

    })
}

module.exports.transcribirBluemix=transcribirBluemix