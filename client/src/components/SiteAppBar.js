import PropTypes from "prop-types";
import * as React from "react";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "./images/5_BL_Horiz_Tile_rgb.svg";

const drawerWidth = 240;
const navItems = ["Home", "FAQ", "About"];

export default function SiteAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Electrical Vehicle Infrastructure Tool
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        position="fixed"
        color="white"
        sx={{ height: 95 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
            {/* <MenuIcon /> */}
          </IconButton>
          <Logo
            onClick={() => navigate("/")}
            style={{ width: 290, height: 95, cursor: "pointer" }}
          ></Logo>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" }, marginLeft: 2 }}
          >
            Electrical Vehicle Charging Infrastructure Planning Tool (EV-CIPT)
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "primary" }} onClick={() => navigate(`/`)}>
              Home
            </Button>
            <Button sx={{ color: "primary" }} onClick={() => navigate(`/faq`)}>
              FAQ
            </Button>
            <Button
              sx={{ color: "primary" }}
              onClick={() => navigate(`/about`)}
            >
              About
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {props.children}
      </Box>
      <Box component="footer" sx={{ p: 2, backgroundColor: "#f1f1f1", textAlign: "left", mt: 'auto' }}>
        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
          Paper Citations:
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
          TBD. {"DFAT: A Web-Based Toolkit for Estimating Demand Flexibility in Building-to-Grid Integration. "}
          <a
            href="https://doi.org/10.1016/j.buildenv.2023.110663"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2196f3" }}
          >
            submitted to Journal of SoftwareX.
          </a>
        </Typography>
      </Box>
    </Box>
  );
}

SiteAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
  children: PropTypes.node
};
