const express = require('express');
const routes = express.Router();
const fs = require('fs');
const path = require('path');

routes.post('/', (req, res) => {
    console.log('🚀 subscribe request received');
    const {email} = req.body;
    const subscribeData = {
        email: email,
        subscribeDate: new Date().toISOString()
    };
    console.log('📝 Request body:', subscribeData);
    if (email) {
        const filePath = path.join(__dirname, '../data/subscribe.json');
        try {
            let emails = [];
            try {
                const data = fs.readFileSync(filePath, { encoding: 'utf8' });
                if (data) {
                    emails = JSON.parse(data);
                    console.log('👥 Current number of emails:', emails.length);
                }
            } catch (err) {
                if (err.code !== 'ENOENT') { // If error is not 'file not found'
                    throw err;
                }
            }
            
            // Check if the email already exists
            const emailExists = emails.find((e) => e.email === email);
            console.log('🔍 Checking email:', email, 'exists:', !!emailExists);
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Add new email
            emails.push(subscribeData);
            console.log('✨ Adding new email to list');

            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
            console.log('✅ Email list updated successfully');
            res.status(200).json({ message: 'Subscription successful' });
        } catch (err) {
            console.error('❌ Error handling subscription:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(400).json({ message: 'Email is required' });
    }
});

module.exports = routes;