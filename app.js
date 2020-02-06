const express = require('express');
const app = express();
var port = process.env.PORT || 5000;
var cors = require('cors');

app.use(cors())

app.get('/IPKit', (req, res) => {
    res.send('Hello Words !!');
});

app.listen(port, () => { console.log('Server is running on port : ', port) });