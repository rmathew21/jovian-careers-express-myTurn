const express = require('express');
const path = require('path');
const JOBS = require('./jobs');
const app = express();
const mustacheExpress = require('mustache-express');

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'pages/index.html'));
    res.render('index', { jobs: JOBS });
});

const port = process.envPORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});