const express = require('express');
const app = express();
var port = process.env.PORT || 5000;
var cors = require('cors');
const path = require("path");

const fs = require("fs");
var multer = require('multer');
var { getDocuments, getSowDocuments } = require('./Samples/textAnalytics');


var { getDSSowDocuments, getDSSowDocumentsNew, getDSSowDocumentsCommentSave} = require('./Samples/textAnalyticsDS');

var { getDataScienceSOWOnLoad, getDataScienceSOW, saveDataScienceSOW, saveData, saveDataScienceSOWRemark } = require('./Samples/DataScienceSOW');

var { getData } = require('./uploaddata.js');

app.use(cors());

app.get('/IPKit', (req, res) => {
    res.send('Hello Words !!');
});


var mime = require('mime'); 

app.get('/download', function (req, res) {
    console.log('download');
    let file = './public/' + req.query.file;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});


app.get('/IPKitDocs', function (req, res) {
    try {
        let param = req.query.hobbies
        getDocuments((data) => {
            res.send(data);
        }, param)
    }
    catch (e) {
        res.send(e);
    }
});

app.get('/SOWDocs', function (req, res) {
    try {
        console.log('start');
        let param = req.query.hobbies
        getSowDocuments((data) => {
            res.send(data);
        }, param)
    }
    catch (e) {
        res.send(e);
    }
});





var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).single('file')


app.post('/uploadsow', function (req, res) {
   

    try {

        let fileName = req.query.filetype;
        if (fileName) {
            console.log('req.query : ')
            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log('1 : ')
                    return res.status(500).json(err)
                } else if (err) {
                       console.log('2 : ')
                    return res.status(500).json(err)
                }
                else {
                    console.log('req.query : ')
                    getData('sow', fileName, (msg) => {
                        return res.status(200).send(fileName + " uploaded successfully...");
                    });
                }


            })
        }
        else {
            return res.status(500).send("Please uplod a file")
        }

    } catch (e) {
        return res.status(500).json(e)
    }
});



app.post('/uploadipkit', function (req, res) {  
    try 
    {
    //console.log('upload', req);
    let fileName = req.query.filetype;
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }else{
          //  console.log('req.query : ')
            getData('ipkit', fileName, (msg) => {
                return res.status(200).send(fileName + " uploaded successfully...");
            });
        }
    })
} catch (e) {
    return res.status(500).json(e)
}
});

//================Data Science==============Section

app.post('/uploadDS_Sow', function (req, res) {


    try {

        let fileName = req.query.filetype;
        if (fileName) {
            console.log('req.query : ')
            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    console.log('1 : ')
                    return res.status(500).json(err)
                } else if (err) {
                    console.log('2 : ')
                    return res.status(500).json(err)
                }
                else {
                    console.log('req.query : ')
                    uploadDSDoc('sow', fileName, (msg) => {
                        return res.status(200).send(fileName + " uploaded successfully...");
                    });
                }


            })
        }
        else {
            return res.status(500).send("Please uplod a file")
        }

    } catch (e) {
        return res.status(500).json(e)
    }
});


app.get('/DS_SOWDocs', function (req, res) {

    try {
        console.log('start');
        let param = req.query.hobbies;
        let crmID = req.query.crmID;
        console.log('Query :', param, crmID);
        getDSSowDocuments((data) => {
            res.send(data);
        }, param, crmID)
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }
});

app.get('/DS_SOWDocsNew', function (req, res) {

    try {
        console.log('start');
        let param = req.query.hobbies;
        let crmID = req.query.crmID;
        console.log('Query :', param, crmID);
        getDSSowDocumentsNew((data) => {
            res.send(data);
        }, param, crmID)
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }
});

app.get('/downloadDSSow', function (req, res) {
    console.log('download');
    let file = './Samples/data/' + req.query.file;

    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
});

app.get('/SaveComment', (req, res) => {

    try {
        console.log('SaveComment');
        let id = req.query.id;
        let key = req.query.key;
        let data = req.query.data;
        if (data && data.length > 0) {
            console.log('Key',key);
            
            console.log('Data',JSON.parse(data));
            getDSSowDocumentsCommentSave((data) => {
                res.send(data);
            }, id, key, JSON.parse(data));
        } else {
            res.send('data is blank');
        }
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }

})

//===============End Data Science=============Section




//===============Data Science Version=================Section
app.get('/DataScienceSOWOnLoad', function (req, res) {

    try {
        console.log('start');
        let param = req.query.hobbies;
        let crmID = req.query.crmID;
        console.log('Query :', param, crmID);
        getDataScienceSOWOnLoad((data) => {
            res.send(data);
        }, param, crmID)
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }
});

app.get('/DataScienceSOW', function (req, res) {

    try {
        console.log('start');
        let param = req.query.hobbies;
        let crmID = req.query.crmID;
        let collectionID = req.query.collectionID;
        console.log('Query :', param, crmID, collectionID);
        getDataScienceSOW((data) => {
            res.send(data);
        }, param, crmID, collectionID)
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }
});


app.get('/SaveDataScienceSOWRemark', (req, res) => {

    try {
        console.log('SaveComment');
        let id = req.query.id;
        let data = req.query.data;
        let collectionID = req.query.collectionID;

        console.log(' SaveDataScienceSOWRemark Query :', id, collectionID);

        if (data) {
            saveDataScienceSOWRemark((data) => {
                res.send(data);
            }, id, data, collectionID);
        } else {
            res.send('data is blank');
        }
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }

})


app.get('/SaveDataScienceSOW', (req, res) => {

    try {
        console.log('SaveComment');
        let id = req.query.id;
        let key = req.query.key;
        let data = req.query.data;
        let collectionID = req.query.collectionID;

        console.log(' SaveDataScienceSOW Query :', id, key, collectionID);

        if (data && data.length > 0) {
            saveDataScienceSOW((data) => {
                res.send(data);
            }, id, key, JSON.parse(data), collectionID);
        } else {
            res.send('data is blank');
        }
    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }

})
//==============End Data Science Version===============
app.get('/saveData', (req, res) => {

    try {
        console.log('SaveComment');
        saveData((data) => {
            res.send(data);
        });

    }
    catch (e) {
        res.send('Error : ', JSON.stringify(e));
    }

})

app.listen(port, () => { console.log('Server is running on port : ', port) });
