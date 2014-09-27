// js/collections/todos.js

var app = app || {};

// Todo collections
// ----------------

// The collection of todo is backed by 'localstorage' instad of a remote server
var TodoList = Backbone.Collection.extend({
  // Reference to this collection's model
  model: app.Todo,

  // Save all of the todo items unser the 'todos-backbone' namespace
  localStorage: new Backbone.LocalStorage('todos-backbone'),

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

app.Todos = new TodoList();