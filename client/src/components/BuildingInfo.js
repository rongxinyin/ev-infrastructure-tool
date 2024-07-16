import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, Box, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Link } from 'react-router-dom';

const App = () => {
  const [buildingInfo, setBuildingInfo] = useState({
    name: '',
    buildingType: '',
    addressType: 'zipCode',
    zipCode: '',
    city: '',
    state: '',
    fullAddress: '',
  });

  const [distributedEnergySource, setDistributedEnergySource] = useState({
    onsiteDER: false,
    desType: '',
    capacity: '',
  });

  const [electricVehicleChargingStations, setElectricVehicleChargingStations] = useState({
    level: '',
    portType: '',
    maxChargingPerPort: '',
    number: '',
  });

  const handleBuildingInfoChange = (event) => {
    const { name, value } = event.target;
    setBuildingInfo({ ...buildingInfo, [name]: value });
  };

  const handleDistributedEnergySourceChange = (event) => {
    const { name, value } = event.target;
    setDistributedEnergySource({ ...distributedEnergySource, [name]: value });
  };

  const handleElectricVehicleChargingStationsChange = (event) => {
    const { name, value } = event.target;
    setElectricVehicleChargingStations({ ...electricVehicleChargingStations, [name]: value });
  };



  return (
    <Grid container spacing={2} style={{ marginTop: 100 }}>
      <Grid item xs={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button component={Link} to="/buildinginfo" variant="contained" fullWidth>
              BUILDINGINFO
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button component={Link} to="/employeeinfo" variant="contained" fullWidth>
              EMPLOYEE INFO
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button component={Link} to="/simulation" variant="contained" fullWidth>
              SIMULATION
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button component={Link} to="/results" variant="contained" fullWidth>
              RESULTS
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h4" gutterBottom>
          BUILDING/SITE INFO
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Building Information
            </Typography>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={buildingInfo.name}
              onChange={handleBuildingInfoChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Building Type"
              fullWidth
              name="buildingType"
              value={buildingInfo.buildingType}
              onChange={handleBuildingInfoChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Address
            </Typography>
            <RadioGroup name="addressType" value={buildingInfo.addressType} onChange={handleBuildingInfoChange}>
              <FormControlLabel value="zipCode" control={<Radio />} label="Zip Code" />
              <FormControlLabel value="fullAddress" control={<Radio />} label="Full Address" />
            </RadioGroup>
            {buildingInfo.addressType === 'zipCode' ? (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Zip Code"
                    fullWidth
                    name="zipCode"
                    value={buildingInfo.zipCode}
                    onChange={handleBuildingInfoChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <TextField
                label="Full Address"
                fullWidth
                name="fullAddress"
                value={buildingInfo.fullAddress}
                onChange={handleBuildingInfoChange}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Onsite Distributed Energy Resource
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={distributedEnergySource.onsiteDER}
                  onChange={handleDistributedEnergySourceChange}
                  name="onsiteDER"
                />
              }
              label="Onsite Distributed Energy Resource"
            />
            {distributedEnergySource.onsiteDER && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="DES Type"
                    fullWidth
                    name="desType"
                    value={distributedEnergySource.desType}
                    onChange={handleDistributedEnergySourceChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Capacity (kW)"
                    fullWidth
                    name="capacity"
                    value={distributedEnergySource.capacity}
                    onChange={handleDistributedEnergySourceChange}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Existing Electric Vehicle Charging Stations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  label="Level"
                  fullWidth
                  name="level"
                  value={electricVehicleChargingStations.level}
                  onChange={handleElectricVehicleChargingStationsChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Port Type"
                  fullWidth
                  name="portType"
                  value={electricVehicleChargingStations.portType}
                  onChange={handleElectricVehicleChargingStationsChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Max Charging per Port"
                  fullWidth
                  name="maxChargingPerPort"
                  value={electricVehicleChargingStations.maxChargingPerPort}
                  onChange={handleElectricVehicleChargingStationsChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Number"
                  fullWidth
                  name="number"
                  value={electricVehicleChargingStations.number}
                  onChange={handleElectricVehicleChargingStationsChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth>
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;