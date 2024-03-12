import React from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  HowToReg,
  ManageAccountsSharp,
  PlaylistRemoveRounded,
  RemoveFromQueue,
  RequestQuote,
  RuleFolder,
  SettingsApplications,
  ShoppingBag,
  TransferWithinAStation,
} from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";

const RequestList = [
  {
    icon: <TransferWithinAStation />,
    label: "Transfer",
    description: "Requesting for Asset Transfer",
    path: "/asset-movement/transfer",
  },

  {
    icon: <RemoveFromQueue />,
    label: "Pull-Out",
    description: "Requesting for Asset Pull-Out",
    path: "/asset-movement/pull-out",
  },

  {
    icon: <RuleFolder />,
    label: "Evaluation",
    description: "Requesting for Asset Evaluation",
    path: "/asset-movement/evaluation",
  },

  {
    icon: <PlaylistRemoveRounded />,
    label: "Disposal",
    description: "List of For Disposal Items",
    path: "/asset-movement/disposal",
  },
];

const AssetMovement = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  return (
    <>
      {location.pathname === "/asset-movement" ? (
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
            Asset Movement
          </Typography>
          <Box className="parentSidebar">
            <Box className="parentSidebar__container">
              <Box className="parentSidebar__wrapper">
                {RequestList?.map((data, index) => {
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

export default AssetMovement;
