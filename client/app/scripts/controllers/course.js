'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('CourseCtrl', ['$scope', function($scope) {
    $scope.materials = [{
              id: 1,
              name: 'Cormen',
              suggestions: 'Great in-depth resource with mathematical proofs'
          }, {
              id: 1,
              name: 'Dasgupta Vazirani',
              suggestions: 'C++ implementations'
          }, {
              id: 1,
              name: 'Robert Sedgewick',
              suggestions: 'Java algorithms'
          }
        ];
  }]);

