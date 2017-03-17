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
  }])
  .controller('UploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    // upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        console.log('upload file');
        Upload.upload({
            url: 'api/upload',
            data: {file: file, 'username': $scope.username}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
}]);
