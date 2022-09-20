const CACHE_NAME = `my-sample-app-cache-v1.1`;


// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // pre-cache all app files (css, js, etc).
    cache.addAll(['/']);
  })());
});


/**
 * Intercept all fetch events from the app to the server.
 * Cache the response or return the last cached response.
 */
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      // Try to fetch the resource from the network.
      const fetchResponse = await fetch(event.request);

      // Save the resource in the cache.
      cache.put(event.request, fetchResponse.clone());

      // And return it.
      return fetchResponse;
    } catch (e) {
      // Fetching didn't work get the resource from the cache.
      const cachedResponse = await cache.match(event.request);

      // And return it.
      return cachedResponse;
    }
  })());
});



// Respond to a server push with a user notification.
self.addEventListener('push', (event) => {
    
    console.log("push event found!");
    const notificationData = JSON.parse(event.data.text());
    //const notificationData = event.data.text();

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.message,
            icon: './icon512.png'
        })
    );
});