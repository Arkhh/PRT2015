/**
 * Created by Thomas on 19/01/2016.
 */
angular.module('BadminTown')
    .controller('NoterMatchCtrl', function ($scope, $uibModalInstance) {


        $scope.notes={
            moyenneFrappe:5,
            moyenneVolee:5,
            moyenneFond:5,
            moyenneEndurance:5,
            moyenneTechnique:5
        };

            //note et nomSkill
        $scope.ok = function () {

            $scope.noteAPI=[];
            $scope.noteAPI.push({nom:'Endurance', note:$scope.notes.moyenneEndurance},{nom:'Frappe', note:$scope.notes.moyenneFrappe},{nom:'Volee',note:$scope.notes.moyenneVolee},{nom:'Fond',note:$scope.notes.moyenneFond},{nom:'Technique',note:$scope.notes.moyenneTechnique});
            $uibModalInstance.close($scope.noteAPI);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

    });