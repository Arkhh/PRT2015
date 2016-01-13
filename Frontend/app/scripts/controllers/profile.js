/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('ProfileCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {


        $scope.getInfos = function () {
            UserAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {
                        console.log("INFOS");
                        console.log(data);
                    }
                });

        };
    });