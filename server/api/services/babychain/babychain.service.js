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
  uploadtest(req,res){
    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    //20181019 sally file information
    var file = req.files.upfile;
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
    l.info(req.files.upfile.path);

        //test1. not working
        upload.single(req.files.upfile.fieldname);
        upload.single(file);
        upload.single('upfile');
        upload.single(req.files.upfile);
    //20181019 sally text value
    l.info(req.body);
    l.info(req.body.value);
    //test2. base64 enocoding test
    var fileInfo = [];
    var data = fs.readFileSync(req.files.upfile.path);
    //fs.writeFile(req.files.upfile.originalname,data,'utf-8',function(err){
    //  l.info('File create?');
    //})
    //20181023 sally image to base64 encdonig buffer
    var base64Image = new Buffer(data.toString(),'base64');
    //var stringImage = data.toString();

    const args = [];
    //args.push(fileInfo);
    args.push(req.files.upfile.originalname);
    args.push(req.body.value);
    //20181023 sally base64 ecndoing buffer
    args.push(base64Image);
    //20181023 sally just image to string
    //args.push(stringImage);
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadtest', args, []));
  
  }
  readImage(req, res) {
    l.info('readImage test');
    l.info('key = '+ req.params.key);
    const args = [];
    args.push(req.params.key);
    //chaincode execute result..json형태로 return 받을 것 같은데..뭐지..
    var base64Image = fbClient.queryChaincode('babychain', 'query', args, []);

    //result is object Promise? object promise는 transaction.js에 생성과정이 정의되어 있음.
    l.info('result = '+base64Image);
    // Object.values()
    //var objValues = Object.values(base64Image);
    //l.info('objValues:', objValues);
    // Object.keys() and map(),
    //var objKeysMap = Object.keys(base64Image).map((k) => obj[k]);
    //l.info('objKeysMap:', objKeysMap);
    //l.info('result string = '+base64Image.toString());

    var res = Promise.resolve(base64Image);
    l.info('res = '+res);
    l.info(res.values);
    //l.info(Promise.values(base64Image));
    l.info(Promise.keys);
    l.info(Promise.prototype.all);
    l.info(res.peer_payloads);
    //l.info('JSON1:',JSON.parse(res));
    l.info('JSON2:',JSON.stringify(res));
    //l.info(Promise.prototype.all(base64Image));
    l.info('payload = '+  res.all);
    //decoding base64 to string->error
    //var stringImage = new Buffer(res,'base64').toString('ascii');
    //l.info('stringImage = '+stringImage.toString());
    
    //file write.. 
    //fs.writeFile("out.png",base64Image,'base64',function(err){
    //  l.info('File create?');
    //})
    return res;
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
