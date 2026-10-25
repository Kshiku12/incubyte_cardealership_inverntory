import { Router } from 'express';
import { getNewsArticles } from '../controllers/newsController';

const router = Router();

router.get('/', getNewsArticles);

export default router;
