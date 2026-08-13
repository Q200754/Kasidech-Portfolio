import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/projects - ดึงโปรเจกต์ทั้งหมดไปแสดงหน้าเว็บ
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects - เพิ่มโปรเจกต์ใหม่ (สำหรับ Admin)
router.post('/', async (req, res) => {
  try {
    const { titleTh, shortDescTh, coverImage } = req.body;
    const newProject = await prisma.project.create({
      data: {
        titleTh,
        shortDescTh,
        coverImage: coverImage || 'https://via.placeholder.com/400x250/121216/FF6FAE?text=Project+Preview'
      }
    });
    res.json({ success: true, data: newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
