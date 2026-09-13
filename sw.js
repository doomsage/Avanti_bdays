self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://via.placeholder.com/192',
    vibrate: [200, 100, 200]
  });
});
