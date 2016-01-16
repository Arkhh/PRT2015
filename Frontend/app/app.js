'use strict';

angular.module('BadminTown', ['ngRoute','ngCookies','ui.bootstrap','angular-input-stars'])
    .config(function ( $routeProvider ) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/landing.html',
                controller: 'LandingCtrl'
            })
            .when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'

            })
            .otherwise({
                redirectTo: '/'
            });
    })

    .run(function($rootScope) {
    });