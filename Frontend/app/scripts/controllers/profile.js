/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('ProfileCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {

        function RandomMoyenne (){
            return Math.floor((Math.random()*6)+1)+0.5;
        }

        $scope.getMyInfos = function () {
            UserAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {

                        $scope.myInfos = data;

                        UserAPI.getUserPubInfos($scope.userInfos.id)
                            .then(function (data) {
                                if (!data.error) {
                                    $scope.myInfos.noteMoyenne = RandomMoyenne();
                                    $scope.myInfos.moyenneVolee = RandomMoyenne();
                                    $scope.myInfos.moyenneFrappe = RandomMoyenne();
                                    $scope.myInfos.moyenneEndurance = RandomMoyenne();
                                    $scope.myInfos.moyenneTechnique = RandomMoyenne();
                                    $scope.myInfos.moyenneFond = RandomMoyenne();
                                }
                            });
                    }
                })
        };

        $scope.getUserInfo = function(id){
            UserAPI.getUserPubInfos(id)
                .then(function (data) {
                    if (!data.error) {

                        $scope.player=data;

                        $scope.player.noteMoyenne= RandomMoyenne();
                        $scope.player.moyenneVolee= RandomMoyenne();
                        $scope.player.moyenneFrappe= RandomMoyenne();
                        $scope.player.moyenneEndurance= RandomMoyenne();
                        $scope.player.moyenneTechnique= RandomMoyenne();
                        $scope.player.moyenneFond= RandomMoyenne();

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

                    if (data.length>0) { //TODO check si plusieurs resultats...

                        $scope.getUserInfo(data.id);
                        $scope.displayProcessing=false;
                        $scope.displayErrorSearch=false;
                        $scope.searchProcessing=false;
                        $scope.ErrorSearch=undefined;

                    }
                },function(err){
                    $scope.searchProcessing=false;
                    $scope.ErrorSearch=err;
            })


        };

        function init() {
            $scope.getMyInfos();
            $scope.player='';
            $scope.searchProcessing=false;
            $scope.ErrorSearch=undefined;
        }

        init();
    });