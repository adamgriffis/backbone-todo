// js/views/js

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/todos',
  'views/todo',
  'text!templates/stats.html'
  ], function($, _, Backbone, Todos, TodoView, statsTemplate){

  var AppView = Backbone.View.extend({
    // Instead of generating of new element, bind to the existing skeleton of the app present in the HTML
    el: "#todoapp",

    // Out template for the line of statistics at the bottom of the app
    statsTemplate: _.template( statsTemplate ),

    events: {
      'keypress #new-todo' : 'createOnEnter',
      'click #clear-completed' : 'clearCompleted',
      'click #toggle-all' : 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the 'Todos' collection, when items are added or changed
    initialize: function() {
      this.allCheckbox = this.$("#toggle-all")[0];
      this.$input = this.$("#new-todo");
      this.$footer = this.$("#footer");
      this.$main = this.$("#main");
      this.$list = this.$("#todo-list");

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);

      this.listenTo(Todos, 'change:completed', this.filterOne);
      this.listenTo(Todos, 'filter', this.filterAll);
      this.listenTo(Todos, 'all', this.render);

      Todos.fetch();
    },

    // Render the app just means refreshing the statisitics -- the rest of the app doesn't change
    render: function() {
      var completed = Todos.completed().length;
      var remaining = Todos.remaining().length;

      if ( Todos.length ) {
        this.$main.show();
        this.$footer.show();
        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$("#filters li a")
          .removeClass('selected')
          .filter('[href="#/' + (AppState.TodoFilter || '') + '"]')
          .addClass("selected");
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    // Add a single todo item to the list by creating a view for it, and appending its element to the <ul>
    addOne: function (todo) {
      var view = new TodoView({model: todo});
      this.$list.append( view.render().el );
    }, 

    // Add all of the items in the **Todos** collection at once
    addAll: function() {
      this.$list.html(''); // reset the existing display list
      Todos.each(this.addOne, this); // add all items independently
    },

    filterOne: function(todo) {
      todo.trigger('visible');
    }, 

    filterAll: function() {
      Todos.each(this.filterOne, this);
    },

    // Generate the attributes for a new Todo item
    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: Todos.nextOrder(),
        completed: false
      };
    },

    // If you hit return on the main input field, create a new Todo model, persisting in local storage
    createOnEnter: function(event) {
      // only create if the key supplied was enter and there's a title in the input field
      if (event.which !== ENTER_KEY || !this.$input.val().trim() ) {
        return;
      }

      Todos.create( this.newAttributes() );
      this.$input.val('');
    },

    // Clear all completed todo items, destroying their models
    clearCompleted: function() {
      _.invoke(Todos.completed(), 'destroy');
      return false;
    },

    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      Todos.each(function(todo) {
        todo.save({
          'completed': completed
        });
      });
    }
  });

  return AppView;
});