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
    
    // save data to database (now is testing only use just in  ../models/contacts.json)
    const filePath = path.join(__dirname, '../models/contacts.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        let contacts = [];
        try {
            contacts = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!Array.isArray(contacts)) {
            contacts = [];  // Ensure contacts is an array
        }
        
        // Add new contact to the array
        contacts.push({ fname, lname, email, subject, message });
        
        // Write updated contacts back to the file
        fs.writeFile(filePath, JSON.stringify(contacts, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ error: 'Internal server error' });
            }
            
            console.log('Contact saved successfully');
        });
    });
    
    res.status(200)
    
});

module.exports = routes;