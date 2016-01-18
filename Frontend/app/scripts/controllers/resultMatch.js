/**
 * Created by Thomas on 18/01/2016.
 */
angular.module('BadminTown')
    .controller('resultMatchCtrl', function ($scope, $uibModalInstance) {
        $scope.result='victoire';

        $scope.ok = function () {
            $uibModalInstance.close($scope.result);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    });
