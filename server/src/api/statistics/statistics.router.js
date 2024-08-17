import { AsyncRouter } from "express-async-router";
import { getStatistics } from "./statistics.controller.js";

const router = AsyncRouter();

router.get("/", getStatistics);

export default router;
