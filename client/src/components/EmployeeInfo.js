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
import dayjs from "dayjs";

export default function EmployeeInfo() {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    commuteMode: "",
    zipcode: "",
    onsiteBldg: "",
    leaveToWorkTime: null,
    returnHomeTime: null,
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
    });
  };

  const handleDeleteLastRow = () => {
    setEmployees(employees.slice(0, -1));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
          };
        });
        setEmployees(employeesFromCsv);
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid item xs={12} style={{ marginTop: 0 }}>
        <Typography variant="h4" gutterBottom>
          Employee Info
        </Typography>
      </Grid>
      <Grid container spacing={0} style={{}}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <TextField
                    label="Employee ID"
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
                      />
                    </DemoContainer>
                  </LocalizationProvider>
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
                          {employee.leaveToWorkTime.format(
                            "MM/DD/YYYY HH:mm:ss"
                          )}
                        </TableCell>
                        <TableCell>
                          {employee.returnHomeTime.format(
                            "MM/DD/YYYY HH:mm:ss"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid container spacing={2} style={{ marginTop: 50 }}>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Traveling 0-10 Miles
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={1}
              max={1000}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              % with Home Charger
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={0}
              max={100}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Trips Per Week
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="0-10 Miles"
              defaultValue={0}
              min={1}
              max={200}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Avg Trip Duration (Minutes)
            </Typography>
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
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={1}
              max={1000}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              % with Home Charger
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={0}
              max={100}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Trips Per Week
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="10-40 Miles"
              defaultValue={10}
              min={1}
              max={200}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Avg Trip Duration (Minutes)
            </Typography>
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
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={1}
              max={1000}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              % with Home Charger
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={0}
              max={100}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Trips Per Week
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={1}
              max={200}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" align="center" gutterBottom>
              Avg Trip Duration (Minutes)
            </Typography>
            <Slider
              valueLabelDisplay="auto"
              aria-label="40-100 Miles"
              defaultValue={40}
              min={1}
              max={120}
            />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
