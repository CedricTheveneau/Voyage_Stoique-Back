const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Middleware to ensure upload directory exists
const uploadDirectory = (req, res, next) => {
  const uploadDir = path.join(__dirname, "../uploads/images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  next();
};

// Configure Multer to store files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/images");
    cb(null, uploadDir);  // Store files in the upload directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);  // Get the file extension
    const filename = `${timestamp}${ext}`;  // Create a unique filename
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },  // 1 MB limit
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

// Export the middleware
module.exports = { uploadDirectory, upload };