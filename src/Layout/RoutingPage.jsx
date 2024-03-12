import { Box, useMediaQuery } from "@mui/material";
import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import "../Style/homePage.scss";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  return (
    <>
      <Box className="homepage">
        <Box className="homepage__sidebar">
          <Sidebar />
        </Box>

        <Box className="homepage__content">
          <Navbar />
          <Box className="homepage__body">
            <Outlet />
          </Box>
          {isSmallScreen ? null : <Footer />}
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
