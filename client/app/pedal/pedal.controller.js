(function() {
'use strict';

function PedalsController(connect, $http) {

  var vm = this;
  vm.all = [];
  vm.audioCtx = connect.audioCtx;
  vm.delay = connect.delay;
  vm.navigator = connect.navigator;
  vm.startAudioStream = startAudio;
  vm.closeAudioStream = closeAudioStream;
  vm.playing = false;
  vm.gainLevel = 0;

  function startAudio (){
    navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia);
    if(navigator.getUserMedia){
      console.log('Connected!');
      var testSource = connect.startAudioStream(navigator, vm.audioCtx);
      console.log(testSource)
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
    console.log(vm.source);
    findPedal('test');
    var gainNode = vm.audioCtx.createGain();
    var levelDistortion = $('#levelDistortion').val();
    gainNode.gain.value = levelDistortion/10;
    console.log(levelDistortion);
    gainNode.connect(vm.audioCtx.destination);
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


  function getPedals(){
    $http.get('/api/pedals')
         .then(function(response){
          vm.all = response.data;
         });
  }
  vm.getPedals = getPedals();

  function findPedal(pedalType){
    console.log(vm.all);
  }
  getPedals();

}

  angular.module('pedalBoardApp').controller('PedalsController', ['connect', '$http', PedalsController]);

})();
