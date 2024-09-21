import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import pythonRoutes from "./routes/python.js";

// app
const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
dotenv.config();

app.use(bodyParser.json({ limit: "1gb" }));
app.use(bodyParser.urlencoded({ limit: "1gb" }));
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));

app.use("/", pythonRoutes);

//listener
const port = 8080;
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
