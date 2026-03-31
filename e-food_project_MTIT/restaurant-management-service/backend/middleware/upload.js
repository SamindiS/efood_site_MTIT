const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = 'uploads/restaurants/';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (/jpg|jpeg|png|webp/.test(ext)) cb(null, true);
    else cb(new Error('Only images are allowed.'));
  },
});

module.exports = upload;
