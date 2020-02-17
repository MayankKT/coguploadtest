const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
var docx = require('./docx.js');
const path = require("path");
var request = require('request');
const mongodb = require('mongodb');
const assert = require('assert');
const uuidv4 = require('uuid/v4');

// constant end

// key variables start 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const subscription_key = '9ee36486c3eb4d42a68112fd4e0486af';//process.env.TEXT_ANALYTICS_SUBSCRIPTION_KEY;
const endpoint = 'https://southcentralus.api.cognitive.microsoft.com';//process.env.TEXT_ANALYTICS_EndPoint

// authentication start

const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);

// authentication end

const directoryPathSOW = path.resolve("./public");
const directoryIPKit = path.resolve("./public");

//const fileNameArray = ["test.pptx"]
exports.getData = function (answer, obj, cb) {
    if (true || fileType == 'word') {
        let directoryPath = answer.toLocaleLowerCase() == 'sow' ? directoryPathSOW : directoryIPKit;
        //.forEach((obj, inex) => {
        var fileName = obj;
        docx.extract(directoryPath + '\\' + fileName).then(function (res, err) {
            if (err) {
                console.log(err)
            }
            else if (res) {
                let myPDFString = res;
                let doc = [];
                let myData = getStringArray(doc, myPDFString, 5000);
                let lan = 'English';
                let iso6391Name = 'en';
                async function languageDetection(client) {

                    console.log("1. This will detect the languages of the inputs.");

                    const languageInput = {
                        documents: [
                            { id: "1", text: ((myData && myData.length > 0) ? myData[0] : '') },
                        ]
                    };

                    const languageResult = await client.detectLanguage({
                        languageBatchInput: languageInput
                    });

                    languageResult.documents.forEach(document => {
                        document.detectedLanguages.forEach(language => {
                            console.log(`ID : ${document.id} Language :  ${language.name}`, language)
                            lan = language.name;
                            iso6391Name = language.iso6391Name;

                        }
                        );
                        keyPhraseExtraction(textAnalyticsClient);
                    });

                }

                languageDetection(textAnalyticsClient);

                //keyPhraseExtraction 
                async function keyPhraseExtraction(client) {
                    if (lan.toLowerCase() == 'english') {
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

                        if (answer.toLocaleLowerCase() == 'sow') {
                            await saveDataToDBAfterProcess(JSON.stringify(keyPhrasesInput), fileName, cb, lan);
                        }
                        else {
                            const keyPhraseResult = await client.keyPhrases({
                                multiLanguageBatchInput: keyPhrasesInput
                            });
                            if (keyPhraseResult && keyPhraseResult.documents && keyPhraseResult.documents.length > 0) {
                                let distinct = getDistinctData(keyPhraseResult.documents);
                                await saveDataToDB(distinct, fileName, cb, lan);

                            }
                        }
                    }
                    else {
                        myData = getStringArray(doc, myPDFString, 1000);
                        let noOfRequest = myData.length;
                        let count = 0;
                        var text = '';
                        myData.forEach((o, i) => {
                            let docs = [];
                            docs.push({text: o});

                            let options = {
                                method: 'POST',
                                baseUrl: 'https://api.cognitive.microsofttranslator.com',
                                url: 'translate',
                                qs: {
                                    'api-version': '3.0',
                                    'from': iso6391Name,
                                    'to': ['en']
                                },
                                headers: {
                                    'Ocp-Apim-Subscription-Key': '1863029dc91c45f4a1d90dad9953caa9',
                                    'Content-type': 'application/json'
                                },
                                body: docs,
                                json: true,
                            };

                            request(options, (err, res, body) => {
                                count = count + 1;
                                body.forEach(obj => {
                                    obj.translations.forEach(o => {
                                        text += o.text;
                                    });
                                });
                                if (count == noOfRequest) {
                                    let doc1 = [];
                                    let myData1 = getStringArray(doc1, text, 5000);

                                    let docs1 = [];
                                    if (myData1 && myData1.length > 0) {
                                        myData1.forEach((o1, i1) => {
                                            if (o1.length > 100)
                                            docs1.push({
                                                    language: "en",
                                                    id: "" + (i1),
                                                    text: o1
                                                })
                                        });
                                    }
                                    const keyPhrasesInput1 = {
                                        documents: docs1
                                    };
            
                                    if (answer.toLocaleLowerCase() == 'sow') {
                                         saveDataToDBAfterProcess(JSON.stringify(keyPhrasesInput1), fileName, cb, lan);
                                    }
                                    else {
                                        getIPKitForOtherLanguage(client, keyPhrasesInput1, fileName,cb,lan);
                                    }

                                }

                            });
                        });
                    }
                }

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



function getStringArray(myData, str, l) {
    if (!l) l = 5000;
    if (str.length > l) {
        let currStr = str.substring(0, l);
        let remStr = str.substring(l, str.length);
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




async function getIPKitForOtherLanguage(client, keyPhrasesInput1, fileName,cb,lan) {
    const keyPhraseResult1 = await client.keyPhrases({
        multiLanguageBatchInput: keyPhrasesInput1
    });
    console.log('keyPhraseResult1', keyPhraseResult1);
    if (keyPhraseResult1 && keyPhraseResult1.documents && keyPhraseResult1.documents.length > 0) {
        let distinct1 = getDistinctData(keyPhraseResult1.documents);
        //await saveBlobData('key', myContent, jsonFileName);
        console.log('lan', lan);
        saveDataToDB(distinct1, fileName, cb, lan);

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


async function saveDataToDBAfterProcess(data, fileName, cb, lan) {
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



    request(options, function (error, response) {
        if (error) throw new Error(error);

        var MongoClient = mongodb.MongoClient;
        // Connection URL
        //const url = 'mongodb://localhost:27017';
        const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

        // Use connect method to connect to the server
        MongoClient.connect(url, function (err, client) {
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
                    // Insert some documents
                    collection.insertMany([{ "keydata": keys, "data": response.body, "url": fileName, language: lan }], function (err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);
                        console.log("Inserted 1 documents into the collection");
                        client.close();
                        if (cb) cb('done');
                    });
                }
            }


        });
    });
}



async function saveDataToDB(data, fileName, cb, lan) {
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
        collection.insertMany([{ "keydata": data, "url": fileName, language: lan }], function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted 1 documents into the collection");

            client.close();
            if (cb) cb('done');
        });
    });

}
