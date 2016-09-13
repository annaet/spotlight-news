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

    var color = d3.scale.category20c();

    var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.size; });

    var div = d3.select(".treemap-container")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

    var url = "https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey=671dd1efc15d076a80954f5a121585d7fdd5ebbc&start=now-7d&end=now&outputMode=json&return=enriched.url.url,enriched.url.title,enriched.url.enrichedTitle.docSentiment.score,enriched.url.entities.entity.text,enriched.url.entities.entity.relevance,enriched.url.entities.entity.sentiment.score,enriched.url.entities.entity.type&q.enriched.url.title=Depression&q.enriched.url.entities.entity.type=drug";

    var docs = [];

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

    var flare = {
      name: "flare",
      children: []
    };

          // "name": "cluster",
          // "children": [{
          //   "name": "AgglomerativeCluster", "size": 3938},
          //   {"name": "CommunityStructure", "size": 3812},
          //   {"name": "HierarchicalCluster", "size": 6714},
          //   {"name": "MergeEdge", "size": 743}
          // ]
          // }
          // }

    d3.json("../../json/diabetes.json", function(error, data) {
      if (error) {
        throw error;
      }

      var docs = data.result.docs;
      var entities = {};

      var acceptedConcepts = [
        'anatomy',
        'country',
        'drug',
        'healthcondition',
        'organisation'
      ];

      for (var i = 0; i < docs.length; ++i) {
        var doc = docs[i];
        var docEntities = doc.source.enriched.url.entities;

        for (var j = 0; j < docEntities.length; ++j) {
          var entity = docEntities[j];
          var type = entity.type.toLowerCase();
          var text = entity.text.toLowerCase();

          if (!entities[type]) {
            entities[type] = {};
          }

          if (entities[type][text]) {
            entities[type][text].push(entity.relevance);
          } else {
            entities[type][text] = [entity.relevance];
          }
        }
      }

      for (var concept in entities) {
        if (acceptedConcepts.indexOf(concept) > -1) {
          var child = {
            name: concept,
            children: []
          };

          for (var entity in entities[concept]) {
            var relevances = entities[concept][entity];
            var avg = 0;

            for (var k = 0; k < relevances.length; ++k) {
              avg += relevances[k];
            }

            avg = avg/relevances.length;
            child.children.push({
              name: entity,
              size: avg
            });
          }

          flare.children.push(child);
        }
      }

      console.log(entities);
      console.log(flare);

      // flare.children.

      var node = div.datum(flare).selectAll(".node")
          .data(treemap.nodes)
        .enter().append("div")
          .attr("class", "node")
          .call(position)
          .style("background", function(d) { return d.children ? color(d.name) : null; })
          .text(function(d) { return d.children ? null : d.name; });

      d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
            ? function() { return 1; }
            : function(d) { return d.size; };

        node
            .data(treemap.value(value).nodes)
          .transition()
            .duration(1500)
            .call(position);
      });
    });

    function position() {
      this.style("left", function(d) { return d.x + "px"; })
          .style("top", function(d) { return d.y + "px"; })
          .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
          .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
    }
  });
