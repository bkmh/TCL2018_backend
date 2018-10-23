import l from '../../../common/logger';

const fbClient = require('../../../blockchain/bc-client');
const fileUpload = require('express-fileupload');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, files, cb) {
    l.info('111111');
    l.info(files);
    cb(null, '../../uploads/'); //cb 콜백함수를 이용해 파일 저장 디렉토리 설정
  },
  filename: function(req, files, cb) {
    l.info('2222222');
    l.info(files.originalname);
    cb(null, new Date().toISOString() + files.originalname); //파일이름 설정
  }
});

const upload = multer({storage: storage});
const fs = require("fs");

class BabyChainService {
  uploadtest(req,res){

    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    //20181019 sally file information
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
    l.info(req.files.upfile.path);
    //20181019 sally text value
    l.info(req.body);
    l.info(req.body.value);
    //test1. not working
    upload.single(req.files.upfile.fieldname);
    upload.single('upfile');

    //test2. base64 enocoding test
    var fileInfo = [];
    var data = fs.readFileSync(req.files.upfile.path);
    //20181023 sally image to base64 encdonig buffer
    var base64Image = new Buffer(data.toString(),'base64');

    const args = [];
    //args.push(fileInfo);
    args.push(req.files.upfile.originalname);
    args.push(req.body.value);
    //20181023 sally base64 ecndoing buffer
    args.push(base64Image);
    //20181023 sally just image to string
    //args.push(data.toString());
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadtest', args, []));
  
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
