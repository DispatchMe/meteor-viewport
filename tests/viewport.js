describe('Viewport', function () {

  it('transitions -- fire events in the right order', function (done) {
    // The lifecycle of the transition should be in this order
    var eventOrder = [
      'Viewport.willTransition',
      'View.willMount',
      'View.attached',
      'View.didMount',
      'Viewport.didTransition'
    ];

    var events = [];

    var after = _.after(eventOrder.length, function () {
      // Verify the events fired in the right order
      expect(events).toDeepEqual(eventOrder);

      done();
    });

    eventOrder.forEach(function (event) {
      var listenTo, eventName;

      if (event.indexOf('Viewport') > -1) {
        listenTo = Viewport;
        eventName = event.substring(9);
      } else {
        listenTo = Template.view;
        eventName = event.substring(5);
      }

      listenTo.on(eventName, function () {
        events.push(event);
        after();
      });
    });

    // Create the viewport
    Template.main.constructView();

    Viewport('main').goTo('view');
  });

});
