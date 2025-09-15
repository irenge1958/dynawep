const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const relativePath = path.dirname(file.originalname);
    const uploadPath = path.join(__dirname, 'uploads', relativePath);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  }
});

const upload = multer({ storage });
// 1. Autoriser les fichiers statiques dans uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React build folder (main frontend)
app.use(express.static(path.join(__dirname, 'client', 'build')));


app.post('/upload', upload.any(), (req, res) => {
  res.json({ message: "Folder uploaded successfully!" });
});

app.post('/modifications', (req, res) => {
  console.log(req.body.json1)
  res.json(req.body.json1);
});

app.get('/check-html', (req, res) => {
  const folderPath = path.join(__dirname, 'uploads');

  const htmlFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));

  if (htmlFiles.length === 0) {
    return res.json({ empty: true, message: 'No HTML files found' });
  } else {
    return res.json({ empty: false, htmlFiles });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
