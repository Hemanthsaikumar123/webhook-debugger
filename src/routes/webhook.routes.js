import { Router } from "express";
import receiveWebhook from "../controllers/webhook.controller.js";
import replayWebhook from "../controllers/replay.controller.js";

const router = Router();

// ingest
router.post("/:projectId", receiveWebhook);

// control
router.post("/replay/:requestId", replayWebhook);



export default router;
