import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import InfoListComponent from "../components/InfoListComponent.js";

const data = [
  {
    question: "test question?",
    answer: "test answer",
  },
  // Add more questions and answers as needed
];

export default function FAQ() {
  return (
    <Box bgcolor={"primary.main"} p={2}>
      <Typography
        variant="h4"
        color="common.white"
        sx={{ marginTop: 5, marginBottom: 1 }}
      >
        Frequently Asked Questions
      </Typography>
      <InfoListComponent data={data} />
    </Box>
  );
}
