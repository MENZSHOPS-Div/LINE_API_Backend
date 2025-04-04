const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const USER_ID = process.env.USER_ID;

app.use(cors()); // เปิด CORS ให้ frontend ใช้ได้
app.use(express.json());

// API รับข้อความจาก frontend แล้วส่งไป LINE
app.post("/push", async (req, res) => {
  const { userId, message } = req.body;
  const targetUserId = userId || USER_ID;

  if (!targetUserId || !message) {
    return res.status(400).json({ error: "userId และ message จำเป็นต้องมี" });
  }

  try {
    await axios.post(
      LINE_API_URL,
      {
        to: targetUserId,
        messages: [{ type: "text", text: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ success: true, message: "ส่งข้อความเรียบร้อย" });
  } catch (err) {
    console.error("ส่ง LINE ไม่สำเร็จ:", err.response?.data || err.message);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการส่ง LINE" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ LINE Messaging Backend is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
