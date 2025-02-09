const express = require('express');
const bodyParser = require('body-parser');
const petController = require('./controllers/petController');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes (ให้ Controller ส่งไฟล์ View)
app.get('/', petController.getReportPage);
app.get('/phoenix', petController.getPhoenixForm);
app.get('/dragon', petController.getDragonForm);
app.get('/owl', petController.getOwlForm);

// Routes (ให้ Controller รับข้อมูลสัตว์เลี้ยง)
app.post('/submit/phoenix', petController.addPhoenix);
app.post('/submit/dragon', petController.addDragon);
app.post('/submit/owl', petController.addOwl);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
