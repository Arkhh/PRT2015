/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('ProfileCtrl', function (UserAPI, $rootScope, $scope, $location, $filter,$cookies) {


        $scope.getInfos = function () {
            UserAPI.getUserInfo($scope.userInfos.id)
                .then(function (data) {
                    if (!data.error) {
                        $scope.userInfos={
                            id:data._node._id,
                            nom:data._node.properties.nom,
                            prenom:data._node.properties.prenom,
                            admin:data._node.properties.admin,
                            sexe:data._node.properties.sexe
                            //email:data._node.properties.email,
                        };
                        //$cookies.remove('userInfos');
                        //$cookies.putObject('userInfos',$scope.userinfos);
                    }
                });

        };

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'fa fa-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];




        function init() {
            $scope.getInfos();
            $scope.max = 5;
            $scope.rate = 2;
            $scope.isReadonly = false;
        }

        init();

    });