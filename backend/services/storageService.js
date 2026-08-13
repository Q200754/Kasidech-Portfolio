const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folder exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration (Local Disk Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filters to support image files (jpg, jpeg, png, webp) and resumes (pdf)
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedPdfTypes = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isImage = allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype);
  const isPdf = allowedPdfTypes.test(extname) && allowedPdfTypes.test(mimetype);

  if (isImage || isPdf) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, WEBP, and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * Storage Service Abstraction
 * These helpers make it easy to swap storage providers in the future (e.g. to AWS S3 or Cloudinary)
 */
const storageService = {
  // Multer middleware reference
  uploadSingle: (fieldName) => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  
  // Custom field uploads (e.g., cover image and multiple screenshots)
  uploadFields: (fields) => upload.fields(fields),

  /**
   * Formats a local uploaded file metadata object
   */
  processUploadedFile: (file) => {
    if (!file) return null;
    return {
      fileName: file.filename,
      url: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date().toISOString()
    };
  },

  /**
   * Deletes a file from local disk
   * @param {string} fileName The file's name on local storage
   */
  deleteFile: async (fileName) => {
    if (!fileName) return false;
    const filePath = path.join(uploadsDir, fileName);
    return new Promise((resolve) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete local file ${fileName}:`, err.message);
          resolve(false);
        } else {
          console.log(`Local file ${fileName} deleted successfully.`);
          resolve(true);
        }
      });
    });
  }
};

module.exports = storageService;
