/**
 * Created by linzhou on 2016/10/31.
 */

var express = require('express');
var router = express.Router();

router.get("*", function (req, res) {
    //console.log("HAHA: " + req.url);
    res.json({result: "favicon"});
});

module.exports = router;