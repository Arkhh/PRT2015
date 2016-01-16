/**
 * Created by Thomas on 12/01/2016.
 */
angular.module('BadminTown')
    .controller('EventsCtrl', function (EventAPI, $rootScope, $scope, $location, $filter,$cookies) {


        $scope.getInfos = function () {
            EventAPI.getEvents()
                .then(function (data) {
                    if (!data.error) {

                        angular.forEach(data, function(value) {
                            $scope.eventTab.push(value._node.properties);
                        });

                        console.log($scope.eventTab);

                        //$cookies.remove('userInfos');
                        //$cookies.putObject('userInfos',$scope.userinfos);
                    }
                });

        };

        $scope.testbop = function(){
            console.log("test");
            console.log($scope.dt);
        };

        function init(){
            $scope.eventTab=[];
            $scope.getInfos();
        }
        init();
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        // Disable weekend selection

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.format = 'dd/MM/yyyy';
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };


        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

    });