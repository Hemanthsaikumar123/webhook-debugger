import { Router } from "express";
import listProjects from "../controllers/project.controller.js";
import { listProjectWebhooks, getWebhookById } from "../controllers/read.controller.js";

const router = Router();

router.get("/", listProjects);
router.get("/:slug/webhooks", listProjectWebhooks);
router.get("/:slug/webhooks/:id", getWebhookById);



export default router;
