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
            Welcome to the Electrical Vehicle Infrastructure Tool (EVIT)!
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
            EVIT is an open-source web-based tool web-based tool for planning
            optimal electric vehicle charging stations for both fleet and
            personally owned vehicles in the context of transportation
            electrification.
          </Typography>
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
          <Typography
            variant="body2"
            color="white.main"
            sx={{ fontSize: "1.2rem" }}
          >
            TBD. {" "}
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
