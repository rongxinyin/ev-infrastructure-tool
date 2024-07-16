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
        paddingBottom: 5
    }}>
<Grid container spacing={0}>
  <Grid item xs={4}>
    <Button
        variant="contained"
        color="secondary"
        sx={{
            marginTop: 10,
            marginLeft: 3,
            width: "75%",
            height: "40px",
        }}
        >
        BUILDING/SITE INFO
    </Button>
    <Button
        variant="contained"
        color="secondary"
        sx={{
            marginTop: 3,
            marginLeft: 3,
            width: "75%",
            height: "40px",
        }}
        >
        EMPLOYEE INFO
    </Button>
    <Button
        variant="contained"
        color="secondary"
        sx={{
            marginTop: 3,
            marginLeft: 3,
            width: "75%",
            height: "40px",
        }}
        >
        SIMULATION
    </Button>
    <Button
        variant="contained"
        color="secondary"
        sx={{
            marginTop: 3,
            marginLeft: 3,
            width: "75%",
            height: "40px",
        }}
        >
        RESULTS
    </Button>
  </Grid>
  <Grid item xs={8}>
    <Typography
        variant="h4"
        color="white.main"
        sx={{ marginTop: 8}}
    >
        SIMULATION
    </Typography>
    <Box 
        bgcolor="tertiary.main"
        >
    <Typography
        variant="h6"
        color="primary"
        sx={{ paddingTop: 2, marginBottom: 1, paddingLeft: 3 }}
        >
            SIMULATION CONFIGURATIONS
    </Typography>
    <Grid container spacing={2} sx={{paddingLeft: 3}}>
        <Grid item xs={4}>
            <Typography
                variant="body1"
                color="primary">
                Start time
            </Typography>
            <TextField 
                id="outlined-basic" 
                label="Start time" 
                variant="outlined"
                sx={textFieldSX}
            />
        </Grid>
        <Grid item xs={4}>
            <Typography
                variant="body1"
                color="primary">
                Run period
            </Typography>
            <TextField 
                id="outlined-basic" 
                label="Run period" 
                variant="outlined"
                sx={textFieldSX}
            />
        </Grid>
    </Grid>
    <Grid container spacing={2} sx={{paddingLeft: 3}}>
        <Grid item xs={4}>
        <Typography
            variant="body1"
            color="primary">
            Level 2 charging power (kW)
        </Typography>
        <TextField 
            id="outlined-basic" 
            label="Level 2 charging power" 
            variant="outlined"
            sx={textFieldSX}
        />
        </Grid>
        <Grid item xs={4}>
        <Typography
            variant="body1"
            color="primary">
            Level 3 charging power (kW)
        </Typography>
        <TextField 
            id="outlined-basic" 
            label="Level 3 charging power" 
            variant="outlined"
            sx={textFieldSX}
        />
        </Grid>
    </Grid>
    </Box>
    <Grid container spacing={3}>
        <Grid item xs={2}>
            <Button
                variant="contained"
                color="secondary"
                sx={{
                    marginTop: 4,
                    marginBottom: 3,
                    width: "100%"
                }}
            >
                RUN
            </Button>
        </Grid>
        <Grid item xs={2}>
            <Button
                variant="contained"
                color="secondary"
                sx={{
                    marginTop: 4,
                    marginBottom: 3,
                    width: "100%"
                }}
            >
                TERMINATE
            </Button>
        </Grid>
    </Grid>
    <Typography 
        variant="h6"
        color="white.main"
    >
        Progress bar
    </Typography>
  </Grid>
</Grid>
</Box>
  );
}