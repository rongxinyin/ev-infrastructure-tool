import { spawn, execSync } from "child_process";
import express from "express";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";
import multer from "multer";
import fs from "fs";
import path from "path";
import archiver from "archiver";

const router = express.Router();
const upload = multer();

// handle cases where different paths use python vs python3 keyword
function getPythonCommand() {
  try {
    execSync("python --version");
    return "python";
  } catch (e) {
    try {
      execSync("python3 --version");
      return "python3";
    } catch (e) {
      throw new Error("Neither 'python' nor 'python3' is available");
    }
  }
}

// fleet/employee info page submissison
router.post("/process-employee-data", (req, res) => {
  const input = JSON.stringify(req.body);

  const python = spawn(getPythonCommand(), [
    "./python-backend/scripts/process-empl-data.py",
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
      console.log(`Python script output: ${dataToSend}`); // raw output
      try {
        const result = JSON.parse(dataToSend);
        res.send(result);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`); // parsing error
        res
          .status(500)
          .send({ status: "error", message: "Invalid JSON output" });
      }
    }
  });
});

// simulation -- employee
router.post("/process-employee-simulation", (req, res) => {
  const employeeCommuteData = JSON.stringify(req.body.data);
  const startTime = req.body.start_time;
  const runPeriod = req.body.run_period;
  const l2ChargingPower = req.body.l2_charging_power;
  const l3ChargingPower = req.body.l3_charging_power;
  const adoptionRate = req.body.adoption_rate;

  const python = spawn(getPythonCommand(), [
    "./python-backend/scripts/pov-charging-management.py",
    employeeCommuteData,
    startTime,
    runPeriod,
    l2ChargingPower,
    l3ChargingPower,
    adoptionRate,
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

      let filteredData = "";
      let skippedRows = 0;

      // split data into lines (assuming each row is a new line)
      const lines = dataToSend.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const row = lines[i];

        // split the row by delimiter (assuming comma)
        const columns = row.split(",");

        // check if there are less than 13 columns
        if (columns.length < 13) {
          skippedRows++;
          console.warn(`Skipping row ${i + 1} (has ${columns.length} columns)`);
        } else {
          // add the row to the filtered data if it has 13 columns
          filteredData += row + "\n";
        }
      }

      if (skippedRows > 0) {
        console.warn(`Skipped a total of ${skippedRows} rows.`);
      }

      // s the filtered data
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
      res.send(filteredData);
    }
  });
});

// simulation -- fleet
router.post("/process-fleet-simulation", (req, res) => {
  const employeeCommuteData = JSON.stringify(req.body.data);
  const startTime = req.body.start_time;
  const runPeriod = req.body.run_period;
  const l2ChargingPower = req.body.l2_charging_power;
  const l3ChargingPower = req.body.l3_charging_power;
  const adoptionRate = req.body.adoption_rate;

  const python = spawn(getPythonCommand(), [
    "./python-backend/scripts/fleet-charging-management.py",
    employeeCommuteData,
    startTime,
    runPeriod,
    0,
    0,
    0,
    0,
    l2ChargingPower,
    l3ChargingPower,
    adoptionRate,
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

      let filteredData = "";
      let skippedRows = 0;

      // split data into lines (assuming each row is a new line)
      const lines = dataToSend.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const row = lines[i];

        // split the row by delimiter (assuming comma)
        const columns = row.split(",");

        // check if there are less than 13 columns
        if (columns.length < 13) {
          skippedRows++;
          console.warn(`Skipping row ${i + 1} (has ${columns.length} columns)`);
        } else {
          // add the row to the filtered data if it has 13 columns
          filteredData += row + "\n";
        }
      }

      if (skippedRows > 0) {
        console.warn(`Skipped a total of ${skippedRows} rows.`);
      }

      // send the filtered data
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
      res.send(filteredData);
    }
  });
});

// post processing data generated from simulation
router.post("/post-process", upload.single("csvFile"), (req, res) => {
  const csvData = req.file.buffer.toString();
  const directoryPath = path.join("./python-backend/scripts/post-process/temp");
  const tempFilePath = path.join(
    directoryPath,
    "vehicle_status_normal_temp.csv"
  );

  // write the uploaded CSV data to a temp file
  fs.writeFileSync(tempFilePath, csvData);

  const python = spawn(getPythonCommand(), [
    "./python-backend/scripts/post-process/output-analysis.py",
  ]);

  python.on("close", (code) => {
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        console.error("Error deleting temporary file:", err);
      }
    });

    // Read all CSV files and send them as JSON
    const results = {};
    const csvFiles = [
      "pivot_cost.csv",
      "pivot_waiting_for_station.csv",
      "pivot_peak_demand.csv",
      "pivot_utilization.csv",
      "melted_results_adoption_rate.csv",
    ];

    let hasAnyValidData = false;

    csvFiles.forEach((filename) => {
      const filePath = path.join(directoryPath, filename);
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        results[filename.replace(".csv", "")] = fileContent;
        hasAnyValidData = true;

        // Clean up the file
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Error deleting ${filename}:`, err);
        });
      } catch (error) {
        console.warn(`Warning: Could not read ${filename}:`, error.message);
        results[filename.replace(".csv", "")] = null;
      }
    });

    if (!hasAnyValidData) {
      res.status(500).send({
        status: "error",
        message: "No valid data files were generated",
      });
    } else {
      res.json(results);
    }
  });
});

// New route to call the post-process Python script smart charging
router.post("/run-smart-charging", (req, res) => {
  const python = spawn(getPythonCommand(), [
    "./python-backend/scripts/post-process/smart-charging-analysis.py",
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
      try {
        const result = JSON.parse(dataToSend);
        res.send(result);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`);
        res
          .status(500)
          .send({ status: "error", message: "Invalid JSON output" });
      }
    }
  });
});

router.post("/run-flex-e", upload.single("csv"), (req, res) => {
  const csvFilePath = req.file.path;
  const timezone = req.body.timezone || "UTC";

  const python = spawn("python", [
    "./python-backend/scripts/operation/post-process-session.py",
    csvFilePath,
    timezone,
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
      try {
        const result = JSON.parse(dataToSend);
        res.send(result);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`);
        res
          .status(500)
          .send({ status: "error", message: "Invalid JSON output" });
      }
    }
  });
});

export default router;
