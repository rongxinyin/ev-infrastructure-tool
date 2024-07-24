import { spawn, exec } from "child_process";
import express from "express";
import { parse } from 'csv-parse';
import { stringify } from "csv-stringify/sync";

const router = express.Router();

router.post("/process-employee-data", (req, res) => {
  const input = JSON.stringify(req.body);

  console.log(typeof input)

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
  const input = JSON.stringify(req.body.data);

  const python = spawn("python", [
    "../python-backend/scripts/main.py",
    input,
    "input.start_time",
    30,
    7,
    50,
    0.1
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
      console.log(`Python script output: ${dataToSend}`);

      // Handle CSV data
      try {
        // Assuming the Python script returns CSV data as a string
        parse(dataToSend, { columns: true }, (err, records) => {
          if (err) {
            console.error(`Error parsing CSV: ${err.message}`);
            res.status(500).send({ status: "error", message: "Invalid CSV output" });
          } else {
            // Optionally: convert records to CSV string
            const csvOutput = stringify(records, { header: true });

            // Send CSV output to client
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
            res.send(csvOutput);
          }
        });
      } catch (e) {
        console.error(`Error handling CSV: ${e.message}`);
        res.status(500).send({ status: "error", message: "Error handling CSV data" });
      }
    }
  });
});



export default router;
