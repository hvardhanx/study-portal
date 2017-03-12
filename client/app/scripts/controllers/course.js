'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('CourseCtrl', ['$http', function($http) {
  	var req = $http.get('/api/users');
  	var scope = this;
  	req.then(function (res) {
      scope.awesomeUsers = res.data.users;
    });
    req.catch(function (err) {
      console.log(err);
    });
  }]);

