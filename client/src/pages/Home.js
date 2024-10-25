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
import planningIcon from "../components/images/ev-planning.png";
import operationIcon from "../components/images/ev-operation.png";

// Visualization
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  let navigate = useNavigate(); // Navigate to different pages
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the device is mobile

  return (
    <Box bgcolor={"primary.main"} p={isMobile ? 1 : 2}>
      {" "}
      {/* Adjust padding for mobile */}
      <Grid container spacing={2} padding={isMobile ? 2 : 10} md={12} xs={12}>
        <Grid item xs={12} align="center">
          <Typography
            variant="h4"
            color="white.main"
            sx={{
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Welcome to the Electrical Vehicle Charging Infrastructure Planning Tool (EV-CIPT)
          </Typography>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography
            variant="h6"
            color="white.main"
            sx={{
              m: 1,
              marginTop: 1,
              textAlign: "center",
            }}
          >
            EV Charging Infrastructure Planning Tool (EV-CIPT) is an open-source web-based tool 
            for decision makers to plan optimal EV charging station combinations by simulating 
            the driving patterns of user-inputted employees/fleets and visualizing 
            various KPIs. EVIT integrates real-time data while ensuring accessibility 
            for all users, making it a comprehensive and convenient tool for a broad 
            range of stakeholders, including city planners, utility companies, and 
            policy makers. Performance metrics including installation cost, waiting time, 
            peak demand, and utilization rate are compared and users are able to 
            customize the weighting of these metrics. 
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          align="center"
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexDirection: isMobile ? "column" : "row",
          }} /* Stack buttons vertically on mobile */
        >
          {/* Button Components */}
          {/* Residential Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/planning")}
            sx={{
              width: "350px",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <img
              src={planningIcon}
              alt="EV Operation Icon"
              style={{ maxWidth: "80%", maxHeight: "60%" }}
            />
            Planning
          </Button>

          {/* Commercial Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/operation")}
            sx={{
              width: "350px",
              height: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <img
              src={operationIcon}
              alt="EV Operation Icon"
              style={{ maxWidth: "80%", maxHeight: "60%" }}
            />
            Operation
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
          align="left"
          sx={{
            marginTop: 5,
            width: "100%",
            backgroundColor: "primary.main",
            fontSize: isMobile
              ? "0.8rem"
              : "1.2rem" /* Adjust font size for mobile */,
          }}
        >
          <Typography
            variant="body2"
            color="white.main"
            sx={{ fontSize: "1.2rem" }}
          >
            Paper Citations:
          </Typography>
          <Typography
            variant="body2"
            color="white.main"
            sx={{ fontSize: "1.2rem" }}
          >
            Development of a Web-Based EV Charging Infrastructure Planning Tool: Enabling Scalable 
            and Adaptive Solutions for Urban and Regional Planning{" "}
            <a
              href="https://www.softxjournal.com/"
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
