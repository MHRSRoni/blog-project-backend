const crypto = require('crypto')
const utils = require('util')
 const jwt = require('jsonwebtoken')

const algorithm = 'aes-256-cbc'
const privateKey = crypto.randomBytes(32).toString('hex')
const iv = crypto.randomBytes(16)
const outputFormat = 'hex'



exports.encrypt = async (data) => {
    return new Promise((resolve, reject) => {
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(privateKey, 'hex'), iv);
        let encrypted = Buffer.from('');

        cipher.on('data', (chunk) => {
            encrypted = Buffer.concat([encrypted, chunk]);
        });

        cipher.on('end', () => {
            resolve(encrypted.toString(outputFormat));
        });

        cipher.on('error', (err) => {
            reject(err);
        });

        cipher.write(JSON.stringify(data), 'utf-8');
        cipher.end();
    });
}



exports.decrypt = async (encryptedData) => {
    return new Promise((resolve, reject) => {
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(privateKey, 'hex'), iv);
        let decrypted = [];

        decipher.on('data', (chunk) => {
            decrypted.push(chunk);
        });

        decipher.on('end', () => {
            try {
                const decryptedString = Buffer.concat(decrypted).toString('utf-8');
                const decryptedObject = JSON.parse(decryptedString);
                resolve(decryptedObject);
            } catch (error) {
                reject(error);
            }
        });

        decipher.on('error', (err) => {
            reject(err);
        });

        decipher.write(encryptedData, 'hex');
        decipher.end();
    });
};




exports.generateToken = async (encryptedText) => {
    const token = jwt.sign({data : encryptedText}, process.env.JWT_SECRET, {expiresIn : '5m'})
    return token
}



exports.decodeToken = async (token) => {
    const {data} = jwt.verify(token, process.env.JWT_SECRET)
    return data
}



exports.generateOtp = () => Math.floor(Math.random() * 100000 + 100000)
