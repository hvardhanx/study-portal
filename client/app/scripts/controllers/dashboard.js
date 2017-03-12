'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('DashboardCtrl', ['$http', function($http) {
  	var req = $http.get('/api/users');
  	var scope = this;
  	req.then(function (res) {
      scope.awesomeUsers = res.data.users;
    });
    req.catch(function (err) {
      console.log(err);
    });
  }]);

