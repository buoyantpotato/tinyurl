/*var http =  require('http');
var fs = require('fs');

http.createServer(function (req, res) {

    //res.writeHead(200, {"Content-Type": "text-html"});
    //res.write("Hello world!");
    //res.end(html);

    if (req.url === "/") {
        res.writeHead(200, {"Content-Type": "text-html"});
        var html = fs.readFileSync(__dirname + "/index.html");
        res.end(html);
    }

    if (req.url === "/api") {
        res.writeHead(200, {"Content-Type": "application/json"});
        var obj = {
            name: "Joe Lin",
            age: 99
        };
        var html = fs.readFileSync(__dirname + "/index.html");
        res.end(JSON.stringify(obj));
    }
    else {

    }
}).listen(3000);*/

/*app.get("/", function (req, res) {
 res.send("Hello express!");
 });*/


var express = require('express');
var app = express();
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/indexRouter');
var faviconRouter = require('./routes/faviconRouter');
var mongoose = require('mongoose');
var useragent = require('express-useragent');

mongoose.connect("mongodb://buoyantpotato:10099960@ds053186.mlab.com:53186/buoyant_db");

app.use("/public", express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use(useragent.express());

app.use("/api/v1", restRouter);

app.use("/favicon.ico", faviconRouter);
app.use("/:shortUrl", redirectRouter);
app.use("/", indexRouter);


app.listen(3000);

