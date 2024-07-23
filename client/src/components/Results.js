import { Box, Button, Grid, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVisualizations } from "./calculator-components/Visualizations.js";

const textFieldSX = {
  width: "100%",
  marginBottom: 5,
  marginTop: 1,
  border: "2px solid #F0F0F0",
  backgroundColor: "secondary.main",
};

export default function Simulation() {
  fetch("/bldg-90/pov_vehicle_status_0.36.csv")
    .then((response) => response.text())
    .then((data) => {
      const parsedData = parseCSV(data);
    });

  let result = null;
  function parseCSV(data) {
    const lines = data.split("\n");
    const headers = lines[0].split(",");
    result = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
    });
  }

  const [waitTimeGraph, setWaitTimeGraph] = useState([]);
  const [lowSocGraph, setLowSocGraph] = useState([]);
  const [utilizationGraph, setUtilizationGraph] = useState([]);
  const [demandGraph, setDemandGraph] = useState([]);

  const test = async () => {
    if (result === null) {
      console.error("Result is not initialized");
      return;
    }

    let waitTime = [0, 0, 0, 0, 0, 0];
    let lowSoc = [0, 0, 0, 0, 0, 0];
    let utilization = [0, 0, 0, 0, 0, 0];
    let demand = [];

    for (let n = 2; n <= 12; n += 2) {
      let waitData = result.filter((entry) => entry.L2 === String(n));

      let count_in_queue = 0;

      for (let i = 0; i < waitData.length; i++) {
        if (waitData[i].queue_status === "In queue") {
          count_in_queue++;
        }
      }
      waitTime[n / 2 - 1] = count_in_queue * 0.25;
    }

    for (let n = 2; n <= 12; n += 2) {
      let lowSocData = result.filter((entry) => entry.L2 === String(n));

      let count_low_soc = 0;

      for (let i = 0; i < lowSocData.length; i++) {
        if (Number(lowSocData[i].soc) < 50) {
          count_low_soc++;
        }
      }
      lowSoc[n / 2 - 1] = count_low_soc / 30; //divide by 30 so it's the # of hours per day
    }

    for (let n = 2; n <= 12; n += 2) {
      let utilizationData = result.filter((entry) => entry.L2 === String(n));

      let utilized = 0;

      for (let i = 0; i < utilizationData.length; i++) {
        if (utilizationData[i].status === "Charging") {
          utilized++;
        }
      }

      utilization[n / 2 - 1] = (utilized / utilizationData.length) * 100;
    }

    setWaitTimeGraph(() => [
      //...prev,
      createVisualizations(
        ["(2,0)", "(4,0)", "(6,0)", "(8,0)", "(10,0)", "(12,0)"],
        "Wait time",
        "Chargers (L2, L3)",
        "Hours",
        waitTime,
        waitTimeGraph.length,
        275,
        "#007681"
      ),
    ]);

    setLowSocGraph(() => [
      //...prev,
      createVisualizations(
        ["(2,0)", "(4,0)", "(6,0)", "(8,0)", "(10,0)", "(12,0)"],
        "Low Soc",
        "Chargers (L2, L3)",
        "Time w/ low Soc (hrs)",
        lowSoc,
        lowSocGraph.length,
        275,
        "#007681"
      ),
    ]);

    setUtilizationGraph(() => [
      //...prev,
      createVisualizations(
        ["(2,0)", "(4,0)", "(6,0)", "(8,0)", "(10,0)", "(12,0)"],
        "Charging port utilization",
        "Chargers (L2, L3)",
        "Utilization (%)",
        utilization,
        utilizationGraph.length,
        275,
        "#007681"
      ),
    ]);
  };

  return (
    <Grid container spacing={1} sx={{ marginLeft: 0 }}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ marginTop: 0 }}>
          Results
        </Typography>
        <Button onClick={test}>Generate Graphs</Button>
        <Grid container spacing={0}>
          <Grid item xs={7}>
            {/*<Typography variant="h6" sx={{ marginTop: 1 }}>
              Wait time
            </Typography>*/}
            {waitTimeGraph}
          </Grid>
          <Grid item xs={5}>
            {/*<Typography variant="h6" sx={{ marginTop: 1 }}>
              Low SoC
            </Typography>*/}
            {lowSocGraph}
          </Grid>
        </Grid>
        {/*<Typography variant="h6" sx={{ marginTop: 1 }}>
          Utilization
        </Typography>*/}
        {utilizationGraph}
        {/*<Typography variant="h6" sx={{ marginTop: 1 }}>
          Charging demand (1 month)
        </Typography>*/}
        {/*<Typography variant="h6" sx={{ marginTop: 1 }}>
          Summary
        </Typography>*/}
        {/*<Grid container spacing={2}>
          <Grid item xs={4}>
            <Box bgcolor="tertiary.main">
              <Typography
                variant="h6"
                color="primary"
                sx={{ marginTop: 3, marginLeft: 3, paddingTop: 2 }}
              >
                Weight
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              >
                Cost
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              ></Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              >
                Wait time
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              >
                Peak demand
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              >
                Utilization
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3, paddingBottom: 2 }}
              >
                Low SoC
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box bgcolor="tertiary.main">
              <Typography
                variant="h6"
                color="primary"
                sx={{ marginTop: 3, marginLeft: 3, paddingTop: 2 }}
              >
                Result
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              >
                # of L2:
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3 }}
              >
                # of L3:
              </Typography>
              <Typography
                variant="body1"
                color="secondary.main"
                sx={{ marginTop: 1, marginLeft: 3, paddingBottom: 2 }}
              >
                Score:
              </Typography>
            </Box>
          </Grid>
        </Grid>*/}
      </Grid>
    </Grid>
  );
}
