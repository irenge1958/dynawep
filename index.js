import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nlpRoutes from './nlpRoutes.js';      // Route NLP
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- Multer pour upload de dossier ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const relativePath = path.dirname(file.originalname);
    const uploadPath = path.join(__dirname, 'uploads', relativePath);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, path.basename(file.originalname))
});
const upload = multer({ storage });

// 1. Autoriser les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Servir le build React
app.use(express.static(path.join(__dirname, 'client', 'build')));

// 3. Route NLP (GeminiService)
app.use('/nlp', nlpRoutes);

// ---------------- Routes ----------------

// Upload folder
app.post('/upload', upload.any(), (req, res) => {
  res.json({ message: "Folder uploaded successfully!" });
});

// Recevoir les modifications du front
app.post('/modifications', (req, res) => {
  console.log('Modifications reçues:', req.body.json1);
  res.json(req.body.json1);
});

// Sauvegarder le HTML modifié
app.post('/save-edited-html', (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.writeFile(filePath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error saving HTML file:', err);
      return res.status(500).json({ message: 'Failed to save file' });
    }
    res.json({ message: 'File saved successfully!' });
  });
});

// Export uploads folder as ZIP
app.get('/export-folder', (req, res) => {
  const folderPath = path.join(__dirname, 'uploads');

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: 'No folder found to export' });
  }

  res.attachment('exported-folder.zip');

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', (err) => {
    console.error('Error while creating ZIP:', err);
    res.status(500).send({ message: 'Error creating zip file' });
  });

  archive.pipe(res);
  archive.directory(folderPath, false);
  archive.finalize();
});

// Vérifier si des fichiers HTML existent
app.get('/check-html', (req, res) => {
  const folderPath = path.join(__dirname, 'uploads');
  const htmlFiles = fs.existsSync(folderPath)
    ? fs.readdirSync(folderPath).filter(f => f.endsWith('.html'))
    : [];

  if (htmlFiles.length === 0) {
    res.json({ empty: true, message: 'No HTML files found' });
  } else {
    res.json({ empty: false, htmlFiles });
  }
});

// ---------------- Lancement serveur ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
