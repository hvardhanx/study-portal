'use strict';

/**
 * @ngdoc function
 * @name studyPortalApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the studyPortalApp
 */
angular.module('studyPortalApp')
  .controller('RegisterCtrl', ['$scope', '$rootScope', '$location', '$cookieStore', 'RegService', 'REG_EVENTS', 'userService',
  function($scope, $rootScope, $location, $cookieStore, RegService, REG_EVENTS, userService) {
    $scope.credentials = {
        username: '',
        password: '',
        contact: '',
        email: ''
    };

    $scope.register = function(credentials) {
        RegService.register(credentials).then(function(user) {
            $rootScope.$broadcast(REG_EVENTS.registerSuccess);
            $scope.setCurrentUser(null);
            $location.path('/home');
            userService.user.isLogged = false;
            $cookieStore.put('loggedin', null);
        }, function() {
            $rootScope.$broadcast(REG_EVENTS.registerFailed);
            $cookieStore.put('loggedin', null);
        });
    };
}])
// Communicating session changes
.constant('REG_EVENTS', {
  registerSuccess: 'reg-register-success',
  registerFailed: 'reg-register-failed',
  notAuthorized: 'reg-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})
// The RegService
.factory('RegService', function($http, Session) {
  var regService = {};

  regService.register = function(credentials) {
    return $http
    .post('http://localhost:8080/api/signup', credentials)
    .then(function(res) {
      Session.create(res.data.id, res.data.user.id,
                     res.data.user.role);
                     return res.data.user;
    });
  };

  regService.isAuthenticated = function() {
    return !!Session.userId;
  };

  regService.isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (regService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);

  };

  return regService;
})
.service('Session', function() {
  this.create = function(sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function() {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
});
