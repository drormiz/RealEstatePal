import { AsyncRouter } from "express-async-router";
import {
  createPurchaseGroup,
  getPurchaseGroups,
  getPurchaseGroupById,
  deletePurchaseGroup,
  updatePurchaseGroup,
  createPurchaseGroupRequest,
  getPurchaseGroupRequests,
  deletePurchaseGroupRequest,
  updatePurchaseGroupRequest,
  changeRequestStatus
} from "./purchaseGroup.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = AsyncRouter();

router.get("/purchaseGroupRequests", getPurchaseGroupRequests);
router.post("/purchaseGroupRequest", protect, createPurchaseGroupRequest);
router.put("/purchaseGroupRequest/:id", protect, updatePurchaseGroupRequest);
router.delete("/purchaseGroupRequest/:id", protect, deletePurchaseGroupRequest);

router.get("/", getPurchaseGroups);
router.get("/:id", getPurchaseGroupById);
router.post("/", protect, createPurchaseGroup);
router.put("/:id", protect, updatePurchaseGroup);
router.delete("/:id", protect, deletePurchaseGroup);

router.put("/changeRequestStatus/:id", protect, changeRequestStatus);

export default router;
