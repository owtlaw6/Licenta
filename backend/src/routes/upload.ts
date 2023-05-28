import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = `./uploads/${req.body.cnp}/${Date.now()}`;

    if (req.body.uploadType === 'PDF') {
      dir = `./uploads/pdfs/${req.body.cnp}/${Date.now()}`;
    }

    fs.exists(dir, exist => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, error => cb(error, dir))
      }
      return cb(null, dir)
    })  
  },
  filename: function(req, file, cb){
    let fileName = file.originalname;

    if (req.body.uploadType === 'PDF') {
      fileName = `${Date.now()}`;
    }

    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
}).array('file');

router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.send('An error occurred while uploading the file');
    } else {
      res.send('File uploaded successfully!');
    }
  });
});

export default router;