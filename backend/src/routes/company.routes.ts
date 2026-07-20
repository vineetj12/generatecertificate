import { Router } from 'express';
import { getCompany, updateCompany, uploadLogo, uploadSignature } from '../controllers/company.controller';
import { authenticate } from '../middleware/auth';
import { uploadLogo as uploadLogoMiddleware, uploadSignature as uploadSignatureMiddleware } from '../middleware/upload';

const router = Router();

router.get('/', authenticate, getCompany);
router.put('/', authenticate, updateCompany);
router.post('/logo', authenticate, uploadLogoMiddleware.single('logo'), uploadLogo);
router.post('/signature', authenticate, uploadSignatureMiddleware.single('signature'), uploadSignature);

export { router as companyRoutes };
