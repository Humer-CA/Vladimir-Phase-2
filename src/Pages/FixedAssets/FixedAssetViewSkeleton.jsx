import React, { useEffect, useState } from "react";
import "../../Style/Fixed Asset/assetViewing.scss";
import { Box, Button, Card, IconButton, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import { ArrowBackIosRounded } from "@mui/icons-material";

const FixedAssetViewSkeleton = () => {
  const isSmallScreen = useMediaQuery("(max-width: 1100px)");

  return (
    <>
      <Box className="tableCard">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            width: "maxContent",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Skeleton variant="circular" width={40} height={40} sx={{ mt: "5px" }} />

            <Box sx={{ mt: "-10px" }}>
              <Skeleton variant="text" width={180} height={40} sx={{ ml: "10px" }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  mt: "-10px",
                  pb: "5px",
                }}
              >
                <Skeleton variant="text" width={120} height={35} sx={{ ml: "10px", mr: "10px" }} />

                <Skeleton variant="text" width={90} height={35} sx={{ ml: "10px" }} />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              pl: "10px",
              pb: "10px",
              display: "flex",
              justifyContent: "center",
              alignSelf: "flex-end",
            }}
          >
            <Skeleton variant="rounded" width={140} height={43} sx={{ ml: "10px" }} />

            <Skeleton variant="rounded" width={80} height={43} sx={{ ml: "10px" }} />

            <Skeleton variant="circular" width={40} height={40} sx={{ ml: "10px" }} />
          </Box>
        </Box>

        <Box className="tableCard__container">
          <Box>
            <Skeleton variant="rounded" width={isSmallScreen ? "100%" : 400} height={180} />

            <Skeleton variant="rounded" width={isSmallScreen ? "100%" : 400} height={130} sx={{ my: "10px" }} />

            <Skeleton variant="rounded" width={isSmallScreen ? "100%" : 400} height={170} sx={{ mb: "10px" }} />
          </Box>

          <Box className="tableCard__wrapper">
            <Skeleton variant="rounded" width={"100%"} height={212} sx={{ mb: "10px" }} />
            <Skeleton variant="rounded" width={"100%"} height={277} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FixedAssetViewSkeleton;
