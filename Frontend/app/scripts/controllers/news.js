/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('NewsCtrl', function (newsAPI, $rootScope, $scope, $location, $filter,$cookies) {

        $scope.newsTab=[];

        $scope.getLatestNews = function () {
            newsAPI.getNews($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {
                        angular.forEach(data, function(value) {
                            value._node.properties.date=parseInt(value._node.properties.date);
                            $scope.newsTab.push(value._node.properties);
                        });

                        console.log($scope.newsTab);


                    }
                });

        };
        $scope.getLatestNews();


    });