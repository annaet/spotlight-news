'use strict';

describe('Controller: TickerCtrl', function () {

  // load the controller's module
  beforeEach(module('spotlightNewsApp'));

  var TickerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TickerCtrl = $controller('TickerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TickerCtrl.awesomeThings.length).toBe(3);
  });
});
