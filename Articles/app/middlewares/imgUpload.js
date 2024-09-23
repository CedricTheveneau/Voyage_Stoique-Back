const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const uploadDirectory = (req, res, next) => {
  const uploadDir = path.join(__dirname, "../uploads/images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  next();
}

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG or PNG images are allowed."));
    }
  },
});

// Middleware to compress the image using sharp
const compressImage = async (req, res, next) => {
  if (!req.file) return next();

  const timestamp = Date.now();
  const filename = `${timestamp}.jpeg`;
  const outputPath = path.join(__dirname, "../uploads/images", filename);

  try {
    await sharp(req.file.buffer)
      .resize(1200)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    req.file.path = `/uploads/images/${filename}`;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Image compression failed.", error: err.message });
  }
};

module.exports = {uploadDirectory, upload, compressImage };