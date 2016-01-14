/**
 * Created by Thomas on 11/01/2016.
 */
'use strict';

angular.module('BadminTown')
    .controller('LandingCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {



        function init(){
            $scope.showConn=false;
            $scope.showInscription=false;
            $scope.session = $cookies.get('isConnected');
            $scope.userInfos = $cookies.get('userInfos');

            if($scope.session || $scope.userInfos){
                console.log("SESSION ON");

                $location.path("/home");
            }

        }

        function onSucessRedirect(data){
            $scope.userinfos={
                id:data._node._id,
                nom:data._node.properties.nom,
                prenom:data._node.properties.prenom,
                admin:data._node.properties.admin
            };
            $cookies.put('isConnected', true);
            $cookies.putObject('userInfos',$scope.userinfos);
            $location.path("/home")
        }

        init();



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
                    if(!data.error){
                        onSucessRedirect(data);
                    }
                });
        };

        $scope.signUp = function() {
            UserAPI.createUser($scope.userinfos)
                .then(function(data) {
                    if(!data.error){
                       onSucessRedirect(data);
                    }
                });
        };

    });