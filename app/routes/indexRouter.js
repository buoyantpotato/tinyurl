/**
 * Created by linzhou on 16-10-2.
 */

var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var path = require('path');

router.get("*", function (req, res) {
    //console.log("HAHA: " + req.url);
    res.sendFile("index.html", { root: path.join(__dirname, '../public/views/')});
});

module.exports = router;

