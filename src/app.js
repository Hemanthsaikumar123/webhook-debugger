import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import webhookRoutes from "./routes/webhook.routes.js";


const app = express();

app.use(cors());

// IMPORTANT: capture raw body (needed later for signature verification)
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  })
);

app.use("/webhooks", webhookRoutes);

app.get("/", (req, res) => {
  res.send("Webhook Debugger running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
