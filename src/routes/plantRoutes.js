const express = require("express");
const { getAllPlants, getPlantById } = require("../handlers/planthandler"); // Pastikan path benar
const { upload, uploadPlant } = require("../handlers/uploadHandler");
const router = express.Router();

// Rute untuk mendapatkan semua dokumen dalam koleksi 'plant'
router.get("/plant", getAllPlants);

// Rute untuk mendapatkan dokumen berdasarkan ID
router.get("/plant/:id", getPlantById);
router.post("/plant", upload.single("image"), uploadPlant);
module.exports = router;


