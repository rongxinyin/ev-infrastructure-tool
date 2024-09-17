import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  LinearProgress,
  Tooltip,
  Fab,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/index.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/index.js";
import Dropzone from 'react-dropzone';
import { DatePicker } from "@mui/x-date-pickers/DatePicker/index.js";

const textFieldSX = {
  marginBottom: 1,
  marginTop: 1,
};

export default function Simulation({
  onFormSubmit,
  progressBarState,
  terminateProcess,
  mode,
}) {

  const [selectedFile, setSelectedFile] = useState(null);

  const [simulationConfig, setSimulationConfig] = useState({
    start_time: null,
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
      [field]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit({
      start_time: simulationConfig.start_time.format("YYYY-MM-DD HH:mm:ss"),
      run_period: simulationConfig.run_period,
      l2_charging_power: simulationConfig.l2_charging_power,
      l3_charging_power: simulationConfig.l3_charging_power,
      adoption_rate: simulationConfig.adoption_rate,
    });
    console.log(simulationConfig);
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('csvFile',   
 selectedFile);

    try {
      const response = await fetch('/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading file');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1} sx={{ marginLeft: 0 }}>
        <Grid item xs={12}>
          <Typography variant="h4" sx={{ marginTop: 0 }}>
            {mode} Simulation
          </Typography>
          <Box bgcolor="primary.white" sx={{ marginLeft: 0 }}>
            <Grid container spacing={0} sx={{ paddingLeft: 0 }}>
              <Grid item xs={2.4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Start time"
                      name="startTime"
                      value={simulationConfig.start_time}
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
              <Grid item xs={2.5}>
                <TextField
                  id="outlined-basic"
                  label="L2 charging power (kW)"
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
              <Grid item xs={2.5}>
                <TextField
                  id="outlined-basic"
                  label="L3 charging power (kW)"
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
              <Grid item xs={2.2}>
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
                color="primary"
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  width: "100%",
                }}
                type="submit"
              >
                Run
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: 0,
                  marginBottom: 0,
                  width: "100%",
                }}
                onClick={terminateProcess}
              >
                Terminate
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {progressBarState && <LinearProgress color="secondary" />}
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ marginLeft: 0 }}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ marginTop: 0 }}>
            Data Post-Processing
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="p" sx={{ marginTop: 0 }}>
            Optional: Upload generated, unprocessed data for post-processing.
          </Typography>
        </Grid>
        <Grid item xs={12}>
        <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>   

      <button onClick={handleUpload} disabled={!selectedFile}>
        Submit
      </button>
        </Grid>
      </Grid>
    </form>
  );
}
