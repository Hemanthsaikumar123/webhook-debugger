import { Router } from "express";
import receiveWebhook from "../controllers/webhook.controller.js";
import replayWebhook from "../controllers/replay.controller.js";

const router = Router();

router.post("/:projectId", receiveWebhook);
router.post("/replay/:requestId", replayWebhook);

export default router;
