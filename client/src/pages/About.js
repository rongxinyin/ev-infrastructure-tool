import { Box, Grid, Paper, Typography, styled } from "@mui/material";

// visualization. will delete later
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function About() {
  return (
    <Box bgcolor="primary.white">
      <Box sx={{ flexGrow: 1, margin: 3, marginLeft: 10, marginRight: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" color="" sx={{ marginTop: 3 }}>
              About
            </Typography>
            <Typography variant="h6" color="" sx={{}}>
              Electrical Vehicle Infrastructure Tool (EVIT) is an open-source
              web-based tool web-based tool for planning optimal electric
              vehicle charging stations for both fleet and personally owned
              vehicles in the context of transportation electrification. It
              provides the ability to estimate the requirements for charging
              infrastructure and the related electrical demands.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" color="" sx={{}}>
              Thanks and Credits
            </Typography>
            <Typography variant="h6" color="" sx={{}}>
              Developers:
            </Typography>
            <ul>
              <Typography variant="h6" color="">
                - Michael Leong
              </Typography>
              <Typography variant="h6" color="">
                - Vidhu Birru
              </Typography>
              <Typography variant="h6" color="" sx={{}}>
                - Katherine Shen
              </Typography>
            </ul>
            <Typography variant="h6" color="" sx={{}}>
              And thank you to mentors Rongxin Yin and Michael Leong for leading
              this project in the 2024 Experiences in Research program.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" color="" sx={{}}>
              Source Code
            </Typography>
            <Typography variant="h6" color="" sx={{}}>
              The source code for EVIT can be found on{" "}
              <a
                style={{ color: "#2196f3" }} // Inline styling
                href="https://github.com/rongxinyin/ev-infrastructure-tool"
              >
                GitHub
              </a>
              .
            </Typography>

            <Typography variant="h6" color="" sx={{}}>
              Paper citation: TBD.{" "}
              <a
                href="https://doi.org/10.1016/j.buildenv.2023.110663"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2196f3" }} // Inline styling
              >
                To be submitted to Journal of SoftwareX
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
