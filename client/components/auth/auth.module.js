'use strict';

angular.module('pedalBoardApp.auth', [
  'pedalBoardApp.constants',
  'pedalBoardApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
