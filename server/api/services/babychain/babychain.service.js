import l from '../../../common/logger';

const path = require('path');


const fileUpload = require('express-fileupload');
// 20181027 sally multer test
const multer = require('multer');
const fs = require('fs');
// 20181101 sally sha256 crypto module add
const crypto = require('crypto');
const fbClient = require('../../../blockchain/bc-client');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/');
  },
  filename(req, userFileName, callback) {
    if (userFileName == null) {
      callback(null, `${file.originalname} - ${Date.now()}`);
    } else {
      callback(null, userFileName);
    }
  },
});

const upload = multer({
  storage,
});

// const storage = multer.diskStorage({
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
// const upload = multer({storage: storage});


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
    const data = fs.readFileSync(req.files.upfile.path, 'base64');
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
    l.info(`key = ${req.params.key}`);
    const args = [];
    args.push(req.params.key);

    return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
  }

  // 20181101 sally upload image to text
  uploadImageToText(req, res) {
    l.info('upload image to text');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile); // file info
    l.info(req.body.value); // input text value
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);

    // multer 를 이용한 파일업로드 테스트
    // upload.single(req.files.upfile, 'testImage');

    // BKMH Upload 된 파일을 기준으로 CouchDB 적재

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const extension = path.extname(req.files.upfile.originalname);
    // const basename = path.basename(req.file.upfile.originalname, extension);

    // const newFilePath = path.join('/uploads/', sha256String.concat(extension));

    // const newFilePath = path.join(__dirname, '/uploads/', uft8Sha256String.concat(extension));

    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    const newFilePath = path.join(__dirname, '/uploads/', sha256String.concat(extension));

    l.info('newFilePath : %s', newFilePath);

    fs.writeFileSync(newFilePath, streamData, 'base64', 'w');

    const args = [];

    args.push(sha256String); // key image
    args.push(req.body.value); // value text string

    return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
  }

  // 20181214 BKMH Upload Image and Values(add flag)
  uploadImageAndValues(req) {
    l.info('upload image to text');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile); // file info
    l.info(req.body.value); // input text value
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);

    // multer 를 이용한 파일업로드 테스트
    // upload.single(req.files.upfile, 'testImage');

    // BKMH Upload 된 파일을 기준으로 CouchDB 적재

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const extension = path.extname(req.files.upfile.originalname);
    // const basename = path.basename(req.file.upfile.originalname, extension);

    // const newFilePath = path.join('/uploads/', sha256String.concat(extension));

    // const newFilePath = path.join(__dirname, '/uploads/', uft8Sha256String.concat(extension));

    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    // 2018.12.15 BKMH - 차후, FLAG에 따라, 저장되는 경로 변경할 것.
    const strDestination = path.join(__dirname, '/uploads/');

    if (!fs.existsSync(strDestination)) {
      fs.mkdirSync(strDestination);
    }

    const newFilePath = path.join(strDestination, sha256String.concat(extension));

    l.info('newFilePath : %s', newFilePath);

    fs.writeFileSync(newFilePath, streamData, 'base64', 'w+');

    const args = [];

    args.push(sha256String); // key image
    args.push(req.body.strcontectnumber); // contectNumber String
    args.push(req.body.strdetailinfo); // detail infomation for baby
    args.push('R'); // for registerFlag

    // return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'registerMultiValues', args, []));
  }

// 20181215 BKMH read Image and Values
  readImageAndValues(req) {
    l.info('readImage test');
    l.info(req.files.upfile); // file info
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);
    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const args = [];
    args.push(sha256String);

    // 제일 마지막 peer List를 전달하는 부분에 대한 내용 확인
    // 해당 함수를 호출하여, 이미지에 해당하는 값을 확인하고, 실제 로컬에 떨어진 파일이 존재한다면, 해당 이미지에 대한 출력값을
    // 어떻게 제공할 것인지 판단 필요함.
    // 일단 기존 front 에서 base64로 데이터를 전달받아, 처리하고 있으므로
    // base64 String을 전달할 수 있도록 로직 수정
    const result = Promise.resolve(fbClient.queryChaincode('babychain', 'readMultiValues', args, []));

    if (result != null) {
      const babyInfo = result.parsed;
      // transaction.js 를 통해 전달되는 값을 확인하여 변경할 것
      // 혹은 그 전에 호출되는지 확인 할것 JSON.parse는 현재 미구동

      // BKMH 해당 부분을 확인하여 전달되는 값이 존재하는 경우, 해당 값을 기준으로 파일을 확인하고, 다시 base64를 붙여서 반환
      l.info('return for chaincode : %s', babyInfo.contactNum);
    }

    return result;
  }

  // 20181214 BKMH Upload Image and Values(for Registered Pools)
  uploadImageAndValuesForRegistered(req) {
    l.info('uploadImageAndValuesForRegistered');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile); // file info
    l.info(req.body.value); // input text value
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);

    // multer 를 이용한 파일업로드 테스트
    // upload.single(req.files.upfile, 'testImage');

    // BKMH Upload 된 파일을 기준으로 CouchDB 적재

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const extension = path.extname(req.files.upfile.originalname);
    // const basename = path.basename(req.file.upfile.originalname, extension);

    // const newFilePath = path.join('/uploads/', sha256String.concat(extension));

    // const newFilePath = path.join(__dirname, '/uploads/', uft8Sha256String.concat(extension));

    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    // 2018.12.15 BKMH - 차후, FLAG에 따라, 저장되는 경로 변경할 것.
    // 파일이 아니라 폴더가 존재하지 않는 경우, 오류가 발생하므로 폴더를 생성하는 로직이 필요함.

    const strDestination = path.join(__dirname, '/uploadRegistered/');

    if (!fs.existsSync(strDestination)) {
      fs.mkdirSync(strDestination);
    }

    const newFilePath = path.join(strDestination, sha256String.concat(extension));

    l.info('newFilePath : %s', newFilePath);

    fs.writeFileSync(newFilePath, streamData, 'base64', 'w+');

    const args = [];

    args.push(sha256String); // key image
    args.push(req.body.strcontectnumber); // contectNumber String
    args.push(req.body.strdetailinfo); // detail infomation for baby
    args.push('R'); // for registerFlag

    // return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'registerMultiValues', args, []));
  }

  // 20181215 BKMH read Image and Values
  readImageAndValuesforRegistered(req) {
    l.info('readImageAndValuesforRegistered');
    l.info(req.files.upfile); // file info
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);
    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const args = [];
    args.push(sha256String);
    args.push('R'); // dataFlag = R 사전등록

    // 20181218 조회된 결과를 기준으로 이미지를 검색하여 조립하는 부분 추가 필요

    // 제일 마지막 peer List를 전달하는 부분에 대한 내용 확인
    return Promise.resolve(fbClient.queryChaincode('babychain', 'readMultiValues', args, []));
  }

  // 20181214 BKMH Upload Image and Values(for Missing Pools)
  uploadImageAndValuesForMissing(req) {
    l.info('uploadImageAndValuesForMissing');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile); // file info
    l.info(req.body.value); // input text value
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);

    // multer 를 이용한 파일업로드 테스트
    // upload.single(req.files.upfile, 'testImage');

    // BKMH Upload 된 파일을 기준으로 CouchDB 적재

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const extension = path.extname(req.files.upfile.originalname);
    // const basename = path.basename(req.file.upfile.originalname, extension);

    // const newFilePath = path.join('/uploads/', sha256String.concat(extension));

    // const newFilePath = path.join(__dirname, '/uploads/', uft8Sha256String.concat(extension));

    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    // 2018.12.15 BKMH - 차후, FLAG에 따라, 저장되는 경로 변경할 것.

    const strDestination = path.join(__dirname, '/uploadMissing/');

    if (!fs.existsSync(strDestination)) {
      fs.mkdirSync(strDestination);
    }

    const newFilePath = path.join(strDestination, sha256String.concat(extension));

    l.info('newFilePath : %s', newFilePath);

    fs.writeFileSync(newFilePath, streamData, 'base64', 'w+');

    const args = [];

    args.push(sha256String); // key image
    args.push(req.body.strcontectnumber); // contectNumber String
    args.push(req.body.strdetailinfo); // detail infomation for baby
    args.push('M'); // for registerFlag

    // return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'registerMultiValues', args, []));
  }

// 20181215 BKMH read Image and Values
  readImageAndValuesforMissing(req) {
    l.info('readImageAndValuesforMissing');
    l.info(req.files.upfile); // file info
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);
    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const args = [];
    args.push(sha256String);
    args.push('M'); // dataFlag = M 실종아동

    // 20181218 조회된 결과를 기준으로 이미지를 검색하여 조립하는 부분 추가 필요

    // 제일 마지막 peer List를 전달하는 부분에 대한 내용 확인
    return Promise.resolve(fbClient.queryChaincode('babychain', 'readMultiValues', args, []));
  }

  // 20181214 BKMH Upload Image and Values(for Protected Pools)
  uploadImageAndValuesForProtected(req) {
    l.info('uploadImageAndValuesForProtected');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile); // file info
    l.info(req.body.value); // input text value
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);

    // multer 를 이용한 파일업로드 테스트
    // upload.single(req.files.upfile, 'testImage');

    // BKMH Upload 된 파일을 기준으로 CouchDB 적재

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const extension = path.extname(req.files.upfile.originalname);
    // const basename = path.basename(req.file.upfile.originalname, extension);

    // const newFilePath = path.join('/uploads/', sha256String.concat(extension));

    // const newFilePath = path.join(__dirname, '/uploads/', uft8Sha256String.concat(extension));

    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    // 2018.12.15 BKMH - 차후, FLAG에 따라, 저장되는 경로 변경할 것
    
    const strDestination = path.join(__dirname, '/uploadProtected/');

    if (!fs.existsSync(strDestination)) {
      fs.mkdirSync(strDestination);
    }
    
    const newFilePath = path.join(strDestination, sha256String.concat(extension));

    l.info('newFilePath : %s', newFilePath);

    fs.writeFileSync(newFilePath, streamData, 'base64', 'w+');

    const args = [];

    args.push(sha256String); // key image
    args.push(req.body.strcontectnumber); // contectNumber String
    args.push(req.body.strdetailinfo); // detail infomation for baby
    args.push('P'); // for registerFlag

    // return Promise.resolve(fbClient.invokeChaincode('babychain', 'register', args, []));
    return Promise.resolve(fbClient.invokeChaincode('babychain', 'registerMultiValues', args, []));
  }

  // 20181215 BKMH read Image and Values
  readImageAndValuesforProtected(req) {
    l.info('readImageAndValuesforProtected');
    l.info(req.files.upfile); // file info
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);
    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const args = [];
    args.push(sha256String);
    args.push('P'); // dataFlag = P 보호아동

    // 20181218 조회된 결과를 기준으로 이미지를 검색하여 조립하는 부분 추가 필요

    // 제일 마지막 peer List를 전달하는 부분에 대한 내용 확인
    return Promise.resolve(fbClient.queryChaincode('babychain', 'readMultiValues', args, []));
  }

  // 20181101 sally upload image to text
  readImageToText(req, res) {
    l.info('readImage test');
    l.info(req.files.upfile); // file info
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');
    // l.info("image file base64 encoding : "+data);
    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');
    // 2018.11.03 BKMH - digest('utf-8') -> utf8로 변환
    // 2018.11.03 BKMH - 실제 출력할 수 있는 문자열로 변환되지 않음.
    const uft8Sha256String = crypto.createHash('sha256').update(streamData).digest('utf8');

    l.info('key_encrypted_string : %s', sha256String);
    l.info('key_encrypted_utf8_string : %s', uft8Sha256String);

    const args = [];
    args.push(sha256String);

    return Promise.resolve(fbClient.queryChaincode('babychain', 'query', args, []));
  }

  modifyImageToText(req, res) {
    l.info('modifyImageToText test');
    l.info(`${this.constructor.name}.byId(${req})`);
    l.info(req.files.upfile); // file info
    l.info(req.body.value); // input text value
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');

    const extension = path.extname(req.files.upfile.originalname);
    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    // TODO 2018.12.14 BKMH - 차후 요청 FLAG에 따라 파일 저장폴더 분리
    const newFilePath = path.join(__dirname, '/uploads/', sha256String.concat(extension));

    // BKMH 수정 대상 물리 파일 존재여부 확인
    if (!fs.existsSync(newFilePath)) {
      l.info('Modify Target Image is not existed');
      return new Error('Modify File is not Existed');
    }

    const utf8sha256String = crypto.createHash('sha256').update(streamData).digest('utf-8');
    l.info('key encrypted string : %s', sha256String);
    l.info('key encrypted utf8 string : %s', utf8sha256String);

    const args = [];

    args.push(sha256String); // key image
    args.push(req.body.value); // value text string

    return Promise.resolve(fbClient.invokeChaincode('babychain', 'modify', args, []));
  }

  deleteImageToText(req, res) {
    l.info('deleteImageToText test');
    l.info(req.files.upfile); // file info
    // var data = fs.readFileSync(req.files.upfile.path, 'base64');
    const streamData = fs.readFileSync(req.files.upfile.path, 'base64');

    // 2018.11.03 BKMH - https://nodejs.org/api/crypto.html 기준으로 sha256 데이터에 대해 hex값 변환
    const sha256String = crypto.createHash('sha256').update(streamData).digest('hex');

    const uft8sha256String = crypto.createHash('sha256').update(streamData).digest('utf-8');
    l.info('key encrypted string : %s', sha256String);
    l.info('key encrypted uft8 string : %s', uft8sha256String);

    const extension = path.extname(req.files.upfile.originalname);
    // 2018.11.03 BKMH - 현재 저장폴더가 결정되지 않았으므로, 현재파일의 경로와 동일경로에 /uploads/를 생성하고
    // 해당 위치에 digest('hex') + 기존 파일의 확장자로 파일 생성
    const targetFilePath = path.join(__dirname, '/uploads/', sha256String.concat(extension));

    // BKMH 수정 대상 물리 파일 존재여부 확인
    if (!fs.existsSync(targetFilePath)) {
      l.info('Delete Target Image is existed.');
      return new Error('Delete File is not Existed');
    }

    // BKMH 존재하는 파일을 삭제한다.
    fs.unlinkSync(targetFilePath);

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
