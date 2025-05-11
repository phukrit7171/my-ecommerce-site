const express = require('express');
const routes = express.Router();
const fs = require('fs');
const path = require('path');

routes.post('/', (req, res) => {
    const {firstName, lastName, category, occupation, email, password} = req.body;
    console.log(req.body);
    if (firstName && lastName && category && occupation && email && password) {
        const userData = {
            firstName,
            lastName,
            category,
            occupation,
            email,
            password
        };
        const filePath = path.join(__dirname, '../data/user.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            let users = [];
            if (data) {
                users = JSON.parse(data);
            }
            
            // Check if the email already exists
            const emailExists = users.find(user => user.email === email);
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            
            users.push(userData);
            fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.status(200).json({ message: 'Registration successful!' });
            });
        });
    } else {
        res.status(400).json({ message: 'Invalid input' });
    }
});

module.exports = routes;