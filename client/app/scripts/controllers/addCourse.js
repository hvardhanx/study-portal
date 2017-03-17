'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('AddCourseCtrl', ['$scope', '$http', '$location',function($scope, $http, $location) {
    $scope.course = {
        name: '',
        credits: '',
        type: '',
        branch: '',
        semester: ''
    };

    $scope.add = function(course) {
      var params = JSON.stringify(course);
      $http.post('http://localhost:8080/api/courses/add', params)
        .then(function successCallback(response) {
          console.log('Success');
        }, function errorCallback(response) {
          console.log('Error');
        });
      $location.path('/dashboard/course');
    };
}]);
