'use strict';

describe('Controller: TunerCtrl', function () {

  // load the controller's module
  beforeEach(module('pedalBoardApp'));

  var TunerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TunerCtrl = $controller('TunerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
