const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const storageService = require('../services/storageService');
const { logAction } = require('../services/logService');

// Helper to compile activities with images
async function getAllActivitiesWithImages() {
  const activitiesRes = await db.query('SELECT * FROM activities ORDER BY date DESC, id DESC');
  const imagesRes = await db.query('SELECT * FROM activity_images ORDER BY activity_id, display_order ASC');
  
  const imagesMap = {};
  imagesRes.rows.forEach(img => {
    if (!imagesMap[img.activity_id]) imagesMap[img.activity_id] = [];
    imagesMap[img.activity_id].push(img);
  });

  return activitiesRes.rows.map(act => ({
    ...act,
    images: imagesMap[act.id] || []
  }));
}

// GET /api/activities
router.get('/', async (req, res) => {
  try {
    const activities = await getAllActivitiesWithImages();
    res.json({ success: true, activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/activities (Protected)
router.post('/', authMiddleware, storageService.uploadMultiple('images', 10), async (req, res) => {
  try {
    const {
      name_th, name_en, date, location_th, location_en,
      description_th, description_en, category,
      achievement_th, achievement_en, organization_th, organization_en
    } = req.body;

    if (!name_th || !name_en || !category) {
      return res.status(400).json({ success: false, message: 'Activity Name (TH/EN) and Category are required.' });
    }

    const actResult = await db.query(`
      INSERT INTO activities (
        name_th, name_en, date, location_th, location_en,
        description_th, description_en, category,
        achievement_th, achievement_en, organization_th, organization_en
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name_th, name_en, date || '', location_th || '', location_en || '',
      description_th || '', description_en || '', category,
      achievement_th || '', achievement_en || '', organization_th || '', organization_en || ''
    ]);

    const activityId = actResult.insertId;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const fileMeta = storageService.processUploadedFile(req.files[i]);
        await db.query(`
          INSERT INTO activity_images (activity_id, image_url, display_order)
          VALUES (?, ?, ?)
        `, [activityId, fileMeta.url, i]);
      }
    }

    await logAction(`Create Activity "${name_en}"`, req.user.email);

    res.status(201).json({ success: true, message: 'Activity created successfully.', activityId });
  } catch (err) {
    console.error('Error creating activity:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/activities/:id (Protected)
router.put('/:id', authMiddleware, storageService.uploadMultiple('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_th, name_en, date, location_th, location_en,
      description_th, description_en, category,
      achievement_th, achievement_en, organization_th, organization_en,
      deleteImageIds // JSON array string of activity image IDs to delete
    } = req.body;

    if (!name_th || !name_en || !category) {
      return res.status(400).json({ success: false, message: 'Activity Name (TH/EN) and Category are required.' });
    }

    const check = await db.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }

    // Update main details
    await db.query(`
      UPDATE activities SET
        name_th = ?, name_en = ?, date = ?, location_th = ?, location_en = ?,
        description_th = ?, description_en = ?, category = ?,
        achievement_th = ?, achievement_en = ?, organization_th = ?, organization_en = ?
      WHERE id = ?
    `, [
      name_th, name_en, date, location_th, location_en,
      description_th, description_en, category,
      achievement_th, achievement_en, organization_th, organization_en, id
    ]);

    // Handle image deletions
    if (deleteImageIds) {
      try {
        const idsToDelete = JSON.parse(deleteImageIds);
        if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
          for (const imgId of idsToDelete) {
            const imgCheck = await db.query('SELECT * FROM activity_images WHERE id = ? AND activity_id = ?', [imgId, id]);
            if (imgCheck.rows.length > 0) {
              const imgUrl = imgCheck.rows[0].image_url;
              if (imgUrl.startsWith('/uploads/') && !imgUrl.includes('gallery_')) {
                const fName = imgUrl.replace('/uploads/', '');
                await storageService.deleteFile(fName);
              }
              await db.query('DELETE FROM activity_images WHERE id = ?', [imgId]);
            }
          }
        }
      } catch (err) {
        console.error('Error parsing deleteImageIds:', err.message);
      }
    }

    // Handle new image uploads (appended)
    if (req.files && req.files.length > 0) {
      const orderCheck = await db.query('SELECT MAX(display_order) as max_order FROM activity_images WHERE activity_id = ?', [id]);
      let maxOrder = orderCheck.rows[0].max_order !== null ? orderCheck.rows[0].max_order : -1;

      for (let i = 0; i < req.files.length; i++) {
        const fileMeta = storageService.processUploadedFile(req.files[i]);
        await db.query(`
          INSERT INTO activity_images (activity_id, image_url, display_order)
          VALUES (?, ?, ?)
        `, [id, fileMeta.url, maxOrder + 1 + i]);
      }
    }

    await logAction(`Update Activity "${name_en}"`, req.user.email);

    res.json({ success: true, message: 'Activity updated successfully.' });
  } catch (err) {
    console.error('Error updating activity:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// DELETE /api/activities/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }

    const activity = check.rows[0];

    // Get all activity images to delete files
    const images = await db.query('SELECT * FROM activity_images WHERE activity_id = ?', [id]);
    for (const img of images.rows) {
      if (img.image_url.startsWith('/uploads/') && !img.image_url.includes('gallery_')) {
        const fileName = img.image_url.replace('/uploads/', '');
        await storageService.deleteFile(fileName);
      }
    }

    // Delete DB rows
    await db.query('DELETE FROM activity_images WHERE activity_id = ?', [id]);
    await db.query('DELETE FROM activities WHERE id = ?', [id]);

    await logAction(`Delete Activity "${activity.name_en}"`, req.user.email);

    res.json({ success: true, message: 'Activity deleted successfully.' });
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
