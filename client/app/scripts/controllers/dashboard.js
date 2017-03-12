'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('DashboardCtrl', ['$scope', function($scope) {
    $scope.courses = [{
              name: 'Data Communication',
              type: 'Theory',
              credits: 4
          }, {
              name: 'Operating Systems',
              type: 'Theory',
              credits: 3
          }, {
              name: 'Database Management Systems',
              type: 'Theory',
              credits: 4
          }, {
              name: 'Design and Analysis of algorithms',
              type: 'Practical',
              credits: 2
          }
        ];
  }]);
