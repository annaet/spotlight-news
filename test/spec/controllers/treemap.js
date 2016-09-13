'use strict';

describe('Controller: TreemapCtrl', function () {

  // load the controller's module
  beforeEach(module('spotlightNewsApp'));

  var TreemapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TreemapCtrl = $controller('TreemapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TreemapCtrl.awesomeThings.length).toBe(3);
  });
});
