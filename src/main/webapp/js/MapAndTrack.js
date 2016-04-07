angular
        .module('mapNtrack', [])
        .controller('RouteController', ['$scope', '$http', function ($scope, $http) {
                $scope.load = function load() {
                    $http.get("_ah/api/myApi/v1/routes")
                            .success(function (data, status, headers, config) {
                                $scope.routes = data.items;
                            });
                }
            }])
        ;        