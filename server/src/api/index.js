import { AsyncRouter } from 'express-async-router';
import usersRouter from './users/user.routes.js';
import fileRoute  from './uploadRoutes.js';

const router = AsyncRouter();

router.use('/users', usersRouter);
router.use('/file', fileRoute);

export default router;