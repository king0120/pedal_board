(function() {
'use strict';

function PedalsController() {
  console.log('hello world2');
  var vm = this;
  vm.testString = 'hello';
  function overdriveLevel() {
      console.log('Overdrive Level');
  }

  function overdriveDrive() {
      console.log('Overdrive Drive');
  }

  function overdriveTone() {
      console.log('Overdrive Tone');
  }

  function overdriveColor() {
      console.log('Overdrive Color');
  }

  vm.testPedal = [{
      id: 1,
      name: 'Overdrive',
      type: 'Distortion',
      on: false,
      knobs: [{
          name: 'level',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: overdriveLevel()
      }, {
          name: 'drive',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: overdriveDrive()
      }, {
          name: 'tone',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: overdriveTone()
      }, {
          name: 'color',
          value: 0,
          lowRange: 0,
          highRange: 100,
          effect: overdriveColor()
      }]
    }];
  }

  angular.module('pedalBoardApp').controller('PedalsController', PedalsController);
  })();
