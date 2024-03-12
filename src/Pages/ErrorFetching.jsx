import React from "react";
import "../Style/errorFetching.scss";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUserDetails } from "../Redux/StateManagement/userLogin";

const ErrorFetching = (props) => {
  const { refetch, category, error } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery("(max-width: 510px)");

  const handleClick = () => {
    if (error.status === 401) {
      localStorage.removeItem("token");
      dispatch(removeUserDetails());
      navigate("/login");
    }

    refetch();
  };

  return (
    <Box className="errorFetching" sx={category ? null : null}>
      <Box className="errorFetching__wrapper">
        <Typography
          variant="h4"
          color="secondary"
          fontSize="2em"
          className="errorFetching__typo"
          sx={{
            fontWeight: "bold",
            mt: "25%",
            fontFamily: "Anton",
            fontSize: isSmallScreen ? "1.2rem" : "1.4rem",
            mx: isSmallScreen ? "20px" : 0,
          }}
        >
          {error.status === 401 ? "Session Expired, Please Login" : "Something went wrong!"}
        </Typography>

        <Button variant="contained" onClick={handleClick} sx={{ fontWeight: "bold", mt: "10px" }}>
          {error.status === 401 ? "Login" : "Try again!"}
        </Button>
      </Box>

      <Box className="errorFetching__svgBg" />
    </Box>
  );
};

export default ErrorFetching;
