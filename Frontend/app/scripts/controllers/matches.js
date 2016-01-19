/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('MatchCtrl', function (MatchAPI,UserAPI, $rootScope, $scope, $location, $filter,$cookies,$uibModal) {


        $scope.getMatchesById = function(){
            $scope.matches=[];
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
                                $scope.matches=$filter('orderBy')( $scope.matches, 'date',true);
                            },function(err){

                            });

                    });
                },function(err){

                })
            ;

        };

        $scope.getSuggestedPlayers = function(id){

            MatchAPI.getSuggestion($scope.userInfos.id)
                .then(function(data) {
                    angular.forEach(data, function (value) {
                        UserAPI.getUserPubInfos(value)
                            .then(function (data) {
                                $scope.suggestPlayers.push(data);
                            }, function (err) {

                            });


                    });
                }, function (err) {

                });
        };


        $scope.getNextMatches = function(){
            $scope.ArrayMax=$scope.matches;
            $scope.ArrayMax=$filter('orderBy')($scope.ArrayMax, 'date');
            console.log($scope.ArrayMax[0]);
            MatchAPI.getNextFive($scope.ArrayMax[0].id,$scope.userInfos.id)
                .then(function(data){
                    angular.forEach(data, function(value) {
                        value.date=parseInt(value.date);
                        value.datePast=Date.create(value.date).isPast();
                        value.dateStr=Date.create(value.date).relative('fr');
                        UserAPI.getUserPubInfos(value.idJ2)
                            .then(function(dataUserInfo){
                                value.nom=dataUserInfo.nom;
                                value.prenom=dataUserInfo.prenom;
                                if(($scope.matches.indexOf(value)<0)){
                                    $scope.matches.push(value);
                                }
                            },function(err){

                            });

                    });
                },function(err){

                })
            ;

        };

        $scope.getHistoById = function(){
            $scope.histoMatches=[];
            MatchAPI.getLastTen($scope.userInfos.id)
                .then(function(data){
                    angular.forEach(data, function(value) {
                        value.date=parseInt(value.date);
                        value.dateStr=Date.create(value.date).relative('fr');
                        UserAPI.getUserPubInfos(value.idJ2)
                            .then(function(dataUserInfo){
                                value.nom=dataUserInfo.nom;
                                value.prenom=dataUserInfo.prenom;
                                $scope.histoMatches.push(value);
                            },function(err){

                            });

                    });
                },function(err){

                })
            ;

        };

        init();


        $scope.selectOpponentFromTab = function(player){
            $scope.opponent=player;
            $scope.opponentDisplay=player.nom+' '+player.prenom;
        };


        $scope.animationsEnabled = true;

        $scope.openEdit = function (size,match) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modals/modalEditMatch.html',
                controller: 'EditMatchCtrl',
                size: size
            });

            modalInstance.result.then(function (newDate) {

                var newInfos = {id: match.id, date: newDate}
                MatchAPI.updateMatch(newInfos)
                    .then(function(data){
                        console.log(data);
                        init();
                    },function(err){

                    });



            }, function () {
            });
        };

        $scope.openResult = function (size,match) {

            console.log(match);



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


        $scope.openNotes = function (size,match) {



            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modals/modalNoteMatch.html',
                controller: 'NoterMatchCtrl',
                size: size
            });

            modalInstance.result.then(function (notes) {

                angular.forEach(notes, function(eval) {

                    MatchAPI.noterAdv(match.idJ1,match.id,eval,match.idJ2)
                        .then(function(data){

                            $scope.histoMatches[$scope.histoMatches.indexOf(match)].aNoter1='true';

                        },function(err){

                        });
                }, function () {

                    }
                );

            });
        };


        function init(){

            console.log("init");
            $scope.createMatchVar={
                datePicker:'',
                idJ1:'',
                idJ2:'',
                gainJ1:0,
                perteJ1:0,
                gainJ2:0,
                perteJ2:0,
                dateAPI:0
            };
            $scope.createMatchVar.datePicker=Date.create(Date.create('in three hours').long());
            $scope.dt = Date.create('in three hours').format('{yyyy}-{MM}-{dd}T{{HH}}:{{mm}}');

            $scope.suggestPlayers=[];
            $scope.opponent='';
            $scope.opponentDisplay='';
            $scope.matches=[];
            $scope.histoMatches=[];
            $scope.getMatchesById();
            $scope.getHistoById();
            $scope.getSuggestedPlayers();
            $scope.basePoints=20;

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

                    $scope.player='';

                    if (!(Array.isArray(data))) {
                        UserAPI.getUserPubInfos(data.id)
                            .then(function(data){

                                $scope.opponentDisplay=data.nom+' '+data.prenom;
                                $scope.opponent=data;
                            },function(err){

                            });
                        $scope.searchProcessing=false;
                        $scope.ErrorSearch=undefined;
                        $scope.simpleSearchSuccessMulti=false;
                        $scope.simpleSearchResultTab=[];


                    }
                    else{
                        $scope.searchProcessing=false;
                        $scope.ErrorSearch=undefined;
                        $scope.simpleSearchSuccessMulti=true;
                        $scope.simpleSearchResultTab=data;
                    }
                },function(err){
                    $scope.searchProcessing=false;
                    $scope.ErrorSearch=err;
                    $scope.multiPlayerResult=false;
                    $scope.multiPlayerResultTab='';
                })
        };


        $scope.close = function(id){
            delPlayer(id);
        };

        function delPlayer(id){
            angular.forEach($scope.suggestPlayers, function(value) {
                if(value.id==id){
                    $scope.suggestPlayers.splice($scope.suggestPlayers.indexOf(value),1);
                }
            });
        }

        function getPlayer(id){
            var index=-1;
            angular.forEach($scope.suggestPlayers, function(value) {
                if(parseInt(value.id)===parseInt(id)){
                    index = $scope.suggestPlayers.indexOf(value);
                }
            });
            return index;
        }

        $scope.select = function(id){
            $scope.opponent=$scope.suggestPlayers[getPlayer(id)];
            $scope.opponentDisplay=$scope.opponent.nom+' '+$scope.opponent.prenom;
            $scope.createMatchVar.idJ2=$scope.opponent.id;
        };

        $scope.createMatch = function(){

            if($scope.createMatchProcessing===true){
                return;
            }
            $scope.createMatchProcessing=true;

            if(!$scope.opponent){
                $scope.createMatchError='Veuilez selectionner un adversaire';
                return ;
            }
            if($scope.opponent.id==$scope.userInfos.id){
                $scope.createMatchError='Vous ne pouvez pas jouer contre vous même';
                return;
            }

            //formatage des données

            $scope.createMatchVar.date=Date.parse(Date.create($scope.createMatchVar.datePicker).toISOString()).toString();
            $scope.createMatchVar.idJ1=$scope.userInfos.id;
            $scope.createMatchVar.idJ2=$scope.opponent.id;
            $scope.createMatchVar.perteJ2=Math.round(($scope.opponent.points/$scope.userInfos.points)*$scope.basePoints); // si le J2 a + de points que le J1 alors il perd plus,
            $scope.createMatchVar.perteJ1=Math.round(($scope.userInfos.points/$scope.opponent.points)*$scope.basePoints); //si il en a moins il en perd moins,
            $scope.createMatchVar.gainJ1=Math.round(($scope.opponent.points/$scope.userInfos.points)*$scope.basePoints);  //c'est un coéficient qui multiplie le gain de base posé à 20.
            $scope.createMatchVar.gainJ2=Math.round(($scope.userInfos.points/$scope.opponent.points)*$scope.basePoints);


            MatchAPI.createMatch($scope.createMatchVar)
                .then(function(data){
                    console.log(data);
                    $scope.createMatchProcessing=false;
                    $scope.createMatchError='';
                    init();
                },function(err){
                    console.log(err);
                    $scope.createMatchProcessing=false;
                });
        };

        $scope.deleteMatch = function(id){
            MatchAPI.deleteMatch(id)
                .then(function(){
                    init();

                },function(err){

                });
        };

//            $scope.createMatchProcessing=false;


    });