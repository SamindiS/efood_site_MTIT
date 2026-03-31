const express = require('express');
const router = express.Router();
const controller = require('../controllers/MenuItemController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Define Multer Storage FIRST
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/menuitems';
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''))
});

// ✅ Define `upload` AFTER storage
const upload = multer({ storage });


// ✅ Routes (use `upload` AFTER it's defined)
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
// router.post('/', upload.array('image', 5), controller.create);
// router.put('/:id', upload.array('image', 5), controller.update);
router.post('/', upload.single('image'), controller.create);
router.put('/:id', upload.single('image'), controller.update);

router.delete('/:id', controller.remove);





module.exports = router;
