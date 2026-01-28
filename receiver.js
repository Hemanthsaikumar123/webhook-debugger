import express from "express";

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("📥 Received in comm backend:", req.body);
  res.status(200).json({ ok: true });
});

app.listen(3000, () => {
  console.log("Receiver running on port 3000");
});
