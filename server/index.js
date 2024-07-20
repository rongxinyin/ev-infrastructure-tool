import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import { spawn } from "child_process";


// import pythonRoutes from "./routes/python.js";

// app
// const bodyParser = require("body-parser");
// const pythonRoutes = require("./routes/python");
const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
dotenv.config();

app.use(bodyParser.json());



app.post('/process-data', (req, res) => {
  const input = JSON.stringify(req.body);

  const python = spawn('python', ['../python-backend/scripts/process-empl-data.py', input]);

  let dataToSend = '';
  let errorOccurred = false;

  python.stdout.on('data', (data) => {
    dataToSend += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOccurred = true;
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
    if (errorOccurred) {
      res.status(500).send({ status: 'error', message: 'Python script error' });
    } else {
      console.log(`Python script output: ${dataToSend}`);  // Log the raw output
      try {
        const result = JSON.parse(dataToSend);
        res.send(result);
      } catch (e) {
        console.error(`Error parsing JSON: ${e.message}`);  // Log the parsing error
        res.status(500).send({ status: 'error', message: 'Invalid JSON output' });
      }
    }
  });
});



// //connect
// mongoose.connect(process.env.CONNECTION_URL);
// const db = mongoose.connection;
// db.once("open", () => console.log(`Connected to database`));

//listener
const port = 8080;
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
