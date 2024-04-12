import React, { useState } from "react";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import AssignedApprover from "./UnitApprovers";
import AssetTransfer from "./AssetTransfer";
import AssetPullout from "./AssetPullout";
import AssetDisposal from "./AssetDisposal";

const FaStatusCategory = () => {
  const [value, setValue] = useState("option1");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const views = {
    option1: <AssignedApprover />,
    option2: <AssetTransfer />,
    option3: <AssetPullout />,
    option4: <AssetDisposal />,
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton, Roboto, Helvetica", fontSize: "1.6rem" }}>
        Form Settings
      </Typography>

      <Stack sx={{ height: "100vh" }}>
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
          <MenuItem value="option1">Unit Approvers</MenuItem>
          <MenuItem value="option2">Asset Transfer</MenuItem>
          <MenuItem value="option3">Asset Pullout</MenuItem>
          <MenuItem value="option4">Asset Disposal</MenuItem>
        </Select>
        {views[value]}
      </Stack>
    </Box>
  );
};

export default FaStatusCategory;
