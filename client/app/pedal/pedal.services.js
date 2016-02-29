//Connect Audio Service
(
 function(){
  'use strict';

angular.module('pedalBoardApp').service('getPedals', function(){

});


angular.module('pedalBoardApp').factory('connect', ['getPedals', function(){
    navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);


    var audioCtx = new AudioContext();

    if(navigator.getUserMedia){
      console.log('Connected!');
      navigator.getUserMedia({
        audio:true
      }, function(stream){
        var source = audioCtx.createMediaStreamSource(stream);

        var biQuadFilter = audioCtx.createBiquadFilter();
        biQuadFilter.type = 'lowshelf';
        biQuadFilter.frequency.value = 800;
        biQuadFilter.gain.value = 80;

        source.connect(audioCtx.destination);
        // biQuadFilter.connect(audioCtx.destination);
      },
      function(err){
        console.log('Ran into the following error: ' + err);
      });
    } else {
      console.log('getUserMedia is not supported on your browser. Try Chrome!');
  }
  return {
    audioCtx: audioCtx
  };
}]);

})();
