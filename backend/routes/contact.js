const express = require('express');
const routes = express.Router();
const fs = require('fs');
const path = require('path');

// Add middleware to support JSON and URL-encoded form bodies
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.post('/', (req, res) => {
    // Fixed destructuring with fallback
    const { fname, lname, email, subject, message } = req.body || {};
    // Correct logging of submitted data
    console.log(req.body);
    res.status(200)
    // save data to database (now is testing only use just in  ../models/contacts.json)
    const filePath = path.join(__dirname, '../models/contacts.json');
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Internal Server Error');
        }
    });
    
    
});

module.exports = routes;