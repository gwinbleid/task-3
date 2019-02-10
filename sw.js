this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/task-3/',
                'index.html',
                'style.css',
                'app.js',
                'images/bell.svg',
                'images/music.png',
                'https://api.songkick.com/api/3.0/events.json?apikey=V24zeBmnMf3f26iq&location=geo:53.9,27.5667'
            ]);
        })
    );
});

this.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                let responseClone = response.clone();

                caches.open('v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                console.log('Nothing');
            });
        }
    }));
});
