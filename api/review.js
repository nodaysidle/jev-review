// Vercel serverless version of GET /api/review.
// Serves the committed sample report (demo/report.json) instead of a local file.
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const REPORT = join(process.cwd(), "demo", "report.json");

export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).send("Method not allowed");
    return;
  }
  let report;
  try {
    report = JSON.parse(readFileSync(REPORT, "utf8"));
  } catch {
    res.status(200).json({ source: "demo/report.json", status: "empty" });
    return;
  }
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    source: "demo/report.json (sample self-review)",
    status: "ok",
    savedAt: statSync(REPORT).mtime.toISOString(),
    report,
  });
}
