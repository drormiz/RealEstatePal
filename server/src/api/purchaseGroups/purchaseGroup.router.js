import { AsyncRouter } from 'express-async-router';
import { createPurchaseGroup, getPurchaseGroups, deletePurchaseGroup, updatePurchaseGroup } from './purchaseGroup.controller.js';
import { protect } from "../../middlewares/auth.middleware.js";

const router = AsyncRouter();

router.get('/', getPurchaseGroups);
router.post('/', protect, createPurchaseGroup);
router.put('/:id', protect, updatePurchaseGroup);
router.delete('/:id', protect, deletePurchaseGroup);

export default router;