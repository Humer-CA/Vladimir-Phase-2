import React from "react";
import "../Style/dashboard.scss";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import dashboard from "../Img/dashboard.svg";
import Cards from "../Components/Reusable/Cards";

const Dashboard = (props) => {
  const { title, icon, content } = props;
  const userDetails = useSelector((state) => state.userLogin);
  return (
    <Box className="mcontainer">
      <Typography
        className="dashboard__title"
        sx={{ fontFamily: "Anton, Impact, Poppins, Roboto", fontSize: "2rem" }}
      >
        Dashboard
      </Typography>

      <Box className="dashboard">
        <Box className="dashboard__container">
          <Box className="dashboard__main-content">
            <Box className="dashboard__header">
              <Box>
                <Typography
                  sx={{
                    color: "secondary.main",
                    fontFamily: "Raleway, Helvetica",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  Welcome back
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Anton, Impact, Poppins, Roboto",
                    color: "primary.main",
                    fontSize: "2rem",
                  }}
                >
                  {userDetails?.user.username.toUpperCase()}!
                </Typography>
              </Box>

              <img className="dashboard__header-image" src={dashboard} />
            </Box>

            <Box className="dashboard__charts">
              <Box
                className="dashboard__charts-item"
                sx={{ width: "calc(70vw - 120px)" }}
              ></Box>
              {/* <Cards title="Assets" icon={icon} content={content} /> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
