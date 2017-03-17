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

    var semester = $cookieStore.get("semester");
    var branch = $cookieStore.get("branch");

    $scope.courses = [{
              id: 1,
              name: 'Data Communication',
              type: 'Theory',
              credits: 4
          }, {
              id: 1,
              name: 'Operating Systems',
              type: 'Theory',
              credits: 3
          }, {
              id: 1,
              name: 'Database Management Systems',
              type: 'Theory',
              credits: 4
          }, {
              id: 1,
              name: 'Design and Analysis of algorithms',
              type: 'Practical',
              credits: 2
          }
        ];
  }]);
