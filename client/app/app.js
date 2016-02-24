'use strict';

angular.module('pedalBoardApp', [
  'pedalBoardApp.auth',
  'pedalBoardApp.admin',
  'pedalBoardApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
