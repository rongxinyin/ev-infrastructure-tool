import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BuildingInfo from "./BuildingInfo.js";
import EmployeeInfo from "./EmployeeInfo.js";
import Simulation from "./Simulation.js"
import Results from "./Results.js"

// Visualization
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const buttonSX = {
  marginTop: 1,
};

export default function Home() {
  let navigate = useNavigate(); // Navigate to different pages
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the device is mobile

  return (
    <Box bgcolor={"primary.white"} p={isMobile ? 1 : 2}>
      {" "}
      {/* Adjust padding for mobile */}
      <Grid container spacing={1} padding={isMobile ? 5 : 5} md={12} xs={12}>
        <Grid item xs={12} align="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginTop: 0,
            }}
          >
            Electrical Vehicle Infrastructure Tool (EVIT)
          </Typography>
        </Grid>

        {/* buttons for subpage navigation */}
        <Grid item xs={3} align="center" spacing={0}>
          <Button
            to="/buildinginfo"
            variant="contained"
            sx={buttonSX}
            fullWidth
          >
            Building Info
          </Button>

          <Button
            to="/employeeinfo"
            variant="contained"
            sx={buttonSX}
            fullWidth
          >
            Employee Info
          </Button>

          <Button to="/simulation" variant="contained" sx={buttonSX} fullWidth>
            Simulation
          </Button>

          <Button to="/results" variant="contained" sx={buttonSX} fullWidth>
            Results
          </Button>
        </Grid>

        <Grid item xs={9}>
          {/* define custom subpage components */}
          {/* <BuildingInfo /> */}
          {/* <EmployeeInfo /> */}
          <Simulation />
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
