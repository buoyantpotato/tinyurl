/**
 * Created by linzhou on 16-10-2.
 */

angular.module("tinyurlApp")
    // Here the name of controller is defined !!!
    .controller("homeController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
                                    // Two-way data binding

        $scope.submit = function () {
            $http.post("/api/v1/urls", {
                longUrl: $scope.longUrl
            }).success(function (data) {
                $location.path("/urls/" + data.shortUrl);
                // switch to a new url
            });
        }
    }]);