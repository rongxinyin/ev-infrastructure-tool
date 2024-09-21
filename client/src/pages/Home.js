import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BuildingInfo from "../components/BuildingInfo.js";
import EmployeeInfo from "../components/EmployeeInfo.js";
import Simulation from "../components/Simulation.js";
import Results from "../components/Results.js";
import SmartCharging from "../components/SmartCharging.js";

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
  const [showSmartCharging, setShowSmartCharging] = useState(false);

  const [buildingInfoData, setBuildingInfoData] = useState({});

  const [employeeInfoData, setEmployeeInfoData] = useState({});
  const [employeeCommuteData, setEmployeeCommuteData] = useState({});

  const [mode, setMode] = useState(""); // set either Employee or Fleet
  const [openModePopup, setOpenModePopup] = React.useState(false);

  const [simulationConfigData, setSimulationConfigData] = useState({});
  const [showProgressBar, setShowProgressBar] = useState(false);

  const abortControllerRef = useRef(null);

  const [openPopup, setOpenPopup] = React.useState(false);
  const [popupTitle, setPopupTitle] = React.useState("");
  const [popupDialogue, setPopupDialogue] = React.useState("");

  const handleClickOpenPopup = (title, dialogue) => {
    setPopupDialogue(dialogue);
    setPopupTitle(title);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setPopupDialogue("");
    setPopupTitle("");
    setOpenPopup(false);
  };

  const handleClickOpenModePopup = () => {
    setOpenModePopup(true);
  };

  const handleCloseModePopupFleet = async () => {
    setMode("Fleet");
    setOpenModePopup(false);
  };

  const handleCloseModePopupEmployee = async () => {
    setMode("Employee");
    setOpenModePopup(false);
  };

  const handleBuildingInfoFormSubmit = (data) => {
    setBuildingInfoData(data);
    handleClickOpenPopup("Success", "Building/Site info saved");
  };

  useEffect(() => {
    if (Object.keys(employeeInfoData).length != 0) {
      getEmployeeCommuteInfo();
    }
  }, [employeeInfoData]);

  const handleEmployeeInfoFormSubmit = (data) => {
    setEmployeeInfoData(data);
  };

  useEffect(() => {
    if (Object.keys(simulationConfigData).length != 0) {
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
        setShowSmartCharging(false);
        break;
      case "employeeInfo":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(true);
        setShowSimulation(false);
        setShowResults(false);
        setShowSmartCharging(false);
        if (mode == "") {
          handleClickOpenModePopup();
        }
        break;
      case "simulation":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(false);
        setShowSimulation(true);
        setShowResults(false);
        setShowSmartCharging(false);
        break;
      case "results":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(false);
        setShowSimulation(false);
        setShowResults(true);
        setShowSmartCharging(false);
        break;
      case "smartCharging":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(false);
        setShowSimulation(false);
        setShowResults(false);
        setShowSmartCharging(true);
        break;
      default:
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
    console.log(result);
    setEmployeeCommuteData(result);
    handleClickOpenPopup("Success", `${mode} info saved`);
  };

  const getSimulationData = async () => {
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    let call = "";
    if (mode == "Fleet") {
      call = "http://localhost:8080/process-fleet-simulation";
    } else {
      call = "http://localhost:8080/process-employee-simulation";
    }

    try {
      const response = await fetch(call, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.assign({}, employeeCommuteData, simulationConfigData),
          null,
          2
        ),
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click(); // initiate download
      setShowProgressBar(false);
      a.remove(); // cleanup
      window.URL.revokeObjectURL(url); // release memory
      handleClickOpenPopup(
        "Success",
        "Simulation data successfully downloaded"
      );
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted. Please try again");
        handleClickOpenPopup("Error", "Abort error");
        setShowProgressBar(false);
      } else {
        console.error("Error fetching and downloading CSV:", error);
        handleClickOpenPopup(
          "Error",
          "Error fetching and downloading CSV. Please try again"
        );
        setShowProgressBar(false);
      }
    }
  };

  const terminateGetSimulationData = () => {
    console.log("Terminating fetch request");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort the fetch request
      setShowProgressBar(false);
      handleClickOpenPopup("Terminated", "Request successfully terminated");
    }
  };

  return (
    <Box
      bgcolor={"primary.white"}
      p={isMobile ? 1 : 2}
      sx={{ marginLeft: 10, marginRight: 10 }}
    >
      <Grid container spacing={4} padding={isMobile ? 5 : 5}>
        {/* <Grid item xs={12} align="center">
          <Typography
            variant="h3"
            sx={{
              marginTop: 0,
              marginBottom: 2,
            }}
          >
            Electrical Vehicle Infrastructure Tool (EVIT)
          </Typography>
        </Grid> */}

        {/* Sidebar */}
        <Grid item xs={12} md={2}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'sticky',
              top: theme.spacing(2),
            }}
          >
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
              Employee/Fleet Info
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

            <Button
              to="/smartCharging"
              variant="contained"
              sx={buttonSX}
              fullWidth
              onClick={() => switchPagesButton("smartCharging")}
            >
              Smart Charging
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={10}>
          {showBuildingInfo && (
            <BuildingInfo onFormSubmit={handleBuildingInfoFormSubmit} />
          )}
          <Dialog
            open={openPopup}
            onClose={handleClosePopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{popupTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {popupDialogue}.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePopup} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {showEmployeeInfo && (
            <EmployeeInfo
              onFormSubmit={handleEmployeeInfoFormSubmit}
              handlePopup={handleClickOpenPopup}
              mode={mode}
            />
          )}

          <Dialog
            open={openModePopup}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Select Mode"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Select to use either Employee or Fleet configuration.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModePopupFleet}>Fleet</Button>
              <Button onClick={handleCloseModePopupEmployee} autoFocus>
                Employee
              </Button>
            </DialogActions>
          </Dialog>

          {showResults && <Results />}
          {showSimulation && (
            <Simulation
              onFormSubmit={handleSimulationConfigFormSubmit}
              progressBarState={showProgressBar}
              terminateProcess={terminateGetSimulationData}
              mode={mode}
            />
          )}
          {showSmartCharging && <SmartCharging />}
        </Grid>

        
      </Grid>
    </Box>
  );
}