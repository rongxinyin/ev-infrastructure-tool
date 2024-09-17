import React, { useState } from "react";
import {
  Button,
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
  Tooltip,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/index.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/index.js";
import { TimePicker } from "@mui/x-date-pickers/TimePicker/index.js";
import Papa from "papaparse";

export default function EmployeeInfo({ onFormSubmit, handlePopup, mode }) {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    commuteMode: "",
    zipcode: "",
    onsiteBldg: "",
    leaveToWorkTime: null,
    returnHomeTime: null,
    homeCharging: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const checkNotEmpty = (employeeData) => {
    for (var key in employeeData) {
      if (employeeData[key] == "" || employeeData[key] == null) {
        return false;
      }
    }
    return true;
  };

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
    if (checkNotEmpty(employeeData)) {
      // prevent adding empty rows
      setEmployees([
        ...employees,
        {
          employee_id: employeeData.employeeId,
          commute_mode: employeeData.commuteMode,
          zip_code: employeeData.zipcode,
          onsite_bldg: employeeData.onsiteBldg,
          leave_to_work_time: isValidDate(employeeData.leaveToWorkTime)
            ? employeeData.leaveToWorkTime.format("HH:mm")
            : "",
          return_home_time: isValidDate(employeeData.returnHomeTime)
            ? employeeData.returnHomeTime.format("HH:mm")
            : "",
          home_charging: employeeData.homeCharging,
          id: Math.random().toString(36).substring(2, 15),
          parking_lot: "bldg-90",
          // TODO: find out above is permanent or use diff bldg types
        },
      ]);
      setEmployeeData({
        employeeId: "",
        commuteMode: "",
        zipcode: "",
        onsiteBldg: "",
        leaveToWorkTime: null,
        returnHomeTime: null,
        homeCharging: "",
      });
    } else {
      handlePopup("Erorr", "One or more inputs are empty");
    }
  };

  const handleDeleteLastRow = () => {
    setEmployees(employees.slice(0, -1));
  };

  const isValidDate = (date) => {
    return date != null;
  };

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          console.log("Parsed Results:", results.data); // Log parsed data for debugging
          const csvData = results.data;
          const employeesFromCsv = csvData.slice(1).map((row) => {
            // Skip the header row
            return {
              employee_id: row[0] || "",
              commute_mode: row[1] || "",
              zip_code: row[2] || "",
              onsite_bldg: row[3] || "",
              leave_to_work_time: row[4] || "",
              return_home_time: row[5] || "",
              home_charging: row[6] || "",
              id: Math.random().toString(36).substring(2, 15),
              parking_lot: "bldg-90", // TODO: don't hardcode
            };
          });
          setEmployees(employeesFromCsv);
        },
        header: false,
        skipEmptyLines: true,
        delimiter: ",",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(employees);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={0} style={{ marginTop: 0, marginLeft: 10 }}>
        <Grid item xs={12} style={{ marginTop: 0 }}>
          <Typography variant="h4" gutterBottom>
            {mode} Info
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <TextField
                    label="ID"
                    fullWidth
                    name="employeeId"
                    value={employeeData.employeeId}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Commute Mode"
                    fullWidth
                    name="commuteMode"
                    value={employeeData.commuteMode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
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
                    label="Onsite Bldg"
                    fullWidth
                    name="onsiteBldg"
                    value={employeeData.onsiteBldg}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
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
                <Tooltip title="Upload CSV File">
                  <Fab color="default" aria-label="upload">
                    <label>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleUploadFile}
                        style={{ display: "none" }}
                      />
                      📤
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
                      <TableCell>{mode} ID</TableCell>
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
                        <TableCell>{employee.employee_id}</TableCell>
                        <TableCell>{employee.commute_mode}</TableCell>
                        <TableCell>{employee.zip_code}</TableCell>
                        <TableCell>{employee.onsite_bldg}</TableCell>
                        <TableCell>{employee.leave_to_work_time}</TableCell>
                        <TableCell>{employee.return_home_time}</TableCell>
                        <TableCell>{employee.home_charging}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{ marginTop: 1 }}
              >
                Update
              </Button>
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
    </form>
  );
}
