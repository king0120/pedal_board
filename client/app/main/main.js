'use strict';

angular.module('pedalBoardApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('pedals', {
        url: '/pedals',
        templateUrl: 'app/pedal/pedal.html',
        controller: 'PedalsController',
        controllerAs: 'pedals'
      })
      .state('tuner', {
        url: '/tuner',
        templateUrl: 'app/tuner/tuner.html',
        controller: 'TunerCtrl',
        controllerAs: 'tuner'
      });
  });
