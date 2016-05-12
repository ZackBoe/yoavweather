(global => {
  'use strict';

  importScripts('sw-toolbox.js');

  global.toolbox.options.debug = false;

  // Always load the fastest response, normally cache.
  // Still fires a network request + updates cache
  global.toolbox.router.default = global.toolbox.fastest;

  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));

  toolbox.precache([
    '/index.html',
    '/styles/main.css',
    '/images/bg.jpg', '/images/yoav.png',
    '/scripts/main.js', '/scripts/vendor.js'
  ]);

  // Never cache check.json, for connectivity test
  toolbox.router.get('check.json', toolbox.networkOnly);

  // Use a dedicated cache for the forecast responses
  toolbox.router.get('/yoav/weather/api*', toolbox.networkFirst, {
    origin: 'https://zackboehm.com',
    cache: {
      name: 'forecast-data',
      maxEntries: 5,
      maxAgeSeconds: 1800  // Expire any entries older than 30 minutes
    }
  });

  console.log('SW Register')

})(self);
