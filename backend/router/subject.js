const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ contactSubject: ['Software Developer', 'System Administrator', 'Data Analyst', 'Cybersecurity Specialist', 'Cloud Engineer', 'UX/UI Designer', 'Other'] });
});

module.exports = router;