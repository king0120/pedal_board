(function(){
  'use strict';

  angular.module('pedalBoardApp')
    .controller('TunerCtrl', function ($scope) {
      $scope.message = 'Hello';
      var ctx = new AudioContext();
      tsw.context(ctx);

      console.log(tsw.context());

      tsw.getUserAudio(function (stream) {
        tsw.connect(stream, tsw.speakers);
      });
    });

})();
