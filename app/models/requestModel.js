/**
 * Created by linzhou on 2016/10/27.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
    shortUrl: String,
    referer: String,
    platform: String,
    browser: String,
    country: String,
    timestamp: Date
});

module.exports = mongoose.model("RequestModel", RequestSchema);;