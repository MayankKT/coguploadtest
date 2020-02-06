const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
var docx = require('./docx.js');
const path = require("path");
var request = require('request');
const mongodb = require('mongodb');
const assert = require('assert');
// constant end

// key variables start 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const subscription_key = process.env.TEXT_ANALYTICS_SUBSCRIPTION_KEY;
const endpoint = process.env.TEXT_ANALYTICS_EndPoint


// authentication start

const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);

// authentication end

const directoryPathSOW = path.resolve("./public");
const directoryIPKit = path.resolve("./public");

//const fileNameArray = ["test.pptx"]
exports.getData = function(answer, obj,cb) {
    if (true || fileType == 'word') {
        let directoryPath = answer.toLocaleLowerCase() == 'sow' ? directoryPathSOW : directoryIPKit;
        //.forEach((obj, inex) => {
        var fileName = obj;
        console.log(" F : ",directoryPath + '\\' + fileName)
        docx.extract(directoryPath + '\\' + fileName).then(function (res, err) {
            if (err) {
                console.log(err)
            }
            else if (res) {
                let myPDFString = res;

                //keyPhraseExtraction 
                async function keyPhraseExtraction(client) {
                    //console.log("2. This will extract key phrases from the sentences.");
                    let doc = [];
                    //console.log('myPDFString', myPDFString);
                    let myData = getStringArray(doc, myPDFString);
                    let docs = [];
                    if (myData && myData.length > 0) {
                        myData.forEach((obj, index) => {
                            if (obj.length > 100)
                                docs.push({
                                    language: "en",
                                    id: "" + (index),
                                    text: obj
                                })
                        });
                    }
                    const keyPhrasesInput = {
                        documents: docs
                    };
                    console.log('f');

                    if (answer.toLocaleLowerCase() == 'sow') {
                        await saveDataToDBAfterProcess(JSON.stringify(keyPhrasesInput), fileName, cb);
                    }
                    else {
                        const keyPhraseResult = await client.keyPhrases({
                            multiLanguageBatchInput: keyPhrasesInput
                        });
                        console.log('f1');
                        if (keyPhraseResult && keyPhraseResult.documents && keyPhraseResult.documents.length > 0) {
                            let distinct = getDistinctData(keyPhraseResult.documents);
                            //await saveBlobData('key', myContent, jsonFileName);
                            console.log('f1 distinct', distinct);
                            console.log('f2');
                            await saveDataToDB(distinct, fileName,cb);
                          
                        }
                    }
                }
                keyPhraseExtraction(textAnalyticsClient);
            }
        });
    }
    else if (answer && answer.toLocaleLowerCase() == 'pdf') {
        var myPDFString = '';
        new pdfreader.PdfReader().parseFileItems(directoryPath + '\\' + fileNamePDF, function (err, item) {
            if (err) {
                return '';
                console.error(err);
            }
            else if (!item) {
                console.log("=========================PDF String================================");
                //console.error(myPDFString);
                //console.log("===================================================================\n");
                // languageDetection 
                async function languageDetection(client) {
                    console.log("1. This will detect the languages of the inputs.");

                    const languageInput = {
                        documents: [
                            { id: "1", text: myPDFString },
                        ]
                    };

                    const languageResult = await client.detectLanguage({
                        languageBatchInput: languageInput
                    });
                    languageResult.documents.forEach(document => {
                        document.detectedLanguages.forEach(language =>
                            console.log(`ID : ${document.id} Language :  ${language.name}`)
                        );
                    });
                }

                //languageDetection(textAnalyticsClient);

                //keyPhraseExtraction 
                async function keyPhraseExtraction(client) {
                    console.log("2. This will extract key phrases from the sentences.");
                    let doc = [];
                    console.log('myPDFString', myPDFString);
                    let myData = getStringArray(doc, myPDFString);
                    let docs = [];
                    if (myData && myData.length > 0) {
                        myData.forEach((obj, index) => {
                            if (obj.length > 100)
                                docs.push({
                                    language: "en",
                                    id: "" + (index),
                                    text: obj
                                })
                        });
                    }
                    //console.log('docs', docs);
                    const keyPhrasesInput = {
                        documents: docs
                    };
                    //  console.log('started',keyPhrasesInput);
                    console.log('keyPhrasesInput', keyPhrasesInput);
                    //     let axiosConfig = {
                    //         headers: {
                    //             'Content-Type': 'application/json',
                    //             "Ocp-Apim-Subscription-Key": "9ee36486c3eb4d42a68112fd4e0486af",
                    //         }
                    //         ,baseURL: 'http://airsymproxyasg.lntinfotech.com'
                    //         ,port: 8080
                    //       };

                    //       axios.post('https://southcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases', keyPhrasesInput, axiosConfig)
                    //       .then((res) => {
                    //         console.log("RESPONSE RECEIVED: ", res.data.documents);
                    //       })
                    //       .catch((err) => {
                    //         console.log("AXIOS ERROR: ", err);
                    //       })


                    const keyPhraseResult = await client.keyPhrases({
                        multiLanguageBatchInput: keyPhrasesInput
                    });
                    //console.log('found', myPDFString.length, keyPhraseResult);
                    //  console.log(os.EOL);
                    if (keyPhraseResult && keyPhraseResult.documents && keyPhraseResult.documents.length > 0) {
                        let myContent = JSON.stringify(keyPhraseResult.documents);
                        let distinct = getDistinctData(keyPhraseResult.documents);
                        //await saveBlobData('key', myContent, 'myNodeKeyExtractionPDF.json');
                        await saveDataToDB(distinct, fileNamePDF);
                    }
                }

                keyPhraseExtraction(textAnalyticsClient);


                // sentimentAnalysis
                async function sentimentAnalysis(client) {

                    console.log("3. This will perform sentiment analysis on the sentences.");

                    const sentimentInput = {
                        documents: [
                            {
                                language: "en",
                                id: "2",
                                text: myPDFString
                            }
                        ]
                    };

                    const sentimentResult = await client.sentiment({
                        multiLanguageBatchInput: sentimentInput
                    });
                    //console.log(sentimentResult.documents);
                    //  console.log(os.EOL);
                }
                //sentimentAnalysis(textAnalyticsClient)

                //entityRecognition 
                async function entityRecognition(client) {
                    console.log("3. This will perform Entity recognition on the sentences.");

                    const entityInputs = {
                        documents: [
                            {
                                language: "en",
                                id: "1",
                                text: "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800"
                            }
                        ]
                    };

                    const entityResults = await client.entities({
                        multiLanguageBatchInput: entityInputs
                    });
                    // console.log(os.EOL);
                    //  console.log('test',JSON.stringify(entityResults.documents))
                    if (entityResults && entityResults.documents && entityResults.documents.length > 0) {
                        let myContent = JSON.stringify(entityResults.documents);
                        await saveBlobData('entity', myContent, 'myNodeEntityExtractionPDF.json');

                    }

                }
                //entityRecognition(textAnalyticsClient);
            }
            else if (item.text)
                myPDFString += item.text;
        });
    }
}



function getStringArray(myData, str) {
    if (str.length > 5000) {
        let currStr = str.substring(0, 5000);
        let remStr = str.substring(5000, str.length);
        let n = currStr.lastIndexOf(".");
        if (n < str.length) {
            myData.push(currStr.substring(0, n + 1).trim());
            remStr = currStr.substring(n + 1, currStr.length) + remStr;
            return getStringArray(myData, remStr);
        }
        else {
            myData.push(currStr);
            return getStringArray(myData, remStr);
        }
    }
    else {
        myData.push(str);
        return myData;
    }
}


function getDistinctData(data) {
    let distData = [];
    data.forEach((obj, index) => {
        distData = [...distData, ...obj.keyPhrases]
    });
    let unique = distData.filter((item, i, ar) => ar.indexOf(item) === i);
    return unique;
}


const env = {
    dbName: 'mongodbfordemo',
    key: 'zraBcPuMEDiJwbyHUlZqVrs5ptDz2jGBwyP82see8igLtBRzgnMYlZgIUjiMn8JoUzKOeB94quMYIX9i9xvaHA==',
    port: 10255

}



const dbs = "campusdbtest";
const collection = "campusdoctest";

async function saveDataToDBAfterProcess(data, fileName, cb) {
    var options = {
        'method': 'POST',
        'url': 'https://campuskeywordrank.azurewebsites.net/api/recon-engine?code=E/frPQJmbkSwh1bsfjkzLTUvSynITSItY597U/da3sOKrBw0eEbTWg==',
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'timeout': '150000'
        },
        body: data

    };

    const dbName = dbs + '_sow';
    const dbCollection = collection + '_sow';

    //console.log('options',options);
    request(options, function (error, response) {
        if (error) throw new Error(error);
        // console.log(response.body);
        var MongoClient = mongodb.MongoClient;
        // Connection URL
        //const url = 'mongodb://localhost:27017';
        const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

        // Use connect method to connect to the server
        MongoClient.connect(url, function (err, client) {
            //console.log('t', err);
            assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db(dbName);
            // Get the documents collection
            //const collection = db.collection('myResumeDataTest');
            const collection = db.collection(dbCollection);


            let keyPhases = response.body;
            if (keyPhases && keyPhases.length > 0) {
                let keyPhasesObj = JSON.parse(keyPhases);
                if (keyPhasesObj && keyPhasesObj.keyPhrases) {
                    let keys = Object.keys(keyPhasesObj.keyPhrases);
                    console.log('keys', keys);
                    // Insert some documents
                    collection.insertMany([{ "keydata": keys, "data": response.body, "url": fileName }], function (err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);
                        console.log("Inserted 1 documents into the collection");
                        client.close();
                         if(cb) cb('done');
                    });
                }
            }


        });
    });
}



async function saveDataToDB(data, fileName,cb) {
    console.log(data, '\n', fileName);
    var MongoClient = mongodb.MongoClient;
    const dbName = dbs + '_ipkit';
    const dbCollection = collection + '_ipkit';
    // Connection URL
    //const url = 'mongodb://localhost:27017';
    const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        //console.log('t', err);
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection(dbCollection);

        // Insert some documents
        collection.insertMany([{ "keydata": data, "url": fileName }], function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted 1 documents into the collection");
            
            client.close();
            if(cb) cb('done');
        });
    });

}
