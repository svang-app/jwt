const { encrypt, decrypt } = require('./crypto');
const fs = require('fs');
const path = require("path");

const fileName = 'keys.bin';

// Read keys.bin and decrypt the file and put it in array

let rawdata = fs.readFileSync(path.resolve(__dirname, fileName));
let hash = JSON.parse(rawdata);

//console.log(hash);

let json = decrypt(hash);

// console.log(json);

const obj = JSON.parse(json);

const checkKey = (key, secret) => {
   let i = 0;
   var result = false;
   var BreakException = {};
   var data = {"key": key, "secret": secret};
   obj.forEach(function(o) {
     try {
        // console.log(JSON.stringify(o));
        if (JSON.stringify(data) == JSON.stringify(o)) {
           result = true;
           throw BreakException;
           i++;
        }
       } catch (e) {
         if (e !== BreakException) throw e;
       }
   });
   return result;
};

module.exports = { checkKey  };