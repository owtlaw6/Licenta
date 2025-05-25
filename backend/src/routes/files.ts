import express from 'express';
import path from 'path';

const router = express.Router();

const pdfsDir = path.join(__dirname, '..', '..', 'uploads', 'pdfs');

// Files will be available at GET /files/{cnp}/{cnp}_{method}.txt
router.use(
  '/',
  express.static(pdfsDir)
);

export default router;