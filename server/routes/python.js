import { spawn, execSync } from "child_process";
import express from "express";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

const router = express.Router();

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
      res.send({ status: "success", rawData: dataToSend });
    }
  });
});

router.post("/download-csv", (req, res) => {
  const rawData = req.body.rawData;

  let filteredData = "";
  let skippedRows = 0;

  // split data into lines (assuming each row is a new line)
  const lines = rawData.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const row = lines[i];

    // Split the row by delimiter (assuming comma)
    const columns = row.split(",");

    // Check if there are less than 13 columns
    if (columns.length < 13) {
      skippedRows++;
      console.warn(`Skipping row ${i + 1} (has ${columns.length} columns)`);
    } else {
      // Add the row to the filtered data if it has 13 columns
      filteredData += row + "\n";
    }
  }

  if (skippedRows > 0) {
    console.warn(`Skipped a total of ${skippedRows} rows.`);
  }

  // Send the filtered data
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
  res.send(filteredData);
});

// simulation -- fleet
router.post("/process-fleet-simulation", (req, res) => {
  const employeeCommuteData = JSON.stringify(req.body.data);
  const startTime = req.body.start_time;
  const runPeriod = req.body.run_period;
  const l2ChargingPower = req.body.l2_charging_power;
  const l3ChargingPower = req.body.l3_charging_power;
  const adoptionRate = req.body.adoption_rate;

  // console.log(JSON.stringify(req.body))

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

      try {
        // assuming the Python script returns CSV data as a string
        parse(dataToSend, { columns: true }, (err, records) => {
          if (err) {
            console.error(`Error parsing CSV: ${err.message}`);
            res
              .status(500)
              .send({ status: "error", message: "Invalid CSV output" });
          } else {
            const csvOutput = stringify(records, { header: true });

            // send csv to client
            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
              "Content-Disposition",
              'attachment; filename="data.csv"'
            );
            res.send(csvOutput);
          }
        });
      } catch (e) {
        console.error(`Error handling CSV: ${e.message}`);
        res
          .status(500)
          .send({ status: "error", message: "Error handling CSV data" });
      }
    }
  });
});

export default router;
