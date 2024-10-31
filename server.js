const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const mammoth = require('mammoth');

const app = express();
const port = 3000;

// Enable file upload
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
}));

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const file = req.files.file;
    const fileId = uuidv4();
    const fileExt = path.extname(file.name);
    const fileName = fileId + fileExt;
    const filePath = path.join(__dirname, 'uploads', fileName);

    file.mv(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const fileUrl = `http://localhost:${port}/uploads/${fileName}`;
        res.json({ 
            success: true,
            fileUrl,
            fileName: file.name,
            id: fileId
        });
    });
});

app.post('/convert-word', async (req, res) => {
    try {
        const { fileId } = req.body;
        if (!fileId) {
            return res.status(400).json({ error: 'No file ID provided' });
        }

        // Find the file in uploads directory
        const files = fs.readdirSync('uploads');
        const file = files.find(f => f.startsWith(fileId));
        
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.join(__dirname, 'uploads', file);
        
        // Convert Word to HTML
        const result = await mammoth.convertToHtml({ path: filePath });
        
        res.json({
            success: true,
            html: result.value
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Cleanup old files periodically (every hour)
setInterval(() => {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) return;

        files.forEach(file => {
            const filePath = path.join(uploadsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;

                // Remove files older than 1 hour
                if (Date.now() - stats.mtime.getTime() > 3600000) {
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
}, 3600000);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
