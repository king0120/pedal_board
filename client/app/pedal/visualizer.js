(function(){
  'use strict';

  angular.module('pedalBoardApp').factory('visualizer', function(){
    return function (audioData){
      audioData.fftSize = 2048;
      var bufferLength = audioData.fftSize;
      var dataArray = new Uint8Array(bufferLength);
      audioData.getByteTimeDomainData(dataArray);
      var canvas = document.getElementById('visualizer');
      var ctx = canvas.getContext('2d');
      var width = canvas.width;
      var height = canvas.height;

      ctx.clearRect(0,0, width, height);
      function draw(){
        requestAnimationFrame(draw);
        audioData.getByteTimeDomainData(dataArray);
        ctx.fillStyle = 'rgb(200,200,200)';
        ctx.fillRect(0,0,width,height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.beginPath();

        var sliceWidth = 500 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = v * height/2;
          if(i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
          ctx.lineTo(width, height/2);
          ctx.stroke();
        }

        draw();

      };
});
})();
