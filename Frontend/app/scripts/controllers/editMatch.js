/**
 * Created by Thomas on 18/01/2016.
 */
angular.module('BadminTown')
    .controller('EditMatchCtrl', function ($scope, $uibModalInstance) {

        $scope.match=match;
        console.log(match);

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    });