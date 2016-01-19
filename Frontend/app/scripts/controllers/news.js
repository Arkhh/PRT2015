/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('NewsCtrl', function (newsAPI, $rootScope, $scope, $location, $filter,$cookies) {

        $scope.newsTab=[];

        $scope.getLatestNews = function () {
            newsAPI.getNews($scope.userInfos.id)
                .then(function (data) {
                        angular.forEach(data, function(value) {
                            value.date=parseInt(value.date);
                            $scope.newsTab.push(value);
                        });
                },function(err){
                    console.log(err);
                });

        };
        $scope.getLatestNews();


    });