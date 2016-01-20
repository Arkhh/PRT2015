/**
 * Created by Thomas on 12/01/2016.
 */

'use strict';

angular.module('BadminTown')
    .controller('HomeCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {


       $scope.displayPartial= function(partial){

            $scope.partials['showProfile']=false;
            $scope.partials['showNews']=false;
            $scope.partials['showMatches']=false;
            $scope.partials['showEvents']=false;
            $scope.partials['showRanking']=false;
            $scope.partials['showAdmin']=false;
            $scope.partials[partial]=true;

        };

        $scope.disconnect = function(){
            $cookies.remove('isConnected');
            $cookies.remove('userInfos');
            $scope.userInfos='';
            init();
        };

        $scope.getRank = function(){
        var rankUser;
            angular.forEach($scope.ranks, function(rank) {
                if($scope.userInfos.points>rank.limit){
                    rankUser= rank.nom;
                }
            });
        return rankUser;
        };

        init();


        function init(){
            $scope.ranks=[{nom:'Bronze',limit:0},{nom:'Argent',limit:1250},{nom:'Or',limit:1500},{nom:'Platine',limit:1750},{nom:'Diamant',limit:2000},{nom:'Mafraj',limit:2500}];
            $scope.partials=[];
            $scope.session = $cookies.get('isConnected');
            $scope.id = $cookies.getObject('userInfos');
            if(!($scope.id)){
                isConnected();
                return;
            }
            UserAPI.getUserInfo($scope.id.id)
                .then(function (data) {
                    $scope.userInfos=data;
                    console.log($scope.userInfos);
                    $scope.rankUser=$scope.getRank();
                    isConnected();
                    $scope.displayPartial('showProfile');
                });

        }

        function isConnected(){
            if(!$scope.userInfos){
                $scope.userInfos='';
                $scope.id='';
                $cookies.remove('isConnected');
                $cookies.remove('userInfos');
                $location.path("/");
            }
        }






    });