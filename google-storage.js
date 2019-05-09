const GoogleCloudStorage = require('@google-cloud/storage');
const GOOGLE_CLOUD_PROJECT_ID = 'engaged-hook-237120'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = 'D:/BitPerfect/SAGA FALABELLA/NODEJS/speechtoText/acceso_storage.json'; // Replace with the path to the downloaded private key
  
const storage = GoogleCloudStorage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });

var myBucket = storage.bucket('my-bucket');

var file = myBucket.file('my-file.jpg');

bufferStream.pipe(file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        custom: 'metadata'
      }
    },
    public: true,
    validation: "md5"
  }))
  .on('error', function(err) {})
  .on('finish', function() {
    // The file upload is complete.
  });