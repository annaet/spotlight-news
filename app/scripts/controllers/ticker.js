'use strict';

/**
 * @ngdoc function
 * @name spotlightNewsApp.controller:TickerCtrl
 * @description
 * # TickerCtrl
 * Controller of the spotlightNewsApp
 */
angular.module('spotlightNewsApp')
  .controller('TickerCtrl', function ($scope, $http) {
    $scope.diseases = ['Diabetes', 'COPD', 'Infarction', 'Asthma', 'Depression', 'Cancer', 'Hypertension', 'HCV', 'HIV', 'Pneumonia'];
    $scope.stats = {};

    var get = function(disease) {
      var url = 'https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=671dd1efc15d076a80954f5a121585d7fdd5ebbc&start=now-15d&end=now&timeSlice=7d&outputMode=json&return=enriched.url.url,enriched.url.title&q.enriched.url.title=' + disease + '&q.enriched.url.entities.entity.type=drug';

      $http.get(url).then(function(data) {
        var slices = data.data.result.slices;
        var start = slices[slices.length - 2];
        var end = slices[slices.length - 1];

        $scope.stats[disease] = {
          start: start,
          end: end,
          change: ((end - start) / start * 100).toFixed(2)
        };
      });
    };

    for (var i = 0; i < $scope.diseases.length; ++i) {
      var disease = $scope.diseases[i];
      get(disease);
    }
  });
