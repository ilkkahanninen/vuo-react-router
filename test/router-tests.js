/*jslint node: true*/
/*global describe, it*/
"use strict";

var assert = require('assert');

describe("Router", function () {
  
  it("works", function () {
    var
      Action = require('../lib/RouterAction'),
      Store = require('../lib/RouterStore');
    
    Action.addMap('default', {
      '/foo/:id': null
    });
    
    Action.start();
    Action.goto('/foo/123');
  });
  
});