import { Router } from 'express';
import { getActivityLogs } from '../controllers/activity.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getActivityLogs);

export { router as activityRoutes };
