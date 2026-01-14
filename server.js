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
// Ganti pengaturan CORS lama dengan ini:
app.use(cors({
    origin: '*', // Mengizinkan semua domain (Vercel, localhost, dll)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Database sederhana menggunakan file JSON
const DB_FILE = 'database.json';

// Pastikan nama di dalam .single('file') sama dengan di frontend
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        // VALIDASI: Cek apakah file ada atau tidak
        if (!req.file) {
            return res.status(400).json({ message: "File tidak terdeteksi oleh server" });
        }

        // Jika file ada, baru akses path-nya
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        
        // ... kode pengolahan excel Anda selanjutnya
        
        res.json({ message: "Berhasil diunggah" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
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