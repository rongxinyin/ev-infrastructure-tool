import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

function BuildingInfo() {
  const [buildingName, setBuildingName] = useState('');
  const [buildingAddress, setBuildingAddress] = useState('');
  const [buildingCity, setBuildingCity] = useState('');
  const [buildingState, setBuildingState] = useState('');
  const [buildingZipCode, setBuildingZipCode] = useState('');
  const [buildingCountry, setBuildingCountry] = useState('');
  const [useZipCodeOnly, setUseZipCodeOnly] = useState(false);
  const [zipCodeOnly, setZipCodeOnly] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [hasSolar, setHasSolar] = useState(false);
  const [hasBatteryStorage, setHasBatteryStorage] = useState(false);
  const [hasEVSE, setHasEVSE] = useState(false);
  const [electricalServiceType, setElectricalServiceType] = useState('');
  const [availableCircuits, setAvailableCircuits] = useState('');
  const [electricalCapacity, setElectricalCapacity] = useState('');
  const [transformerAndDistributionEquipment, setTransformerAndDistributionEquipment] = useState({
    electricalCapacity: '',
    voltage: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let buildingLocation;
    if (useZipCodeOnly) {
      buildingLocation = {
        zip_code: zipCodeOnly,
      };
    } else {
      buildingLocation = {
        address: buildingAddress,
        city: buildingCity,
        state: buildingState,
        zip_code: buildingZipCode,
        country: buildingCountry,
      };
    }

    const buildingData = {
      building_name: buildingName,
      building_location: buildingLocation,
      building_type: buildingType,
      has_solar: hasSolar,
      has_battery_storage: hasBatteryStorage,
      has_evse: hasEVSE,
      electrical_service_type: electricalServiceType,
      electrical_panel: {
        available_circuits: availableCircuits,
        electrical_capacity: electricalCapacity,
      },
      transformer_and_distribution_equipment: transformerAndDistributionEquipment,
    };

    const json = JSON.stringify(buildingData, null, 2);
    console.log(json); 
    document.getElementById('json-output').innerText = json; // display the JSON in the HTML element
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant='h1'>Building INFO </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Building Name"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useZipCodeOnly}
                  onChange={(e) => setUseZipCodeOnly(e.target.checked)}
                />
              }
              label="Use Zip Code Only"
            />
          </Grid>
          {useZipCodeOnly? (
            <Grid item xs={12}>
              <TextField
                label="Zip Code"
                value={zipCodeOnly}
                onChange={(e) => setZipCodeOnly(e.target.value)}
                fullWidth
              />
            </Grid>
          ) : (
            <React.Fragment>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={buildingAddress}
                  onChange={(e) => setBuildingAddress(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="City"
                  value={buildingCity}
                  onChange={(e) => setBuildingCity(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="State"
                  value={buildingState}
                  onChange={(e) => setBuildingState(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Zip Code"
                  value={buildingZipCode}
                  onChange={(e) => setBuildingZipCode(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  value={buildingCountry}
                  onChange={(e) => setBuildingCountry(e.target.value)}
                  fullWidth
                />
              </Grid>
            </React.Fragment>
          )}
         <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Building Type</InputLabel>
              <Select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
              >
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Industrial">Industrial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasSolar}
                  onChange={(e) => setHasSolar(e.target.checked)}
                />
              }
              label="Solar Panels"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasBatteryStorage}
                  onChange={(e) => setHasBatteryStorage(e.target.checked)}
                />
              }
              label="Battery Storage"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasEVSE}
                  onChange={(e) => setHasEVSE(e.target.checked)}
                />
              }
              label="EVSE"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Electrical Service Type"
              value={electricalServiceType}
              onChange={(e) => setElectricalServiceType(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Available Circuits"
              type="number"
              value={availableCircuits}
              onChange={(e) => setAvailableCircuits(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Electrical Capacity"
              type="number"
              value={electricalCapacity}
              onChange={(e) => setElectricalCapacity(e.target.value)}
              fullWidth
            />
          </Grid>
<          Grid item xs={12}>
              <TextField
              label="Electrical Capacity"
              type="number"
              value={transformerAndDistributionEquipment.electricalCapacity}
              onChange={(e) => setTransformerAndDistributionEquipment({...transformerAndDistributionEquipment, electricalCapacity: e.target.value})}
              fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box sx={{ mt: 2 }}>
        <Typography>json-output:</Typography>
        <Box id="json-output" sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
        </Box>
      </Box>
    </Box>
  );
}

export default BuildingInfo;