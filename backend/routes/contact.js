const routes = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '../data/contact.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the contact database.");
    }
});

db.run(`CREATE TABLE IF NOT EXISTS contact (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        fname TEXT,
        lname TEXT, 
        email TEXT,
        subject TEXT, 
        message TEXT,
        submittedAt DATE)`, (tableErr) => {
    if (tableErr) {
        console.error("Error creating table:", tableErr.message);
    } else {
        console.log("Contact table created or already exists.");
    }
});


routes.post('/', (req, res) => {
    console.log('🚀 Contact request received');
    const { fname, lname, email, subject, message } = req.body;
    console.log('📝 Request body:', req.body);
    if (fname && lname && email && subject && message) {
        const submittedAt = new Date().toISOString();
        const sql = `INSERT INTO contact (fname, lname, email, subject, message, submittedAt) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [fname, lname, email, subject, message, submittedAt], function (err) {
            if (err) {
                console.error('❌ Error inserting data:', err.message);
                return res.status(500).json({ message: 'Internal server error' });
            }
            console.log('✅ Contact form submission successful for:', email);
            res.status(200).json({ message: 'Contact form submission successful!' });
        });
    } else {
        console.log('⚠️ Invalid input - missing required fields');
        res.status(400).json({ message: 'Invalid input' });
    }
});


routes.get('/', (req, res) => {
    const sql = `SELECT * FROM contact ORDER BY submittedAt DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching data:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('📋 Fetched contact form submissions:', rows);
        res.status(200).json(rows);
    });
});

routes.get('/:action', (req, res) => {
    const { action } = req.params;
    switch (action) {
        case 'all':
            const sql = `SELECT * FROM contact ORDER BY submittedAt DESC`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching data:', err.message);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('📋 Fetched contact form submissions:', rows);
                res.status(200).json(rows);
            });
            break;
        case 'last':
            const sqlLast = `SELECT * FROM contact ORDER BY submittedAt DESC LIMIT 1`; // or const sqlLast = `SELECT * FROM contact  WHERE id = (SELECT MAX(id) FROM contact)`;
            db.all(sqlLast, [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching data:', err.message);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('📋 Fetched last contact form submission:', rows);
                res.status(200).json(rows);
            });
            break;
        case 'deleteLast':
            const sqlDeleteLast = `DELETE FROM contact WHERE id = (SELECT MAX(id) FROM contact)`;
            db.run(sqlDeleteLast, [], (err) => {
                if (err) {
                    console.error('❌ Error deleting last entry:', err.message);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('✅ Last contact form submission deleted');
                res.status(200).json({ message: 'Last contact form submission deleted' });
            });
            break;
        case 'deleteAll':
            const sqlDeleteAll = `DELETE FROM contact`;
            db.run(sqlDeleteAll, [], (err) => {
                if (err) {
                    console.error('❌ Error deleting all entries:', err.message);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log('✅ All contact form submissions deleted');
                res.status(200).json({ message: 'All contact form submissions deleted' });
            });
            break;
        case 'delete':
            const idToDelete = req.query.id;
            if (!idToDelete) {
                return res.status(400).json({ message: 'ID parameter is required' });
            }
            const sqlDelete = `DELETE FROM contact WHERE id = ?`;
            db.run(sqlDelete, [idToDelete], (err) => {
                if (err) {
                    console.error('❌ Error deleting entry:', err.message);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                console.log(`✅ Contact form submission with ID ${idToDelete} deleted`);
                res.status(200).json({ message: `Contact form submission with ID ${idToDelete} deleted` });
            });
            break;
        default:
            res.status(400).json({ message: 'action not found' });
            break;
    }
});

module.exports = routes;