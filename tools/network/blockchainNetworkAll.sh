#20181027 sally write

#docker container 모두 삭제
docker rm -f $(docker ps -aq)
#docker compose network down
docker-compose -f docker-compose.yml down
#docker compose network up 
docker-compose -f docker-compose.yml up -d
sleep 10s
#channel create
docker exec cli /opt/gopath/src/github.com/hyperledger/fabric/peer/cli/setup-channel.sh
sleep 10s

#chaincode 1.0version image 삭제
docker rmi -f $(docker images -q dev-peer0.org1.example.com-babychain-1.0*)
sleep 10s

#체인코드 install instantiate
docker exec cli /opt/gopath/src/github.com/hyperledger/fabric/peer/cli/setup-chaincode.sh babychain 1.0

sleep 30s

#restul api 서버띄우기
cd ../../

npm run dev
