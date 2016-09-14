'use strict';

/**
 * @ngdoc function
 * @name spotlightNewsApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the spotlightNewsApp
 */
angular.module('spotlightNewsApp')
  .controller('SummaryCtrl', function ($scope, $window) {
    var d3 = $window.d3;

    $scope.question = "http://www.healthline.com/diabetesmine/lyfebulb-encouraging-diabetes-patient-entrepreneurs";

    $scope.submitFunction = function() {
        var givenURL = $scope.question;
        var generatedJSON = "https://gateway-a.watsonplatform.net/calls/url/URLGetRelations?apikey=29b0e2628cc366afb201bdf3b11d7338fc1bb14a&outputMode=json&maxRetrieve=20&url=" + givenURL + "&return=enriched.url.url,enriched.url.title";

        var sentenceArray = [];

        var result;
        d3.json(generatedJSON, function(error, data) {
          if (error) {
            throw error;
          }
        // $.getJSON(generatedJSON, function (data) {
            result = data;

            for (var i = 0; i < result.relations.length; i++) {
                if (result.relations[i].subject && result.relations[i].action && result.relations[i].object) {
                    var tempSentence = result.relations[i].subject.text + " " + result.relations[i].action.text + " " + result.relations[i].object.text;
                    sentenceArray.push(tempSentence);

                }

            }

            var stringOutput = "";
            for (var i = 0; i < sentenceArray.length; i++) {
                stringOutput = stringOutput + String(sentenceArray[i]) + "\n";
            }
            document.getElementById("response").innerHTML = stringOutput;
        });
    };
  });
