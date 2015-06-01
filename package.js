Package.describe({
  name: 'dispatch:viewport',
  summary: 'View manager that supports transition multiple viewports on a page.',
  git: 'https://github.com/DispatchMe/meteor-viewport.git',
  version: '0.0.2'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    // core
    'blaze',
    'reactive-var',
    'templating',

    // atmosphere
    'percolate:velocityjs@1.2.1',
    'raix:eventemitter@0.1.2'
  ], 'web');

  api.addFiles([
    'view_extensions.js',
    'viewport.html',
    'viewport.js',
    'transition.js'
  ], 'web');

  api.export('Viewport', 'web');
});

Package.onTest(function (api) {
  api.use([
    'templating',
    'test-helpers',
    'tinytest',
    'dispatch:viewport'
  ], 'web');

  api.addFiles([
    'tests.html',
    'tests.js'
  ], 'web');
});
