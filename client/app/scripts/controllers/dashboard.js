'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('DashboardCtrl', ['$scope', '$location', '$cookieStore', '$http', function($scope, $location, $cookieStore, $http) {
    $scope.goToLink = function(course) {
      console.log(course);
      $location.path('/dashboard/course');
    };

    $scope.getCookie = function(param) {
      console.log($cookieStore.get(param));
      return $cookieStore.get(param);
    };

    $scope.courses = [];

    $http({method : 'GET',url : 'http://localhost:8080/api/courses'})
      .success(function(data, status) {
          $scope.courses = data;
          console.log(status);
      })
      .error(function(data, status) {
          console.log("Error: "+ data + status);
      });

  }]);
