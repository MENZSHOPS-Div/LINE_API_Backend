@@ -4,29 +4,25 @@ const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const USER_ID = process.env.USER_ID;

app.use(cors()); // เปิด CORS ให้ frontend ใช้ได้
app.use(express.json());
const userId = process.env.USER_ID;

// API รับข้อความจาก frontend แล้วส่งไป LINE
app.post("/push", async (req, res) => {
  const { userId, message } = req.body;
  const targetUserId = userId || USER_ID;
  const { message } = req.body;

  if (!targetUserId || !message) {
    return res.status(400).json({ error: "userId และ message จำเป็นต้องมี" });
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    await axios.post(
    const response = await axios.post(
      LINE_API_URL,
      {
        to: targetUserId,
        to: userId,
        messages: [{ type: "text", text: message }],
      },
      {
@@ -36,17 +32,19 @@ app.post("/push", async (req, res) => {
        },
      }
    );
    res.json({ success: true, message: "ส่งข้อความเรียบร้อย" });
  } catch (err) {
    console.error("ส่ง LINE ไม่สำเร็จ:", err.response?.data || err.message);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการส่ง LINE" });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ LINE API error:", error.response?.data || error.message);
    res.status(500).json({ error: "LINE message failed", details: error.response?.data });
  }
});

app.get("/", (req, res) => {
  res.send("✅ LINE Messaging Backend is running.");
  res.send("✅ LINE Backend is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
