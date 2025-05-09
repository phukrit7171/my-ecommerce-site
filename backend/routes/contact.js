const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    res.json(
        {
            contactSubject:
                [
                    'Software Developer',
                    'System Administrator',
                    'Data Analyst',
                    'Cybersecurity Specialist',
                    'Cloud Engineer',
                    'UX/UI Designer',
                    'Other',
                    'Phu'
                ]
        }
    );
});

module.exports = routes;