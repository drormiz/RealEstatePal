import express from 'express';
import authRouter from './auth/auth.routes.js';
import apiRouter from './api/index.js'

const router = express.Router();

router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;