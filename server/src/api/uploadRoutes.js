import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { AsyncRouter } from 'express-async-router';

const router = AsyncRouter();

dotenv.config();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    res.json({ imageUrl });
  } else {  
    res.status(500).json({ error: 'Error uploading image' });
  }
});

export default router;