/**
 * Created by alistairmadden on 13/09/2016.
 */

'use strict';

/**
 * @ngdoc function
 * @name spotlightNewsApp.controller:GeographicMapCtrl
 * @description
 * # GeographicMapCtrl
 * Controller of the spotlightNewsApp
 */
angular.module('spotlightNewsApp')

    .controller('GeomapCtrl', function ($scope) {
        $scope.filterData = {
            "date": [1998, 2016],
            "filter": [{'Drug': ["INFLIXIMAB"]}, {"Topic": ["COST STUDIES (CS)"]}]
        };
        $scope.paperList = {"the_list": []};
    })

    .directive('worldMap', ['$parse', '$window', function ($parse, $window) {
        return {
            restrict: 'E',
            link: function (scope, element) {
                var d3 = $window.d3;


                var country_data_map = {};
                var reverse_data_map = {};
                var fullpaperList = [];

                var width = 960,
                    height = 580,
                    scale = 175,
                    active = d3.select(null);


                var min, max;

                //Stores country_code : # of occurences key value pairs
                var map = {};
                var projection = d3.geo.kavrayskiy7()
                    .precision(.1);
                projection.scale(scale).translate([width / 2, height / 2]);


                d3.select("svg").selectAll('*').remove();

                var svg = d3.select('svg')
                    .attr("width", width)
                    .attr("height", height);

                var path = d3.geo.path()
                    .projection(projection);
                svg.append("defs").append("path")
                    .datum({type: "Sphere"})
                    .attr("id", "sphere")
                    .attr("d", path);
                svg.append("use")
                    .attr("class", "stroke")
                    .attr("xlink:href", "#sphere");
                svg.append("use")
                    .attr("class", "fill")
                    .attr("xlink:href", "#sphere");

                var tooltip = d3.select('world-map').append('div')
                    .attr('class', 'hidden tooltip');


                d3.select(self.frameElement).style("height", height + "px");



                d3.json("../../json/JSONLite.json", function (error, litedb) {
                    d3.csv("../../json/slim-2.csv", function (d) {
                        return {
                            code: d.code,
                            name: d.name.toUpperCase()
                        };
                    }, function (error, country_data) {
                        for (var i = 0; i < country_data.length; i++) {
                            country_data_map[country_data[i].code] = country_data[i].name;
                            reverse_data_map[country_data[i].name] = country_data[i].code;
                        }

                        d3.json("../../json/diabetes.json", function (error, diabetes) {
                            for (var i in diabetes.result.docs) {
                                diabetes.result.docs[i].countries = [];
                                for (var j in diabetes.result.docs[i].source.enriched.url.entities) {
                                    if (diabetes.result.docs[i].source.enriched.url.entities[j].type == "Country") {

                                        var alchemy_country = diabetes.result.docs[i].source.enriched.url.entities[j].text;

                                        if (alchemy_country == "US" || alchemy_country == "U.S." || alchemy_country == "United States") {
                                            diabetes.result.docs[i].source.enriched.url.entities[j].text = "USA";
                                        }

                                        if (alchemy_country == "UK" || alchemy_country == "U.K." || alchemy_country == "England", alchemy_country == "Scotland") {
                                            diabetes.result.docs[i].source.enriched.url.entities[j].text = "United Kingdom";
                                        }

                                        var countryCode = reverse_data_map[diabetes.result.docs[i].source.enriched.url.entities[j].text.toUpperCase()];
                                        if (countryCode) {
                                            diabetes.result.docs[i].countries.push(countryCode);
                                            if (map[countryCode]) {
                                                map[countryCode] += 1;
                                            }
                                            else {
                                                map[countryCode] = 1;
                                            }
                                        }
                                    }
                                }
                            }

                            d3.json("../../json/world-50m.json", function (error, world) {
                                if (error) throw error;
                                initialise_map(litedb, scope.filterData.filter, scope.filterData.date, world);

                                scope.$watchCollection('filterData', function (newVal) {// when expData expression changes, execute this
                                    // redraw chart
                                    update_map(litedb, newVal.filter, newVal.date);
                                })
                            });
                        });
                    });
                });


                function initialise_map(litedb, filter_array, date_range, world) {
                    /*for (var i = 0; i < litedb.length; i++) {
                        var d = litedb[i];
                        if (p_date(d, date_range)) {
                            if (p_country(d, filter_array)) {
                                populate_map(d, map);
                            }
                        }
                    }*/
                    scope.paperList.the_list = get_id_list(litedb, filter_array, date_range);
                    fullpaperList = scope.paperList.the_list;

                    var map_keys = Object.keys(map).map(function (d) {
                        return map[d]
                    });


                    max = Math.log(d3.max(map_keys));
                    min = Math.log(d3.min(map_keys));


                    // d3.csv.parse("worldmapdata.csv")
                    var paletteScale = d3.scale.linear()
                        .domain([min, max])
                        //.range(["#ade6bb","#026F38"]); // green color
                        //.range(["#f6ba7f","#d66a00"]); //blue color
                        //.range(["#a7fae6","#006d5d"]); //teal color
                        .range(["#fdd600", "#e71d32"]); //yellow -> red
                        //.range(["#fdd600","#006d5d"]); //yellow -> teal

                    var countries = topojson.feature(world, world.objects.countries).features;


                    svg.selectAll(".country")
                        .data(countries)
                        .enter().insert("path", ".graticule")
                        .attr("class", "country")
                        .attr("d", path)
                        .on("mousemove", function (d, i) {
                            var mouse = d3.mouse(svg.node()).map(function (d) {
                                return parseInt(d);
                            });
                            tooltip.classed("hidden", false)
                                .attr("style", "left:" + (mouse[0] + 25) + "px;top:" + mouse[1] + "px")
                                .html(country_data_map[d.id] + " : " + (map[d.id] ? map[d.id] : 0));
                        })
                        .on("mouseout", function (d, i) {
                            tooltip.classed("hidden", true);
                        })
                        .on('click', function (d) {
                            clicked(this, d, litedb)
                        })
                        .style("fill", "#c8d2d2")
                        .transition()
                        .duration(3000)
                        // for all countries
                        .style("fill", function (d) {
                            if (map[d.id]) {
                                return paletteScale(Math.log(map[d.id]) || 0);
                            } else {
                                return "#c8d2d2";
                            }
                        });
                    svg.insert("path", ".graticule")
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                            return a !== b;
                        }))
                        .attr("class", "boundary")
                        .attr("d", path);
                }


                function update_map(litedb, filter_array, date_range) {
                    map = {};
                    for (var i = 0; i < litedb.length; i++) {
                        var d = litedb[i];
                        if (p_date(d, date_range)) {
                            if (p_country(d, filter_array)) {
                                populate_map(d, map);
                            }
                        }
                    }
                    scope.paperList.the_list = get_id_list(litedb, filter_array, date_range);
                    fullpaperList = scope.paperList.the_list;
                    var map_keys_1 = Object.keys(map).map(function (d) {
                        return map[d]
                    });

                    var max_1 = Math.log(d3.max(map_keys_1));
                    var min_1 = Math.log(d3.min(map_keys_1));

                    var paletteScale = d3.scale.linear()
                        .domain([min_1, max_1])
                        //.range(["#ade6bb","#026F38"]); // green color
                        //.range(["#f6ba7f","#d66a00"]); //blue color
                        //.range(["#a7fae6","#006d5d"]); //teal color
                        .range(["#fdd600", "#e71d32"]); //yellow -> red
                    //.range(["#fdd600","#006d5d"]); //yellow -> teal

                    d3.selectAll(".country")
                        .transition().duration(3000)
                        .style("fill", function (d) {
                            if (map[d.id]) {
                                return paletteScale(Math.log(map[d.id]) || 0);
                            } else {
                                return "#c8d2d2";
                            }
                        });
                }

                function clicked(element, d, litedb) {
                    var this_date_range = scope.filterData.date;
                    if (active.node() === element) return reset();
                    active.classed("active", false);
                    active = d3.select(element).classed("active", true);
                    var country_filter_array = [];
                    for (var j = 0; j < scope.filterData.filter.length; j++) {
                        country_filter_array.push(scope.filterData.filter[j]);
                    }
                    country_filter_array.push({"Country": [country_data_map[d.id]]});
                    scope.paperList.the_list = get_id_list(litedb, country_filter_array, this_date_range);
                    var bounds = path.bounds(d),
                        dx = bounds[1][0] - bounds[0][0],
                        dy = bounds[1][1] - bounds[0][1],
                        x = (bounds[0][0] + bounds[1][0]) / 2,
                        y = (bounds[0][1] + bounds[1][1]) / 2,
                        scale = .8 / Math.max(dx / width, dy / height),
                        translate = [width / 2 - scale * x, height / 2 - scale * y];


                    svg.transition()
                        .duration(800)
                        .style("stroke-width", 1.5 / scale + "px")
                        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                }

                function reset() {//to "unclick" a country
                    active.classed("active", false);
                    active = d3.select(null);
                    scope.paperList.the_list = fullpaperList;
                    svg.transition()
                        .duration(800)
                        .style("stroke-width", "1.5px")
                        .attr("transform", "");
                }


                function populate_map(d, map_dict) {
                    if (d.Country) {
                        for (var i = 0; i < d.Country.length; i++) {
                            var this_country = reverse_data_map[d.Country[i]]; //delete when changed data
                            if (this_country) {
                                if (map_dict[this_country]) {
                                    map_dict[this_country] += 1;
                                } else {
                                    map_dict[this_country] = 1;
                                }
                            }
                            ;
                        }
                    }
                    ;
                }


                function p_date(d, date_range) {
                    var date = d.DatePresented[1];
                    var to_return = (date >= date_range[0] & date <= date_range[1]);
                    return to_return;
                }


                function p_country(d, filter_array) {
                    var to_return = false;
                    var final_level = 0;
                    for (var level in filter_array)
                        for (var key in filter_array[level]) {
                            for (element in filter_array[level][key]) {
                                if (d[key]) {
                                    if ((d[key].indexOf(filter_array[level][key][element]) >= 0) || filter_array[level][key][element] == '*') {
                                        final_level += 1;
                                        break;
                                    }
                                }
                            }
                        }

                    to_return = (final_level == filter_array.length);
                    return to_return;
                }


                function get_id_list(litedb, filter_array, date_range) {
                    var to_return = [];
                    for (var i = 0; i < litedb.length; i++) {
                        var d = litedb[i];
                        if (p_date(d, date_range)) {
                            if (p_country(d, filter_array)) {
                                //populate_map(d,map);
                                to_return.push(d.ID);
                            }
                        }
                    }

                    return to_return;
                }


            }
        }
    }]);