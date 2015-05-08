/*jslint node: true*/
"use strict";

var ActionCreator = require("vuo").ActionCreator;

module.exports = ActionCreator.create("VuoRouter")

  // Location actions
  .action("goto")
  .action("replace")
  .action("back")
  .action("forward")

  // Configuration actions
  .action("addMap", function (name, map) {
    var payload = {};
    payload[name] = map;
    this.dispatch({value: payload});
  })
  .action("setUpdateListeners")
  .action("setMapSelectCallback")
  .action("start")

  // Publish
  .publicAPI();
