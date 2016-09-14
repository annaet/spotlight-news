'use strict';

/**
 * @ngdoc overview
 * @name spotlightNewsApp
 * @description
 * # spotlightNewsApp
 *
 * Main module of the application.
 */
angular.module('spotlightNewsApp', [
  'ui.router'
])

.config(function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider
  .otherwise('/main');

  var main = {
    name: 'main',
    url: '/main',
    templateUrl: '../views/main.html',
    controller: 'MainCtrl'
  };

  var treemap = {
    name: 'treemap',
    url: '/treemap',
    templateUrl: '../views/treemap.html',
    controller: 'TreemapCtrl'
  };

  var search = {
    name: 'search',
    url: '/search',
    templateUrl: '../views/search.html',
    controller: 'SearchCtrl'
  };

  var geographicMap = {
    name: 'geographicMap',
    url: '/geomap',
    templateUrl: '../views/geographicMap.html',
    controller: 'GeomapCtrl'
  };

  var ticker = {
    name: 'ticker',
    url: '/ticker',
    templateUrl: '../views/ticker.html',
    controller: 'TickerCtrl'
  };

  var dendrogram = {
    name: 'dendrogram',
    url: '/dendrogram',
    templateUrl: '../views/dendrogram.html',
    controller: 'DendrogramCtrl'
  };

  var summary = {
    name: 'summary',
    url: '/summary',
    templateUrl: '../views/summary.html',
    controller: 'SummaryCtrl'
  };

  $stateProvider.state(main);
  $stateProvider.state(treemap);
  $stateProvider.state(search);
  $stateProvider.state(geographicMap);
  $stateProvider.state(ticker);
  $stateProvider.state(dendrogram);
  $stateProvider.state(summary);
});
