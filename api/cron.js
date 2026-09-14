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
  { name: "Ishu Maitry", dob: "17-04" },
  { name: "Janmejaya Sahoo", dob: "09-02" },
  { name: "Jashobanta Behera", dob: "14-05" },
  { name: "Samarendra Mishra", dob: "26-11" }
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
