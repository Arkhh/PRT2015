/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('ProfileCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {

        $scope.getMyInfos = function () {
            UserAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (data) {

                        $scope.myInfos = data;

                        UserAPI.getUserPubInfos($scope.userInfos.id)
                            .then(function (data) {
                                if (!data.error) {
                                    $scope.myInfos.points=data.points;
                                    $scope.myInfos.points=data.points;
                                    $scope.myInfos.moyenneVolee=data.moyenneVolee;
                                    $scope.myInfos.moyenneFrappe=data.moyenneFrappe;
                                    $scope.myInfos.moyenneEndurance=data.moyenneEndurance;
                                    $scope.myInfos.moyenneTechnique=data.moyenneTechnique;
                                    $scope.myInfos.moyenneFond=data.moyenneFond;
                                    $scope.myInfos.noteMoyenne=data.noteMoyenne;
                                }
                            });
                    }
                }, function(){

                });
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
            $scope.sucessEdit='';
            $scope.failEdit='';
            $scope.myInfos.password=CryptoJS.SHA256($scope.myInfos.newPassword).toString();
            UserAPI.updateUser($scope.myInfos,$scope.userInfos.id)
                .then(function (data) {
                        $scope.myInfos = data;
                    $scope.sucessEdit='Profil edité avec succès';
                },function(err){
                    $scope.failEdit=err;
                    //TODO erreur

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

                    if (!(Array.isArray(data))||data.length==1) {
                        $scope.getUserInfo(data[0].id);
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