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

  var summary = {
    name: 'summary',
    url: '/summary',
    templateUrl: '../views/summary.html',
    controller: 'SummaryCtrl'
  };

  $stateProvider.state(main);
  $stateProvider.state(treemap);
  $stateProvider.state(summary);
});
