import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Grid, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  IconButton, 
  Input,
  Paper
} from '@mui/material';

function EmployeeInfo() {
  const [employeeId, setEmployeeId] = useState('');
  const [commuteMode, setCommuteMode] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [onsiteBldg, setOnsiteBldg] = useState('');
  const [leaveToWorkTime, setLeaveToWorkTime] = useState('');
  const [returnHomeTime, setReturnHomeTime] = useState('');
  const [homeCharging, setHomeCharging] = useState(false);
  const [chargerLevel, setChargerLevel] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showJson, setShowJson] = useState(false);
  const [file, setFile] = useState(null);

  const handleAddRow = () => {
    const newRow = {
      employeeId,
      commuteMode,
      zipCode,
      onsiteBldg,
      leaveToWorkTime,
      returnHomeTime,
      homeCharging,
      chargerLevel,
    };
    setEmployees([...employees, newRow]);
    setEmployeeId('');
    setCommuteMode('');
    setZipCode('');
    setOnsiteBldg('');
    setLeaveToWorkTime('');
    setReturnHomeTime('');
    setHomeCharging(false);
    setChargerLevel('');
  };

  const handleDeleteRow = (index) => {
    setEmployees(employees.filter((_, i) => i!== index));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Grid>
        <Typography variant='h1'>Employee INFO </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Commute Mode"
              value={commuteMode}
              onChange={(e) => setCommuteMode(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Onsite Bldg"
              value={onsiteBldg}
              onChange={(e) => setOnsiteBldg(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Leave to Work Time"
              value={leaveToWorkTime}
              onChange={(e) => setLeaveToWorkTime(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Return Home Time"
              value={returnHomeTime}
              onChange={(e) => setReturnHomeTime(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={homeCharging}
                  onChange={(e) => setHomeCharging(e.target.checked)}
                />
              }
              label="Home Charging"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Charger Level"
              value={chargerLevel}
              onChange={(e) => setChargerLevel(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 10 }}>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
              >
                Add Row
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDeleteRow(employees.length - 1)}
                sx={{ ml: 2 }}
              >
                Delete Row
              </Button>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <IconButton component="span" sx={{ ml: 2 }}>
                <i className="fas fa-upload" />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                component="label"
                sx={{ ml: 2 }}
              >
                Upload File
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Button>
            </Grid>
          </Grid>
          
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Commute Mode</TableCell>
                  <TableCell>Zipcode</TableCell>
                  <TableCell>Onsite Bldg</TableCell>
                  <TableCell>Leave to Work Time</TableCell>
                  <TableCell>Return Home Time</TableCell>
                  <TableCell>Home Charging</TableCell>
                  <TableCell>Charger Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.commuteMode}</TableCell>
                    <TableCell>{employee.zipCode}</TableCell>
                    <TableCell>{employee.onsiteBldg}</TableCell>
                    <TableCell>{employee.leaveToWorkTime}</TableCell>
                    <TableCell>{employee.returnHomeTime}</TableCell>
                    <TableCell>{employee.homeCharging? "True" : "False"}</TableCell>
                    <TableCell>{employee.chargerLevel}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteRow(index)}>
                        <i className="fas fa-trash" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {showJson && (
            <Box sx={{ mt: 2 }}>
              <Typography>json-output:</Typography>
              <Typography>{JSON.stringify(employees, null, 2)}</Typography>
            </Box>
          )}
        </Box>
      </Grid>
    </Box>
  );
}

export default EmployeeInfo;