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
  .module('studyPortalApp', [
          'ngRoute',
          'ui.router',
          'ngCookies',
          'angularUtils.directives.dirDisqus',
          'ngDisqus',
          'ngFileUpload'
        ])
  .config(function($disqusProvider){
      $disqusProvider.setShortname('rishabhstr');
   })
  .factory('storage', function() {
        return {};
    })
  .factory('userService', function () {
      var user = {
          isLogged: false
      };

      var reset = function() {
          user.isLogged = false;
      };

      return {
          user: user,
          reset : reset
        };
  })
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
          enabled: true,
          requiredBase: false
        });
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl',
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
            })
            .when('/dashboard/course', {
                templateUrl: 'views/course.html',
                controller: 'CourseCtrl',
            })
            .when('/dashboard/add', {
                templateUrl: 'views/addCourse.html',
                controller: 'AddCourseCtrl',
            })

        .otherwise({
            redirectTo: '/'
        });
  });
