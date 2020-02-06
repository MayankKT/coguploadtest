const CognitiveServicesCredentials = require("@azure/ms-rest-js");
const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
var docx = require('./docx.js');
const path = require("path");
var request = require('request');
const mongodb = require('mongodb');
const assert = require('assert');
// constant end

// key variables start 

// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config();
// }

const subscription_key = '9ee36486c3eb4d42a68112fd4e0486af';//process.env.TEXT_ANALYTICS_SUBSCRIPTION_KEY;
const endpoint = 'https://southcentralus.api.cognitive.microsoft.com';process.env.TEXT_ANALYTICS_EndPoint


// authentication start

const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
const textAnalyticsClient = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, endpoint);

// authentication end

const directoryPathSOW = path.resolve("./public");
const directoryIPKit = path.resolve("./public");

//const fileNameArray = ["test.pptx"]
exports.getData = function(answer, obj,cb) {
   cb('done');
}

