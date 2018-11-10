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
  // 20181101 sally upload image to text
  uploadImageToText(req, res) {
    BabyChainService
      .uploadImageToText(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  // 20181101 sally read
  readImageToText(req, res) {
    BabyChainService
      .readImageToText(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  modifyImageToText(req, res) {
    BabyChainService
      .modifyImageToText(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  deleteImageToText(req, res) {
    BabyChainService
      .deleteImageToText(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
  
   // 20181110 sally upload image and values
   uploadImageAndValues(req, res) {
    BabyChainService
      .uploadImageAndValues(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  // 20181110 sally read image and values
  readImageAndValues(req, res) {
    BabyChainService
      .readImageAndValues(req, res)
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


}
export default new Controller();
