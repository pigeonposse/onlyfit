const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { optimize } = require('svgo');
const { PDFDocument } = require('pdf-lib');
const { minify } = require('html-minifier-terser');
const zlib = require('zlib');
const util = require('util');
const gzipAsync = util.promisify(zlib.gzip);

const app = express();

// Configuración de multer con límites y validación de tipos de archivo
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = 'uploads';
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        cb(null, `${timestamp}-${randomString}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Imágenes
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/bmp', 'image/svg+xml',
        // Documentos
        'application/pdf', 'text/html',
        // Video
        'video/mp4', 'video/webm',
        // Audio
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        // Otros
        'text/plain', 'application/json', 'application/xml', 'text/css', 'application/javascript'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not supported: ${file.mimetype}`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB para mantenerlo simple
        files: 10 // máximo 10 archivos a la vez
    }
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use('/docs', express.static('docs'));
app.use('/compressed', express.static('public/compressed'));
app.use(express.json());

// Crear directorios necesarios si no existen
['public/compressed', 'uploads'].forEach(async dir => {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (err) {
        console.error(`Failed to create directory ${dir}:`, err.message);
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de compresión
app.post('/compress', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const originalSize = req.file.size;
        const fileType = req.file.mimetype;
        const compressedName = `compressed_${Date.now()}_${req.file.originalname}`;
        const outputPath = path.join('public', 'compressed', compressedName);

        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        let compressedSize;

        console.log(`Processing file: ${req.file.originalname}, Type: ${fileType}`);

        switch(true) {
            case fileType.startsWith('image/'):
                if (fileType === 'image/svg+xml') {
                    await compressSVG(req.file.path, outputPath);
                } else {
                    await compressImage(req.file.path, outputPath, fileType);
                }
                break;

            case fileType === 'application/pdf':
                await compressPDF(req.file.path, outputPath);
                break;

            case fileType === 'text/html':
                await compressHTML(req.file.path, outputPath);
                break;

            default:
                await compressGeneric(req.file.path, outputPath);
        }

        compressedSize = (await fs.stat(outputPath)).size;
        const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

        // Limpiar archivo original
        await fs.unlink(req.file.path).catch(err => console.error(`Failed to delete original file ${req.file.path}: ${err.message}`));

        res.json({
            downloadUrl: `/compressed/${path.basename(outputPath)}`,
            compressedName: path.basename(outputPath),
            originalSize,
            compressedSize,
            savings
        });

    } catch (error) {
        console.error(`Compression error for ${req.file?.originalname}:`, error.message);
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path).catch(err => console.error(`Failed to delete file ${req.file.path}: ${err.message}`));
        }
        res.status(500).json({ error: error.message || 'Error compressing file' });
    }
});

// Ruta para descargar todos los archivos
app.post('/download-all', async (req, res) => {
    try {
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('error', (err) => {
            console.error('Archive error:', err.message);
            res.status(500).json({ error: err.message });
        });

        res.attachment('onlyfit-compressed-files.zip');
        archive.pipe(res);

        const compressedDir = path.join('public', 'compressed');
        const files = req.body.files || [];

        for (const file of files) {
            const compressedFilePath = path.join(compressedDir, file.compressedName);
            if (await fs.access(compressedFilePath).then(() => true).catch(() => false)) {
                archive.file(compressedFilePath, { name: `compressed_${file.originalName}` });
            } else {
                console.warn(`File not found: ${compressedFilePath}`);
            }
        }

        await archive.finalize();

    } catch (error) {
        console.error('Error creating zip:', error.message);
        res.status(500).json({ error: 'Error creating ZIP file' });
    }
});

// Funciones de compresión
async function compressImage(inputPath, outputPath, mimeType) {
    try {
        const image = sharp(inputPath);
        if (mimeType === 'image/gif' || mimeType === 'image/png') {
            await image
                .png({ quality: 50, compressionLevel: 9 })
                .toFile(outputPath);
        } else {
            await image
                .jpeg({ quality: 50 })
                .toFile(outputPath);
        }
    } catch (error) {
        console.error(`Image compression failed for ${inputPath}:`, error.message);
        await fs.copyFile(inputPath, outputPath);
    }
}

async function compressSVG(inputPath, outputPath) {
    try {
        const svgContent = await fs.readFile(inputPath, 'utf-8');
        const result = optimize(svgContent, {
            multipass: true,
            plugins: ['preset-default']
        });
        await fs.writeFile(outputPath, result.data);
    } catch (error) {
        console.error(`SVG compression failed for ${inputPath}:`, error.message);
        await fs.copyFile(inputPath, outputPath);
    }
}

async function compressPDF(inputPath, outputPath) {
    try {
        const pdfData = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(pdfData);
        const compressedData = await pdfDoc.save({ useObjectStreams: true });
        await fs.writeFile(outputPath, compressedData);
        console.log(`PDF compression successful for ${inputPath}`);
    } catch (error) {
        console.error(`PDF compression failed for ${inputPath}:`, error.message);
        await fs.copyFile(inputPath, outputPath);
    }
}

async function compressHTML(inputPath, outputPath) {
    try {
        const htmlContent = await fs.readFile(inputPath, 'utf-8');
        const minified = await minify(htmlContent, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        });
        await fs.writeFile(outputPath, minified);
    } catch (error) {
        console.error(`HTML compression failed for ${inputPath}:`, error.message);
        await fs.copyFile(inputPath, outputPath);
    }
}

async function compressGeneric(inputPath, outputPath) {
    try {
        const data = await fs.readFile(inputPath);
        const compressed = await gzipAsync(data, { level: 9 });
        await fs.writeFile(outputPath, compressed);
    } catch (error) {
        console.error(`Generic compression failed for ${inputPath}:`, error.message);
        await fs.copyFile(inputPath, outputPath);
    }
}

// Limpieza periódica de archivos antiguos
async function cleanupOldFiles() {
    const directories = ['uploads', 'public/compressed'];
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    for (const dir of directories) {
        try {
            const files = await fs.readdir(dir);
            const now = Date.now();

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);
                const age = now - stats.mtimeMs;

                if (age > maxAge) {
                    await fs.unlink(filePath);
                    console.log(`Deleted old file: ${filePath}`);
                }
            }
        } catch (error) {
            console.error(`Error cleaning up ${dir}: ${error.message}`);
        }
    }
}

// Ejecutar limpieza cada 24 horas
setInterval(cleanupOldFiles, 24 * 60 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Started at ${new Date().toISOString()}`);
});