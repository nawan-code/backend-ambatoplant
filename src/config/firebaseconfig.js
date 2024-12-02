const admin = require("firebase-admin");

// Path ke file kunci akun layanan Firebase
const firebaseServiceAccount = require("./key.json");

const bucketName = "ambatoplant.firebasestorage.app";

// Inisialisasi Admin SDK dengan kredensial Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  storageBucket: "plant-image.appspot.com", // Pastikan nama bucket lengkap
});

// Inisialisasi Firestore dan Storage
const db = admin.firestore();
const storage = admin.storage().bucket(bucketName);


// Tes koneksi ke Firestore
db.collection("test").doc("connectionTest").set({ connected: true })
  .then(() => {
    console.log("Firebase Firestore connection successful");
  })
  .catch((error) => {
    console.error("Error connecting to Firebase Firestore:", error.message);
  });

// Tes koneksi ke Storage
(async () => {
  try {
    const [exists] = await storage.exists();
    if (exists) {
      console.log("Google Cloud Storage connection successful");
    } else {
      console.warn("Storage bucket does not exist or is not accessible.");
    }
  } catch (error) {
    console.error("Error connecting to Google Cloud Storage:", error.message);
  }
});

// Ekspor modul
module.exports = {
  db,
  storage,
};

