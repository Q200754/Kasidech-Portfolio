const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { logAction } = require('../services/logService');

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM settings');
    // Map rows into a key-value object
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key_name] = row.value_data;
    });
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/settings (Protected - updates multiple settings at once)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const settingsObject = req.body; // Expects { key: value, key2: value2 }

    if (!settingsObject || typeof settingsObject !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings format.' });
    }

    for (const [key, val] of Object.entries(settingsObject)) {
      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);

      // Check if key exists
      const check = await db.query('SELECT * FROM settings WHERE key_name = ?', [key]);

      if (check.rows.length > 0) {
        await db.query('UPDATE settings SET value_data = ? WHERE key_name = ?', [valStr, key]);
      } else {
        await db.query('INSERT INTO settings (key_name, value_data) VALUES (?, ?)', [key, valStr]);
      }
    }

    await logAction('Update Website Settings', req.user.email);
    
    // Fetch updated settings
    const updatedRes = await db.query('SELECT * FROM settings');
    const settings = {};
    updatedRes.rows.forEach(row => {
      settings[row.key_name] = row.value_data;
    });

    res.json({ success: true, message: 'Settings updated successfully.', settings });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
