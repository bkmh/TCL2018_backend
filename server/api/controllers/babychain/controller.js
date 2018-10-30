import BabyChainService from '../../services/babychain/babychain.service';


export class Controller {

  // 20181030 BKMH 기존 uploadImage 원복
  // babychain.service.js 연관
  uploadImage(req, res) {
    BabyChainService
      .uploadImage(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  // 20181030 BKMH 기존 readImage 원복
  // babychain.service.js 연관
  readImage(req, res) {
    BabyChainService
      .readImage(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
  
  uploadImageJSEncoding(req, res) {
    BabyChainService
      .uploadImageJSEncoding(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
  
  readImageJSDecoding(req, res) {
    BabyChainService
      .readImageJSDecoding(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  uploadImageCCEncoding(req, res) {
    BabyChainService
      .uploadImageCCEncoding(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
  
  readImageCCDecoding(req, res) {
    BabyChainService
      .readImageCCDecoding(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }


  getBaby(req, res) {
    BabyChainService
      .getBaby(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
 
  register(req, res) {
    BabyChainService
      .register(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }


  modify(req, res) {
    BabyChainService
      .modify(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  delete(req, res) {
    BabyChainService
      .delete(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
  
  postdelete(req, res) {
    BabyChainService
      .postdelete(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  upload(req, res) {
    BabyChainService
      .postdelete(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }


}
export default new Controller();
