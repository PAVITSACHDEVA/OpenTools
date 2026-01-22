import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.status(200).send("Lumix Core backend is alive 🚀");
});

/* ================= RENDER HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* ================= MEMORY ================= */
const chatHistory = {};

/* ================= AI STREAM ================= */

/* ================= WEATHER ================= */
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "City required" });
    }

    const r = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${encodeURIComponent(city)}`
    );
    const d = await r.json();

    res.json({
      location: d.location.name,
      temp: d.current.temp_c,
      condition: d.current.condition.text,
      humidity: d.current.humidity,
      wind: d.current.wind_kph
    });

  } catch (err) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
});
// ================================
// PDF COMPRESSION (GHOSTSCRIPT)
// ================================
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const upload = multer({ dest: "tmp/" });

app.post("/api/compress", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}-compressed.pdf`;

  const gsCommand = `
    gs -sDEVICE=pdfwrite \
       -dCompatibilityLevel=1.4 \
       -dPDFSETTINGS=/ebook \
       -dNOPAUSE -dQUIET -dBATCH \
       -sOutputFile=${outputPath} \
       ${inputPath}
  `;

  exec(gsCommand, (error) => {
    if (error) {
      console.error("Ghostscript error:", error);
      return res.status(500).send("Compression failed");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(path.resolve(outputPath), () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Lumix Core backend running on port ${PORT}`);
});