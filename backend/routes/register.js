const express = require('express');
const routes = express.Router();
const fs = require('fs');
const path = require('path');

routes.post('/', (req, res) => {
    console.log('🚀 Registration request received');
    const {firstName, lastName, category, occupation, email, password} = req.body;
    console.log('📝 Request body:', req.body);
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
                console.error('❌ Error reading user file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            let users = [];
            if (data) {
                users = JSON.parse(data);
                console.log('👥 Current number of users:', users.length);
            }
            
            // Check if the email already exists
            const emailExists = users.find(user => user.email === email);
            console.log('🔍 Checking email:', email, 'exists:', !!emailExists);
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            
            users.push(userData);
            fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('❌ Error writing to user file:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('✅ User registration successful for:', email);
                res.status(200).json({ message: 'Registration successful!' });
            });
        });
    } else {
        console.log('⚠️ Invalid input - missing required fields');
        res.status(400).json({ message: 'Invalid input' });
    }
});

module.exports = routes;