import React from "react";
import { Outlet } from "react-router";

import "../../Style/parentSidebar.scss";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  AccountBox,
  Apartment,
  BackupTableRounded,
  Groups2Rounded,
  LocationOn,
  ManageAccountsSharp,
  Schema,
  Badge,
  MonetizationOn,
  FactCheck,
  Segment,
  Ballot,
  BusinessCenter,
} from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";

const MasterlistList = [
  {
    icon: <Apartment />,
    label: "Company",
    description: "Synching of Company Masterlist from Fisto to Vladimir",
    path: "/masterlist/company",
  },

  {
    icon: <BusinessCenter />,
    label: "Business Unit",
    description: "Synching of Business Unit Masterlist from Ymir to Vladimir",
    path: "/masterlist/business-unit",
  },

  {
    icon: <Schema />,
    label: "Department",
    description: "Synching of Department Masterlist from Fisto to Vladimir",
    path: "/masterlist/department",
  },

  {
    icon: <Ballot />,
    label: "Unit",
    description: "Synching of Unit Masterlist from Ymir to Vladimir",
    path: "/masterlist/unit",
  },

  {
    icon: <LocationOn />,
    label: "Location",
    description: "Synching of Location Masterlist from Fisto to Vladimir",
    path: "/masterlist/location",
  },

  {
    icon: <Badge />,
    label: "Account Title",
    description: "Synching of Account Title Masterlist from Fisto to Vladimir",
    path: "/masterlist/account-title",
  },

  {
    icon: <Segment />,
    label: "Sub Unit",
    description: "Adding, editing and archiving of Sub Unit masterlist",
    path: "/masterlist/sub-unit",
  },

  {
    icon: <Groups2Rounded />,
    label: "Division",
    description: "Adding, editing and archiving of Division masterlist",
    path: "/masterlist/division",
  },

  {
    icon: <BackupTableRounded />,
    label: "Type of Request",
    description: "Adding, editing and archiving of Type of Request masterlist",
    path: "/masterlist/type-of-request",
  },
  {
    icon: <MonetizationOn />,
    label: "Capex",
    description: "Adding, editing and archiving of Capex and Sub Capex masterlist",
    path: "/masterlist/capex",
  },

  {
    icon: <ManageAccountsSharp />,
    label: "Category",
    description: "Adding of Major and Minor Category masterlist",
    path: "/masterlist/category",
  },

  {
    icon: <FactCheck />,
    label: "Status Category",
    description: "Setting up of Fixed Asset status masterlist",
    path: "/masterlist/status-category",
  },
];

const Masterlist = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  return (
    <>
      {location.pathname === "/masterlist" ? (
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
            Masterlist
          </Typography>
          <Box className="parentSidebar">
            <Box className="parentSidebar__container">
              <Box className="parentSidebar__wrapper">
                {MasterlistList?.map((data, index) => {
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

export default Masterlist;
