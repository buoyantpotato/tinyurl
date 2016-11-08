/**
 * Created by linzhou on 16-10-2.
 */

var app = angular.module("tinyurlApp", ["ngRoute", "ngResource", "chart.js"]);

// "ngRoute" indicates that we use $routeProvider from this module
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            // templateUrl will fit ng-view in index.html
            templateUrl: "./public/views/home.html",
            controller: "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl: "./public/views/url.html",
            controller: "urlController"
        })
});

// To remove the "#" in the url, change the mode into html5
// app.config(function ($locationProvider) {
//     $locationProvider.html5Mode(true);
// });