/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('MatchCtrl', function (MatchAPI,UserAPI, $rootScope, $scope, $location, $filter,$cookies,$uibModal) {

        $scope.getMatchesById = function(){
            MatchAPI.getMatchUser($scope.userInfos.id)
                .then(function(data){
                    angular.forEach(data, function(value) {
                        value.date=parseInt(value.date);
                        value.datePast=Date.create(value.date).isPast();
                        value.dateStr=Date.create(value.date).relative('fr');
                        UserAPI.getUserPubInfos(value.idJ2)
                            .then(function(dataUserInfo){
                                value.nom=dataUserInfo.nom;
                                value.prenom=dataUserInfo.prenom;
                                $scope.matches.push(value);
                            },function(err){

                            });

                    });
                },function(err){

                })
            ;

        };

        init();


        $scope.animationsEnabled = true;

        $scope.openEdit = function (size,match) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modals/modalEditMatch.html',
                controller: 'EditMatchCtrl',
                size: size
            });

            modalInstance.result.then(function (newDate) {
                console.log(newDate);
            }, function () {
            });
        };

        $scope.openResult = function (size,match) {

            console.log(match);


            $scope.editResultMatch=match;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modals/modalEditResultat.html',
                controller: 'resultMatchCtrl',
                size: size
            });

            modalInstance.result.then(function (result) {


                if(result==='victoire'){
                    match.resultJ1=match.idJ1;
                }
                else {
                    match.resultJ1=match.idJ2;

                }

                MatchAPI.updateResult({id:match.idJ1,idm:match.id,resultat:match.resultJ1})
                    .then(function(data){
                        init();
                    },function(err){

                    });

            }, function () {
            });
        };


        function init(){

            $scope.items = ['item1', 'item2', 'item3'];


            $scope.dateToday=Date.create('today');
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


            $scope.histoMatches=[];

            $scope.histoMatches.push({
                idMatch:'5',
                idJ1:'70',
                idJ2:'68',
                date:Date.create(1452271844000).relative('fr'),
                resultatJ1:'70',
                resultatJ2:'68',
                resultat:'',
                noteJ1:'false',
                noteJ2:'false',
                gainJ1:15,
                gainJ2:10,
                perteJ1:15,
                perteJ2:10
            });

            $scope.histoMatches.push({
                id:'6',
                nom:'bop2',
                prenom:'zamel2',
                date: Date.create(1452271844000).relative('fr'),
                resultat:'D',
                note:'false',
                recompense:-10
            });

            $scope.opponentCreate={id:'',nom:'',prenom:''};
            $scope.opponentDisplay='';
            $scope.matches=[];

            $scope.getMatchesById();

        }

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

        $scope.createMatch = function(){
            MatchAPI.createMatch()
                .then(function(data){

                },function(err){

                });
        };

        $scope.deleteMatch = function(id){
            MatchAPI.deleteMatch(id)
                .then(function(){
                    init();

                },function(err){

                });
        }



});