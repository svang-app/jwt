const crypto = require('crypto');

require('dotenv').config({path: __dirname + '/.env'});

const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRETKEY;
const iv = crypto.randomBytes(16);

// console.log("Path=" +  __dirname);

if (!process.env.SECRETKEY) {
   console.log("SECRETKEY not found. Exiting....");
   process.exit(1);
}

// console.log("SecretKey: " + secretKey);

const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};