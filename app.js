const express = require('express');
const app = express();
var port = process.env.PORT || 5000;
var cors = require('cors');
var { getDocuments, getSowDocuments } = require('./Samples/textAnalytics');

app.use(cors())

app.get('/IPKit', (req, res) => {
    res.send('Hello Words !!');
});


var mime = require('mime');

app.get('/download', function (req, res) {
    console.log('download');
    let file = './Samples/data/' + req.query.file;

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

app.listen(port, () => { console.log('Server is running on port : ', port) });