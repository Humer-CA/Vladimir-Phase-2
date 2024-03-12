import React from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import { HowToReg, ManageAccountsSharp, SettingsApplications } from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";
import { useSelector } from "react-redux";

const SettingsList = [
  {
    icon: <HowToReg />,
    label: "Approver Settings",
    description: "Setting up of the Approvers",
    path: "/settings/approver-settings",
    permission: "approver-settings",
  },

  {
    icon: <SettingsApplications />,
    label: "Form Settings",
    description: "Setup Settings for Unit Approvers",
    path: "/settings/form-settings",
    permission: "form-settings",
  },
];

const Settings = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  const permissions = useSelector((state) => state.userLogin?.user.role.access_permission);

  return (
    <>
      {location.pathname === "/settings" ? (
        <>
          <Typography
            color="secondary"
            sx={{
              fontFamily: "Anton, Roboto, Impact, Helvetica",
              fontSize: "25px",
              alignSelf: isSmallScreen ? "center" : "flex-start",
              marginLeft: isSmallScreen ? null : "30px",
            }}
          >
            Settings
          </Typography>
          <Box className="parentSidebar">
            <Box className="parentSidebar__container">
              <Box className="parentSidebar__wrapper">
                {SettingsList?.map((data, index) => {
                  return permissions.split(", ").includes(data.permission) && <Cards data={data} key={index} />;
                })}
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
    // <Outlet />
  );
};

export default Settings;
