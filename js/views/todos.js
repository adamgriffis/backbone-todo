// js/views/todos.js

var app = app || {};

// Todo Item View
// --------------

// The DOM element for a todo item
app.TodoView = Backbone.View.extend({
  // this element is a list tag
  tagName: 'li',

  // Cache the template function for a single item
  template: _.template( $("#item-template").html() ),

  events: {
    'dblclick label' : 'edit',
    'click .destroy' : 'clear',
    'keypress .edit' : 'updateOnEnter',
    'blur .edit': 'close',
    'click .toggle' : 'toggleCompleted'
  },

  // The TodoView listens for changes to its modle, rerendering. Since there's a one-to-one correspondence between a 
  // **Todo** and a **TodoView** in this app, we set a direct reference on the model for convenience
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // Rerenders the titles of the todo item.
  render: function() {
    this.$el.html( this.template(this.model.toJSON() ) );

    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();

    this.$input = this.$('.edit');

    return this;
  },

  // Toggles visibility of item
  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden());
  }, 

  // Determines if item should be hidden
  isHidden: function() {
    var isCompleted = this.model.get('completed');

    return (
      (!isCompleted && app.TodoFilter === 'completed') || (isCompleted && app.TodoFilter === 'active')
    );
  },

  // Toggle the 'completed' state of the model
  toggleCompleted: function() {
    this.model.toggle();
  },

  // Switch the view into 'editing' mode, displaying the input field
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // Close the editing mode, saving changes to the todo
  close: function() {
    var value = this.$input.val().trim();

    if ( value ) {
      this.model.save({ title: value });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  },

  // If you hit 'ender', we're through editing the item.
  updateOnEnter: function(e) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  clear: function() {
    this.model.destroy();
  },
});