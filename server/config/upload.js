const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Folders ---
const uploadsDir = path.join(__dirname, "../uploads");
const videoDir = path.join(uploadsDir, "videos");

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

/** 
 * MemoryStorage for small files (images, PDFs)
 * File is kept in memory as req.file.buffer
 */
const memoryStorage = multer.memoryStorage();
const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});
const uploadDocument = multer({
  storage: memoryStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

/**
 * DiskStorage for large videos
 * File is saved on disk at uploads/videos/
 */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videoDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadVideo = multer({
  storage: diskStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
});

module.exports = {
  uploadImage,
  uploadVideo,
  uploadDocument
};