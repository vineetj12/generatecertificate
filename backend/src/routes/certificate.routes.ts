import { Router } from 'express';
import {
  create,
  getById,
  list,
  download,
  remove,
  stats,
  preview,
  downloadTemplate,
  regeneratePdf,
  bulkCreate,
} from '../controllers/certificate.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Statistics
router.get('/stats', authenticate, stats);

// Template download
router.get('/template', authenticate, downloadTemplate);

// Bulk upload
router.post('/bulk', authenticate, upload.single('file'), bulkCreate);

// CRUD
router.post('/', authenticate, create);
router.get('/', authenticate, list);
router.get('/:id', authenticate, getById);
router.delete('/:id', authenticate, remove);

// PDF operations
router.get('/download/:id', authenticate, download);
router.post('/regenerate/:id', authenticate, regeneratePdf);

// Preview
router.post('/preview', authenticate, preview);



export { router as certificateRoutes };
