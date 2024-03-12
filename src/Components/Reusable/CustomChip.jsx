import { Chip } from "@mui/material";
import React from "react";

const CustomChip = (props) => {
  const { status } = props;
  return (
    <Chip
      size="small"
      variant="contained"
      sx={
        status === "active"
          ? {
              background: "#27ff811f",
              color: "active.dark",
              fontSize: "0.7rem",
              px: 1,
            }
          : {
              background: "#fc3e3e34",
              color: "error.light",
              fontSize: "0.7rem",
              px: 1,
            }
      }
      label={status === "active" ? "ACTIVE" : "INACTIVE"}
    />
  );
};

export default CustomChip;
