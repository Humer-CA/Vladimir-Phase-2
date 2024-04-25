import React from "react";
import "../Style/pageNotFound.scss";
import { Box, Button, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Box className="pageNotFound">
      <Box className="pageNotFound__container">
        <Box className="pageNotFound__background" />
        <Box className="pageNotFound__content">
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Anton",
              color: "white",
              fontSize: "120px",
              mb: "5px",
            }}
          >
            404
          </Typography>
          <Typography variant="h3" sx={{ mt: "10px", fontFamily: "Anton" }}>
            Page Not Found
          </Typography>
          {/* <NavLink to="/" style={{ textDecoration: "none" }}> */}
          <Button
            variant="contained"
            onClick={() => navigate(-1, { replace: false })}
            sx={{ mt: "20px", fontWeight: "bold" }}
          >
            Go Back
          </Button>
          {/* </NavLink> */}
        </Box>
      </Box>
    </Box>
  );
};

export default PageNotFound;
