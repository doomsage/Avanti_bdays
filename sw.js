// Dummy offline fallback to strictly satisfy Chrome PWA rules
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Avanti Bdays is offline. Connect to internet to see updates.');
    })
  );
});

self.addEventListener('push', event => {
  let data = { title: "Notification", body: "New Update!" };
  if (event.data) {
    data = event.data.json();
  }
  const options = {
    body: data.body,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/192px-Google_Chrome_icon_%28September_2014%29.svg.png',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
