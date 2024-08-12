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

router.post("/process-simulation", (req, res) => {
  const employeeCommuteData = JSON.stringify(req.body.data);
  const startTime = req.body.start_time;
  const runPeriod = req.body.run_period;
  const l2ChargingPower = req.body.l2_charging_power;
  const l3ChargingPower = req.body.l3_charging_power;
  const adoptionRate = req.body.adoption_rate;

  // console.log(JSON.stringify(req.body))

  const python = spawn(getPythonCommand(), [
    "./python-backend/scripts/main.py",
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
