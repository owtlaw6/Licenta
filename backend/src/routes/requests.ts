import express from "express";
import * as RequestsController from "../controllers/requests";

const router = express.Router();

router.get("/", RequestsController.getRequests);

router.get("/:RequestId", RequestsController.getRequest);

router.post("/", RequestsController.acceptRequest);

router.delete("/:RequestId", RequestsController.deleteRequest);

export default router;