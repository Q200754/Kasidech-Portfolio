const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { logAction } = require('../services/logService');

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM skills ORDER BY display_order ASC, name ASC');
    res.json({ success: true, skills: result.rows });
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/skills (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, category, icon, description_th, description_en, level, display_order, enabled } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill Name and Category are required.' });
    }

    const enabledVal = enabled === undefined ? 1 : (enabled ? 1 : 0);
    const orderVal = display_order ? parseInt(display_order) : 0;
    const levelVal = level ? parseInt(level) : 0;

    const result = await db.query(`
      INSERT INTO skills (name, category, icon, description_th, description_en, level, display_order, enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, category, icon || 'Cpu', description_th || '', description_en || '', levelVal, orderVal, enabledVal]);

    await logAction(`Create Skill "${name}"`, req.user.email);

    res.status(201).json({ 
      success: true, 
      message: 'Skill created successfully.', 
      skillId: result.insertId 
    });
  } catch (err) {
    console.error('Error creating skill:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/skills/:id (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, icon, description_th, description_en, level, display_order, enabled } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill Name and Category are required.' });
    }

    const enabledVal = enabled === undefined ? 1 : (enabled ? 1 : 0);
    const orderVal = display_order ? parseInt(display_order) : 0;
    const levelVal = level ? parseInt(level) : 0;

    const check = await db.query('SELECT * FROM skills WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    await db.query(`
      UPDATE skills SET 
        name = ?, category = ?, icon = ?, description_th = ?, 
        description_en = ?, level = ?, display_order = ?, enabled = ?
      WHERE id = ?
    `, [name, category, icon, description_th, description_en, levelVal, orderVal, enabledVal, id]);

    await logAction(`Update Skill "${name}"`, req.user.email);

    res.json({ success: true, message: 'Skill updated successfully.' });
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// DELETE /api/skills/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const check = await db.query('SELECT * FROM skills WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    const skillName = check.rows[0].name;
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    await logAction(`Delete Skill "${skillName}"`, req.user.email);

    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
