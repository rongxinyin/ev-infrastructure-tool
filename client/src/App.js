import { ThemeProvider, createTheme } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import About from "./components/About.js";
import FAQ from "./components/FAQ.js";
import Simulation from "./components/Simulation.js";
import Results from "./components/Results.js";
import Home from "./components/Home.js";
import NotFound from "./components/NotFound.js";
import AppBar from "./components/SiteAppBar.js";
import BuildingInfo from "./components/BuildingInfo.js";
import EmployeeInfo from "./components/EmployeeInfo.js";

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: "#00303C", // dark teal
    },
    secondary: {
      main: "#007681", // teal
    },
    tertiary: {
      main: "#BED7DD", // light blue
    },
    white: {
      main: "#FFFFFF", // white
    },
    lightgray: {
      main: "#b1b3b3" // light gray
    },
  },
  typography: {
    primary: {
      main: "#00303C", // dark teal
    },
    secondary: {
      main: "#007681", // teal
    },
    tertiary: {
      main: "#BED7DD", // light blue
    },
  },
  mode: "dark",
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar />
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<NotFound />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/results" element={<Results />} />
            <Route path="/buildinginfo" element={<BuildingInfo />} />
            <Route path="/employeeinfo" element={<EmployeeInfo />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
