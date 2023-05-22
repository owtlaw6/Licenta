import express from 'express';
import multer from 'multer';
import fs from 'fs';
import moment from 'moment';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./uploads/${req.body.cnp}/${moment().format('YYYY-MM-DD')}`;

    fs.exists(dir, exist => {
      if (!exist) {
        return fs.mkdir(dir, { recursive: true }, error => cb(error, dir))
      }
      return cb(null, dir)
    })  
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
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