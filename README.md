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
