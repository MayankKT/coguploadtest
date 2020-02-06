const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
var docx = require('./docx.js');
const path = require("path");
var request = require('request');
const mongodb = require('mongodb');
const assert = require('assert');

//const fileNameArray = ["test.pptx"]
exports.getData = function(answer, obj,cb) {
   cb('done');
}

