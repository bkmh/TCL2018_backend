/*
Copyright IBM Corp. 2016 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("BabyChain example_cc!!!!!!!!")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type Baby struct {
	ObjectType     string `json:"docType"` // field for couchdb
	Id             string `json:"id"`
	ContactNum     string `json:"contactNum"`
	DetailContents string `json:"detailContents"`
	RegFlag        string `json:"dataFlag"`
	Enabled        bool   `json:"enabled"` // disabled owners will not be visible to the application
}

// Init - initialize the state
// 2018.12.15 BKMH - 차후 Init  처리 변경
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Babychain example_cc Init!!!!!!!!!!! ###########")

	_, args := stub.GetFunctionAndParameters()
	var A, B string       // key
	var Aval, Bval string // value
	var err error

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	// Initialize the chaincode
	A = args[0]
	Aval = args[1]
	if err != nil {
		return shim.Error("Expecting string value for babychain")
	}
	B = args[2]
	Bval = args[3]
	if err != nil {
		return shim.Error("Expecting string value for babychain")
	}
	logger.Infof("Aval = %s, Bval = %s\n", Aval, Bval)

	// Write the state to the ledger
	err = stub.PutState(A, []byte(Aval))
	if err != nil {
		return shim.Error(err.Error())
	}

	err = stub.PutState(B, []byte(Bval))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// Invoke - Transaction makes payment of X units from A to B
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Babychain example_cc Invoke ###########")

	function, args := stub.GetFunctionAndParameters()
	if function == "register" {
		// Add an entity to its state
		return t.register(stub, args)
	}

	if function == "query" {
		// queries an entity state
		return t.query(stub, args)
	}

	if function == "modify" {
		// Deletes an entity from its state
		return t.modify(stub, args)
	}

	if function == "delete" {
		// Deletes an entity from its state
		return t.delete(stub, args)
	}

	if function == "uploadImage" {
		return t.uploadImage(stub, args)
	}

	if function == "readImage" {
		return t.readImage(stub, args)
	}

	if function == "registerMultiValues" {
		return t.registerMultiValues(stub, args)
	}

	logger.Errorf("Unknown action, check the first argument, must be one of 'register', 'delete', 'query', or 'modify'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'delete', 'query', or 'move'. But got: %v", args[0]))
}

// 20181023 sally upload images with string key
func (t *SimpleChaincode) uploadImage(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("########### Babychain uploadImageJSEncoding ###########")
	var fileName string
	var value string
	var err error

	fileName = args[0]
	value = args[1]
	logger.Info("fileName : " + fileName + ", value : " + value)
	var b string
	b = args[2]

	logger.Info("########### " + b)

	err = stub.PutState(value, []byte(b))
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}

// 20181024 sally read images with string key
func (t *SimpleChaincode) readImage(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("########### Babychain readImage ###########")
	var key string
	var err error

	key = args[0]
	logger.Info("key : " + key)
	Avalbytes, err := stub.GetState(key)

	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"key\":\"" + key + "\",\"value\":\"" + string(Avalbytes) + "\"}"
	logger.Infof("Query Response:%s\n", jsonResp)

	// 20181030 BKMH 기존 로직과 동일하게 encoding 없이 query 수행
	return shim.Success(Avalbytes)
}

func (t *SimpleChaincode) register(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var key string   // User key
	var value string //
	var err error

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2, function followed by 1 name and 1 value")
	}

	key = args[0]
	value = args[1]
	//20181016 sally - query Before register.. if exists..error
	Avalbytes, err := stub.GetState(key)
	if Avalbytes != nil {
		jsonResp := "{\"Error\":\"This key already Exists!! Failed to regist for " + key + "\"}"
		return shim.Error(jsonResp)
	}
	// Write the state to the ledger
	err = stub.PutState(key, []byte(value))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("register succeed!!!"))
}

// Query callback representing the query of a chaincode
func (t *SimpleChaincode) query(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var key string // Entities
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting name of the person to query")
	}

	key = args[0]

	// Get the state from the ledger
	Avalbytes, err := stub.GetState(key)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	if Avalbytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	jsonResp := "{\"key\":\"" + key + "\",\"value\":\"" + string(Avalbytes) + "\"}"
	logger.Infof("Query Response:%s\n", jsonResp)
	return shim.Success(Avalbytes)
}

func (t *SimpleChaincode) modify(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var key, modifyValue string // Entities
	var Aval string             // Asset holdings
	var err error

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2, function followed by 1 key and 1 value")
	}

	key = args[0]
	modifyValue = args[1]

	// Get the state from the ledger
	// TODO: will be nice to have a GetAllState call to ledger
	Avalbytes, err := stub.GetState(key)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if Avalbytes == nil {
		return shim.Error("Entity not found")
	}
	Aval = string(Avalbytes)

	logger.Infof("Aval = %s, modifyValue = %s\n", Aval, modifyValue)

	// Write the state back to the ledger
	err = stub.PutState(key, []byte(modifyValue))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("modify succeed"))
}

// Deletes an entity from state
func (t *SimpleChaincode) delete(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var key = args[0]

	// Delete the key from the state in ledger
	err := stub.DelState(key)
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	return shim.Success(nil)
}

/*
func (t *SimpleChaincode) registerMultiValues(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var key string   // User key
	var value1 string //
	var value2 string //
	var value3 string //
	var err error

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 2, function followed by 1 name and 1 value")
	}

	key = args[0]
	value1 = args[1]
	value2 = args[2]
	value3 = args[3]

	str := `{
		"PhoneNumber": "` + value1 + `",
		"BabyName": ` + value2 + `,
		"ParentsName": ` + value3 + `
	}`
	logger.Info("########### str ###########"+str)

	Avalbytes, err := stub.GetState(key)
	if Avalbytes != nil {
		jsonResp := "{\"Error\":\"This key already Exists!! Failed to regist for " + key + "\"}"
		return shim.Error(jsonResp)
	}
	// Write the state to the ledger
	err = stub.PutState(key, []byte(str))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("register succeed!!!"))
}
*/

// 20181218 - BKMH Register for pre-Registered, Protected, Missing
func (t *SimpleChaincode) registerMultiValues(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// must be an invoke
	var strKey string           // User key - made by Image name to sha256 String
	var strContectNumber string //Input Contact Number
	var strDetailInfo string    // Input Detail Info
	var strRegisterFlag string  // Input Data Flag
	//var value3 string //
	var err error

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4, function followed by 1 name and 1 value")
	}

	strKey = args[0]
	strContectNumber = args[1]
	strDetailInfo = args[2]
	strRegisterFlag = args[3]
	//value3 = args[3]

	// 입력되는 Flag가 없는 경우, 일단 사전등록(R)로 입력
	if len(strRegisterFlag) == 0 {
		strRegisterFlag = "R"
	}

	//실종시 또는 사전 등록시 등록되는 원장
	var baby Baby
	baby.ObjectType = "baby_info"
	baby.Id = strKey // 우선 image key값을 id로 함.. 이게 맞나..?
	baby.ContactNum = strContectNumber
	baby.DetailContents = strDetailInfo
	baby.RegFlag = strRegisterFlag
	baby.Enabled = true
	logger.Info("########### baby ###########", baby)

	//check if user already exists
	//_, err =stub.GetState(key)
	//if err == nil {
	//	fmt.Println("This owner already exists - " + owner.Id)
	//	return shim.Error("This owner already exists - " + owner.Id)
	//}

	//store user
	babyAsBytes, _ := json.Marshal(baby)      //convert to array of bytes
	err = stub.PutState(baby.Id, babyAsBytes) //store owner by its Id

	if err != nil {
		logger.Info("Could not register baby")
		return shim.Error(err.Error())
	}

	logger.Info("- end register baby info")
	return shim.Success([]byte("register succeed!!!"))
}

// 20181215 BKMH - read for couchDB
func (t *SimpleChaincode) readMultiValues(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("########### Babychain readMultiValues ###########")
	var key string
	var err error

	key = args[0]
	logger.Info("key : " + key)
	queryResult, err := stub.GetState(key)
	// 차후 dataFlag를 기준으로 조회할 수 있도록 처리 필요함(couchDB INDEX 관련 내용 확인)

	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	if queryResult == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	logger.Infof("Query Raw Data : %s\n", queryResult)

	// 20181215 BKMH - 해당 부분에 대해서 실제 query 결과를 어떻게 조립할 것인지 판단 필요
	jsonResp := "{\"key\":\"" + key + "\",\"value\":\"" + string(queryResult) + "\"}"
	logger.Infof("Query Response:%s\n", jsonResp)

	// 20181030 BKMH 기존 로직과 동일하게 encoding 없이 query 수행
	return shim.Success(queryResult)
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		logger.Errorf("Error starting Simple chaincode: %s", err)
	}
}
