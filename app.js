import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Teri Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA2qI0oQCfLHEEGqC0OZ3bvdk2SfaiqQo4",
  authDomain: "avanti-bdays.firebaseapp.com",
  projectId: "avanti-bdays",
  storageBucket: "avanti-bdays.firebasestorage.app",
  messagingSenderId: "408757362091",
  appId: "1:408757362091:web:b8178ae8bcc420144dc6ee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PUBLIC_VAPID_KEY = "BJv7JeCkFJL6evAswfndWfeHqLOk4UJAOZsIFUMrDMipaPngmYJRMIBLkTAfot4tNMQvVpFqNPO5dqwSVXafKsw";

// Student Data
const students = [
  { name: "Kuber", dob: "12-05" },
  { name: "Nitesh", dob: "08-10" },
  { name: "Abhinash", dob: "14-09" } 
];

// Search Logic
document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(query));
  document.getElementById('results').innerHTML = filtered.map(s => `<p>${s.name} - ${s.dob}</p>`).join('');
});

// VAPID Key Converter
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Push Notification Subscription Logic
document.getElementById('enable-notifications').addEventListener('click', async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("Bhai permission Deny kar di. Browser settings me jaake allow kar.");
        return;
      }

      await navigator.serviceWorker.register('/sw.js');
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const applicationServerKey = urlB64ToUint8Array(PUBLIC_VAPID_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });

        await addDoc(collection(db, "subscriptions"), {
          subInfo: JSON.stringify(subscription),
          timestamp: new Date()
        });
        
        alert("Success! Notifications ON.");
      } else {
        alert("Tu already subscribed hai bhai!");
      }

    } catch (err) {
      console.error(err);
      alert("Error aa gaya: " + err.message);
    }
  } else {
    alert("Push notifications is browser me support nahi karte.");
  }
});

// --- PWA INSTALLATION LOGIC ---
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Browser ka default bottom bar prompt rok do
  e.preventDefault();
  deferredPrompt = e;
  // Apna button dikhao
  if(installBtn) {
    installBtn.style.display = 'block';
  }
});

if(installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Asli install popup trigger karo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('App Installed!');
        installBtn.style.display = 'none'; 
      }
      deferredPrompt = null;
    }
  });
}
