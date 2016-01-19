/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('RankingCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,MatchAPI,$uibModal) {

        $scope.rankingTab =[];
        $scope.ErrorDisplay=undefined;
        $scope.basePoints =20;
        $scope.defi={
            date:'',
            idJ1:'',
            idJ2:'',
            perteJ2:'',
            gainJ2:'',
            gainJ1:'',
            perteJ1:''
        };


        $scope.getRank = function(points){
            var rankUser;
            angular.forEach($scope.ranks, function(rank) {
                if(points>rank.limit){
                    rankUser= rank.nom;
                }
            });
            return rankUser;
        };

        $scope.getUsersRanking = function (){
                UserAPI.getRanking()
                    .then(function (data) {
                            $scope.rankingTab=data;
                        angular.forEach($scope.rankingTab, function(user) {
                            user.rank=$scope.getRank(user.points);
                        });
                        $scope.rankingTab=$filter('orderBy')($scope.rankingTab, 'points',true);
                        $scope.ErrorDisplay=undefined;

                    },function(err){
                        $scope.ErrorDisplay=err;
                    });
            };


        $scope.openDefier = function (size,player) {



            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/modals/modalDefier.html',
                controller: 'DefierCtrl',
                size: size
            });

            modalInstance.result.then(function (dateDefi) {

                $scope.defi.date=dateDefi;
                $scope.defi.idJ1=$scope.userInfos.id;
                $scope.defi.idJ2=player.id;
                $scope.defi.perteJ2=Math.round((player.points/$scope.userInfos.points)*$scope.basePoints); // si le J2 a + de points que le J1 alors il perd plus,
                $scope.defi.perteJ1=Math.round(($scope.userInfos.points/player.points)*$scope.basePoints); //si il en a moins il en perd moins,
                $scope.defi.gainJ1=Math.round((player.points/$scope.userInfos.points)*$scope.basePoints);  //c'est un coéficient qui multiplie le gain de base posé à 20.
                $scope.defi.gainJ2=Math.round(($scope.userInfos.points/player.points)*$scope.basePoints);


                MatchAPI.createMatch($scope.defi)
                    .then(function(data){
                        $scope.defiSuccess='Défi bien envoyé';
                    },function(err){
                        console.log(err);
                        $scope.createMatchProcessing=false;
                    });



            }, function () {
            });
        };


        function init(){
            $scope.getUsersRanking();
        }

        init();
    });