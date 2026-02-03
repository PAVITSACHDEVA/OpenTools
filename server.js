import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import multer from "multer";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";

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

/* ================= AI STREAM ================= */

/* ================= WEATHER ================= */
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "City required" });
    }

    if (!process.env.WEATHER_API_KEY) {
      return res.status(500).json({ error: "Weather API key missing" });
    }

    const r = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${encodeURIComponent(city)}`
    );

    if (!r.ok) {
      return res.status(r.status).json({ error: "Weather fetch failed" });
    }

    const d = await r.json();

    if (!d?.location || !d?.current) {
      return res.status(502).json({ error: "Unexpected weather response" });
    }

    return res.json({
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

const upload = multer({ dest: "tmp/" });

app.post("/api/compress", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const inputPath = req.file.path;
  const outputPath = `${inputPath}-compressed.pdf`;

  const gsArgs = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    "-dPDFSETTINGS=/ebook",
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${outputPath}`,
    inputPath
  ];

  execFile("gs", gsArgs, async (error) => {
    if (error) {
      console.error("Ghostscript error:", error);
      await Promise.allSettled([
        fs.promises.unlink(inputPath),
        fs.promises.unlink(outputPath)
      ]);
      return res.status(500).send("Compression failed");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(path.resolve(outputPath), async (sendError) => {
      if (sendError) {
        console.error("Send file error:", sendError);
      }
      await Promise.allSettled([
        fs.promises.unlink(inputPath),
        fs.promises.unlink(outputPath)
      ]);
    });
  });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Lumix Core backend running on port ${PORT}`);
});
