const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello Worldd');
});

const port = process.envPORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});