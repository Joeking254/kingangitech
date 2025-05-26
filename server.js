const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve static files from current directory

// Setup multer for image uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

const portfolioDataPath = path.join(__dirname, 'portfolio-data.json');

// Helper function to read portfolio data
function readPortfolioData() {
    try {
        const data = fs.readFileSync(portfolioDataPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write portfolio data
function writePortfolioData(data) {
    fs.writeFileSync(portfolioDataPath, JSON.stringify(data, null, 2));
}

// Get all portfolio items
app.get('/api/portfolio', (req, res) => {
    const portfolio = readPortfolioData();
    res.json(portfolio);
});

// Add a new portfolio item
app.post('/api/portfolio', (req, res) => {
    const portfolio = readPortfolioData();
    const newItem = req.body;

    if (!newItem.image || !newItem.title) {
        return res.status(400).json({ error: 'Image and title are required' });
    }

    newItem.id = Date.now().toString();
    portfolio.push(newItem);
    writePortfolioData(portfolio);
    res.status(201).json(newItem);
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the relative path to the uploaded file
    const relativePath = path.relative(__dirname, req.file.path).replace(/\\\\/g, '/').replace(/\\/g, '/');
    res.json({ filename: relativePath });
});

// Update a portfolio item with optional image upload
app.put('/api/portfolio/:id', upload.single('image'), (req, res) => {
    const portfolio = readPortfolioData();
    const id = req.params.id;
    const index = portfolio.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Portfolio item not found' });
    }

    let updatedItem = { ...portfolio[index], id };

    if (req.file) {
        // If new image uploaded, update image path
        const relativePath = path.relative(__dirname, req.file.path).replace(/\\\\/g, '/').replace(/\\/g, '/');
        updatedItem.image = relativePath;
    }

    if (req.body.title) {
        updatedItem.title = req.body.title;
    }

    portfolio[index] = updatedItem;
    writePortfolioData(portfolio);
    res.json(updatedItem);
});

// Delete a portfolio item
app.delete('/api/portfolio/:id', (req, res) => {
    let portfolio = readPortfolioData();
    const id = req.params.id;
    const initialLength = portfolio.length;
    portfolio = portfolio.filter(item => item.id !== id);

    if (portfolio.length === initialLength) {
        return res.status(404).json({ error: 'Portfolio item not found' });
    }

    writePortfolioData(portfolio);
    res.json({ message: 'Portfolio item deleted' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
