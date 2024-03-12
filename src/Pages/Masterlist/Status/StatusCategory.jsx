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

      <Stack sx={{ height: "100dvh" || "100vh" }}>
        <Select
          size="small"
          value={value}
          onChange={handleChange}
          sx={{
            minWidth: "230px",
            width: "30%",
            borderRadius: "10px",
            backgroundColor: "white",
            border: "1px solid #c7c7c70e",
            my: "5px",
            fontWeight: "bold",
            color: "secondary.main",
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
