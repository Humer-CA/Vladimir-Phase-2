import React from "react";
import { Box, Chip } from "@mui/material";
import {
  BuildCircle,
  CheckCircleRounded,
  DeleteForever,
  EditOff,
  FileCopy,
  FolderDelete,
  RadioButtonUncheckedRounded,
  Sell,
} from "@mui/icons-material";

const faStatusComponent = ({ faStatus, data }) => {
  if (faStatus === "Good") {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<CheckCircleRounded size="small" color="#00ba34" />}
        label="Good"
        sx={{
          backgroundColor: "#e6f8eb",
          color: "#00ba34",

          p: "0 5px",
        }}
      />
    );
  } else if (faStatus === "For Repair") {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<BuildCircle size="small" color="#0288d1" />}
        label="For Repair"
        sx={{
          backgroundColor: "#61c3f831",
          color: "#0288d1",

          p: "0 5px",
        }}
      />
    );
  } else if (faStatus === "For Disposal") {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<FolderDelete size="small" color="#d13202" />}
        label="For Disposal"
        sx={{
          backgroundColor: "#fd8e6c3a",
          color: "#d13202",

          p: "0 5px",
        }}
      />
    );
  } else if (faStatus === "Spare") {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<FileCopy size="small" color="#5102d1" />}
        label="Spare"
        sx={{
          backgroundColor: "#b88ffa41",
          color: "#5102d1",

          p: "0 5px",
        }}
      />
    );
  } else if (faStatus === "Write Off") {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<EditOff size="small" color="#109790" />}
        label="Write Off"
        sx={{
          backgroundColor: "#7bfff838",
          color: "#109790",

          p: "0 5px",
        }}
      />
    );
  } else if (faStatus === "Sold") {
    return (
      <Chip
        size="small"
        variant="outlined"
        icon={<Sell size="small" color="#00ba34" />}
        label="Sold"
        sx={{
          borderColor: "#00ba34",
          color: "#00ba34",
          p: "0 5px",
        }}
      />
    );
  } else if (faStatus === "Disposed") {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<DeleteForever size="small" color="#a32424" />}
        label="Disposed"
        sx={{
          backgroundColor: "#ff979749",
          color: "#a32424",

          p: "0 5px",
        }}
      />
    );
  } else {
    return (
      <Chip
        size="small"
        variant="contained"
        icon={<RadioButtonUncheckedRounded size="small" />}
        label={data}
        sx={{
          backgroundColor: "#c7c7c742",

          p: "0 5px",
        }}
      />
    );
  }
  // console.log(faStatus);
};

export default faStatusComponent;
