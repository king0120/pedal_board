//Connect Audio Service
(
 function(){
  'use strict';


angular.module('pedalBoardApp').factory('connect', ['visualizer', function(visualizer){

    var audioCtx = new AudioContext();
    var source;

    function startAudioStream(nav, ctx){
      var stream  = nav.getUserMedia({
        audio:true
      }, function(stream){
        //set up variables
        var analyser, outputMix, dryGain, wetGain,effectInput;

        //Grab streaming audio

        source = ctx.createMediaStreamSource(stream);

        //Create effects nodes
        outputMix = ctx.createGain();

        outputMix.gain.value = 0;
        dryGain = ctx.createGain();
        dryGain.gain.value = 0;
        wetGain = ctx.createGain();
        wetGain.gain.value = 0;
        effectInput = ctx.createGain();
        effectInput.gain.value = 0;
        analyser = ctx.createAnalyser();
        source.connect(analyser);
        source.connect(dryGain);
        source.connect(wetGain);
        source.connect(effectInput);
        dryGain.connect(outputMix);
        wetGain.connect(outputMix);
        effectInput.connect(outputMix);
        //outputMix.connect(ctx.destination);
        //source.connect(ctx.destination);
        console.log(visualizer);
        visualizer(analyser);
        console.log(source);
        return source;
        },
        //Use canvas element to create waveform visualization
      function(err){
        console.log('Ran into the following error: ' + err);
      });

      return stream;
    }

  function createDelay(){
    console.log(audioCtx);
    console.log('filters!');
    var delayNode = audioCtx.createDelay();
        delayNode.delayTime.value = 3;

    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 0;

    gainNode.connect(delayNode);
    delayNode.connect(audioCtx.destination);
    console.log('audioCtx');
    console.log(audioCtx);
  }
  console.log(source);
  return {
    audioCtx: audioCtx,
    source: source,
    delay: createDelay,
    navigator: navigator,
    startAudioStream: startAudioStream
};
}
]);

})();
