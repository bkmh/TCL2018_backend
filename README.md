#1. 소스 복사

git clone git@gitlab.com:skbwg/babychain_backend.git

#2. web scaffold 생성(express, nodejs, swagger 연동 플랫폼 - 한번 실행 후 재수행 안해도 됨)

npm install -g yo generator-express-no-stress

#3. 소스 디렉토리 cd

cd babychain-backend

#4. node modules 설치

npm install

#5. 기존 docker container 있다면 삭제

docker rm -f $(docker ps -aq)

#6. blockchain network 구성(2-setup-chaincode.sh chaincode명 chaincode버전)

cd tools/network

sh 0-network-start.sh

sh 1-create-channel.sh

sh 2-setup-chaincode.sh babychain 1.0

#7. babychain-backend 디렉토리로 되돌아가기

cd ../..

#8. restful api 서버 띄우기..

npm run dev


#9.명령어 end localhost 접속

web에서 localhost:3500 접속 - restful API swagger 페이지

#10.couchDB 접속

http://localhost:5984/_utils/#/_all_dbs

#11. babychain tab의 CRUD 해보기.


<참고사항>
chaincode 수정시
1. chaincode 소스 있는 디렉토리 cd
2. go build
3. cd tools/network
4. sh upgrade-chaincode.sh chaincode명 chaincode버전
5. 2번 chaincode setup 시에도 마찬가지..

````# Simple Balance API

Simple Balance API

## Hyperledger Network 개발 환경 구성
```
curl -sSL http://bit.ly/2ysbOFE | bash -s 1.2.0
```

## CouchDB
```
http://localhost:5984/_utils/#/_all_dbs
```

## Install It
```
npm install
npm install artillery -g
```

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Run in *production* mode:

```
npm run compile
npm start
```

#### Run tests:

```
npm test
```

#### Deploy to the Cloud
e.g. CloudFoundry

```
cf push ImPlatform
```

### Try It
* Point you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the example REST endpoint `curl http://localhost:3000/api/v1/examples`
   
# ImPlatform
````
