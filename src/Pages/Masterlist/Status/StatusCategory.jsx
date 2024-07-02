import React, { useState } from "react";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import AssetStatus from "./AssetStatus";
import CycleCountStatus from "./CycleCountStatus";
import AssetMovementStatus from "./AssetMovementStatus";
import DepreciationStatus from "./DepreciationStatus";

const FaStatusCategory = () => {
  const [value, setValue] = useState("option1");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const views = {
    option1: <AssetStatus />,
    option2: <CycleCountStatus />,
    option3: <AssetMovementStatus />,
    option4: <DepreciationStatus />,
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton, Roboto, Helvetica", fontSize: "1.6rem" }}>
        Status Category
      </Typography>

      <Stack sx={{ height: "calc(100dvh - 22rem)" }}>
        <Select
          size="small"
          value={value}
          onChange={handleChange}
          color="primary"
          sx={{
            minWidth: "230px",
            width: "250px",
            borderRadius: "10px",
            backgroundColor: "white",
            // border: "1px solid primary.main",
            my: "5px",
            fontWeight: "bold",
            color: "secondary.light",
          }}
        >
          <MenuItem value="option1">Asset Status</MenuItem>
          <MenuItem value="option2">Cycle Count Status</MenuItem>
          <MenuItem value="option3">Asset Movement Status</MenuItem>
          <MenuItem value="option4">Depreciation Status</MenuItem>
        </Select>
        {views[value]}
      </Stack>
    </Box>
  );
};

export default FaStatusCategory;
