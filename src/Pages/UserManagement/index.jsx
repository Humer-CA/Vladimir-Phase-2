import React from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import { AccountBox, ArrowForward, ManageAccountsSharp } from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";

const UserManagementList = [
  {
    icon: <AccountBox />,
    label: "User Accounts",
    description: "Adding of user using based on the Sedar System API",
    path: "/user-management/user-accounts",
  },

  {
    icon: <ManageAccountsSharp />,
    label: "Role Management",
    description: "Use for adding of role/permissions per user",
    path: "/user-management/role-management",
  },
];

const UserManagement = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  return (
    <>
      {location.pathname === "/user-management" ? (
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
            User Management
          </Typography>
          <Box className="parentSidebar">
            <Box className="parentSidebar__container">
              <Box className="parentSidebar__wrapper">
                {UserManagementList?.map((data, index) => {
                  return <Cards data={data} key={index} />;
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

export default UserManagement;
