import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export default function BuildingInfo() {
  const [buildingInfo, setBuildingInfo] = useState({
    name: "",
    buildingType: "",
    addressType: "zipCode",
    zipCode: "",
    city: "",
    state: "",
    fullAddress: "",
  });

  const [distributedEnergySource, setDistributedEnergySource] = useState({
    onsiteDER: false,
    desType: "",
    capacity: "",
  });

  const [electricVehicleChargingStations, setElectricVehicleChargingStations] =
    useState({
      level: "",
      portType: "",
      maxChargingPerPort: "",
      number: "",
    });

  const handleBuildingInfoChange = (event) => {
    const { name, value } = event.target;
    setBuildingInfo({ ...buildingInfo, [name]: value });
  };

  const handleDistributedEnergySourceChange = (event) => {
    const { name, value } = event.target;
    setDistributedEnergySource({ ...distributedEnergySource, [name]: value });
  };

  const handleOnsiteDERChange = (event) => {
    const { checked } = event.target;
    setDistributedEnergySource({
      ...distributedEnergySource,
      onsiteDER: checked,
    });
  };


  const handleElectricVehicleChargingStationsChange = (event) => {
    const { name, value } = event.target;
    setElectricVehicleChargingStations({
      ...electricVehicleChargingStations,
      [name]: value,
    });
  };

  const textFieldSX = {};

  return (
    <Grid container spacing={2} style={{ marginTop: 0, marginLeft: 10 }}>
      <Typography variant="h4" gutterBottom>
        Building/Site Info
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            value={buildingInfo.name}
            onChange={handleBuildingInfoChange}
            // size="small"
            sx={textFieldSX}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Type"
            name="buildingType"
            value={buildingInfo.buildingType}
            onChange={handleBuildingInfoChange}
            // size="big"
          />
        </Grid>
        {/* <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
            Address
          </Typography>
        </Grid> */}
        <Grid item xs={2}>
          <RadioGroup
            name="addressType"
            value={buildingInfo.addressType}
            onChange={handleBuildingInfoChange}
          >
            <FormControlLabel
              value="zipCode"
              control={<Radio />}
              label="Zip Code"
            />
            <FormControlLabel
              value="fullAddress"
              control={<Radio />}
              label="Full Address"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={10} sx={{marginLeft: -1}}>
          {buildingInfo.addressType === "zipCode" ? (
            <Grid container spacing={0}>
              <Grid item xs={3} >
                <TextField
                  fullWidth
                  name="zipCode"
                  value={buildingInfo.zipCode}
                  onChange={handleBuildingInfoChange}
                  sx={{ marginTop: 1 }}
                  type="number"
                  label="Zip Code"
                />
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="fullAddress"
                value={buildingInfo.fullAddress}
                onChange={handleBuildingInfoChange}
                sx={{ marginTop: 1 }}
                label="Full Address"
              />
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={distributedEnergySource.onsiteDER}
                onChange={handleOnsiteDERChange}
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
                type="number"
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
                type="number"
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
  );
}
