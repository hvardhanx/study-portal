'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('DashboardCtrl', ['$scope', '$location', '$cookieStore', function($scope, $location, $cookieStore) {
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
      })
      .error(function(data, status) {
          alert("Error");
      });

  }]);
