import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BuildingInfo from "../components/BuildingInfo.js";
import EmployeeInfo from "../components/EmployeeInfo.js";
import Simulation from "../components/Simulation.js";
import Results from "../components/Results.js";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Visualization
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const buttonSX = {
  marginBottom: 1,
  height: 80,
};

export default function Home() {
  let navigate = useNavigate(); // Navigate to different pages
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the device is mobile

  const [showBuildingInfo, setShowBuildingInfo] = useState(true);
  const [showEmployeeInfo, setShowEmployeeInfo] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [buildingInfoData, setBuildingInfoData] = useState({});

  const [employeeInfoData, setEmployeeInfoData] = useState({});
  const [employeeCommuteData, setEmployeeCommuteData] = useState({});

  const [simulationConfigData, setSimulationConfigData] = useState({});
  const [showProgressBar, setShowProgressBar] = useState(false);

  const handleBuildingInfoFormSubmit = (data) => {
    setBuildingInfoData(data);
  };

  const handleEmployeeInfoFormSubmit = (data) => {
    setEmployeeInfoData(data);
    getEmployeeCommuteInfo();
  };

  useEffect(() => {
    if (simulationConfigData) {
      getSimulationData();
    }
  }, [simulationConfigData]);

  const handleSimulationConfigFormSubmit = (data) => {
    setSimulationConfigData(data);
    setShowProgressBar(true);
  };

  const switchPagesButton = (state) => {
    switch (state) {
      case "buildingInfo":
        setShowBuildingInfo(true);
        setShowEmployeeInfo(false);
        setShowSimulation(false);
        setShowResults(false);
        break;
      case "employeeInfo":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(true);
        setShowSimulation(false);
        setShowResults(false);
        break;
      case "simulation":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(false);
        setShowSimulation(true);
        setShowResults(false);
        break;
      case "results":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(false);
        setShowSimulation(false);
        setShowResults(true);
        break;
    }
  };

  const getEmployeeCommuteInfo = async () => {
    const response = await fetch(
      "http://localhost:8080/process-employee-data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeInfoData, null, 2),
      }
    );

    const result = await response.json();
    console.log(result); // Process the result as needed
    setEmployeeCommuteData(result);
  };

  const getSimulationData = async () => {
    try {
      const response = await fetch("http://localhost:8080/process-simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.assign({}, employeeCommuteData, simulationConfigData),
          null,
          2
        ),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the response as a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv"; // Set the file name
      document.body.appendChild(a);
      a.click(); // Trigger the download
      setShowProgressBar(false);
      a.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release memory
    } catch (error) {
      console.error("Error fetching and downloading CSV:", error);
    }
  };

  return (
    <Box
      bgcolor={"primary.white"}
      p={isMobile ? 1 : 2}
      sx={{ marginLeft: 10, marginRight: 10 }}
    >
      {" "}
      {/* Adjust padding for mobile */}
      <Grid container spacing={1} padding={isMobile ? 5 : 5} md={12} xs={12}>
        <Grid item xs={12} align="center">
          <Typography
            variant="h4"
            sx={{
              marginTop: 0,
              marginBottom: 2,
            }}
          >
            Electrical Vehicle Infrastructure Tool (EVIT)
          </Typography>
        </Grid>

        {/* buttons for subpage navigation */}
        <Grid item xs={2} align="center" spacing={0}>
          <Button
            variant="contained"
            sx={buttonSX}
            fullWidth
            onClick={() => switchPagesButton("buildingInfo")}
          >
            Building/Site Info
          </Button>

          <Button
            variant="contained"
            sx={buttonSX}
            fullWidth
            onClick={() => switchPagesButton("employeeInfo")}
          >
            Employee Info
          </Button>

          <Button
            variant="contained"
            sx={buttonSX}
            fullWidth
            onClick={() => switchPagesButton("simulation")}
          >
            Simulation
          </Button>

          <Button
            to="/results"
            variant="contained"
            sx={buttonSX}
            fullWidth
            onClick={() => switchPagesButton("results")}
          >
            Results
          </Button>
        </Grid>

        <Grid item xs={10}>
          {/* displays subpage if the state is true */}
          {showBuildingInfo && (
            <BuildingInfo onFormSubmit={handleBuildingInfoFormSubmit} />
          )}
          {/* {showBuildingInfo && (
            <pre>{JSON.stringify(buildingInfoData, null, 2)}</pre>
          )} */}
          {showEmployeeInfo && (
            <EmployeeInfo onFormSubmit={handleEmployeeInfoFormSubmit} />
          )}
          {/* {showEmployeeInfo && (
            <pre>{JSON.stringify(employeeInfoData, null, 2)}</pre>
          )} */}
          {/* {showEmployeeInfo && (
            <Button onClick={() => getEmployeeCommuteInfo()}>TEST</Button>
          )} */}
          {/* {showEmployeeInfo && (
            <pre>{JSON.stringify(employeeCommuteData, null, 2)}</pre>
          )} */}
          {showResults && <Results />}
          {showSimulation && (
            <Simulation
              onFormSubmit={handleSimulationConfigFormSubmit}
              progressBarState={showProgressBar}
            />
          )}
          {/* {showSimulation && showProgressBar && (
            <LinearProgress color="secondary" />
          )} */}
          {/* {showSimulation && (
            <Button onClick={() => getSimulationData()}>TEST</Button>
          )} */}
        </Grid>

        <Grid
          item
          xs={12}
          align="left"
          sx={{
            marginTop: 5,
            width: "100%",
            backgroundColor: "primary.white",
            fontSize: isMobile
              ? "0.8rem"
              : "1.2rem" /* Adjust font size for mobile */,
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
            Paper Citations:
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
            Yin, R., J. Liu, M.A. Piette, J. Xie, M. Pritoni, A. Casillas, L.
            Yu, P. Schwartz, Comparing simulated demand flexibility against
            actual performance in commercial office buildings, Building and
            Environment, 2023.{" "}
            <a
              href="https://doi.org/10.1016/j.buildenv.2023.110663"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2196f3" }}
            >
              https://doi.org/10.1016/j.buildenv.2023.110663
            </a>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
            TBD.{" "}
            <a
              href="https://doi.org/10.1016/j.buildenv.2023.110663"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2196f3" }}
            >
              To be submitted to Journal of SoftwareX
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
