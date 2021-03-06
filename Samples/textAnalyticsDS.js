/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */


//constants start
const mongodb = require('mongodb');
const assert = require('assert');
// constant end

// key variables start 

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const env = {
    dbName: 'mongodbfordemo',
    key: 'zraBcPuMEDiJwbyHUlZqVrs5ptDz2jGBwyP82see8igLtBRzgnMYlZgIUjiMn8JoUzKOeB94quMYIX9i9xvaHA==',
    port: 10255

}


const dbs = "campusdb";
const collection = "campusdoc";


const dbNamesow = dbs + '_sow';
const dbNameipkit = dbs + '_ipkit';;

const dbcollectionsow = collection + '_sow';
const dbcollectionipkit = collection + '_ipkit';;

exports.getDocuments = function (callBack, param) {
    var MongoClient = mongodb.MongoClient;
    // Connection URL
    //const url = 'mongodb://localhost:27017';
    const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

    //const url ='mongodb://3bec7eb3-0ee0-4-231-b9ee:5kYSe6xHjwJ97ooQYn9xbRoeSTXjfxzJjHH2eYTwfTfJclGKWr1i80JeTqn2p3nki89roFPJhKe8VbOklKa0IQ%3D%3D@3bec7eb3-0ee0-4-231-b9ee.documents.azure.com:10255/?ssl=true'

    // Database Name
    //const dbName = 'mytestdb';
    //const dbName = 'campusdocinfonew';
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbNameipkit);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection(dbcollectionipkit);

        // var regex = new RegExp(".*" + param + "*");
        //console.log('a :', regex);
        // "keydata": regex
        var d = param && param.length > 0 ? collection.find({}) : [];
        //var d =  collection.find({}, { "_id": 0 });

        //let returnObj = [];
        d.toArray(function (err, docs) {
            let retDocs = [];
            //----------------1 start
            let sowKey1 = JSON.parse(param);
            if (sowKey1 && sowKey1.length > 0) {
                for (var i = 0; i < sowKey1.length; i++) {
                    var data = docs.filter(obj => obj.keydata.find(o => o.toLowerCase().includes(sowKey1[i].toLowerCase())) != undefined)
                    if (data && data.length > 0) {
                        data.forEach(m => {
                            console.log('M:', m);
                            if (retDocs.find(o => o.url.toLowerCase() == m.url.toLowerCase()) == undefined) {
                                let objReturn = {}
                                objReturn["keydata"] = m.keydata;
                                objReturn["url"] = m.url;
                                objReturn["language"] = m.language ? m.language : '';
                                retDocs.push(objReturn);
                            }
                        })

                    }
                }
            }
            //----------------1 end
            //----------------2 start
            // docs.forEach(obj => {
            //     let objReturn = {}
            //     let sowKey = JSON.parse(param);
            //     if (sowKey && sowKey.length > 0) {
            //         if (retDocs.find(o => o.url.toLowerCase() == obj.url.toLowerCase()) == undefined) {
            //             for (var i = 0; i < sowKey.length; i++) {
            //                 if (obj.keydata.find(obj1 => obj1.toLowerCase().includes(sowKey[i].toLowerCase()))) {
            //                     objReturn["keydata"] = obj.keydata;
            //                     objReturn["url"] = obj.url;
            //                     retDocs.push(objReturn);
            //                     break;
            //                 }
            //             }
            //         }
            //     }
            // })
            //----------------2 end
            assert.equal(err, null);
            // console.log('param : ', param);
            console.log("Found the following records");
            // if (docs && docs.length > 0) {
            //     docs.forEach((obj, index) => {
            //         if (obj.keydata.find(obj => obj.toLowerCase().includes(param.toLowerCase())) != undefined)
            //             returnObj.push(obj)
            //     })
            // }
            callBack(retDocs);
            client.close();
        });


    });
}



exports.getDSSowDocuments = function (callBack, param, crmID) {
    var MongoClient = mongodb.MongoClient;
    // Connection URL
    //const url = 'mongodb://localhost:27017';
    const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

    //const url ='mongodb://3bec7eb3-0ee0-4-231-b9ee:5kYSe6xHjwJ97ooQYn9xbRoeSTXjfxzJjHH2eYTwfTfJclGKWr1i80JeTqn2p3nki89roFPJhKe8VbOklKa0IQ%3D%3D@3bec7eb3-0ee0-4-231-b9ee.documents.azure.com:10255/?ssl=true'

    // Database Name
    //const dbName = 'mytestdb';
    //const dbName = 'campusdocinfonew';
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        //console.log('t', err);
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbNamesow);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection(dbcollectionsow);

        // var regex = new RegExp(".*" + param + "*");
        //console.log('a :', regex);
        // "keydata": regex
        var d = collection.find({});
        //var d =  collection.find({}, { "_id": 0 });

        //let returnObj = [];
        d.toArray(function (err, docs) {
            // console.log('docs',docs);
            let retDocs = [];
            docs.forEach(obj => {
                if (obj.key_words) {
                    let keywords = Object.keys(obj.key_words);
                    let objReturn = {}
                    console.log('crmID : ' + (!crmID || (crmID.trim().toLowerCase() == '' || obj.crmID.toLowerCase().includes(crmID.toLowerCase())))
                    );
                    console.log('param : ' + (!param || (param.trim().toLowerCase() == '' || keywords.find(obj1 => obj1.toLowerCase().includes(param.toLowerCase()))))
                    );
                    if ((!param || (param.trim().toLowerCase() == '' || keywords.find(obj1 => obj1.toLowerCase().includes(param.toLowerCase()))))
                        && (!crmID || (crmID.trim().toLowerCase() == '' || obj.crmID.toLowerCase().includes(crmID.toLowerCase())))
                    ) {
                        objReturn["keydata"] = keywords.join(", ");
                        objReturn["url"] = obj.SOW_File_name;
                        objReturn["crmID"] = obj.crmID;
                        objReturn["language"] = obj.Language ? obj.Language : '';
                        objReturn["ratingDetails"] = obj.key_words;
                        retDocs.push(objReturn);
                    }
                }
            })


            // console.log('docs',docs);
            assert.equal(err, null);
            // console.log('param : ', param);
            console.log("Found the following records");
            // if (docs && docs.length > 0) {
            //     docs.forEach((obj, index) => {
            //         if (obj.keydata.find(obj => obj.toLowerCase().includes(param.toLowerCase())) != undefined)
            //             returnObj.push(obj)
            //     })
            // }
            callBack(retDocs);
            client.close();
        });


    });
}


exports.getDSSowDocumentsNew = function (callBack, param, crmID) {
    var MongoClient = mongodb.MongoClient;
    // Connection URL
    //const url = 'mongodb://localhost:27017';
    const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

    //const url ='mongodb://3bec7eb3-0ee0-4-231-b9ee:5kYSe6xHjwJ97ooQYn9xbRoeSTXjfxzJjHH2eYTwfTfJclGKWr1i80JeTqn2p3nki89roFPJhKe8VbOklKa0IQ%3D%3D@3bec7eb3-0ee0-4-231-b9ee.documents.azure.com:10255/?ssl=true'

    // Database Name
    //const dbName = 'mytestdb';
    //const dbName = 'campusdocinfonew';
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        //console.log('t', err);
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbNameipkit);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection(dbcollectionipkit);

        // var regex = new RegExp(".*" + param + "*");
        //console.log('a :', regex);
        // "keydata": regex
        var d = collection.find({});
        //var d =  collection.find({}, { "_id": 0 });

        //let returnObj = [];
        d.toArray(function (err, docs) {
            // console.log('docs',docs);
            let retDocs = [];
            docs.forEach(obj => {
                let objReturn = {}
                objReturn["url"] = obj.SOW_File_name;
                objReturn["id"] = obj._id;
                objReturn["crmID"] = obj.crmID;
                objReturn["Trigram_model"] = obj.Trigram_model;
                objReturn["key_words_tf_idf"] = obj.key_words_tf_idf;
                objReturn["Azure_congnitive_services"] = obj.Azure_congnitive_services;

                objReturn["Trigram_model_feed"] = obj.Trigram_model_feed;
                objReturn["Key_words_tf_idf_feed"] = obj.Key_words_tf_idf_feed;
                objReturn["Azure_congnitive_services_feed"] = obj.Azure_congnitive_services_feed;
                retDocs.push(objReturn);
            })


            // console.log('docs',docs);
            assert.equal(err, null);
            // console.log('param : ', param);
            console.log("Found the following records");
            // if (docs && docs.length > 0) {
            //     docs.forEach((obj, index) => {
            //         if (obj.keydata.find(obj => obj.toLowerCase().includes(param.toLowerCase())) != undefined)
            //             returnObj.push(obj)
            //     })
            // }
            callBack(retDocs);
            client.close();
        });


    });
}

exports.getDSSowDocumentsCommentSave = function (callBack, id, key, data) {
    var MongoClient = mongodb.MongoClient;
    // Connection URL
    //const url = 'mongodb://localhost:27017';
    const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

    //const url ='mongodb://3bec7eb3-0ee0-4-231-b9ee:5kYSe6xHjwJ97ooQYn9xbRoeSTXjfxzJjHH2eYTwfTfJclGKWr1i80JeTqn2p3nki89roFPJhKe8VbOklKa0IQ%3D%3D@3bec7eb3-0ee0-4-231-b9ee.documents.azure.com:10255/?ssl=true'

    // Database Name
    //const dbName = 'mytestdb';
    //const dbName = 'campusdocinfonew';
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        //console.log('t', err);
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbNameipkit);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection(dbcollectionipkit);

        // var regex = new RegExp(".*" + param + "*");
        //console.log('a :', regex);
        // "keydata": regex

        let keys = Object.keys(data);
        if (keys && keys.length > 0) {
            keys.forEach(obj => {
                if (!data[obj] || ((!data[obj]["Remark"] || data[obj]["Remark"].length <= 0) &&
                    (data[obj]["InActive"] == undefined || data[obj]["InActive"] == false)
                )) {
                    delete data[obj];
                }
            })
        }



        if (key == "Key_words_tf_idf_feed")
            collection.update({ _id: id }, { $set: { "Key_words_tf_idf_feed": data } });
        else if (key == "Trigram_model_feed")
            collection.update({ _id: id }, { $set: { "Trigram_model_feed": data } });
        else if (key == "Azure_congnitive_services_feed")
            collection.update({ _id: id }, { $set: { "Azure_congnitive_services_feed": data } });




        //var d =  collection.find({}, { "_id": 0 });

        //let returnObj = [];
        assert.equal(err, null);
        // console.log('param : ', param);
        console.log("Saved Successfully");
        // if (docs && docs.length > 0) {
        //     docs.forEach((obj, index) => {
        //         if (obj.keydata.find(obj => obj.toLowerCase().includes(param.toLowerCase())) != undefined)
        //             returnObj.push(obj)
        //     })
        // }
        callBack('Saved Successfully');
        client.close();
    });
}

