import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
}).array('file');

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      console.log("random " + err);
      res.send('An error occurred while uploading the file');
    } else {
      res.send('File uploaded successfully!');
    }
  });
});

export default router;