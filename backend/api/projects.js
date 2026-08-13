import express from 'express';

const router = express.Router();

// GET /api/projects - ส่งข้อมูล Mock Data กลับไป
router.get('/', (req, res) => {
    const projects = [{
            title: 'Full-Stack E-Commerce Platform',
            description: 'ระบบร้านค้าออนไลน์รองรับการชำระเงิน ตรวจสอบสต็อกสินค้า และการจัดการข้อมูลหลังบ้าน',
            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800&auto=format&fit=crop',
            tags: ['React', 'Node.js', 'PostgreSQL']
        },
        {
            title: 'Task Management System',
            description: 'แอปพลิเคชันบริหารจัดการงานในทีมแบบ Real-time พร้อมแดชบอร์ดสรุปความก้าวหน้า',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
            tags: ['Next.js', 'TailwindCSS', 'Prisma']
        }
    ];
    res.status(200).json(projects);
});

export default router;