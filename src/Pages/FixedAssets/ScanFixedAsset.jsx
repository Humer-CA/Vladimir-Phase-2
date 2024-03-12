import React, { useState } from "react";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

import { useDispatch } from "react-redux";

import { closeScan } from "../../Redux/StateManagement/booleanStateSlice";

const ScanFixedAsset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(closeScan());
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="secondary" sx={{ fontFamily: "Anton" }}>
            Scan Asset
          </Typography>

          <Typography variant="p" color="secondary.light" sx={{ fontFamily: "Anton", textAlign: "center" }}>
            Please Scan the Vladimir Asset Tag
          </Typography>
        </Box>

        <Box
          sx={{
            "& video": {
              border: "2px solid lightGray",
              borderRadius: "10px",
              overflow: "hidden",
            },
          }}
        >
          {/* <BarcodeScannerComponent
            minwidth={200}
            maxWidth={400}
            onUpdate={(err, result) => {
              if (result)
                navigate(`/fixed-assets/asset`, {
                  state: { vladimir_tag_number: result.text },
                });
              // else setData("Not Found");
            }}
          /> */}
        </Box>

        <Button
          sx={{ alignSelf: "center" }}
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleClose}
          fullWidth
        >
          Close
        </Button>
      </Box>
    </>
  );
};

export default ScanFixedAsset;
