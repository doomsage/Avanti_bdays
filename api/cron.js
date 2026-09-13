const webpush = require('web-push');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
const db = admin.firestore();

webpush.setVapidDetails(
  'mailto:test@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const students = [
  { name: "Kuber", dob: "12-05" },
  { name: "Nitesh", dob: "08-10" },
  { name: "Abhinash", dob: "14-09" } 
];

export default async function handler(req, res) {
  const today = new Date();
  const dateStr = String(today.getDate()).padStart(2, '0') + '-' + String(today.getMonth() + 1).padStart(2, '0');
  
  const bdayBoys = students.filter(s => s.dob === dateStr);

  if (bdayBoys.length === 0) {
    return res.status(200).json({ message: 'Aaj kisi ka bday nahi hai.' });
  }

  const names = bdayBoys.map(s => s.name).join(' aur ');
  const payload = JSON.stringify({ 
    title: 'Happy Birthday! 🎉', 
    body: `Aaj ${names} ka birthday hai! Wish kar do fatak se.` 
  });

  try {
    const snapshot = await db.collection('subscriptions').get();
    if (snapshot.empty) return res.status(200).json({ message: 'No subscribers found.' });

    const sendPromises = [];
    snapshot.forEach(doc => {
      const subData = JSON.parse(doc.data().subInfo);
      sendPromises.push(webpush.sendNotification(subData, payload).catch(() => {}));
    });

    await Promise.all(sendPromises);
    res.status(200).json({ success: true, message: `Push sent for ${names}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
