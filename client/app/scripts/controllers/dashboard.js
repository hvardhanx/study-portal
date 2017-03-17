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
      return $cookieStore.get(param);
    };

    $scope.courses = [{
              id: 1,
              name: 'Data Communication',
              type: 'Theory',
              credits: 4,
              branch: 'CSE',
              semester: '5'
          }, {
              id: 2,
              name: 'Operating Systems',
              type: 'Theory',
              credits: 3,
              branch: 'CSE',
              semester: '4'
          }, {
              id: 3,
              name: 'Database Management Systems',
              type: 'Theory',
              credits: 4,
              branch: 'CSE',
              semester: '4'
          }, {
              id: 4,
              name: 'Design and Analysis of algorithms',
              type: 'Practical',
              credits: 2,
              branch: 'CSE',
              semester: '5'
          }
        ];
  }]);
