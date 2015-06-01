Viewport.Transition = {};

Transition = Viewport.Transition;

var DURATION = 300;
var QUADRATIC_EASE = [0.1, 0.7, 0.1, 1];

Transition.none = function (current, next, options, callback) {
  if (current) {
    current.emit('willUnmount', current);
    current.emit('didUnmount', current);
  }

  if (!next) {
    if (callback) callback();

    return;
  }

  next.on('rendered', function () {
    next.emit('willMount', next);
    next.attach(this.view);
    next.emit('didMount', next);

    if (callback) callback();
  });

  next.render();
};

var slideNodesX = function (nodes, options, complete) {
  // Setup the transition in translations -- the transition out will be the opposite.
  // Slide in from the right.
  var startTranslateX = window.innerWidth;

  // Slide in from the left, if reversed.
  if (options.reverse) startTranslateX *= -1;

  var translateOpts = options.out ? [-startTranslateX, 0] : [0, startTranslateX];

  $(nodes)
    .velocity({translateX: translateOpts},
    _.extend({
        duration: DURATION,
        easing: QUADRATIC_EASE,
        complete: complete
      }, _.pick(options, 'duration', 'easing')
    ));
};

function noop() {
}

Transition.slideX = function (current, next, options, callback) {
  var viewport = this;

  var done = callback || noop;

  var slideCurrentOut = function () {
    current.emit('willUnmount', current);

    slideNodesX(current.nodes(), _.extend({out: true}, options), function () {
      current.emit('didUnmount', current);

      done();
    });
  };

  if (!next) return slideCurrentOut();

  next.on('rendered', function () {
    // Set the transform before the attaching the next page so
    // it does not flash on the screen in the wrong place.
    var startTranslateX = window.innerWidth;
    if (options.reverse) startTranslateX *= -1;
    Tools.transform(next.nodes(), 'translateX(' + startTranslateX + 'px)');

    next.emit('willMount', next);
    next.attach(viewport.view);

    if (current) {
      done = _.after(2, done);
      slideCurrentOut();
    }

    slideNodesX(next.nodes(), options, function () {
      next.emit('didMount', next);
      done();
    });
  });

  next.render();
};

var slideNodesY = function (nodes, options, complete) {
  var translateOpts = options.out ? [window.innerHeight, 0]
    // Keep it at a small value instead of 0 to prevent element positioning issues.
    : [0.00001, window.innerHeight];

  $(nodes)
    .velocity({translateY: translateOpts},
    _.extend({
        duration: DURATION,
        easing: QUADRATIC_EASE,
        complete: complete
      }, _.pick(options, 'duration', 'easing')
    ));
};

Transition.slideY = function (current, next, options, callback) {
  var viewport = this;

  var slideCurrentOut = function (done) {
    current.emit('willUnmount', current);

    // slide the current component out
    slideNodesY(current.nodes(), _.extend({out: true}, options), function () {
      current.emit('didUnmount', current);

      if (done) done();
    });
  };

  if (!next) return slideCurrentOut(callback);

  // After the view is rendered -- transition it in.
  next.on('rendered', function () {
    next.emit('willMount', next);

    // Set the transform before the attaching the next page so
    // it does not flash on the screen in the wrong place.
    Tools.transform(next.nodes(), 'translateY(' + window.innerHeight + 'px)');
    next.attach(viewport.view);

    slideNodesY(next.nodes(), options, function () {
      next.emit('didMount', next);

      if (callback) callback();
    });
  });

  if (current) {
    slideCurrentOut(next.render);
  } else {
    next.render();
  }
};
