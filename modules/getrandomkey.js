const { encrypt, decrypt } = require('./crypto');
const fs = require('fs');
const path = require("path");

const fileName = 'keys.bin';

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

// Read keys.bin and decrypt the file and put it in array

let rawdata = fs.readFileSync(path.resolve(__dirname, fileName));
let hash = JSON.parse(rawdata);

//console.log(hash);

let json = decrypt(hash);

// console.log(json);

const obj = JSON.parse(json);

let n = between(0, obj.length);

// console.log("Random index " + n);

let i = 0;
var data = [];
var BreakException = {};

obj.forEach(function(o) {
   try {
     if (i++ == n) {
        data = o;
        throw BreakException;
     }
   } catch (e) {
     if (e !== BreakException) throw e;
   }
});

// console.log(JSON.stringify(data));

module.exports.data = data;