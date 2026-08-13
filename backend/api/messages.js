import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = await prisma.contactMessage.create({
      data: { name, email, message }
    });
    res.json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
