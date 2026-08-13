const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/logs (Protected - lists audit logs)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM activity_logs ORDER BY date_time DESC LIMIT 100');
    res.json({ success: true, logs: result.rows });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
