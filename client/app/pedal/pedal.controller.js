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

  vm.distortion = function(){
     if (!vm.waveshaper){
        vm.waveshaper = new WaveShaper( vm.audioCtx );
     }

    vm.waveshaper.output.connect( vm.dryGain );
    vm.waveshaper.setDrive(5.0);
    return vm.waveshaper.input;
  };


  vm.changeEffects = function(){
    vm.closeAudioStream();
    vm.changeGain();
    vm.addDelay();
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


  // Copyright 2011, Google Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var threshold = -27; // dB
var headroom = 21; // dB
var x;

function e4(x, k)
{
    return 1.0 - Math.exp(-k * x);
}

function dBToLinear(db) {
    return Math.pow(10.0, 0.05 * db);
}

function shape(x) {
    var linearThreshold = dBToLinear(threshold);
    var linearHeadroom = dBToLinear(headroom);

    var maximum = 1.05 * linearHeadroom * linearThreshold;
    var kk = (maximum - linearThreshold);

    var sign = x < 0 ? -1 : +1;
    var absx = Math.abs(x);

    var shapedInput = absx < linearThreshold ? absx : linearThreshold + kk * e4(absx - linearThreshold, 1.0 / kk);
    shapedInput *= sign;

    return shapedInput;
}

function generateColortouchCurve(curve) {
    var n = 65536;
    var n2 = n / 2;

    for (var i = 0; i < n2; ++i) {
        x = i / n2;
        x = shape(x);

        curve[n2 + i] = x;
        curve[n2 - i - 1] = -x;
    }

    return curve;
}

function generateMirrorCurve(curve) {
    var n = 65536;
    var n2 = n / 2;

    for (var i = 0; i < n2; ++i) {
        x = i / n2;
        x = shape(x);

        curve[n2 + i] = x;
        curve[n2 - i - 1] = x;
    }

    return curve;
}

function WaveShaper(context) {
    this.context = context;
    var waveshaper = context.createWaveShaper();
    var preGain = context.createGain();
    var postGain = context.createGain();
    preGain.connect(waveshaper);
    waveshaper.connect(postGain);
    this.input = preGain;
    this.output = postGain;

    var curve = new Float32Array(65536); // FIXME: share across instances
    generateColortouchCurve(curve);
    waveshaper.curve = curve;
}

WaveShaper.prototype.setDrive = function(drive) {
    if (drive < 0.01) drive = 0.01;
    this.input.gain.value = drive;
    var postDrive = Math.pow(1 / drive, 0.6);
    this.output.gain.value = postDrive;
}

})();
