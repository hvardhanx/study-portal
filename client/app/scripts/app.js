'use strict';

/**
 * @ngdoc overview
 * @name studyPortalApp
 * @description
 * # studyPortalApp
 *
 * Main module of the application.
 */
angular
  .module('studyPortalApp', ['ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'MainCtrl',
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'MainCtrl',
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'MainCtrl',
            })
            .when('/dashboard/course', {
                templateUrl: 'views/course.html',
                controller: 'MainCtrl',
            })

        .otherwise({
            redirectTo: '/'
        });
  });
