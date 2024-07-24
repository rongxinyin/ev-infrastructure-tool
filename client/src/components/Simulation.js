import React, { useState } from "react";
import { Box, Button, Grid, Typography, TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/index.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/index.js";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/index.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/index.js";

const textFieldSX = {
  marginBottom: 1,
  marginTop: 1,
};

export default function Simulation({ onFormSubmit }) {
  const [simulationConfig, setSimulationConfig] = useState({
    start_time: "test",
    run_period: "",
    l2_charging_power: "",
    l3_charging_power: "",
    adoption_rate: "",
  });

  const handleChange = (e) => {
    setSimulationConfig({
      ...simulationConfig,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (newValue, field) => {
    setSimulationConfig({
      ...simulationConfig,
      [field]: newValue.format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(simulationConfig);
    console.log(simulationConfig);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1} sx={{ marginLeft: 0 }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ marginTop: 0 }}>
            Simulation
          </Typography>
          <Box bgcolor="primary.white" sx={{ marginLeft: 0 }}>
            <Grid container spacing={0} sx={{ paddingLeft: 0 }}>
              <Grid item xs={2.4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Start time"
                      name="startTime"
                      slotProps={{ textField: { fullWidth: true } }}
                      required
                      onChange={(newValue) =>
                        handleTimeChange(newValue, "start_time")
                      }

                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={2.4}>
                <TextField
                  id="outlined-basic"
                  label="Run period"
                  variant="outlined"
                  sx={textFieldSX}
                  fullWidth
                  type="number"
                  name="run_period"
                  value={simulationConfig.run_period}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={2.4}>
                <TextField
                  id="outlined-basic"
                  label="Level 2 charging power (kW)"
                  variant="outlined"
                  fullWidth
                  type="number"
                  sx={textFieldSX}
                  name="l2_charging_power"
                  value={simulationConfig.l2_charging_power}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={2.4}>
                <TextField
                  id="outlined-basic"
                  label="Level 3 charging power (kW)"
                  variant="outlined"
                  fullWidth
                  type="number"
                  sx={textFieldSX}
                  name="l3_charging_power"
                  value={simulationConfig.l3_charging_power}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={2.4}>
                <TextField
                  id="outlined-basic"
                  label="Adoption Rate"
                  variant="outlined"
                  fullWidth
                  type="number"
                  sx={textFieldSX}
                  name="adoption_rate"
                  value={simulationConfig.adoption_rate}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  width: "100%",
                }}
                type="submit"
              >
                RUN
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  width: "100%",
                }}
              >
                TERMINATE
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" color="white.main">
            Progress bar
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
}
