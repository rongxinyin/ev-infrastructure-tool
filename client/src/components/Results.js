import { Box, Button, Grid, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const textFieldSX = {
  width: "100%",
  marginBottom: 5,
  marginTop: 1,
  border: "2px solid #F0F0F0",
  backgroundColor: "secondary.main",
};

export default function Simulation() {
  return (
    <Box
      bgcolor="primary.main"
      sx={{
        paddingRight: 5,
        paddingLeft: 3,
        paddingBottom: 5,
      }}
    >
      <Grid container spacing={0}>

        <Grid item xs={12}>
          <Typography variant="h4" color="white.main" sx={{ marginTop: 8 }}>
            RESULTS
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6" color="white.main" sx={{ marginTop: 2 }}>
                Wait time
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" color="white.main" sx={{ marginTop: 2 }}>
                Low SoC
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" color="white.main" sx={{ marginTop: 2 }}>
            Utilization
          </Typography>
          <Typography variant="h6" color="white.main" sx={{ marginTop: 2 }}>
            Charging demand (1 month)
          </Typography>
          <Typography variant="h6" color="white.main" sx={{ marginTop: 2 }}>
            Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box bgcolor="tertiary.main">
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ marginTop: 3, marginLeft: 3, paddingTop: 2 }}
                >
                  Weight
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                >
                  Cost
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                ></Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                >
                  Wait time
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                >
                  Peak demand
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                >
                  Utilization
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3, paddingBottom: 2 }}
                >
                  Low SoC
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box bgcolor="tertiary.main">
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ marginTop: 3, marginLeft: 3, paddingTop: 2 }}
                >
                  Result
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                >
                  # of L2:
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3 }}
                >
                  # of L3:
                </Typography>
                <Typography
                  variant="body1"
                  color="secondary.main"
                  sx={{ marginTop: 1, marginLeft: 3, paddingBottom: 2 }}
                >
                  Score:
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
