import { Box, Button, Grid, Typography, TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/index.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/index.js";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/index.js";

const textFieldSX = {
  marginBottom: 1,
  marginTop: 1,
};

export default function Simulation() {
  return (
    <Grid container spacing={1} sx={{ marginLeft: 0 }}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ marginTop: 0 }}>
          Simulation
        </Typography>
        <Box bgcolor="primary.white" sx={{ marginLeft: 0 }}>
          <Grid container spacing={0} sx={{ paddingLeft: 0 }}>
            <Grid item xs={2.4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    label="Start time"
                    // value={} TODO
                    name="startTime"
                    // onChange={(newValue) =>
                    //   handleTimeChange(newValue, "returnHomeTime")
                    // } TODO
                    slotProps={{ textField: { fullWidth: true } }}
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
  );
}
