import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

const router = express.Router();

let filepathPdf = `D:\\licenta\\mern\\backend\\uploads\\pdfs\\`;
const pdfExtractor = `C:\\Users\\Diana\\Downloads\\pdf_extractor.py`;
const ctScript = `C:\\Users\\Diana\\Downloads\\pdf_extractor.py`;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = `./uploads/${req.body.cnp}/dcms/${Date.now()}`;

    if (req.body.uploadType === 'PDF') {
      dir = `./uploads/pdfs/${req.body.cnp}`;
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
      fileName = `${Date.now() + path.extname(file.originalname)}`;
      filepathPdf += `${req.body.cnp}\\${fileName}`;
    }
    else if (req.body.uploadType === 'CT') {
      filepathPdf += `${req.body.cnp}\\dcms\\${fileName}`;
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
      if (req.body.uploadType === 'PDF') {
        exec(`python3 ${pdfExtractor} ${req.body.cnp} ${filepathPdf}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
          }
          else if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          else {
            console.log(stdout);
          }
        })
        filepathPdf = `D:\\licenta\\mern\\backend\\uploads\\pdfs\\`;
        res.send('PDF uploaded successfully!');
      }
      else if (req.body.uploadType === 'CT') {
        exec(`python3 ${ctScript} ${req.body.cnp}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
          }
          else if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          else {
            console.log(stdout);
          }
        })
        res.send('CT uploaded successfully!');
      }
      else {
        res.send('Something weird happened!');
      }
    }
  });
});

export default router;