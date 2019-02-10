var CACHE_STATIC_NAME = 'static-v1.4';
var CACHE_DYNAMIC_NAME = 'dynamic-v1.4';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME ).then(function(cache) {
            return cache.addAll([
                '/task-3/',
                '/task-3/index.html',
                '/task-3/style.css',
                '/task-3/app.js',
                '/task-3/images/bell.svg',
                '/task-3/images/music.png',
                'https://api.songkick.com/api/3.0/events.json?apikey=V24zeBmnMf3f26iq&location=geo:53.9,27.5667'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
    const cacheWhitelist = [CACHE_DYNAMIC_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                let responseClone = response.clone();

                caches.open(CACHE_STATIC_NAME).then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                console.log('Nothing');
            });
        }
    }));
});
