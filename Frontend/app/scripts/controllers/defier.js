/**
 * Created by Thomas on 19/01/2016.
 */
angular.module('BadminTown')
    .controller('DefierCtrl', function ($scope, $uibModalInstance) {


        $scope.matchDate=Date.create(Date.create('in three hours').long());
        $scope.dt = Date.create('in three hours').format('{yyyy}-{MM}-{dd}T{{HH}}:{{mm}}');

        $scope.ok = function () {
            $scope.dateResult=Date.parse(Date.create($scope.matchDate).toISOString()).toString();
            $uibModalInstance.close($scope.dateResult);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    });