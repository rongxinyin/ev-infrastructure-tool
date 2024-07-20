import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post("/process", async (req, res) => {
  const inputData = JSON.stringify(req.body);

  // Make sure to use the correct path to your Python script
  const scriptPath = path.resolve(
    __dirname,
    "../../python-backend/scripts/process-empl-data.py"
  );

  const pythonProcess = spawn("python", [scriptPath, inputData]);

  let result = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      try {
        res.status(200).json(JSON.parse(result));
      } catch (e) {
        res.status(500).json({ error: "Error parsing Python script output" });
      }
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

export default router;
