import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import * as htmlToImage from "html-to-image";
import { useDropzone } from "react-dropzone";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge/index.js";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Flex = () => {
  const [file, setFile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const chartRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  const handleProcessData = async () => {
    if (!file) {
      alert("Please upload a CSV file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("csv", file);
    formData.append("timezone", timezone);

    console.log("File to be uploaded:", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/run-flex-e",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from backend:", response.data);
      const result = response.data;
      setMetrics(result);
      console.log("Metrics set:", result);
    } catch (error) {
      console.error("Error processing data:", error);
    } finally {
      setLoading(false);
    }
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

  const histogramData = metrics
    ? {
        labels: metrics.sessions.map((_, index) => `Session ${index + 1}`),
        datasets: [
          {
            label: "Load Flexibility",
            data: metrics.sessions.map((session) => session.load_flexibility),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      }
    : null;

  return (
    <Grid container spacing={1} style={{ marginTop: 0, marginLeft: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Charging Session Data
          <IconButton
            onClick={handleProcessData}
            color="secondary"
            disabled={loading}
          >
            <SaveAlt />
          </IconButton>
        </Typography>
        <div
          {...getRootProps()}
          style={{
            textAlign: "center",
            padding: 10,
            backgroundColor: "#f5f5f5",
            border: "2px dashed #c3c3c3",
          }}
        >
          <input {...getInputProps()} />
          <p>
            Optional: Upload generated, unprocessed data for post-processing
          </p>
          {file && (
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              Uploaded file: {file.name}
            </Typography>
          )}
        </div>
        <Grid item xs={6}>
          <TextField
            label="Data Source"
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            fullWidth
            sx={{ marginTop: 2 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            fullWidth
            sx={{ marginTop: 2 }}
          >
            <MenuItem value="UTC">UTC</MenuItem>
            <MenuItem value="America/New_York">America/New_York</MenuItem>
            <MenuItem value="America/Los_Angeles">America/Los_Angeles</MenuItem>
            {/* Add more timezones as needed */}
          </TextField>
        </Grid>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleProcessData}
          disabled={loading}
          sx={{ marginTop: 1, marginBottom: 2 }}
        >
          {loading ? "Processing..." : "Process Data"}
        </Button>
      </Grid>
      {metrics && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">Metrics</Typography>
            <Grid container spacing={1} style={{ marginTop: 2 }}>
              <Grid item xs={6}>
                <TextField
                  label="Total Sessions"
                  value={metrics.total_sessions.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Energy Used (kWh)"
                  value={metrics.total_energy_used.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Average Energy per Session (kWh)"
                  value={metrics.average_energy_per_session.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Charge Duration (hours)"
                  value={metrics.total_charge_duration.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Average Charge Duration (hours)"
                  value={metrics.average_charge_duration.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total SOC Change"
                  value={metrics.total_soc_change.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Average SOC Change"
                  value={metrics.average_soc_change.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Average Power (kW)"
                  value={metrics.average_power.toFixed(1) || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginTop: 3 }}>
              Average Load Flexibility
            </Typography>
            <Gauge
              value={metrics.average_load_flexibility.toFixed(2) * 100 || 0}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 12,
                },
                width: 200, // Define width
                height: 200, // Define height
              }}
              text={({ value, valueMax }) => `${value} / ${valueMax}`}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginTop: 3 }}>
              Load Flexibility Distribution
            </Typography>
            {histogramData && (
              <Bar
                data={histogramData}
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Sessions",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Load Flexibility",
                      },
                    },
                  },
                }}
              />
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Flex;
