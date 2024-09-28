import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/index.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/index.js";
import { format } from "date-fns";
import { SaveAlt, Image } from "@mui/icons-material";
import * as htmlToImage from "html-to-image";

const SmartCharging = () => {
  const [L2, setL2] = useState("");
  const [L3, setL3] = useState("");
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [aggregatedChargingRate, setAggregatedChargingRate] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const chartRef = useRef(null);

  const handleRunScript = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/run-smart-charging"
      );
      console.log("Response from backend:", response.data);
      const result = response.data;
      setL2(result.optimal_L2);
      setL3(result.optimal_L3);
      setStatistics(result.statistics);
      setAggregatedChargingRate(result.aggregated_charging_rate);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csvData = aggregatedChargingRate.map((row) => ({
      time: row.time,
      charging_rate: row.charging_rate,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "time,charging_rate",
        ...csvData.map((row) => `${row.time},${row.charging_rate}`),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "aggregated_charging_rate.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportImage = (format) => {
    if (chartRef.current) {
      const node = chartRef.current;
      const exportFunction =
        format === "png" ? htmlToImage.toPng : htmlToImage.toSvg;

      exportFunction(node)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `line_chart.${format}`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Error exporting image:", error);
        });
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredData = aggregatedChargingRate.filter((row) => {
    const rowTime = new Date(row.time);
    return (
      (!startTime || rowTime >= startTime) && (!endTime || rowTime <= endTime)
    );
  });

  return (
    <Grid container spacing={1} style={{ marginTop: 0, marginLeft: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h4">Smart Charging</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRunScript}
          disabled={loading}
          sx={{ marginTop: 1, marginBottom: 2 }}
        >
          {loading ? "Loading..." : "Query Optimal Stations"}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Optimal L2"
          value={L2}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Optimal L3"
          value={L3}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Charging Load Metrics</Typography>
        <Grid container spacing={1} style={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Consumed Electricity (kWh)"
              value={statistics.consumed_electricity || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Peak Demand (kW)"
              value={statistics.peak_demand || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Average Load"
              value={statistics.average_load || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Load Factor"
              value={statistics.load_factor || ""}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Aggregated Charging Rate</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Box>
            <IconButton onClick={handleExportCSV} color="primary">
              <SaveAlt />
            </IconButton>
            <IconButton onClick={handleMenuOpen} color="primary">
              <Image />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleExportImage("png");
                  handleMenuClose();
                }}
              >
                Export as PNG
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleExportImage("svg");
                  handleMenuClose();
                }}
              >
                Export as SVG
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={(tick) =>
                  format(new Date(tick), "yyyy-MM-dd HH:mm:ss")
                }
              >
                <Label value="Date/time" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label
                  value="Power (kW)"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip
                labelFormatter={(label) =>
                  format(new Date(label), "yyyy-MM-dd HH:mm:ss")
                }
              />
              <Legend verticalAlign="top" align="right" />
              <Line type="monotone" dataKey="charging_rate" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Grid>
    </Grid>
  );
};

export default SmartCharging;
