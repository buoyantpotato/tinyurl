/**
 * Created by linzhou on 2016/10/25.
 */

var geoip = require("geoip-lite"); // Package from online
var RequestModel = require("../models/requestModel");

var logRequest = function (shortUrl, req) {
    var reqInfo = {};

    reqInfo.shortUrl = shortUrl;

    // As short urls for advertisement, referrer info is important
    reqInfo.referer = req.headers.referer || "Unknown";

    // req will contain useragent info since the server take care the useragent of urls
    reqInfo.platform = req.useragent.platform || "Unknown";
    reqInfo.browser = req.useragent.browser || "Unknown";

    // Get countries info by detecting ip
    var ip = req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    var geo = geoip.lookup(ip);
    if (geo) {
        reqInfo.country = geo.country;
    } else {
        reqInfo.country = "Unknown";
    }

    reqInfo.timestamp = new Date();

    var request = new RequestModel(reqInfo);
    request.save(); // Can add callback function to handle exceptions
};

var getUrlInfo = function (shortUrl, info, callback) {
    if (info === "totalClicks") {
        RequestModel.count({shortUrl: shortUrl}, function (err, data) {
            callback(data);
        });
        return;
    }

    var groupId = "$" + info;

    // If it is grouped by itme, set the time limit
    if (info === "hour") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"},
            hour: { $hour: "$timestamp"},
            minutes: { $minute: "$timestamp"}
        }
    } else if (info === "day") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"},
            hour: { $hour: "$timestamp"}
        }
    } else if (info === "month") {
        groupId = {
            year: { $year: "$timestamp"},
            month: { $month: "$timestamp"},
            day: { $dayOfMonth: "$timestamp"}
        }
    }

    RequestModel.aggregate([ // "Pipeline" ???
        {
            $match: { // aggregate all entries with THIS short url
                shortUrl: shortUrl
            }
        },
        {
            $sort: { // sort by latest first
                timestamp: -1
            }
        },
        {
            $group: {
                _id: groupId,  // grouping by this parameter
                count: {         // counting sums based on 1 for each
                    $sum: 1
                }
            }
        }
    ], function (err, data) {
        callback(data);
    })
};

module.exports = {
    logRequest: logRequest,
    getUrlInfo: getUrlInfo
};