import { Router } from "express";
import receiveWebhook from "../controllers/webhook.controller.js";

const router = Router();

router.post("/:projectId", receiveWebhook);

export default router;
