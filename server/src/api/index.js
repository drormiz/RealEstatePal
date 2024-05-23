import { AsyncRouter } from 'express-async-router';
import usersRouter from './users/user.routes.js';
import fileRoute  from './uploadRoutes.js';
import purchaseGroupRouter from './purchaseGroups/purchaseGroup.router.js';

const router = AsyncRouter();

router.use('/users', usersRouter);
router.use('/file', fileRoute);
router.use('/purchaseGroups', purchaseGroupRouter)

export default router;