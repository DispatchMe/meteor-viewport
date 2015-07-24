var _viewports = {};

/**
 * @method ViewPort
 * @param {string} id
 */
Viewport = function (id) {
  var self = this;

  // If the viewport already exists, return it.
  if (_viewports[id]) return _viewports[id];

  if (!(self instanceof Viewport)) return new Viewport(id);

  self.id = id;
  self.isActive = false;

  _viewports[id] = self;
};

// Add a global emitter
Viewport._emitter = new EventEmitter();
Viewport.emit = Viewport._emitter.emit.bind(Viewport._emitter);
Viewport.on = Viewport._emitter.on.bind(Viewport._emitter);
Viewport.once = Viewport._emitter.once.bind(Viewport._emitter);

Viewport.isTransitionEnabled = true;

Viewport.disableTransition = function () {
  Viewport.isTransitionEnabled = false;
};

Viewport.enableTransition = function () {
  Viewport.isTransitionEnabled = true;
};

Viewport.prototype.goTo = function (nextTemplate, options /** callback **/ ) {
  var self = this;

  // The callback is the last argument that is a function
  var callback = arguments[arguments.length - 1];
  if (typeof callback !== 'function') callback = null;
  if (typeof options === 'function') options = null;
  if (typeof nextTemplate === 'function') nextTemplate = null;

  options = options || {};

  var nextView = null;

  if (nextTemplate) {
    nextView = Viewport.view.create(nextTemplate, options)
      .setData({
        transitioning: true
      }, true);
  }

  var transition = (Viewport.isTransitionEnabled && options.transition) || Transition.none;

  // If there is a current view in the viewport pause it's reactivity
  //if (self.currentView) self.currentView.pause();

  Viewport.emit('willTransition', self, options);

  transition.call(self, self.currentView, nextView, options, function () {
    // Destroy the current template
    if (self.currentView) {
      Viewport.view.destroy(self.currentView);
    }

    self.currentView = nextView;

    if (nextView) {
      nextView.setData({
        transitioning: false
      }, true);
    }

    Viewport.emit('didTransition');
    if (callback) callback();
  });

  // If there is a template then the viewport is active
  self.isActive = !!nextTemplate;

  return self;
};

// Attach the view to the viewport
Template.viewport.onCreated(function () {
  Viewport(this.data.id).view = this.view;
});

// ----------------- View helpers -----------------------

Viewport.view = {};

Viewport.view.create = function (templateName, options) {
  var view = Template[templateName].constructView();
  if (options.data) view.setData(options.data);
  return view;
};

Viewport.view.destroy = function (view) {
  view.destroy();
};
