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
    $scope.disqusConfig = {
      disqus_shortname: 'rishabhstr',
      disqus_identifier: '',
      disqus_url: ''
    };
    $scope.course = { name: 'Data Structures and Algorithms' };
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

