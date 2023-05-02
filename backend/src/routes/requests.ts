import express from "express";
import * as RequestController from "../controllers/requests";
import { requiresAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/", RequestController.getAllRequests);

router.post("/approve/:requestId", requiresAdmin, RequestController.approveRequest);

router.delete("/deny/:requestId", requiresAdmin, RequestController.denyRequest);

export default router;