'use strict';

/**
 * @ngdoc function
 * @name spotlightNewsApp.controller:TreemapCtrl
 * @description
 * # TreemapCtrl
 * Controller of the spotlightNewsApp
 */
angular.module('spotlightNewsApp')
  .controller('TreemapCtrl', function ($scope, $http, $window) {
    $scope.diseases = ['Diabetes', 'COPD', 'Infarction', 'Asthma', 'Depression', 'Cancer', 'Hypertension', 'HCV', 'HIV', 'Pneumonia'];

    var d3 = $window.d3;

    var margin = {top: 40, right: 10, bottom: 10, left: 10},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category10();

    // var url = "https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=671dd1efc15d076a80954f5a121585d7fdd5ebbc&start=now-7d&end=now&outputMode=json&return=enriched.url.url,enriched.url.title,enriched.url.enrichedTitle.docSentiment.score,enriched.url.entities.entity.text,enriched.url.entities.entity.relevance,enriched.url.entities.entity.sentiment.score,enriched.url.entities.entity.type&q.enriched.url.title=Depression&q.enriched.url.entities.entity.type=drug";

    // var url = "https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=671dd1efc15d076a80954f5a121585d7fdd5ebbc&start=now-7d&end=now&outputMode=json&return=enriched.url.url,enriched.url.title,enriched.url.entities.entity.text,enriched.url.entities.entity.relevance,enriched.url.entities.entity.type&q.enriched.url.title=copd&q.enriched.url.entities.entity.type=drug";

    // $scope.next = function(next) {
    //   var nextUrl = next ? url + '&next=' + next : url;
    //   console.log(nextUrl);

    //   $http.get(nextUrl).then(function(response) {
    //     console.log(response);
    //     var result = response.data.result;
    //     console.log(result);
    //     docs = docs.concat(result.docs);
    //     console.log(docs);

    //     if (result.next) {
    //       $scope.next(result.next);
    //     }
    //   }, function(err) {
    //     console.log(err);
    //   });
    // };
    // $scope.next();

    $scope.acceptedConcepts = [
      'anatomy',
      'continent',
      'drug',
      'healthcondition',
      // 'company'
    ];

    function position() {
      this.style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
          .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
    }

    var drawTreeMap = function(data, container) {
      var flare = {
        name: "flare",
        children: []
      };

      $scope.radio = 'count';
      $scope.usedConcepts = {};
      var entities = {};

      var treemap = d3.layout.treemap()
          .size([width, height])
          .sticky(true)
          .value(function(d) { return d.size; });

      var div = d3.select(container)
          .style("position", "relative")
          .style("width", (width + margin.left + margin.right) + "px")
          .style("height", (height + margin.top + margin.bottom) + "px");

      var docs = data.result.docs;

      for (var i = 0; i < $scope.acceptedConcepts.length; ++i) {
        $scope.usedConcepts[$scope.acceptedConcepts[i]] = true;
      }

      for (var i = 0; i < docs.length; ++i) {
        var doc = docs[i];
        var docEntities = doc.source.enriched.url.entities;

        for (var j = 0; j < docEntities.length; ++j) {
          var entity = docEntities[j];
          var type = entity.type.toLowerCase();
          var text = entity.text.toLowerCase();

          if (!entities[type] && $scope.acceptedConcepts.indexOf(type) > -1) {
            entities[type] = {};
          }

          if (entities[type]) {
            if (entities[type][text]) {
              entities[type][text].relevance.push(entity.relevance);
              entities[type][text].count++;
            } else {
              entities[type][text] = {
                relevance: [entity.relevance],
                count: 1
              };
            }
          }
        }
      }

      for (var concept in entities) {
        var child = {
          name: concept,
          children: []
        };

        for (var entity in entities[concept]) {
          var relevances = entities[concept][entity].relevance;
          var count = entities[concept][entity].count;
          var avg = 0;

          for (var k = 0; k < relevances.length; ++k) {
            avg += relevances[k];
          }

          avg = avg/relevances.length;
          child.children.push({
            name: entity,
            size: avg * avg,
            count: count
          });
        }

        flare.children.push(child);
      }

      console.log(entities);
      console.log(flare);

      var node = div.datum(flare).selectAll(".node")
          .data(treemap.nodes)
        .enter().append("div")
          .attr("class", "node")
          .call(position)
          .style("background", function(d) { return d.children && d.parent ? color(d.name) : null; })
          .style("opacity", function(d) { return d.children && d.parent ? 0.75 : 1; })
          .text(function(d) { return d.children ? null : d.name; })
          .on("mousemove", mousemove)
          .on("mouseout", mouseout);

      $scope.change = function() {
        var value = function(d) {
          if (d.parent.name === 'flare') {
          } else if (d.parent.parent.name === 'flare') {
            if ($scope.usedConcepts[d.parent.name]) {
              if ($scope.radio === "count") {
                return d.count;
              } else {
                return d.size;
              }
            } else {
              return 0;
            }
          }
        };

        node
            .data(treemap.value(value).nodes)
          .transition()
            .duration(1500)
            .call(position);
      };

      d3.selectAll("input").on("change", $scope.change());
    };

    d3.json("../../json/diabetes.json", function(error, data) {
      if (error) {
        throw error;
      } else {
        drawTreeMap(data, ".treemap-container");
      }
    });

    d3.json("../../json/copd.json", function(error, data) {
      if (error) {
        throw error;
      } else {
        drawTreeMap(data, ".treemap-container-copd");
      }
    });

    var mousemove = function(d) {
      var xPosition = d3.event.pageX + 5;
      var yPosition = d3.event.pageY + 5;

      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");
      d3.select("#tooltip #concept")
        .text(d.parent.name);
      d3.select("#tooltip #entity")
        .text(d.name);
      d3.select("#tooltip #count")
        .text('count: ' + d.count);
      d3.select("#tooltip #relevance")
        .text('relevance: ' + d.size.toFixed(2));
      d3.select("#tooltip").classed("hidden", false);
    };

    var mouseout = function() {
      d3.select("#tooltip").classed("hidden", true);
    };
  });
