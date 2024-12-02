const { db, storage } = require("../config/firebaseconfig");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const admin = require("firebase-admin");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const uploadPlant = async (req, res, next) => {
  try {
    const { name, benefit, care_tips } = req.body;
    const file = req.file;

    // console.log(req.body)
    // console.log(req.file)

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    
    const fileUpload = storage.file(fileName);
    await fileUpload.save(file.buffer, {
      public: true,
    })

    // const blobStream = fileUpload.createWriteStream({
    //   metadata: {
    //     contentType: file.mimetype,
    //   },
    // });


    // blobStream.on("error", (error) => {
    //   console.error("Error uploading file:", error.message);
    //   return res.status(500).send("Error uploading file");
    // });

    // blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${storage.name}/${fileName}`;

    //   // Get the next document ID
      const plantsCollection = db.collection("plant");
      // const snapshot = await plantsCollection.orderBy("createdAt", "desc").limit(1).get();
    //   let nextId = 1;
    //   if (!snapshot.empty) {
    //     const lastDoc = snapshot.docs[0];
    //     nextId = parseInt(lasktDoc.id) + 1;
    //   }

      const newPlant = {
        name,
        benefit,
        care_tips,
        imageUrl: publicUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const snapshot = await plantsCollection.get();
      const currentIncrement = snapshot.size.toString();
      await plantsCollection.doc(currentIncrement).set(newPlant);

      return res.status(201).json(newPlant);
    // });

    // blobStream.end(file.buffer);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

module.exports = { upload, uploadPlant, errorHandler };