const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const storageService = require('../services/storageService');
const { logAction } = require('../services/logService');

// GET /api/certificates
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM certificates ORDER BY issue_date DESC, name_en ASC');
    res.json({ success: true, certificates: result.rows });
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/certificates (Protected, handles certificate image upload)
router.post('/', authMiddleware, storageService.uploadSingle('certificateImage'), async (req, res) => {
  try {
    const {
      name_th, name_en, organization_th, organization_en,
      certificate_id, issue_date, category, verification_url, description_th, description_en
    } = req.body;

    if (!name_th || !name_en || !category) {
      return res.status(400).json({ success: false, message: 'Certificate Name (TH/EN) and Category are required.' });
    }

    let certificateImageUrl = '';
    if (req.file) {
      const fileMeta = storageService.processUploadedFile(req.file);
      certificateImageUrl = fileMeta.url;
    }

    const result = await db.query(`
      INSERT INTO certificates (
        name_th, name_en, organization_th, organization_en, certificate_id, issue_date,
        category, certificate_image, verification_url, description_th, description_en
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name_th, name_en, organization_th || '', organization_en || '',
      certificate_id || '', issue_date || '', category, certificateImageUrl,
      verification_url || '', description_th || '', description_en || ''
    ]);

    await logAction(`Create Certificate "${name_en}"`, req.user.email);

    res.status(201).json({ success: true, message: 'Certificate created successfully.', certificateId: result.insertId });
  } catch (err) {
    console.error('Error creating certificate:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/certificates/:id (Protected, handles optional certificate image update)
router.put('/:id', authMiddleware, storageService.uploadSingle('certificateImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_th, name_en, organization_th, organization_en,
      certificate_id, issue_date, category, verification_url, description_th, description_en
    } = req.body;

    if (!name_th || !name_en || !category) {
      return res.status(400).json({ success: false, message: 'Certificate Name (TH/EN) and Category are required.' });
    }

    const check = await db.query('SELECT * FROM certificates WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    const currentCert = check.rows[0];
    let certificateImageUrl = currentCert.certificate_image;

    if (req.file) {
      const fileMeta = storageService.processUploadedFile(req.file);
      certificateImageUrl = fileMeta.url;

      // Delete old local file
      if (currentCert.certificate_image && currentCert.certificate_image.startsWith('/uploads/') && !currentCert.certificate_image.includes('cert_')) {
        const oldFileName = currentCert.certificate_image.replace('/uploads/', '');
        await storageService.deleteFile(oldFileName);
      }
    }

    await db.query(`
      UPDATE certificates SET
        name_th = ?, name_en = ?, organization_th = ?, organization_en = ?,
        certificate_id = ?, issue_date = ?, category = ?, certificate_image = ?,
        verification_url = ?, description_th = ?, description_en = ?
      WHERE id = ?
    `, [
      name_th, name_en, organization_th, organization_en,
      certificate_id, issue_date, category, certificateImageUrl,
      verification_url, description_th, description_en, id
    ]);

    await logAction(`Update Certificate "${name_en}"`, req.user.email);

    res.json({ success: true, message: 'Certificate updated successfully.' });
  } catch (err) {
    console.error('Error updating certificate:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// DELETE /api/certificates/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM certificates WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    const cert = check.rows[0];

    // Delete image file from local storage
    if (cert.certificate_image && cert.certificate_image.startsWith('/uploads/') && !cert.certificate_image.includes('cert_')) {
      const fileName = cert.certificate_image.replace('/uploads/', '');
      await storageService.deleteFile(fileName);
    }

    await db.query('DELETE FROM certificates WHERE id = ?', [id]);
    await logAction(`Delete Certificate "${cert.name_en}"`, req.user.email);

    res.json({ success: true, message: 'Certificate deleted successfully.' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
