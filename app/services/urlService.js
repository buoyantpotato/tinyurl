var UrlModel = require("../models/urlModel");
var redis = require("redis");

//"process.env. + sth" 是node.js获取环境变量的方法
//传入环境变量的方法是在: node <app_name>.js REDIS_PORT_6379_TCP_PORT = ...
//但是此处的两个环境变量docker会自动替我们填写
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var redisClient = redis.createClient(port, host);

// Generate an array containing 62 characters
var encode = [];
var genCharArray = function (charFirst, charLast) {
    var arr = [];
    var i = charFirst.charCodeAt(0);
    var j = charLast.charCodeAt(0);
    for (; i <= j; i++) {
        arr.push(String.fromCharCode(i));
    }
    return arr;
};
encode = encode.concat(genCharArray('a', 'z'));
encode = encode.concat(genCharArray('A', 'Z'));
encode = encode.concat(genCharArray('0', '9'));

// Another way to generate encode[]
/*for (var i = 0; i < 10; i++) {
    encode[i] = String.fromCharCode(i + 48);
}
for (var i = 0; i < 26; i++) {
    encode[i + 10] = String.fromCharCode(i + 65);
    encode[i + 36] = String.fromCharCode(i + 97);
}*/


// Get short url based on the given long url
var getShortUrl = function (longUrl, callback) {
    if (longUrl.indexOf('http') === -1) {
        longUrl = "http://" + longUrl;
    }

    redisClient.get(longUrl, function (err, shortUrl) {
        if (shortUrl) {
            console.log("Get short url cache.");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        }
        else {
            UrlModel.findOne({ longUrl: longUrl }, function (err, data) {
                // No handle to error, which could be completed later
                if (data) {

                    callback(data);
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                }
                else {
                    // There are many ways to generate, which can be modified later
                    generateShortUrl(function (shortUrl) {
                        var url = new UrlModel({
                            shortUrl: shortUrl,
                            longUrl: longUrl
                        });
                        url.save();

                        callback(url);
                        redisClient.set(shortUrl, longUrl);
                        redisClient.set(longUrl, shortUrl);
                    });
                }
            });
        }
    });
};

var generateShortUrl = function (callback) {
    UrlModel.count({}, function (err, num) {
        callback(convertTo62(num));
    });
};

var convertTo62 = function (number) {
    var res = "";
    do {
        res = encode[number % 62] + res;
        number /= 62;
    }
    while (number >= 1);
    return res;
};

// Get long url based on the given short url
var getLongUrl = function (shortUrl, callback) {

    redisClient.get(shortUrl, function (err, longUrl) {
        if (longUrl) {
            console.log("Get short url: " + shortUrl);
            console.log("Get long url cache: " + longUrl);
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        }
        else {
            UrlModel.findOne({ shortUrl: shortUrl }, function (err, data) {

                callback(data);
                redisClient.set(shortUrl, longUrl);
                redisClient.set(longUrl, shortUrl);
                // There is no undefined exception handle, so restore the available data
            })
        }
    });
};

module.exports = {
    getShortUrl: getShortUrl,
    getLongUrl: getLongUrl
};

