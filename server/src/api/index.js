import { AsyncRouter } from 'express-async-router';
import usersRouter from './users/user.routes.js';
import fileRoute  from './uploadRoutes.js';
import purchaseGroupRouter from './purchaseGroups/purchaseGroup.router.js';
import propertiesRouter from './properties/property.router.js';
import statisticsRouter from './statistics/statistics.router.js';
import { authUser } from '../auth/auth.controller.js';

const router = AsyncRouter();

router.use('/users', authUser,  usersRouter);
router.use('/file', authUser, fileRoute);
router.use('/purchaseGroups', authUser, purchaseGroupRouter)
router.use('/properties', propertiesRouter)
router.use('/statistics', authUser, statisticsRouter)

export default router;