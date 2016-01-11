'use strict';

angular.module('BadminTown', ['ngRoute'])
    .config(function ( $routeProvider ) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/landing.html',
                controller: 'LandingCtrl'
            })
            .when('/home', {
                templateUrl: 'home.html',
                controller: 'HomeCtrl'

            })
            .when('/news', {
                templateUrl: 'news.html',
                controller: 'NewsCtrl'

            })
            .when('/news/:id', {
                templateUrl: 'newsDetails.html',
                controller: 'NewsCtrl'

            })
            .when('/admin', {
                templateUrl: 'admin.html',
                controller: 'AdminCtrl'

            })
            .when('/profile/', {
                templateUrl: 'profile.html',
                controller: 'ProfileCtrl'

            })
            .when('/events/', {
                templateUrl: 'events.html',
                controller: 'EventsCtrl'

            })
            .when('/events/:id', {
                templateUrl: 'eventsDetails.html',
                controller: 'EventsCtrl'

            })
            .when('/events/create', {
                templateUrl: 'events.html',
                controller: 'EventsCtrl'

            })
            .when('/events/users/:id', {
                templateUrl: 'events.html',
                controller: 'EventsCtrl'

            })
            .when('/matches/', {
                templateUrl: 'matches.html',
                controller: 'MatchCtrl'

            })
            .when('/matches/results', {
                templateUrl: 'results.html',
                controller: 'MatchCtrl'

            })
            .when('/matches/opponents', {
                templateUrl: 'opponents.html',
                controller: 'MatchCtrl'

            })
            .when('/ranking', {
                templateUrl: 'ranking.html',
                controller: 'RankingCtrl'

            })
            .otherwise({
                redirectTo: '/'
            });
    })

    .run(function($rootScope) {
    });