import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Teri exact Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2qI0oQCfLHEEGqC0OZ3bvdk2SfaiqQo4",
  authDomain: "avanti-bdays.firebaseapp.com",
  projectId: "avanti-bdays",
  storageBucket: "avanti-bdays.firebasestorage.app",
  messagingSenderId: "408757362091",
  appId: "1:408757362091:web:b8178ae8bcc420144dc6ee",
  measurementId: "G-WW1ZNNGBMH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Teri Public VAPID Key
const PUBLIC_VAPID_KEY = "BJv7JeCkFJL6evAswfndWfeHqLOk4UJAOZsIFUMrDMipaPngmYJRMIBLkTAfot4tNMQvVpFqNPO5dqwSVXafKsw";

// Abhi ke liye ye 3 naam hain, test karne ke baad isme baaki bacchon ka data add kar lena
const students = [
  { name: "Kuber", dob: "12-05" },
  { name: "Nitesh", dob: "08-10" },
  { name: "Abhinash", dob: "14-09" } // Aaj 14 Sept hai, test karega toh iska notification trigger hona chahiye
];

// Search Logic
document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(query));
  document.getElementById('results').innerHTML = filtered.map(s => `<p>${s.name} - ${s.dob}</p>`).join('');
});

// Register SW & Save Subscription to Firestore
document.getElementById('enable-notifications').addEventListener('click', async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const register = await navigator.serviceWorker.register('/sw.js');
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: PUBLIC_VAPID_KEY
      });

      // Firebase Firestore me save kar rahe hain
      await addDoc(collection(db, "subscriptions"), {
        subInfo: JSON.stringify(subscription),
        timestamp: new Date()
      });
      
      alert("Notifications ON! Firebase me data save ho gaya.");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  } else {
    alert("Push notifications is browser me support nahi karte.");
  }
});
