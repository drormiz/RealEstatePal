import { AsyncRouter } from 'express-async-router';
import { createProperty, getProperties, deleteProperty, updateProperty, getProperty } from './property.controller.js';
import { protect } from "../../middlewares/auth.middleware.js";

const router = AsyncRouter();

router.get('/', getProperties);
router.get('/:id',protect, getProperty);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;