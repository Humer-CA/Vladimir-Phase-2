import React from "react";
import Lottie from "lottie-react";
import LoadingAnimation from "../../assets/Lottie/LoadingAnimation";
import ImportLoading from "../../assets/Lottie/ImportLoading";
import ImportLoadingCircle from "../../assets/Lottie/ImportLoadingCircle";
import { Box, TableCell, TableRow, Typography } from "@mui/material";

export const ImportingData = ({ text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "250px",
        ml: "5px",
        // width: "350px",
        position: "absolute",
        overflow: "hidden",
      }}
    >
      <Lottie animationData={ImportLoading} style={{ padding: 0, margin: 0, marginTop: "-40px" }} />
      {text && (
        <Typography fontSize="2rem" color="white" mt={2}>
          {text ? text : ""}
        </Typography>
      )}
    </Box>
  );
};

export const LoadingData = ({ category }) => {
  return (
    <>
      <TableRow>
        <TableCell
          colSpan={999}
          rowSpan={999}
          sx={{
            borderBottom: "none",
            height: "calc(100vh - 360px)",
          }}
        >
          <Box className="tblLoading" sx={category ? { marginTop: "-20px!important" } : null}>
            <Lottie animationData={LoadingAnimation} style={category ? { marginTop: "-20px!important" } : null} />
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};
