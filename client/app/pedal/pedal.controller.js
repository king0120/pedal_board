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
  vm.stompBox = stompBox;

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

        //Overdrive Pedal
          vm.dryGain = ctx.createGain();
          vm.dryGain.gain.value = vm.gainLevel;
          vm.dryGainLevel = vm.dryGain.gain.value;

          vm.distortion = ctx.createWaveShaper();
          vm.distortion.curve = makeDistortionCurve(400 * vm.drive/100);




        //Delay Pedal

          vm.delayNode = ctx.createDelay();
          vm.delayNode.delayTime.value = vm.delayTime/10;
          var feedback = ctx.createGain();
         feedback.gain.value = vm.repeat/100;
          console.log('delay time');
          console.log(vm.delayNode.delayTime);
          vm.delayNode.connect(feedback);
          feedback.connect(vm.delayNode);




        analyser = ctx.createAnalyser();

        //connections
        vm.source.connect(analyser);
        vm.source.connect(vm.dryGain);

        vm.dryGain.connect(ctx.destination);
        vm.dryGain.connect(vm.delayNode);
        vm.source.connect(vm.delayNode);
        vm.delayNode.connect(vm.distortion);
        vm.source.connect(vm.distortion);
        vm.distortion.connect(ctx.destination);

        vm.delayNode.connect(ctx.destination);

        visualizer(analyser);

        },
        //Use canvas element to create waveform visualization
      function(err){
        console.log('Ran into the following error: ' + err);
      });

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
    vm.repeat = repeatDelay;
    console.log(vm.repeat);
  };

  vm.addDrive =function(){
    console.log('add drive');
    var driveDistortion = $('#driveDistortion').val();
    vm.drive = driveDistortion;
  };


  function makeDistortionCurve(amount) {
    console.log('makeDistortionCurve');
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
    if($('#Distortion').hasClass('on')){
      vm.changeGain();
      vm.addDrive();
    }
    if($('#Delay').hasClass('on')){
      vm.addDelay();
      vm.addRepeat();
    }
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
  function stompBox(pedal){
    pedal.active = !pedal.active;
    vm.changeEffects();
  }


}


  angular.module('pedalBoardApp').controller('PedalsController',
                                             [
                                             '$http',
                                             'visualizer',  PedalsController]);

})();
