/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('RankingCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {

        $scope.rankingTab =[];
        $scope.ErrorDisplay=undefined;


        function RandomMoyenne (){
            return Math.floor((Math.random()*6)+1)+0.5;
        }

        $scope.getUsersRanking = function (){
                UserAPI.getRanking()
                    .then(function (data) {
                            $scope.rankingTab=data;
                            $scope.rankingTab=$filter('orderBy')($scope.rankingTab, 'points',true);
                            angular.forEach($scope.rankingTab, function(value) {
                                value.noteMoyenne= RandomMoyenne();
                            });
                        $scope.ErrorDisplay=undefined;

                    },function(err){
                        $scope.ErrorDisplay=err;
                    });
            };


        function init(){
            $scope.getUsersRanking();
        }

        init();
    });