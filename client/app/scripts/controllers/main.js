'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('MainCtrl', ['$http', function($http) {
  	var req = $http.get('/api/users');
  	var scope = this;
  	req.then(function (res) {
      scope.awesomeUsers = res.data.users;
    });
    req.catch(function (err) {
      console.log(err);
    });
    scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
