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


const dbs = "DaaScienceSOW";



const getDataScienceSOWByVer = function (callback, param, crmID, collectionID) {
    console.log('collectionID : ', collectionID);
    try {
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

            const db = client.db(dbs);
            // Get the documents collection
            //const collection = db.collection('myResumeDataTest');
            const collection = db.collection(collectionID);

            // var regex = new RegExp(".*" + param + "*");
            //console.log('a :', regex);
            // "keydata": regex
            var d = collection.find({});
            //var d =  collection.find({}, { "_id": 0 });

            //let returnObj = [];
            let retDocs = [];
            d.each((err, obj) => {
                // console.log('docs',docs);
                if (obj != null) {
                    // let objReturn = {}
                    // objReturn["url"] = obj.SOW_File_name;
                    // objReturn["id"] = obj._id;
                    // objReturn["crmID"] = obj.crmID;
                    // objReturn["Trigram_model"] = obj.Trigram_model;
                    // objReturn["key_words_tf_idf"] = obj.key_words_tf_idf;
                    // objReturn["Azure_congnitive_services"] = obj.Azure_congnitive_services;

                    // objReturn["Trigram_model_feed"] = obj.Trigram_model_feed;
                    // objReturn["Key_words_tf_idf_feed"] = obj.Key_words_tf_idf_feed;
                    // objReturn["Azure_congnitive_services_feed"] = obj.Azure_congnitive_services_feed;
                    retDocs.push(obj);
                } else {
                    assert.equal(err, null);
                    console.log("Found the following records");

                    client.close();
                    callback(retDocs);

                }



            });


        });
    }
    catch (e) {
        throw e;
    }
}

const getDataScienceSOWVersions = function (callback) {
    try {
        var MongoClient = mongodb.MongoClient;
        // Connection URL
        //const url = 'mongodb://localhost:27017';
        const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

        // Use connect method to connect to the server
        MongoClient.connect(url, function (err, client) {
            //console.log('t', err);
            assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db(dbs);
            // Get the documents collection
            //const collection = db.collection('myResumeDataTest');
            const collection = db.collection("SOWDocVersion");

            // var regex = new RegExp(".*" + param + "*");
            //console.log('a :', regex);
            // "keydata": regex
            var d = collection.find({});
            let retDocs = [];
            d.each(function (err, obj) {
                console.log('docs :', obj);
                if (obj != null) {
                    let objReturn = {}
                    objReturn["id"] = obj._id;
                    objReturn["CollectionName"] = obj.CollectionName;
                    objReturn["Text"] = obj.Text;
                    objReturn["Remark"] = obj.Remark;
                    objReturn["DataKey"] = obj.DataKey;
                    retDocs.push(objReturn);
                }
                else {
                    assert.equal(err, null);
                    console.log("Found the following records", retDocs);

                    client.close();
                    callback(retDocs);
                }
            });



        });
    }
    catch (e) {
        throw e;
    }
}



exports.getDataScienceSOWOnLoad = function (callBack, param, crmID) {
    getDataScienceSOWVersions((retDocVersions) => {
        console.log('Result : ', retDocVersions)
        if (retDocVersions && retDocVersions.length > 0) {
            let collectionIDObj = retDocVersions[retDocVersions.length - 1];
            if (collectionIDObj && collectionIDObj.CollectionName) {
                getDataScienceSOWByVer((retDocs) => {
                    let myData = {}
                    myData["VersionDet"] = retDocVersions;
                    myData["SOWData"] = retDocs;
                    callBack(myData);
                }
                    , param, crmID, collectionIDObj.CollectionName);

            }
            else
                callBack('No Data Found');
        }
        else
            callBack('No Data Found');
    });
}



exports.getDataScienceSOW = function (callBack, param, crmID, collectionID) {
    getDataScienceSOWByVer((retDocs) => {
        callBack(retDocs);
    }
        , param, crmID, collectionID);
}

exports.saveDataScienceSOW = function (callBack, id, key, data, collectionID) {
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

        const db = client.db(dbs);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection(collectionID);

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


        let mykey = key;
        let updateData = {}
        updateData[mykey] = data;
        collection.update({ _id: id }, { $set: updateData });



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





exports.saveData = function (callBack) {

    var MongoClient = mongodb.MongoClient;
    // Connection URL
    //const url = 'mongodb://localhost:27017';
    const url = `mongodb://${env.dbName}:${env.key}@${env.dbName}.documents.azure.com:10255/?ssl=true&replicaSet=globaldb`

    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbs);
        // Get the documents collection
        //const collection = db.collection('myResumeDataTest');
        const collection = db.collection("DocKeyVer4");


        let data = []
        console.log('data', data);
        collection.insertMany(data



            , function (err, result) {
                // assert.equal(err, null);
                // assert.equal(1, result.result.n);
                // assert.equal(1, result.ops.length);
                console.log("Inserted 1 documents into the collection");
                client.close();
                if (callBack) callBack('done');
            });


    });
}