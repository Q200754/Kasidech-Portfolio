import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

// ป้องกันปัญหา Prisma Client Connection Overflow บน Serverless
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// GET /api/projects - ดึงรายการผลงานทั้งหมด
router.get('/', async(req, res) => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({
            error: 'Failed to fetch projects',
            message: error.message
        });
    }
});

// GET /api/projects/:id - ดึงข้อมูลผลงานเดี่ยวตาม ID
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) || id }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        return res.status(500).json({
            error: 'Failed to fetch project detail',
            message: error.message
        });
    }
});

export default router;