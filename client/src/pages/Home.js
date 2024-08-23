import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BuildingInfo from "../components/BuildingInfo.js";
import EmployeeInfo from "../components/EmployeeInfo.js";
import Simulation from "../components/Simulation.js";
import Results from "../components/Results.js";
import React, { useState, useEffect, useRef } from "react";

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
        break;
      case "employeeInfo":
        setShowBuildingInfo(false);
        setShowEmployeeInfo(true);
        setShowSimulation(false);
        setShowResults(false);
        if (mode == "") {
          handleClickOpenModePopup();
        }
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
      {" "}
      {/* Adjust padding for mobile */}
      <Grid container spacing={1} padding={isMobile ? 5 : 5}>
        <Grid item xs={12} align="center">
          <Typography
            variant="h3"
            sx={{
              marginTop: 0,
              marginBottom: 2,
            }}
          >
            Electrical Vehicle Infrastructure Tool (EVIT)
          </Typography>
        </Grid>

        {/* buttons for subpage navigation */}
        <Grid item xs={2} align="center">
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
        </Grid>

        <Grid item xs={10}>
          {/* displays subpage if the state is true */}
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
