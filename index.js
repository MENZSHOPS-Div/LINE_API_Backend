const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow the production checkout and local development pages to call this API.
const allowedOrigins = new Set([
  "https://docs.menzshops.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
]);

const corsOptions = {
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

// Handle the browser's JSON preflight before parsing the POST body.
app.options("/push", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const userId = process.env.USER_ID;

app.post("/push", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const response = await axios.post(
      LINE_API_URL,
      {
        to: userId,
        messages: [{ type: "text", text: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ LINE API error:", error.response?.data || error.message);
    res.status(500).json({ error: "LINE message failed", details: error.response?.data });
  }
});

app.get("/", (req, res) => {
  res.send("✅ LINE Backend is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
