const QRCode = require("qrcode");
const crypto = require("crypto");


const qRcodeRepo = require("../models/QRcode.model");


function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function createQRcode() {

    const tokenId = generateToken();
    const url = process.env.URL + tokenId;
      
    const dataUrl = await QRCode.toDataURL(url); //QR code created

    const QR = qRcodeRepo.create({ tokenId, url});
      
    return QR;
    //add to database
}


async function getQRcode(Id) {
    const qrCode = await qRcodeRepo.findById(Id);
    if (!qrCode) {
        const err = new Error("Not found");
        err.status = 404;
        throw err; 
    } 

    //create QRcode on the go
    const tokenId = qrCode.tokenId;
    
    const url = process.env.URL + tokenId;
    const dataUrl = await QRCode.toDataURL(url); //QR code created

    return dataUrl;
}


async function scanQRcode(tokenId) {
    const qrCode = await qRcodeRepo.findByTokenId(tokenId);


    if (!qrCode) {
        const err = new Error("Not found");
        err.status = 404;
        throw err
    }
    return qrCode;
}

module.exports = {
    createQRcode,
    getQRcode,scanQRcode
};  

