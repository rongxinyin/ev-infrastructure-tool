import { spawn } from "child_process";
import express from "express";

const router = express.Router();

router.post("/process-employee-data", (req, res) => {
  const input = JSON.stringify(req.body);

  const python = spawn("python", [
    "../python-backend/scripts/process-empl-data.py",
    input,
  ]);

  let dataToSend = "";
  let errorOccurred = false;

  python.stdout.on("data", (data) => {
    dataToSend += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOccurred = true;
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    if (errorOccurred) {
      res.status(500).send({ status: "error", message: "Python script error" });
    } else {
      console.log(`Python script output: ${dataToSend}`); // Log the raw output
      try {
        const result = JSON.parse(dataToSend);
        res.send(result);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`); // Log the parsing error
        res
          .status(500)
          .send({ status: "error", message: "Invalid JSON output" });
      }
    }
  });
});

router.post("/process-simulation", (req, res) => {
  const input = JSON.stringify(req.body);

  const python = spawn("python", ["../python-backend/scripts/main.py", input]);

  let dataToSend = "";
  let errorOccurred = false;

  python.stdout.on("data", (data) => {
    dataToSend += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOccurred = true;
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    if (errorOccurred) {
      res.status(500).send({ status: "error", message: "Python script error" });
    } else {
      console.log(`Python script output: ${dataToSend}`); // Log the raw output
      try {
        const result = JSON.parse(dataToSend);
        res.send(result);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`); // Log the parsing error
        res
          .status(500)
          .send({ status: "error", message: "Invalid JSON output" });
      }
    }
  });
});

export default router;
