import { ThemeProvider, createTheme } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import About from "./pages/About.js";
import FAQ from "./pages/FAQ.js";
import Home from "./pages/Home.js";
import NotFound from "./pages/NotFound.js";
import SiteAppBar from "./components/SiteAppBar.js";
import Operation from "./pages/Operation.js";
import Planning from "./pages/Planning.js";

const theme = createTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    button: {
      textTransform: "none",
      fontSize: "medium",
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
      main: "#b1b3b3", // light gray
    },
  },
  mode: "dark",
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <SiteAppBar>
          <Suspense>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/operation" element={<Operation />} />
              <Route path="/planning" element={<Planning />} />
            </Routes>
          </Suspense>
        </SiteAppBar>
      </BrowserRouter>
    </ThemeProvider>
  );
}
