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

export default function EmployeeInfo() {
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    commuteMode: "",
    zipcode: "",
    onsiteBldg: "",
    leaveToWorkTime: "",
    returnHomeTime: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
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
      leaveToWorkTime: "",
      returnHomeTime: "",
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
        <Typography variant="h4" align="center" gutterBottom>
          EMPLOYEE INFO
        </Typography>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: 2 }}>
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
                  <TextField
                    label="Leave to Work Time"
                    fullWidth
                    name="leaveToWorkTime"
                    value={employeeData.leaveToWorkTime}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Return Home Time"
                    fullWidth
                    name="returnHomeTime"
                    value={employeeData.returnHomeTime}
                    onChange={handleChange}
                  />
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
                        <TableCell>{employee.leaveToWorkTime}</TableCell>
                        <TableCell>{employee.returnHomeTime}</TableCell>
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
        <Grid container spacing={2} style={{ marginTop: 100 }}>
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
              Avg Trip Duration(Minutes)
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
              Avg Trip Duration(Minutes)
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
