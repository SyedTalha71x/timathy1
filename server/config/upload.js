const multer = require("multer");
const path = require("path");
const fs = require("fs");

// make sure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads folder created at:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
  fileFilter: (req, file, cb) => {
    // VIDEO
    if (file.fieldname === "videoUrl") {
      const allowedExtensions = [".mp4", ".avi", ".mov", ".mkv"];
      const allowedMimeTypes = [
        "video/mp4",
        "video/x-matroska",
        "video/x-msvideo",
        "video/quicktime",
      ];

      const ext = path.extname(file.originalname).toLowerCase();

      if (
        !allowedExtensions.includes(ext) ||
        !allowedMimeTypes.includes(file.mimetype)
      ) {
        return cb(
          new Error("Only video files (.mp4, .avi, .mov, .mkv) are allowed"),
          false
        );
      }

      return cb(null, true);
    }

    // THUMBNAIL
    if (file.fieldname === "thumbnail") {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedImageTypes.includes(file.mimetype)) {
        return cb(
          new Error("Only image files (jpeg, png, webp) are allowed"),
          false
        );
      }

      return cb(null, true);
    }

    // Any other field is rejected
    cb(new Error("Unexpected field"), false);
  },
});

module.exports = { upload };
