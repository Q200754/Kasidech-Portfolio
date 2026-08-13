const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const storageService = require('../services/storageService');
const { logAction } = require('../services/logService');

// GET /api/resume (Public - gets current active resume)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM resumes WHERE is_current = 1 OR is_current = true LIMIT 1');
    if (result.rows.length === 0) {
      // Fallback to latest uploaded if no active one is explicitly set
      const latest = await db.query('SELECT * FROM resumes ORDER BY upload_date DESC LIMIT 1');
      if (latest.rows.length === 0) {
        return res.json({ success: true, resume: null });
      }
      return res.json({ success: true, resume: latest.rows[0] });
    }
    res.json({ success: true, resume: result.rows[0] });
  } catch (err) {
    console.error('Error fetching active resume:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// GET /api/resume/list (Protected - lists all resumes for admin)
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM resumes ORDER BY upload_date DESC');
    // Ensure boolean properties are parsed correctly for response
    const list = result.rows.map(r => ({
      ...r,
      is_current: !!r.is_current
    }));
    res.json({ success: true, resumes: list });
  } catch (err) {
    console.error('Error fetching resume list:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/resume/upload (Protected - uploads a new resume PDF)
router.post('/upload', authMiddleware, storageService.uploadSingle('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required.' });
    }

    const fileMeta = storageService.processUploadedFile(req.file);

    // If this is the first resume, set it as current active automatically
    const countCheck = await db.query('SELECT COUNT(*) as count FROM resumes');
    const count = parseInt(countCheck.rows[0].count || '0');
    const isCurrentVal = count === 0 ? 1 : 0;

    const result = await db.query(`
      INSERT INTO resumes (file_name, file_path, file_size, upload_date, is_current)
      VALUES (?, ?, ?, ?, ?)
    `, [req.file.originalname, fileMeta.url, fileMeta.fileSize, fileMeta.uploadDate, isCurrentVal]);

    await logAction(`Upload Resume "${req.file.originalname}"`, req.user.email);

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully.',
      resume: {
        id: result.insertId,
        file_name: req.file.originalname,
        file_path: fileMeta.url,
        file_size: fileMeta.fileSize,
        upload_date: fileMeta.uploadDate,
        is_current: !!isCurrentVal
      }
    });
  } catch (err) {
    console.error('Error uploading resume:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/resume/:id/active (Protected - sets active resume)
router.put('/:id/active', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM resumes WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const isSQLite = process.env.DB_TYPE !== 'postgres' && process.env.DB_TYPE !== 'mysql';
    const falseVal = 0;
    const trueVal = 1;

    // Reset current active states
    await db.query('UPDATE resumes SET is_current = ?', [falseVal]);
    
    // Set this one as active
    await db.query('UPDATE resumes SET is_current = ? WHERE id = ?', [trueVal, id]);

    await logAction(`Set Active Resume ID ${id}`, req.user.email);

    res.json({ success: true, message: 'Active resume updated successfully.' });
  } catch (err) {
    console.error('Error updating active resume:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// DELETE /api/resume/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM resumes WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const resume = check.rows[0];

    // Delete PDF file from local storage
    if (resume.file_path && resume.file_path.startsWith('/uploads/')) {
      const fileName = resume.file_path.replace('/uploads/', '');
      await storageService.deleteFile(fileName);
    }

    await db.query('DELETE FROM resumes WHERE id = ?', [id]);
    await logAction(`Delete Resume "${resume.file_name}"`, req.user.email);

    // If deleted the active one, mark the latest uploaded one as active
    if (resume.is_current) {
      const latest = await db.query('SELECT id FROM resumes ORDER BY upload_date DESC LIMIT 1');
      if (latest.rows.length > 0) {
        await db.query('UPDATE resumes SET is_current = 1 WHERE id = ?', [latest.rows[0].id]);
      }
    }

    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    console.error('Error deleting resume:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
