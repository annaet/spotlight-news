'use strict';

/**
 * @ngdoc function
 * @name spotlightNewsApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the spotlightNewsApp
 */
angular.module('spotlightNewsApp')
  .controller('SearchCtrl', function ($scope, $http) {
    $scope.disease = 'diabetes';
    $scope.drug = 'metformin';

    $scope.submit = function() {
      var url = 'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=671dd1efc15d076a80954f5a121585d7fdd5ebbc&start=now-60d&end=now&count=50&outputMode=json&return=enriched.url.url,enriched.url.title&q.enriched.url.title=' + $scope.disease + '&q.enriched.url.entities.entity=|text=' + $scope.drug + ',type=drug|';

      $http.get(url).then(function(data) {
        $scope.results = data.data.result.docs;
      });
    };
  });
