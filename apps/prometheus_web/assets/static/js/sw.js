const cacheName = 'CACHE_MYVTMIIM_2020';

// Cache all the files to make a PWA
self.addEventListener('install', e => {
    e.waitUntil(function () {
            caches.open(cacheName).then(cache => {
                // Our application only has two files here index.html and manifest.json
                // but you can add more such as style.css as your app grows
                return cache.addAll([                
                    //'./js/manifest.json',
                    //'./css/app.css',
                    //'./images/agenda-semana-23.png',
                    './images/logo-myvtim.png',
                    './images/favicon.ico'
                ]);
            });

            //TODO: clean up old caches: TEMPMYVTMIIM, Temporas, TempMYVTMIIM_2020
            try {
                caches.open("Temporas").then(cache => {

                });
            } catch {
                //  nothing to do
            }
        }
    );
});

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName)
        .then(cache => cache.match(event.request, { ignoreSearch: true }))
        .then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'MYVTMI.IM Codelab';
    const options = {
        body: 'Yay it works.',
        icon: 'images/logo-myvtim.png',
        badge: 'images/logo-myvtim.png'
    };

    var notig = self.registration.showNotification(title, options);
    event.waitUntil(notig);
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    //event.waitUntil(
    //    clients.openWindow('TEST!')
    //);
});