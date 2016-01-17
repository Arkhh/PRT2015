/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('MatchCtrl', function (MatchAPI,UserAPI, $rootScope, $scope, $location, $filter,$cookies) {


        $scope.players=[];

        $scope.players.push({
            id:'123',
            nom:'bop',
            prenom:'zamel'
        });
        $scope.players.push({
            id:'5',
            nom:'bop2',
            prenom:'zamel2'
        });

        $scope.processSearch= function(simpleSearchText){
            if($scope.searchProcessing===true){
                return;
            }

            if(simpleSearchText.length<2){
                $scope.ErrorSearch='Minimum 2 caractères';
                return;
            }

            $scope.searchProcessing=true;


            UserAPI.getUserByName(simpleSearchText)
                .then(function (data) {

                    if (data.length>0) { //TODO check si plusieurs resultats...

                        $scope.getUserInfo(data.id);
                        $scope.searchProcessing=false;
                        $scope.ErrorSearch=undefined;

                    }
                },function(err){
                    $scope.searchProcessing=false;
                    $scope.ErrorSearch=err;
                })
        };

        $scope.opponentCreate={id:'',nom:'',prenom:''};
        $scope.opponentDisplay='';

        $scope.getInfos = function () {
            MatchAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {

                        //$cookies.remove('userInfos');
                        //$cookies.putObject('userInfos',$scope.userinfos);
                    }
                });

        };

        $scope.close = function(id){
            delPlayer(id);
        };

        function delPlayer(id){
            angular.forEach($scope.players, function(value) {
                if(value.id===id){
                    $scope.players.splice($scope.players[value],1);
                }
            });
        }

        function getPlayer(id){
            var index=-1;
            angular.forEach($scope.players, function(value) {
                if(parseInt(value.id)===parseInt(id)){
                    index = $scope.players.indexOf(value);
                }
            });
            return index;
        }

        $scope.select = function(id){
            $scope.opponentDisplay='';
            $scope.opponentCreate=$scope.players[getPlayer(id)];
            $scope.opponentDisplay=$scope.opponentCreate.nom+' '+$scope.opponentCreate.prenom
        };

    });