const cloudinary = require("./Cloudinary");
const fs = require("fs");

// --- Profile Images ---
const uploadToCloudinary = (fileBuffer, folder = "Timathy/profiles") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// --- Notes Attachments ---
const uploadAttachment = (fileBuffer, folder = "Timathy/notes/attachments") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// --- Services / Products ---
const uploadService = (fileBuffer, folder = "Timathy/servicesImg") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// --- Idle Period Documents ---
const uploadIdlePeriod = (fileBuffer, folder = "Timathy/vacation") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "raw" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// --- Contracts ---
const uploadContract = (fileBuffer, fileName, folder = "Timathy/contracts") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        type: "upload",
        public_id: fileName.replace(".pdf", ""),
        format: "pdf",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        access_mode: "public",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// --- Video Thumbnails ---
const uploadThumbnail = (filePath, folder = "Timathy/trainingVideo/thumbnail") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

// --- Training Plan Videos (diskStorage + upload_large) ---

const uploadTrainingPlanVideo = (filePath, folder = "Timathy/trainingVideo/videos") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, { resource_type: "video", folder, chunk_size: 6 * 1024 * 1024 }, (err, result) => {
      if (err) return reject(err);

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      resolve({
        url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration,
      });
    });
  });
};

module.exports = {
  uploadToCloudinary,
  uploadService,
  uploadContract,
  uploadIdlePeriod,
  uploadThumbnail,
  uploadTrainingPlanVideo,
  uploadAttachment
};
