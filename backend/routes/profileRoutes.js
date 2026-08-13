const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const storageService = require('../services/storageService');
const { logAction } = require('../services/logService');

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM profiles LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    res.json({ success: true, profile: result.rows[0] });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// PUT /api/profile (Protected, handles optional profile image upload)
router.put('/', authMiddleware, storageService.uploadSingle('profileImage'), async (req, res) => {
  try {
    // Check if new profile image is uploaded
    let profileImageUrl = req.body.profile_image;
    if (req.file) {
      const fileMeta = storageService.processUploadedFile(req.file);
      profileImageUrl = fileMeta.url;
    }

    const {
      full_name_th, full_name_en, nickname_th, nickname_en, age,
      school_th, school_en, education_th, education_en,
      description_th, description_en, about_me_th, about_me_en,
      career_goal_th, career_goal_en, location_th, location_en,
      email, phone, github, facebook, instagram, discord
    } = req.body;

    // Get current profile ID
    const getProfile = await db.query('SELECT id, profile_image FROM profiles LIMIT 1');
    
    if (getProfile.rows.length === 0) {
      // Create if doesn't exist
      await db.query(`
        INSERT INTO profiles (
          full_name_th, full_name_en, nickname_th, nickname_en, profile_image, age,
          school_th, school_en, education_th, education_en,
          description_th, description_en, about_me_th, about_me_en,
          career_goal_th, career_goal_en, location_th, location_en,
          email, phone, github, facebook, instagram, discord
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        full_name_th, full_name_en, nickname_th, nickname_en, profileImageUrl, parseInt(age || '0'),
        school_th, school_en, education_th, education_en,
        description_th, description_en, about_me_th, about_me_en,
        career_goal_th, career_goal_en, location_th, location_en,
        email, phone, github, facebook, instagram, discord
      ]);
    } else {
      const profileId = getProfile.rows[0].id;
      const oldImage = getProfile.rows[0].profile_image;

      // Update existing
      await db.query(`
        UPDATE profiles SET
          full_name_th = ?, full_name_en = ?, nickname_th = ?, nickname_en = ?, 
          profile_image = ?, age = ?, school_th = ?, school_en = ?, 
          education_th = ?, education_en = ?, description_th = ?, description_en = ?, 
          about_me_th = ?, about_me_en = ?, career_goal_th = ?, career_goal_en = ?, 
          location_th = ?, location_en = ?, email = ?, phone = ?, 
          github = ?, facebook = ?, instagram = ?, discord = ?
        WHERE id = ?
      `, [
        full_name_th, full_name_en, nickname_th, nickname_en, profileImageUrl, parseInt(age || '0'),
        school_th, school_en, education_th, education_en,
        description_th, description_en, about_me_th, about_me_en,
        career_goal_th, career_goal_en, location_th, location_en,
        email, phone, github, facebook, instagram, discord,
        profileId
      ]);

      // If new image is uploaded and there was an old one, delete old local file (unless it was default placeholder)
      if (req.file && oldImage && oldImage.startsWith('/uploads/') && !oldImage.includes('profile_default.jpg')) {
        const oldFileName = oldImage.replace('/uploads/', '');
        await storageService.deleteFile(oldFileName);
      }
    }

    await logAction('Update Profile', req.user.email);
    
    // Fetch updated profile
    const updated = await db.query('SELECT * FROM profiles LIMIT 1');
    res.json({ success: true, message: 'Profile updated successfully.', profile: updated.rows[0] });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
