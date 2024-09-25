import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Typography } from '@mui/material';

const SmartCharging = () => {
  const [L2, setL2] = useState('');
  const [L3, setL3] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunScript = async () => {
    console.log('Button clicked, running script...');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/run-smart-charging');
      console.log('Response from backend:', response.data);
      const result = response.data;
      setL2(result.optimal_L2);
      setL3(result.optimal_L3);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ marginTop: 0, marginBottom: 2 }}>
          Smart Charging
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleRunScript} disabled={loading}>
          {loading ? 'Loading...' : 'Query Optimal Stations'}
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
    </Grid>
  );
};

export default SmartCharging;