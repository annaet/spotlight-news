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

<<<<<<< HEAD
  var geographicMap = {
    name: 'geographicMap',
    url: '/geomap',
    templateUrl: '../views/geographicMap.html',
    controller: 'GeomapCtrl'
=======
  var ticker = {
    name: 'ticker',
    url: '/ticker',
    templateUrl: '../views/ticker.html',
    controller: 'TickerCtrl'
>>>>>>> 954561eca2c970b81cc8e57cefde1bbad3d95fcf
  };

  $stateProvider.state(main);
  $stateProvider.state(treemap);
  $stateProvider.state(search);
<<<<<<< HEAD
  $stateProvider.state(geographicMap);
=======
  $stateProvider.state(ticker);
>>>>>>> 954561eca2c970b81cc8e57cefde1bbad3d95fcf
});
