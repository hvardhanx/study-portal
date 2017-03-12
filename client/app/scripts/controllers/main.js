'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('MainCtrl', ['$http', '$scope', '$location', function($http, $scope, $location) {
    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };
  }]);
