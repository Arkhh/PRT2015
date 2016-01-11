/**
 * Created by Thomas on 11/01/2016.
 */
'use strict';

angular.module('BadminTown')
    .controller('LandingCtrl', function (UserAPI, $rootScope, $scope, $location, $filter) {

        $scope.userinfos={
            email: '',
            password:''
        };


        $scope.logIn = function() {


        };

        $scope.signUp = function() {
            UserAPI.createUser($scope.userinfos)
                .then(function(data) {
                    console.log("GREAT SUCCES")
                });
        };


    });