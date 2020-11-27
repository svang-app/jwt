const { encrypt, decrypt } = require('./crypto');

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const outFileName = 'keys.bin';

// We will generate keys.bin file and this file will be used by
// the mobile app, web app and the API app.
// The ideas is to pick one user id and password (randomly from the file)
// send it to the API server - which will validate same from the file to make sure
// that they have not been tempered and then API server will send the JWT that the
// mobile and web app will use to communicate with the API server so that there is
// protection of the APIs.

// This program needs to be run only once and and then share the keys.bin amongst apps.

var obj = [];

for (i = 0; i < 512; i++) {
   obj.push({primary: uuidv4(), secondary:uuidv4()});
}

var json = JSON.stringify(obj, null, 4);

const hash = encrypt(json);

//console.log(hash);

fs.writeFile(outFileName, JSON.stringify(hash, null, 4), function (err) {
  if (err) return console.log(err);
  console.log('Keys generated successfully.');
});