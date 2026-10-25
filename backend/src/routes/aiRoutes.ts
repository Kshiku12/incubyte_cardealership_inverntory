import { Router } from 'express';
import { handleAiChat } from '../controllers/aiController';

const router = Router();

router.post('/chat', handleAiChat);

export default router;
