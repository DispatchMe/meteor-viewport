Package.describe({
  name: 'dispatch:viewport',
  summary: 'View manager that supports transition multiple viewports on a page.',
  git: 'https://github.com/DispatchMe/meteor-viewport.git',
  version: '1.0.0'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    // core
    'blaze',
    'templating',

    // atmosphere
    'dispatch:view-extensions@0.0.1',
    'percolate:velocityjs@1.2.1',
    'raix:eventemitter@0.1.2'
  ], 'web');

  api.addFiles([
    'viewport.html',
    'viewport.js',
    'transition.js'
  ], 'web');

  api.export('Viewport', 'web');
});

Package.onTest(function (api) {
  api.use('sanjo:jasmine@0.14.0');

  api.use([
    'templating',
    'dispatch:viewport'
  ], 'web');

  api.addFiles([
    'tests/helpers.js',
    'tests/templates.html',
    'tests/viewport.js'
  ], 'web');
});
