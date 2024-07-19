import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Fab,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  Slider,
  Checkbox,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/index.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/index.js";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/index.js";

export default function EmployeeInfo() {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    commuteMode: "",
    zipcode: "",
    onsiteBldg: "",
    leaveToWorkTime: null,
    returnHomeTime: null,
    homeCharging: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimeChange = (newValue, field) => {
    setEmployeeData({
      ...employeeData,
      [field]: newValue,
    });
  };

  const handleAddRow = () => {
    setEmployees([
      ...employees,
      { ...employeeData, id: Math.random().toString(36).substring(2, 15) },
    ]);
    setEmployeeData({
      employeeId: "",
      commuteMode: "",
      zipcode: "",
      onsiteBldg: "",
      leaveToWorkTime: null,
      returnHomeTime: null,
      homeCharging: null,
    });
  };

  const handleDeleteLastRow = () => {
    setEmployees(employees.slice(0, -1));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const isValidDate = (date) => {
    return date != null;
  };

  const handleUploadFile = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        const rows = csvData.split("\n");
        const employeesFromCsv = rows.map((row) => {
          const columns = row.split(",");
          return {
            employeeId: columns[0],
            commuteMode: columns[1],
            zipcode: columns[2],
            onsiteBldg: columns[3],
            leaveToWorkTime: columns[4],
            returnHomeTime: columns[5],
            homeCharging: columns[6],
          };
        });
        setEmployees(employeesFromCsv);
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <Grid container spacing={0} style={{ marginTop: 0, marginLeft: 10 }}>
      <Grid item xs={12} style={{ marginTop: 0 }}>
        <Typography variant="h4" gutterBottom>
          Employee Info
        </Typography>
      </Grid>
        <Grid item xs={12} md={12}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <TextField
                    required
                    label="Employee ID"
                    fullWidth
                    name="employeeId"
                    value={employeeData.employeeId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    label="Commute Mode"
                    fullWidth
                    name="commuteMode"
                    value={employeeData.commuteMode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    label="Zipcode"
                    fullWidth
                    name="zipcode"
                    type="number"
                    value={employeeData.zipcode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    label="Onsite Bldg"
                    fullWidth
                    name="onsiteBldg"
                    value={employeeData.onsiteBldg}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        required
                        label="Leave to work time"
                        fullWidth
                        value={employeeData.leaveToWorkTime}
                        name="leaveToWorkTime"
                        onChange={(newValue) =>
                          handleTimeChange(newValue, "leaveToWorkTime")
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        required
                        label="Return home time"
                        fullWidth
                        value={employeeData.returnHomeTime}
                        name="returnHomeTime"
                        onChange={(newValue) =>
                          handleTimeChange(newValue, "returnHomeTime")
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={3}>
                  {/* <TextField
                    label="Home Charging Level"
                    fullWidth
                    name="homeChargingLevel"
                    value={employeeData.homeCharging}
                    onChange={handleChange}
                    type="number"
                    sx={{ marginTop: 1 }}
                  /> */}

                  <FormControl fullWidth sx={{ marginTop: 1 }}>
                    <InputLabel id="homeChargingLevelLabel">
                      Home Charging Level
                    </InputLabel>
                    <Select
                      labelId="homeChargingLevelLabel"
                      id="demo-simple-select"
                      value={employeeData.homeCharging}
                      label="Home Charging Level"
                      onChange={handleChange}
                      fullWidth
                      // variant="filled"
                      name="homeCharging"
                    >
                      <MenuItem value={"None"}>No Charger</MenuItem>
                      <MenuItem value={"L1"}>Level 1</MenuItem>
                      <MenuItem value={"L2"}>Level 2</MenuItem>
                      <MenuItem value={"L3"}>Level 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justifyContent="flex-end">
                <Tooltip title="Add Row">
                  <Fab color="primary" aria-label="add" onClick={handleAddRow}>
                    +
                  </Fab>
                </Tooltip>
                <Tooltip title="Delete Last Row">
                  <Fab
                    color="secondary"
                    aria-label="delete"
                    onClick={handleDeleteLastRow}
                  >
                    -
                  </Fab>
                </Tooltip>
                <Tooltip title="Upload File">
                  <Fab color="default" aria-label="upload">
                    <label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                      <IconButton component="span">
                        <i className="fas fa-upload" />
                      </IconButton>
                    </label>
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Commute Mode</TableCell>
                      <TableCell>Zipcode</TableCell>
                      <TableCell>Onsite Bldg</TableCell>
                      <TableCell>Leave to Work Time</TableCell>
                      <TableCell>Return Home Time</TableCell>
                      <TableCell>Home Charging Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.employeeId}</TableCell>
                        <TableCell>{employee.commuteMode}</TableCell>
                        <TableCell>{employee.zipcode}</TableCell>
                        <TableCell>{employee.onsiteBldg}</TableCell>
                        <TableCell>
                          {isValidDate(employee.leaveToWorkTime)
                            ? employee.leaveToWorkTime.format(
                                "MM/DD/YYYY HH:mm:ss"
                              )
                            : ""}
                        </TableCell>
                        <TableCell>
                          {isValidDate(employee.returnHomeTime)
                            ? employee.returnHomeTime.format(
                                "MM/DD/YYYY HH:mm:ss"
                              )
                            : ""}
                        </TableCell>
                        <TableCell>{employee.homeCharging}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      {/* <Grid container spacing={2}>
        <Grid container spacing={2} style={{ marginTop: 50 }}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Traveling 0-10 Miles
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              % with Home Charger
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Trips Per Week
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Avg Trip Duration (Min)
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={1}
              max={1000}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={0}
              max={100}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={1}
              max={200}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={1}
              max={120}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Traveling 10-40 Miles
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              % with Home Charger
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Trips Per Week
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Avg Trip Duration (Min)
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={1}
              max={1000}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={0}
              max={100}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={1}
              max={200}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={1}
              max={120}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Traveling 40-100 Miles
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              % with Home Charger
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Trips Per Week
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Avg Trip Duration (Min)
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={1}
              max={1000}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={0}
              max={100}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={1}
              max={200}
            />
          </Grid>

          <Grid item xs={3}>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={1}
              max={120}
            />
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
}
