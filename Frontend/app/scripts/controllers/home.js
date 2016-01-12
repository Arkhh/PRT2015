/**
 * Created by Thomas on 12/01/2016.
 */

'use strict';

angular.module('BadminTown')
    .controller('HomeCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,Cookies) {

    $scope.userId=$rootScope.userID;
    $scope.connected =$rootScope.isConnected;

        function isConnected(){
            if($scope.connected===false || !($scope.userId)){
                $location.path("/");
            }
        }

        function init(){
            isConnected();
        }

        init();


        $scope.disconnect = function(){
            $scope.userId=undefined;
            $scope.connected=false;
            init();
        }

    });