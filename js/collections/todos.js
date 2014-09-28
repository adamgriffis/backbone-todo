// js/collections/todos.js

// Todo collections
// ----------------

// The collection of todo is backed by 'localstorage' instad of a remote server
define([
  'underscore',
  'backbone',
  'lib/backbone.localstorage',
  'models/todo'
  ], function(_, Backbone, Store, Todo){

  var TodoList = Backbone.Collection.extend({
    // Reference to this collection's model
    model: Todo,

    // Save all of the todo items unser the 'todos-backbone' namespace
    localStorage: new Store('todos-backbone'),

    // Filter down the list of all todos items that are finished
    completed: function() {
      return this.filter(function( todo ) {
        return todo.get('completed')
      });
    }, 

    // Filter down the list of all todos items that are not finished
    remaining: function() {
      return this.without.apply(this, this.completed() );
    },

    // We keep the Todos in sequential order
    nextOrder: function() {
      if ( !this.length ) {
        return 1;
      }

      return this.last().get('order') + 1;
    }, 

    comparator: function( todo ) {
      return todo.get('order');
    }
  });

  return new TodoList();
});