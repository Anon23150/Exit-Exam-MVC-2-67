const express = require('express');
const bodyParser = require('body-parser');
const petController = require('./controllers/petController');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes (แสดงหน้า HTML)
app.get('/', petController.getReportPage);
app.get('/phoenix', (req, res) => res.sendFile(__dirname + '/views/phoenix.html'));
app.get('/dragon', (req, res) => res.sendFile(__dirname + '/views/dragon.html'));
app.get('/owl', (req, res) => res.sendFile(__dirname + '/views/owl.html'));

// Routes (บันทึกข้อมูลสัตว์)
app.post('/submit/phoenix', petController.addPhoenix);
app.post('/submit/dragon', petController.addDragon);
app.post('/submit/owl', petController.addOwl);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
