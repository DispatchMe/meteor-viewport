Tinytest.add('View extensions -- setData / attach / detach / destroy', function (test) {
  var div = document.createElement('DIV');

  var view = Template.widgetOne.constructView();

  // Test the extended data
  test.equal(canonicalizeHtml(div.innerHTML), '');

  view.setData({skeleton: true}, true);
  view.attach(div);
  test.equal(canonicalizeHtml(div.innerHTML), 'Show Skeleton');

  view.setData({content: 'Hello'});
  Tracker.flush();
  test.equal(canonicalizeHtml(div.innerHTML), 'Show Skeleton');

  view.setData({skeleton: false}, true);
  Tracker.flush();
  test.equal(canonicalizeHtml(div.innerHTML), 'Hello');

  view.attach(div);
  test.equal(canonicalizeHtml(div.innerHTML), 'Hello');

  view.detach();
  test.equal(canonicalizeHtml(div.innerHTML), '');

  // reattach
  view.attach(div);
  test.equal(canonicalizeHtml(div.innerHTML), 'Hello');

  view.destroy();
  test.equal(canonicalizeHtml(div.innerHTML), '');
});
