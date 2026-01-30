import { Router } from "express";
import receiveWebhook from "../controllers/webhook.controller.js";
import replayWebhook from "../controllers/replay.controller.js";
import { listProjectWebhooks, getWebhookById } from "../controllers/read.controller.js";

const router = Router();

// ingest
router.post("/:projectId", receiveWebhook);

// control
router.post("/replay/:requestId", replayWebhook);

// read
router.get("/projects/:slug/webhooks", listProjectWebhooks);
router.get("/:id", getWebhookById);

export default router;
