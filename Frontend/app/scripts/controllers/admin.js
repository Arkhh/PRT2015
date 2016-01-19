/**
 * Created by Thomas on 19/01/2016.
 */
angular.module('BadminTown')
    .controller('AdminCtrl', function (AdminAPI, $rootScope, $scope, $location, $filter) {



        $scope.tabAllInfos = function () {
            AdminAPI.getAllUsersInfos()
                .then(function (data) {
                    if (data) {


                        angular.forEach(data, function(user) {
                            var userproperties=user._node.properties;
                            userproperties.id=user._node._id;
                            $scope.usersTab.push(userproperties);
                            console.log($scope.usersTab);
                        });



                    }
                }, function(){

                });
        };

        $scope.sendNews = function(test){
            console.log(test);
        };

        function init(){
            $scope.usersTab=[];
            $scope.tabAllInfos();
            $scope.message='test';
        }
        init();

        $scope.changeStatus = function(user,status){

            AdminAPI.editAdminStatus(user,status)
                .then(function(data){

                    init();
                },function(err){
                    console.log(err)

                });




        };



    });