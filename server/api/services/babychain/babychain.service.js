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


class BabyChainService {
  uploadtest(req,res){

    l.info('upload image test');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile);
    l.info(req.files.upfile.originalname);
   
    upload.single(req.files.upfile.fieldname);
    upload.single('upfile');

    l.info(req.formdata);
    l.info(req.params);
    l.info(req.body);
    l.info(req.value);
    l.info(req.params.value);
    const args = [];
    args.push(req.files.upfile.originalname);
    args.push();
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'uploadtest', args, []));
 

    res.send('baby test');
  
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
