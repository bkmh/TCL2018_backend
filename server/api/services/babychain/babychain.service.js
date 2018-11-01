import l from '../../../common/logger';

const fbClient = require('../../../blockchain/bc-client');


const fileUpload = require('express-fileupload');
//20181027 sally multer test
const multer = require('multer');
const fs = require('fs');
//20181101 sally sha256 crypto module add
const crypto = require('crypto')


var storage = multer.diskStorage({
  destination: function(req,file,callback){
    l.info('multer test');
    callback(null,'uploads/')
  },
  filename: function (req,file,callback){
    callback(null,file.originalname+Date.now())
  }
});
var upload = multer({
  storage: storage
});

//const storage = multer.diskStorage({
//  destination: function(req, files, cb) {
//    l.info('111111');
//    l.info(files);
//    cb(null, 'uploads/'); //cb 콜백함수를 이용해 파일 저장 디렉토리 설정
//   },
//   filename: function(req, files, cb) {
//     l.info('2222222');
//     l.info(files.originalname);
//     cb(null, new Date().toISOString() + files.originalname); //파일이름 설정
//   }
// });
//const upload = multer({storage: storage});


class BabyChainService {
  // 20181030 BKMH 기존 uploadImage 복원
  uploadImage(req, res) {
    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    // 20181019 sally file information
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
    // 20181019 sally text value
     l.info(req.body.value);
    // 20181030 BKMH readFile를 이용하여 Buffer를 encoding= base64 로 생성
    var data = fs.readFileSync(req.files.upfile.path, 'base64');
    // var base64Image = new Buffer(data.toString(),'base64');
    const args = [];
    args.push(req.files.upfile.originalname);
    args.push(req.body.value);
    // 20181023 sally base64 ecndoing buffer
    args.push(data);
  
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadImage', args, []));
  
  }

  // 20181030 BKMH 기존 uploadImage 복원 
  readImage(req, res) {
    l.info('readImage test');
    l.info('key = '+ req.params.key);
    const args = [];
    args.push(req.params.key);
    
    return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
  }

    // 20181101 sally upload image to text
    uploadImageToText(req, res) {
      l.info('upload image to text');
      l.info(`${this.constructor.name}.byId(${req})`);
      l.info(req.files.upfile);             //file info
      l.info(req.body.value);               //input text value
      var data = fs.readFileSync(req.files.upfile.path, 'base64');
      //l.info("image file base64 encoding : "+data);
      var sha256String = crypto.createHash('sha256').update(data).digest('utf-8')
      l.info("key encrypted string : "+sha256String); 
      const args = [];

      args.push(sha256String);    //key image 
      args.push(req.body.value);  //value text string
        
      return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
    
    }
  
   // 20181101 sally upload image to text 
    readImageToText(req, res) {
      l.info('readImage test');
      l.info(req.files.upfile);             //file info
      var data = fs.readFileSync(req.files.upfile.path, 'base64');
      //l.info("image file base64 encoding : "+data);   
      var sha256String = crypto.createHash('sha256').update(data).digest('utf-8')
      l.info("key encrypted string : "+sha256String); 
      const args = [];
      args.push(sha256String);
      
      return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
    }

    modifyImageToText(req, res) {
      l.info('modifyImageToText test');
      l.info(`${this.constructor.name}.byId(${req})`);
      l.info(req.files.upfile);             //file info
      l.info(req.body.value);               //input text value
      var data = fs.readFileSync(req.files.upfile.path, 'base64');;
      var sha256String = crypto.createHash('sha256').update(data).digest('utf-8')
      l.info("key encrypted string : "+sha256String); 
      const args = [];

      args.push(sha256String);    //key image 
      args.push(req.body.value);  //value text string
  
      return Promise.resolve(fbClient.invokeChaincode('babychain', 'modify', args, []));
    }
  
    deleteImageToText(req, res) {
      l.info('deleteImageToText test');
      l.info(req.files.upfile);             //file info
      var data = fs.readFileSync(req.files.upfile.path, 'base64');  
      var sha256String = crypto.createHash('sha256').update(data).digest('utf-8')
      l.info("key encrypted string : "+sha256String); 
      const args = [];
      args.push(sha256String);
      return Promise.resolve(fbClient.invokeChaincode('babychain', 'delete', args, []));
    }

  getBaby(req, res) {
    l.info('getbaby test');
    const args = [];

    args.push(req.params.key);
    return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
  }

  register(req, res) {
    l.info('register test');
    l.info(`${this.constructor.name}.byId(${req})`);
    const args = [];

    args.push(req.body.key);
    args.push(req.body.value);

    return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
  }

  modify(req, res) {
    l.info('modify test');
    l.info(`${this.constructor.name}.byId(${req})`);
    const args = [];

    args.push(req.body.key);
    args.push(req.body.value);

    return Promise.resolve(fbClient.invokeChaincode('babychain', 'modify', args, []));
  }

  delete(req, res) {
    l.info('delete test');
    const args = [];
    args.push(req.params.key);
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'delete', args, []));
  }

  postdelete(req, res) {
    l.info('delete test');
    l.info(`${this.constructor.name}.byId(${req})`);
    const args = [];
    args.push(req.params.key);
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'delete', args, []));
  }


}

export default new BabyChainService();
