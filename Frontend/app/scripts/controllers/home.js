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
            //$scope.partials['showAdmin']=false;
            $scope.partials[partial]=true;

        };

        $scope.disconnect = function(){
            $cookies.remove('isConnected');
            $cookies.remove('userInfos');
            $scope.userInfos='';
            init();
        };

        init();


        function init(){
            $scope.partials=[];
            $scope.session = $cookies.get('isConnected');
            $scope.userInfos = $cookies.getObject('userInfos');
            isConnected();
            $scope.displayPartial('showProfile');
        }

        function isConnected(){
            if(!$scope.userInfos){
                $scope.userInfos='';
                $cookies.remove('isConnected');
                $cookies.remove('userInfos');
                $location.path("/");
            }
        }






    });