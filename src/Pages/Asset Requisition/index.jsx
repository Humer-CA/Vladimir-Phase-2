import React, { useEffect } from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import { AssignmentTurnedIn, OpenInBrowserOutlined, Output, ShoppingBasket, TableRows } from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";
import { useSelector } from "react-redux";
import { useGetNotificationApiQuery } from "../../Redux/Query/Notification";

const AssetRequisition = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);
  const { data: notifData, refetch } = useGetNotificationApiQuery(null, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    refetch();
  }, [notifData]);

  const RequestList = [
    {
      icon: <AssignmentTurnedIn />,
      label: "Requisition",
      description: "Requesting of Fixed Asset",
      path: "/asset-requisition/requisition",
      permission: "requisition",
    },

    {
      icon: <OpenInBrowserOutlined />,
      label: "Received Asset",
      description: "Input of additional info and Purchase Order Number",
      path: "/asset-requisition/requisition-received-asset",
      permission: "requisition-received-asset",
      notification: notifData?.toReceive,
    },

    {
      icon: <TableRows />,
      label: "RR Summary",
      description: "Viewing of Received Receipt List",
      path: "/asset-requisition/requisition-rr-summary",
      permission: "requisition-rr-summary",
      notification: notifData?.toPR,
    },

    {
      icon: <Output />,
      label: "Releasing of Asset",
      description: "Release the Asset to the End User",
      path: "/asset-requisition/requisition-releasing",
      permission: "requisition-releasing",
      notification: notifData?.toRelease,
    },
  ];

  const permissions = useSelector((state) => state.userLogin?.user.role.access_permission);

  return (
    <>
      {location.pathname === "/asset-requisition" ? (
        <>
          <Typography
            color="secondary"
            sx={{
              fontFamily: "Anton, Roboto, Impact, Helvetica",
              fontSize: "25px",
              alignSelf: isSmallScreen ? "center" : "flex-start",
              marginLeft: isSmallScreen ? null : "30px",
              marginBottom: isSmallScreen ? "30px" : null,
            }}
          >
            Asset Requisition
          </Typography>
          <Box className="parentSidebar">
            <Box className="parentSidebar__container">
              <Box className="parentSidebar__wrapper">
                {RequestList?.map((data, index) => {
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

export default AssetRequisition;
