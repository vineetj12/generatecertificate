import { Router } from 'express';
import { verifyCertificate, publicDownload } from '../controllers/verify.controller';

const router = Router();

// Public endpoints — no authentication required
// IMPORTANT: specific routes must come before wildcard routes
router.get('/download/:id', publicDownload);
router.get('/:certificateId', verifyCertificate);

export { router as verifyRoutes };
