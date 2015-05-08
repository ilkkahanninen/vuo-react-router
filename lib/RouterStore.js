/*jslint node: true*/
"use strict";

var
  Vuo = require("vuo"),
  RouterAction = require('./RouterAction'),
  assign = require('object-assign'),
  Parser = require('route-parser');

module.exports = Vuo.Store.create({
  
  listeners: function ($) {
    
    /*
     *
     */
    function updateCurrentMap() {
      var
        currentMap = [],
        map = {},
        maps = $.state.maps,
        mapNames = ['default'],
        path,
        route;
      
      if ($.state.callback) {
        mapNames = $.state.callback();
      }
      
      mapNames.forEach(function (name) {
        if (!maps[name]) {
          throw new Error("Router map not found: " + name);
        }
        assign(map, maps[name]);
      });
      
      for (path in map) {
        if (map.hasOwnProperty(path)) {
          currentMap.push({
            path: new Parser(path),
            test: path
          });
        }
      }
      
      $.setState({currentMap: currentMap});
    }
    
    /*
     *
     */
    function matchRoute(url) {
      var map = $.state.currentMap, i, match, route;
      for (i = 0; i < map.length; i += 1) {
        route = map[i];
        match = route.path.match(url);
        if (match) {
          return {
            views: route.views,
            params: match
          };
        }
      }
    }
    
    /*
     *
     */
    $.on(RouterAction.ADD_MAP, function (payload) {
      $.setState({
        maps: assign($.state.maps, payload.value)
      });
    });
    
    $.on(RouterAction.SET_UPDATE_LISTENERS, function (payload) {
      $.removeListeners($.state.listenActions);      
      $.setState({listenActions: payload.value});
      $.on($.state.listenActions, function (payload) {
        // TODO: 
      });
    });
    
    $.on(RouterAction.SET_MAP_SELECT_CALLBACK, "callback");
    
    $.on(RouterAction.START, function () {
      updateCurrentMap();
    });
    
    $.on(RouterAction.GOTO, function (payload) {
      var route = matchRoute(payload.value);
      if (!route) {
        throw new Error('Could not resolve route: ' + payload.value);
      }
      $.setState({route: route});
    });
    
  },
  
  state: function ($) {
    $.define("route").is("object");
    $.define("currentMap").is("array").init([]).protect();
    $.define("maps").is("object").init({}).protect();
    $.define("listenActions").is("array").init([]).protect();
    $.define("callback").is("undefined, array").protect();
  }
  
});
