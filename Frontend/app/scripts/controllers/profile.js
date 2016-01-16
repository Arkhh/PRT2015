/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('ProfileCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {

        /*$scope.editInfos={
            id:data._node._id,
            nom:data._node.properties.nom,
            prenom:data._node.properties.prenom,
            admin:data._node.properties.admin,
            sexe:data._node.properties.sexe,
            email:data._node.properties.email,
            password:data._node.properties.password
        };*/


        $scope.getInfos = function () {
            UserAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {

                        //$cookies.remove('userInfos');
                        //$cookies.putObject('userInfos',$scope.userinfos);
                    }
                });

        };




        function init() {
            $scope.getInfos();
        }

        init();

    });