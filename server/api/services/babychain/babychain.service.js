import l from '../../../common/logger';

const fbClient = require('../../../blockchain/bc-client');


const fileUpload = require('express-fileupload');
//20181027 sally multer test
const multer = require('multer');
const fs = require("fs");


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

  uploadImage(req,res){
    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    //20181019 sally file information
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
    //20181019 sally text value
     l.info(req.body.value);
    //test2. base64 enocoding test
    var data = fs.readFileSync(req.files.upfile.path, 'base64');
    //var base64Image = new Buffer(data.toString(),'base64');
    const args = [];
    args.push(req.files.upfile.originalname);
    args.push(req.body.value);
    //20181023 sally base64 ecndoing buffer
    args.push(data);
  
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadImage', args, []));
  
  }

  readImage(req, res) {
    l.info('readImage test');
    l.info('key = '+ req.params.key);
    const args = [];
    args.push(req.params.key);
    
    return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
  }


  uploadImageJSEncoding(req,res){
    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    //20181019 sally file information
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
    //20181019 sally text value
     l.info(req.body.value);
    //test2. base64 enocoding test
    var data = fs.readFileSync(req.files.upfile.path);
    var base64Image = new Buffer(data.toString(),'base64');
    const args = [];
    args.push(req.files.upfile.originalname);
    args.push(req.body.value);
    //20181023 sally base64 ecndoing buffer
    args.push(base64Image);
  
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadImage', args, []));
  
  }

  readImageJSDecoding(req, res) {
    l.info('readImage test');
    l.info('key = '+ req.params.key);
    const args = [];
    args.push(req.params.key);
    Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []))
    .then(result=>{

      l.info('----------result[0].peer_payloads--------');
      l.info(result[0].peer_payloads);
      var stringImage = new Buffer(result[0].peer_payloads,'base64').toString('ascii')
      l.info('stringImage = '+stringImage.toString());
      //20181030 sally
      //to do - base64 encoding 했던 것을 decode하고 image file로 보여주는것 까지 구현해야함.. 
      //구현한 것을 return result에 setting하는 것도 필요함.
    });
    return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
  }

  uploadImageCCEncoding(req,res){
    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
    //20181019 sally text value
    l.info(req.body.value);
    //just read data -> to string
    var data = fs.readFileSync(req.files.upfile.path);
    var stringImage = data.toString();
    const args = [];
    args.push(req.files.upfile.originalname);
    args.push(req.body.value);
    //20181023 sally just image to string
    args.push(stringImage);
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadImageCCEncoding', args, []));
  
  }


  readImageCCDecoding(req, res) {
    l.info('readImage test');
    const args = [];
    args.push(req.params.key);
    l.info("11111111111111111111111111111111111111111111111111111111111111111");
    Promise.resolve(fbClient.queryChaincode('babychain', 'readImage', args, []))
    .then(result=>{
      //l.info('----------promise--------');
      //l.info(result);
      //l.info('----------result[0]--------');
      //l.info(result[0]);
      l.info('----------result[0].peer_payloads--------');
      l.info(result[0].peer_payloads);      
      //20181030 sally
      //to do - 결과 string을  image file로 보여주는것 까지 구현해야함.(decoding은 완료된 string임.)
      //구현한 것을 return result에 setting하는 것도 필요함.
    });

    return Promise.resolve(fbClient.queryChaincode('babychain', 'readImageCCDecoding', args, []));

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
