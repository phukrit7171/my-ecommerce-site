const express = require('express');
const routes = express.Router();
const fs = require('fs');
const path = require('path');

routes.post('/', (req, res) => {
    const { email, password } = req.body;
    console.log('[Login] Attempt -', { email });
    if (email && password) {
        const filePath = path.join(__dirname, '../data/user.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading user file:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            let users = [];
            if (data) {
                users = JSON.parse(data);
                console.log('[Login] Loaded users from file -', { count: users.length });
            }
            // Find user where email (username) and password match
            const user = users.find(u => u.email === email);
            console.log('[Login] User found? -', { found: !!user });
            if (!user || user.password !== password) {
                console.log('[Login] Authentication failed -', { email });
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            console.log('[Login] Authentication successful -', { email });
            return res.status(200).json({ 
                message: 'Login successful!',
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        });
    } else {
        res.status(400).json({ message: 'Email and password are required' });
    }
});

module.exports = routes;
