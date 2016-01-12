'use strict';

angular.module('BadminTown', ['ngRoute'])
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
            .when('/news', {
                templateUrl: 'news.html',
                controller: 'NewsCtrl'

            })
            .when('/news/:id', {
                templateUrl: 'views/newsDetails.html',
                controller: 'NewsCtrl'

            })
            .when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'AdminCtrl'

            })
            .when('/profile/', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl'

            })
            .when('/events/', {
                templateUrl: 'views/events.html',
                controller: 'EventsCtrl'

            })
            .when('/events/:id', {
                templateUrl: 'views/eventsDetails.html',
                controller: 'EventsCtrl'

            })
            .when('/events/create', {
                templateUrl: 'views/events.html',
                controller: 'EventsCtrl'

            })
            .when('/events/users/:id', {
                templateUrl: 'views/events.html',
                controller: 'EventsCtrl'

            })
            .when('/matches/', {
                templateUrl: 'views/matches.html',
                controller: 'MatchCtrl'

            })
            .when('/matches/results', {
                templateUrl: 'views/results.html',
                controller: 'MatchCtrl'

            })
            .when('/matches/opponents', {
                templateUrl: 'views/opponents.html',
                controller: 'MatchCtrl'

            })
            .when('/ranking', {
                templateUrl: 'views/ranking.html',
                controller: 'RankingCtrl'

            })
            .otherwise({
                redirectTo: '/'
            });
    })

    .run(function($rootScope) {
    });