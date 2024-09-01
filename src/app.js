require('dotenv').config();
const express = require('express');
const path = require('path');
const JOBS = require('./jobs');
const mustacheExpress = require('mustache-express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


const app = express();

//configuire bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, 'pages/index.html'));
    res.render('index', { jobs: JOBS });
});

// route for job.mustache
app.get('/jobs:id', (req, res) => {
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
    console.log('req.params', req.params);
    console.log('matchedJob', matchedJob);
    res.render('job', { job: matchedJob });
})

const transporter = nodemailer.createTransport({ 
    host: 'mail.gmx.com',
    port: 587,
    secure: false,
    auth: { 
        user: process.env.EMAIL_ID, 
        pass: process.env.EMAIL_PASSWORD,
    }
});

// To allow application submission
app.post('/jobs/:id/apply', (req, res) => {
    const { name, email, phone, dob, position, coverletter } = req.body; 
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);

    console.log('req.body', req.body);
    console.log('matchedJob', matchedJob);

    res.send("Got the application!");

    const mailOptions = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID,
        subject: `New Application for ${matchedJob.title}`,
        html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Cover Letter:</strong> ${coverletter}</p>
            `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).render('applied');
        }
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});