import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const students = [
  { name: "Abhinash Behera", dob: "16-10" },
  { name: "Aditya Dwivedi", dob: "02-12" },
  { name: "Gaurav Patel", dob: "07-11" },
  { name: "Hitesh Kumar Nayak", dob: "04-07" },
  { name: "Homnath Yogi", dob: "14-04" },
  { name: "Kartik Malik", dob: "03-06" },
  { name: "Piyush Nayak", dob: "22-12" },
  { name: "Sekhar Rout", dob: "25-10" },
  { name: "Subhankar Mallick", dob: "08-10" },
  { name: "Lokesh Kumar Uike", dob: "23-08" },
  { name: "Sudiptashree Biswal", dob: "03-09" },
  { name: "Adarsha Ranjan Meher", dob: "25-12" },
  { name: "Ajitesh Sahoo", dob: "22-09" },
  { name: "Bishnu Priya Parida", dob: "02-04" },
  { name: "Biswa Ranjan Sethi", dob: "10-07" },
  { name: "Deeksha Markam", dob: "03-10" },
  { name: "Dhuma Charan Majhi", dob: "16-03" },
  { name: "Haunri Naik", dob: "03-07" },
  { name: "Hitesh Kumar Meher", dob: "02-07" },
  { name: "Kuber Lahare", dob: "31-12" },
  { name: "Kunal Dewangan", dob: "30-06" },
  { name: "Mohan Kumar Behera", dob: "11-11" },
  { name: "Nishant Kumar", dob: "08-06" },
  { name: "Om Prakash Sahoo", dob: "13-01" },
  { name: "Prabhat Ranjan Rout", dob: "16-06" },
  { name: "Riya Gupta", dob: "29-09" },
  { name: "Sai Vinayak", dob: "20-03" },
  { name: "Somesh Ranjan Samantaray", dob: "03-08" },
  { name: "Subhradeepa Samal", dob: "14-09" },
  { name: "Upasana Sahu", dob: "01-12" },
  { name: "Yugant Chandra Shekhar Sakhare", dob: "15-04" },
  { name: "Arman Dhal", dob: "02-11" },
  { name: "Ranik Kumar Mahanta", dob: "13-10" },
  { name: "Ashvini Yadav", dob: "11-10" },
  { name: "trial only", dob: "19-09" },
  { name: "Ishu Maitry", dob: "17-04" },
  { name: "Janmejaya Sahoo", dob: "09-02" },
  { name: "Jashobanta Behera", dob: "14-05" },
  { name: "Samarendra Mishra", dob: "26-11" }
];


// --- 1. AUTOMATIC SW REGISTRATION (Fixes Install Button Delay) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log("SW loaded"))
      .catch(err => console.error(err));
  });
}

// --- 2. SEARCH LOGIC (Fixes frozen search bar) ---
document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(query));
  document.getElementById('results').innerHTML = filtered.map(s => `<p>${s.name} - ${s.dob}</p>`).join('');
});

// --- 3. PUSH NOTIFICATIONS ---
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

document.getElementById('enable-notifications').addEventListener('click', async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("Permission denied. Browser settings check kar.");
        return;
      }
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
      alert("Error aa gaya: " + err.message);
    }
  }
});
