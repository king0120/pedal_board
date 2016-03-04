(function() {
'use strict';

function PedalsController($http, visualizer) {

  var vm = this;
  vm.all = [];
  vm.audioCtx = new AudioContext();
  vm.source;
  vm.dryGain;
  vm.dryGainLevel;
  vm.navigator;
  vm.startAudioStream = startAudio;
  vm.closeAudioStream = closeAudioStream;
  vm.playing = false;
  vm.gainLevel = 0;
  vm.delayTime = 0;
  vm.dryGain;
  vm.repeat = 0;
  vm.waveshaper = null;

  console.log(vm.dryGain);

  function startAudioStream(nav, ctx){
      nav.getUserMedia({
        audio:true
      }, function(stream){
        //set up variables
        var analyser, outputMix, dryGain, wetGain,effectInput;

        //Grab streaming audio

        vm.source = ctx.createMediaStreamSource(stream);

        //Create effects nodes
        outputMix = ctx.createGain();

        outputMix.gain.value = 1;
        vm.dryGain = ctx.createGain();
        vm.dryGain.gain.value = vm.gainLevel;
        vm.dryGainLevel = vm.dryGain.gain.value;


        vm.delayNode = ctx.createDelay();
        vm.delayNode.delayTime.value = vm.delayTime/5;
        console.log('delay time');
        console.log(vm.delayNode.delayTime);
        // console.log('gain value');
        // console.log(vm.dryGainLevel);
        // console.log(vm.dryGain.gain.value);
        wetGain = ctx.createGain();
        wetGain.gain.value = 1;
        effectInput = ctx.createGain();
        effectInput.gain.value = 1;
        analyser = ctx.createAnalyser();
        vm.source.connect(analyser);
        vm.source.connect(vm.dryGain);
        vm.source.connect(wetGain);
        vm.source.connect(effectInput);
        vm.distortion = ctx.createWaveShaper();
        vm.distortion.curve = makeDistortionCurve(400 * vm.drive/100)
        vm.dryGain.connect(vm.delayNode);
        vm.dryGain.connect(ctx.destination);
        for (var i=0; i < vm.repeat; i++){
          var delay = [];
          delay[i] = ctx.createDelay();
          var repeater = vm.delayTime * i;
          delay[i].delayTime.value = repeater;
          delay[i].connect(ctx.destination);
          console.log(delay);
          console.log(ctx.destination);
        }
        vm.delayNode.connect(ctx.destination);
        wetGain.connect(outputMix);
        effectInput.connect(outputMix);
        //outputMix.connect(ctx.destination);
        //vm.source.connect(ctx.destination);
        visualizer(analyser);
        console.log(vm.source);
        },
        //Use canvas element to create waveform visualization
      function(err){
        console.log('Ran into the following error: ' + err);
      });

      // Create delay effect node.
      var delay = delay({
          delayTime: 0.5,
          feedback: 0.2,
          level: 0.5
      });
      // Connect nodes.
      tsw.connect(vm.source, delay, ctx.destination);
      return vm.dryGainLevel;
    }

  function startAudio (){
    navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);
    if(navigator.getUserMedia){
      console.log('Connected!');
      var testSource = startAudioStream(navigator, vm.audioCtx);
      console.log(testSource);
    } else {
      console.log('getUserMedia is not supported on your browser. Try Chrome!');
    }
  }

  function closeAudioStream(){
    if (vm.audioCtx.state === 'running'){
      vm.audioCtx.close();
      vm.audioCtx = new AudioContext();
      console.log(vm.audioCtx);
    }
  }

  vm.changeGain = function (){
    var levelDistortion = $('#levelDistortion').val();
    vm.gainLevel = levelDistortion/10;
    console.log(levelDistortion);
  };

  vm.addDelay = function (){
    var timeDelay = $('#timeDelay').val();
    vm.delayTime = timeDelay/10;
    console.log(vm.delayTime);
  };

  vm.addRepeat = function (){
    var repeatDelay = $('#repeatDelay').val();
    vm.repeat = repeatDelay/10;
    console.log(vm.repeat);
  };

  vm.addDrive =function(){
    var driveDistortion = $('#driveDistortion').val();
    vm.drive = driveDistortion;
  };


  function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
    return curve;
  }

  vm.toggle = function(){
    console.log(vm.playing);
    console.log(vm.audioCtx);
    if (vm.audioCtx.state === 'running'){
      vm.audioCtx.suspend();
    } else if (vm.audioCtx.state === 'suspended'){
      vm.audioCtx.resume();
    }
    vm.playing = !vm.playing;
    return vm.playing;
  };


  vm.changeEffects = function(){
    vm.closeAudioStream();
    vm.changeGain();
    vm.addDelay();
    vm.addDrive();
    vm.addRepeat();
    startAudio();
  };
  function getPedals(){
    $http.get('/api/pedals')
         .then(function(response){
          vm.all = response.data;
         });
  }
  vm.getPedals = getPedals();

  function findPedal(pedalType){
    console.log(pedalType);
    console.log(vm.all);
  }
  getPedals();

}

  angular.module('pedalBoardApp').controller('PedalsController',
                                             [
                                             '$http',
                                             'visualizer',  PedalsController]);

})();
