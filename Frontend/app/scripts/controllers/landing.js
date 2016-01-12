/**
 * Created by Thomas on 11/01/2016.
 */
'use strict';

angular.module('BadminTown')
    .controller('LandingCtrl', function (UserAPI, $rootScope, $scope, $location, $filter) {

        $rootScope.isConnected=false;
        $rootScope.userID=null;

        $scope.showConn=false;
        $scope.showInscription=false;

        $scope.displayInscription = function(){
            $scope.showConn=false;
            $scope.showInscription=true;
        };
        $scope.displayConnexion = function(){
            $scope.showConn=true;
            $scope.showInscription=false;
        };

        $scope.userinfos={
            email: '',
            password:'',
            nom:'',
            prenom:''
        };


        $scope.logIn = function() {
            UserAPI.authenticate($scope.userinfos)
                .then(function(data) {
                    console.log(data);
                    if(!data.error){
                        $rootScope.isConnected=true;
                        $rootScope.userID=data._node._id;
                        $location.path("/home")
                    }
                });


        };

        $scope.signUp = function() {
            UserAPI.createUser($scope.userinfos)
                .then(function(data) {
                    console.log(data);
                    if(!data.error){
                        $rootScope.isConnected=true;
                        $rootScope.userID=data._node._id;
                        console.log("T'es co");
                    }
                });
        };


    });