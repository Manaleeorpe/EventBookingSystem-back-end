const service = require("../services/QRcode.service");
const { parseId } = require("../middlewares/utils");

async function createQRcode(req, res, next) {
  try {
    const qrCode = await service.createQRcode();
    res.json( qrCode );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR" });
  }
}

async function getQRcode(req, res, next) {
    try {
      
    const Id = parseId(req.params.id);
    const QRcode = await service.getQRcode(Id);  //QRcode is the complete object from the db   
    res.json({ QRcode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retreive QR" });
  }
}


async function scanQRcode(req, res, next) {

    //should only be scanned one hour before the event to

    try {
        const tokenId = req.params.tokenId;
       
        const Qcode = await service.scanQRcode(tokenId);
        res.json(true);
    } catch (err) {
        console.error(err);
       res.json(false);;
      }

    }



module.exports = { createQRcode, getQRcode,scanQRcode };