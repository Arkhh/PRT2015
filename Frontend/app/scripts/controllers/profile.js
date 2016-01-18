/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('ProfileCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {

        $scope.getMyInfos = function () {
            UserAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {

                        $scope.myInfos = data;

                        UserAPI.getUserPubInfos($scope.userInfos.id)
                            .then(function (data) {
                                if (!data.error) {
                                    $scope.myInfos.moyenneVolee=data.moyenneVolee;
                                    $scope.myInfos.moyenneFrappe=data.moyenneFrappe;
                                    $scope.myInfos.moyenneEndurance=data.moyenneEndurance;
                                    $scope.myInfos.moyenneTechnique=data.moyenneTechnique;
                                    $scope.myInfos.moyenneFond=data.moyenneFond;
                                    $scope.myInfos.noteMoyenne=data.noteMoyenne;
                                }
                            });
                    }
                })
        };

        $scope.getUserInfo = function(id){
            $scope.multiPlayerResult=false;
            $scope.multiPlayerResultTab='';
            UserAPI.getUserPubInfos(id)
                .then(function (data) {
                    if (!data.error) {

                        $scope.player=data;
                        $scope.player.noteMoyenne=data.noteMoyenne;
                        $scope.player.moyenneVolee= data.moyenneVolee;
                        $scope.player.moyenneFrappe= data.moyenneFrappe;
                        $scope.player.moyenneEndurance= data.moyenneEndurance;
                        $scope.player.moyenneTechnique= data.moyenneTechnique;
                        $scope.player.moyenneFond= data.moyenneFond;

                    }
                });

        };


        $scope.editProfile= function(){
            UserAPI.updateUser($scope.myInfos,$scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {
                        $scope.myInfos = data;
                    }
                });
        };


        $scope.processSearch= function(searchText){
            if($scope.searchProcessing===true){
                return;
            }

            if(searchText.length<2){
                $scope.ErrorSearch='Minimum 2 caractères';
                return;
            }

            $scope.searchProcessing=true;


            UserAPI.getUserByName(searchText)
                .then(function (data) {

                    $scope.player='';

                    if (!(Array.isArray(data))) {
                        $scope.getUserInfo(data.id);
                        $scope.searchProcessing=false;
                        $scope.ErrorSearch=undefined;

                    }
                    else{
                        $scope.searchProcessing=false;
                        $scope.ErrorSearch=undefined;
                        $scope.multiPlayerResult=true;
                        $scope.multiPlayerResultTab=data;
                    }
                },function(err){
                    console.log(err);
                    $scope.player='';
                    $scope.searchProcessing=false;
                    $scope.ErrorSearch=err;
                    $scope.multiPlayerResult=false;
                    $scope.multiPlayerResultTab='';
            })


        };

        function init() {
            $scope.getMyInfos();
            $scope.player='';
            $scope.searchProcessing=false;
            $scope.ErrorSearch=undefined;
            $scope.multiPlayerResult=false;
            $scope.multiPlayerResultTab='';
        }

        init();
    });