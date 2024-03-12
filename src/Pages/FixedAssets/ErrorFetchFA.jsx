import React from "react";
import "../../Style/Fixed Asset/errorFetchFA.scss";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorFetchFA = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 650px)");

  return (
    <>
      <Box className="errorFetchFA">
        <Box className="errorFetchFA__logo">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: "10px",
              // pr: "40px",
            }}
          >
            <Typography
              variant={isSmallScreen ? "h2" : "h1"}
              sx={{
                fontWeight: "bold",
                fontFamily: "Anton",
              }}
              color="primary.main"
            >
              404
            </Typography>

            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              sx={{
                fontWeight: "bold",
                fontFamily: "Anton",
                textAlign: "center",
                textShadow: "1px 1px 1px black",
                // border: "1px solid ",
                // padding: "10px",
              }}
              color="background.light"
            >
              Fixed Asset Not Found!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/fixed-assets")}
              color="black"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ErrorFetchFA;
