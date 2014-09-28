// js/routers/router.js

// Todo router
// -----------

define(['collections/todos', 'backbone'], function(Todos, Backbone) {
  var Workspace = Backbone.Router.extend({
    routes: {
      '*filter' : 'setFilter'
    },

    setFilter: function( param ) {
      // Set the current filter to be used
      AppState.TodoFilter = param;

      // Trigger a collection filter event, causing hiding / unhiding of Todo view items
      Todos.trigger('filter');
    }
  });

  var TodoRouter = new Workspace();

  Backbone.history.start();

  return TodoRouter;
});