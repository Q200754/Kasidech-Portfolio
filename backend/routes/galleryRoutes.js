const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const storageService = require('../services/storageService');
const { logAction } = require('../services/logService');

// GET /api/gallery
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gallery ORDER BY upload_date DESC, id DESC');
    res.json({ success: true, gallery: result.rows });
  } catch (err) {
    console.error('Error fetching gallery:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/gallery (Protected, handles single image upload)
router.post('/', authMiddleware, storageService.uploadSingle('galleryImage'), async (req, res) => {
  try {
    const { category, title_th, title_en, description_th, description_en } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }

    const fileMeta = storageService.processUploadedFile(req.file);

    const result = await db.query(`
      INSERT INTO gallery (
        image_url, category, title_th, title_en, description_th, description_en,
        file_size, file_type, upload_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      fileMeta.url, category, title_th || '', title_en || '', description_th || '', description_en || '',
      fileMeta.fileSize, fileMeta.fileType, fileMeta.uploadDate
    ]);

    await logAction(`Upload Gallery Image "${title_en || fileMeta.fileName}"`, req.user.email);

    res.status(201).json({ 
      success: true, 
      message: 'Gallery image uploaded successfully.',
      image: {
        id: result.insertId,
        image_url: fileMeta.url,
        category,
        title_th,
        title_en,
        description_th,
        description_en,
        file_size: fileMeta.fileSize,
        file_type: fileMeta.fileType,
        upload_date: fileMeta.uploadDate
      }
    });
  } catch (err) {
    console.error('Error uploading gallery image:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// DELETE /api/gallery/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM gallery WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Gallery image not found.' });
    }

    const image = check.rows[0];

    // Delete image file from local storage
    if (image.image_url && image.image_url.startsWith('/uploads/') && !image.image_url.includes('gallery_')) {
      const fileName = image.image_url.replace('/uploads/', '');
      await storageService.deleteFile(fileName);
    }

    await db.query('DELETE FROM gallery WHERE id = ?', [id]);
    await logAction(`Delete Gallery Image "${image.title_en || image.image_url}"`, req.user.email);

    res.json({ success: true, message: 'Gallery image deleted successfully.' });
  } catch (err) {
    console.error('Error deleting gallery image:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
