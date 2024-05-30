const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `image${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // лимит 5 МБ
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Разрешены только изображения'));
        }
        cb(null, true);
    }
});

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.get('/images', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send('Не удалось получить изображения');
        }
        res.json(files.slice(-3)); // Вернуть последние 3 изображения
    });
});

app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('Файл не загружен');
    }

    // Check if image is 1920x1080
    const dimensions = require('image-size');
    const size = dimensions(file.path);
    if (size.width !== 1920 || size.height !== 1080) {
        fs.unlinkSync(file.path);
        return res.status(400).send('Изображение должно иметь разрешение 1920x1080.');
    }

    // Limit to 3 images
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send('Не удалось получить изображения');
        }
        if (files.length > 2) {
            fs.unlinkSync(path.join('uploads', files[0])); // Удалить самое старое изображение
        }
        res.send('Файл успешно загружен');
    });
});

app.delete('/images', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send('Не удалось получить изображения');
        }

        files.forEach(file => fs.unlinkSync(path.join('uploads', file)));
        res.send('Все изображения успешно удалены');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});