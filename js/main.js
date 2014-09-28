require.config({
  baseUrl:'./js/',
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    text: 'lib/require/text'
  },
  shim: {
    'underscore': {
      deps: ['jquery'],
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'backbone'
    }
  }
});

var ENTER_KEY = 13;

var AppState = {};

require(['views/app', 'routers/router'], function(AppView){
  var app_view = new AppView;
});