// Prepare the data context to enable setData
Blaze.View.prototype._prepareDataContext = function () {
  var self = this;

  // Setup the data context so setData can work
  if (!self._v_dataFunc) {
    self._v_dataFunc = function () {
    };

    self._v_dataFuncDep = new Tracker.Dependency();
    self._v_extendedDataVar = new ReactiveVar();
  }
};

/**
 * Set the data context.
 * @param {Object||Function} data The data context to set
 * @param {Boolean} extend Extend the data context with this data
 * @returns {Blaze.View}
 */
Blaze.View.prototype.setData = function (data, extend) {
  var self = this;

  if (self.isRendered && !self._v_dataFunc) {
    throw 'You can only set data on views rendered with the view extensions.';
  }

  self._prepareDataContext();

  if (extend) {
    self._v_extendedDataVar.set(data);
    return self;
  }

  if (typeof data === 'function') {
    self._v_dataFunc = data;
  } else {
    self._v_dataFunc = function () {
      return data;
    };
  }
  self._v_dataFuncDep.changed();

  return self;
};

/**
 * Attach the view.
 * @param {Node||Blaze.View} parent
 * @param [nextNode]
 */
Blaze.View.prototype.attach = function (parent, nextNode) {
  var self = this;

  if (!self.isRendered) self.render();

  if (self.isAttached) return self;

  if (parent instanceof Blaze.View) {
    var domrange = parent._domrange;
    parent = domrange.parentElement;
    nextNode = domrange.lastNode().nextSibling;
  }

  self._domrange.attach(parent || document.body, nextNode);

  if (self.emit) self.emit('attached', self);

  return self;
};

Blaze.View.prototype.detach = function () {
  this._domrange.detach();
};

Blaze.View.prototype.destroy = function () {
  var self = this;
  if (self._domrange.attached) self._domrange.detach();
  Blaze.remove(self);
};

/**
 * Render the view without attaching it to the dom.
 * @returns {Blaze.View}
 */
Blaze.View.prototype.render = function () {
  var self = this;
  if (self.isRendered) return self;

  self._prepareDataContext();

  var content = Blaze._TemplateWith(function () {
    self._v_dataFuncDep.depend();

    return _.extend({}, self._v_dataFunc(), self._v_extendedDataVar.get());
  }, function () {
    return self;
  });

  Blaze._materializeView(content);

  return self;
};

var domRangeNodes = function (domRange) {
  var nodes = [];

  domRange.members.forEach(function (member) {
    if (member instanceof Blaze._DOMRange) {
      nodes = nodes.concat(domRangeNodes(member));
    } else if (member.nodeType === 1) {
      nodes.push(member);
    }
  });

  return nodes;
};

/**
 * The dom range nodes.
 */
Blaze.View.prototype.nodes = function () {
  return domRangeNodes(this._domrange);
};

/**
 * Pause reactivity. TODO @raix :)
 */
//Blaze.View.prototype.pause = function () { };
