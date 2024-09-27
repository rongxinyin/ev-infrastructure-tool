import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Grid, Typography } from "@mui/material";

const SmartCharging = () => {
  const [L2, setL2] = useState("");
  const [L3, setL3] = useState("");
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRunScript = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/run-smart-charging"
      );
      console.log("Response from backend:", response.data);
      const result = response.data;
      setL2(result.optimal_L2);
      setL3(result.optimal_L3);
      setStatistics(result.statistics);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={1} style={{ marginTop: 0, marginLeft: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h4">Smart Charging</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRunScript}
          disabled={loading}
          sx={{ marginTop: 1, marginBottom: 2 }}
        >
          {loading ? "Loading..." : "Query Optimal Stations"}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Optimal L2"
          value={L2}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Optimal L3"
          value={L3}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={12} >
        <Typography variant="h6">Charging Load Metrics</Typography>
        <Grid container spacing={1} style={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Consumed Electricity (kWh)"
              value={statistics.consumed_electricity || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Peak Demand (kW)"
              value={statistics.peak_demand || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Average Load"
              value={statistics.average_load || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Load Factor"
              value={statistics.load_factor || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SmartCharging;
