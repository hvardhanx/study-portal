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
              name: 'Cormen',
              suggestions: 'Great in-depth resource with mathematical proofs'
          }, {
              name: 'Dasgupta Vazirani',
              suggestions: 'C++ implementations'
          }, {
              name: 'Robert Sedgewick',
              suggestions: 'Java algorithms'
          }
        ];
  }]);

