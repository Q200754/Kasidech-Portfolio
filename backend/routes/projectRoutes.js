const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const storageService = require('../services/storageService');
const { logAction } = require('../services/logService');

// Helper to compile projects with screenshots
async function getAllProjectsWithImages() {
  const projectsRes = await db.query('SELECT * FROM projects ORDER BY featured DESC, start_date DESC');
  const imagesRes = await db.query('SELECT * FROM project_images ORDER BY project_id, display_order ASC');
  
  const imagesMap = {};
  imagesRes.rows.forEach(img => {
    if (!imagesMap[img.project_id]) imagesMap[img.project_id] = [];
    imagesMap[img.project_id].push(img);
  });

  return projectsRes.rows.map(proj => ({
    ...proj,
    featured: !!proj.featured,
    screenshots: imagesMap[proj.id] || []
  }));
}

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjectsWithImages();
    res.json({ success: true, projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/projects (Protected)
router.post('/', authMiddleware, storageService.uploadFields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]), async (req, res) => {
  try {
    const {
      name_th, name_en, slug, description_th, description_en,
      full_description_th, full_description_en, category,
      technologies, github_url, live_demo_url, start_date, end_date, featured, status
    } = req.body;

    if (!name_th || !name_en || !category) {
      return res.status(400).json({ success: false, message: 'Project Name (TH/EN) and Category are required.' });
    }

    // Auto-generate slug if not provided
    let finalSlug = slug || name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Ensure unique slug
    const slugCheck = await db.query('SELECT * FROM projects WHERE slug = ?', [finalSlug]);
    if (slugCheck.rows.length > 0) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const featuredVal = featured === 'true' || featured === true || featured === 1 ? 1 : 0;
    const projectStatus = status || 'Completed';

    // File uploads
    let coverImageUrl = '';
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const coverMeta = storageService.processUploadedFile(req.files.coverImage[0]);
      coverImageUrl = coverMeta.url;
    }

    const projResult = await db.query(`
      INSERT INTO projects (
        name_th, name_en, slug, description_th, description_en,
        full_description_th, full_description_en, cover_image, category,
        technologies, github_url, live_demo_url, start_date, end_date, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name_th, name_en, finalSlug, description_th || '', description_en || '',
      full_description_th || '', full_description_en || '', coverImageUrl, category,
      technologies || '', github_url || '', live_demo_url || '', start_date || '', end_date || '',
      featuredVal, projectStatus
    ]);

    const projectId = projResult.insertId;

    // Handle multiple screenshot uploads
    if (req.files && req.files.screenshots && req.files.screenshots.length > 0) {
      for (let i = 0; i < req.files.screenshots.length; i++) {
        const screenshotMeta = storageService.processUploadedFile(req.files.screenshots[i]);
        await db.query(`
          INSERT INTO project_images (project_id, image_url, display_order)
          VALUES (?, ?, ?)
        `, [projectId, screenshotMeta.url, i]);
      }
    }

    await logAction(`Create Project "${name_en}"`, req.user.email);

    res.status(201).json({ success: true, message: 'Project created successfully.', projectId });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/projects/:id (Protected)
router.put('/:id', authMiddleware, storageService.uploadFields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_th, name_en, slug, description_th, description_en,
      full_description_th, full_description_en, category,
      technologies, github_url, live_demo_url, start_date, end_date, featured, status,
      deleteScreenshotIds // JSON array string of image IDs to delete
    } = req.body;

    if (!name_th || !name_en || !category) {
      return res.status(400).json({ success: false, message: 'Project Name (TH/EN) and Category are required.' });
    }

    const check = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const currentProject = check.rows[0];
    const featuredVal = featured === 'true' || featured === true || featured === 1 ? 1 : 0;
    const projectStatus = status || currentProject.status;
    let finalSlug = slug || currentProject.slug;

    // Cover image update
    let coverImageUrl = currentProject.cover_image;
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const coverMeta = storageService.processUploadedFile(req.files.coverImage[0]);
      coverImageUrl = coverMeta.url;

      // Delete old local file
      if (currentProject.cover_image && currentProject.cover_image.startsWith('/uploads/') && !currentProject.cover_image.includes('project_')) {
        const oldFileName = currentProject.cover_image.replace('/uploads/', '');
        await storageService.deleteFile(oldFileName);
      }
    }

    // Update fields
    await db.query(`
      UPDATE projects SET
        name_th = ?, name_en = ?, slug = ?, description_th = ?, description_en = ?,
        full_description_th = ?, full_description_en = ?, cover_image = ?, category = ?,
        technologies = ?, github_url = ?, live_demo_url = ?, start_date = ?, end_date = ?,
        featured = ?, status = ?
      WHERE id = ?
    `, [
      name_th, name_en, finalSlug, description_th, description_en,
      full_description_th, full_description_en, coverImageUrl, category,
      technologies, github_url, live_demo_url, start_date, end_date,
      featuredVal, projectStatus, id
    ]);

    // Handle screenshot deletions if requested
    if (deleteScreenshotIds) {
      try {
        const idsToDelete = JSON.parse(deleteScreenshotIds);
        if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
          for (const imgId of idsToDelete) {
            const imgCheck = await db.query('SELECT * FROM project_images WHERE id = ? AND project_id = ?', [imgId, id]);
            if (imgCheck.rows.length > 0) {
              const imgUrl = imgCheck.rows[0].image_url;
              // Remove file
              if (imgUrl.startsWith('/uploads/') && !imgUrl.includes('project_')) {
                const fName = imgUrl.replace('/uploads/', '');
                await storageService.deleteFile(fName);
              }
              // Delete row
              await db.query('DELETE FROM project_images WHERE id = ?', [imgId]);
            }
          }
        }
      } catch (err) {
        console.error('Error parsing deleteScreenshotIds:', err.message);
      }
    }

    // Handle new screenshot uploads (Appends to existing screenshots)
    if (req.files && req.files.screenshots && req.files.screenshots.length > 0) {
      const orderCheck = await db.query('SELECT MAX(display_order) as max_order FROM project_images WHERE project_id = ?', [id]);
      let maxOrder = orderCheck.rows[0].max_order !== null ? orderCheck.rows[0].max_order : -1;

      for (let i = 0; i < req.files.screenshots.length; i++) {
        const screenshotMeta = storageService.processUploadedFile(req.files.screenshots[i]);
        await db.query(`
          INSERT INTO project_images (project_id, image_url, display_order)
          VALUES (?, ?, ?)
        `, [id, screenshotMeta.url, maxOrder + 1 + i]);
      }
    }

    await logAction(`Update Project "${name_en}"`, req.user.email);
    res.json({ success: true, message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// DELETE /api/projects/:id (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const project = check.rows[0];

    // Get all project screenshots to delete their local files
    const images = await db.query('SELECT * FROM project_images WHERE project_id = ?', [id]);
    for (const img of images.rows) {
      if (img.image_url.startsWith('/uploads/') && !img.image_url.includes('project_')) {
        const fileName = img.image_url.replace('/uploads/', '');
        await storageService.deleteFile(fileName);
      }
    }

    // Delete cover image
    if (project.cover_image && project.cover_image.startsWith('/uploads/') && !project.cover_image.includes('project_')) {
      const coverFileName = project.cover_image.replace('/uploads/', '');
      await storageService.deleteFile(coverFileName);
    }

    // Delete DB references (cascade delete screenshots if foreign keys support it, but manually executing is safer)
    await db.query('DELETE FROM project_images WHERE project_id = ?', [id]);
    await db.query('DELETE FROM projects WHERE id = ?', [id]);

    await logAction(`Delete Project "${project.name_en}"`, req.user.email);

    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
