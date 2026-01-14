const express = require('express');
const multer = require('multer');
const cors = require('cors');
const xlsx = require('xlsx');
const PORT = process.env.PORT || 5000;
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const app = express();
app.use(cors({
    origin: function (origin, callback) {
      // Mengizinkan permintaan tanpa origin (seperti mobile apps atau curl) 
      // atau yang cocok dengan domain vercel Anda
      const allowedOrigins = [
        'https://excel-app-frontend.vercel.app',
        'https://excel-app-frontend-one.vercel.app' // jaga-jaga jika ada domain lain
      ];
      
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

const upload = multer({ dest: 'uploads/' });

// Database sederhana menggunakan file JSON
const DB_FILE = 'database.json';

app.post('/upload', upload.single('file'), (req, res) => {
    const workbook = xlsx.readFile(req.file.path);
    const data = {};

    workbook.SheetNames.forEach(sheetName => {
        data[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });

    // Simpan ke "Database"
    let currentDB = [];
    if (fs.existsSync(DB_FILE)) {
        currentDB = JSON.parse(fs.readFileSync(DB_FILE));
    }
    currentDB.push({ id: Date.now(), filename: req.file.originalname, content: data });
    fs.writeFileSync(DB_FILE, JSON.stringify(currentDB));

    res.json({ message: "Data berhasil disimpan!", data });
});

app.get('/data', (req, res) => {
    if (fs.existsSync(DB_FILE)) {
        res.json(JSON.parse(fs.readFileSync(DB_FILE)));
    } else {
        res.json([]);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});