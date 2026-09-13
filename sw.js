// Ye Chrome ko batayega ki app offline chal sakta hai (PWA Requirement)
self.addEventListener('fetch', event => {
  // Abhi offline data cache nahi kar rahe, toh isko bas aise hi chhod do.
  // Chrome ko bas ye event listener chahiye hota hai app installable manne ke liye.
});

// Push Notification handle karne ka logic
self.addEventListener('push', event => {
  let data = { title: "Notification", body: "New Update!" };
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: 'https://i.ibb.co/kYNMLY7/doomsage.png', // Baad me isko apni real image se replace karna
    vibrate: [200, 100, 200]
  };

  // waitUntil ensure karta hai ki notification dikhne se pehle OS is process ko na maare
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
