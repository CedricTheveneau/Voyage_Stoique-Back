const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const uploadAudioDirectory = (req, res, next) => {
  const uploadDir = path.join(__dirname, "../uploads/records");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  next();
};

const storage = multer.memoryStorage();
const uploadAudio = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp3/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only MP3 audio files are allowed."));
    }
  },
});

const compressAudio = (req, res, next) => {
  if (!req.file) return next();

  const timestamp = Date.now();
  const filename = `${timestamp}.mp3`;
  const outputPath = path.join(__dirname, "../uploads/records", filename);

  ffmpeg()
    .input(req.file.buffer)
    .audioBitrate(128)
    .save(outputPath)
    .on('end', () => {
      req.file.path = `/uploads/records/${filename}`;
      next();
    })
    .on('error', (err) => {
      return res.status(500).json({ message: "Audio compression failed.", error: err.message });
    });
};

module.exports = { uploadAudioDirectory, uploadAudio, compressAudio };