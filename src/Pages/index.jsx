import React from "react";
import "../Style/dashboard.scss";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { DashboardAnimate } from "../Components/LottieFiles/LottieComponents";
import {
  AttachMoney,
  BarChartOutlined,
  DataUsage,
  DeliveryDining,
  GridOffSharp,
  Group,
  Money,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const dashboardItems = [
  {
    title: "Process",
    icon: <DataUsage />,
    data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    color: "skyblue",
  },
  {
    title: "Accountable",
    icon: <Group />,
    data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    color: "lightGreen",
  },
  {
    title: "Depreciation",
    icon: <Money />,
    data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    color: "lightPink",
  },
  {
    title: "Delivered Items",
    icon: <DeliveryDining />,
    data: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    color: "lightYellow",
  },
];

const Dashboard = () => {
  const isSmallScreen = useMediaQuery("(max-width: 1400px)");
  const isMobileScreen = useMediaQuery("(max-width: 800px)");
  const userDetails = useSelector((state) => state.userLogin);

  const CardDashboard = ({ title, icon, data, color }) => (
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white",
        borderRadius: "10px",
        width: "fitContent",
        boxShadow: "10px 10px 20px #dfdfdf,-10px -15px 40px #ffffff",
        p: "20px",
        gap: 2,
        overflow: "auto",
        maxWidth: isMobileScreen ? "90%" : "300px",
      }}
    >
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${color}`,
          p: "10px",
          borderRadius: "100%",
        }}
      >
        {icon}
      </Stack>

      <Box width="250px" flexWrap="wrap">
        <Typography fontWeight={600}>{title}</Typography>
        <Typography fontSize=".7rem" color="gray">
          {data}
        </Typography>
      </Box>
    </Stack>
  );

  const GraphDashboard = ({ title, icon, data, color }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        px: "20px",
        flexDirection: "row",
      }}
    >
      <Stack
        gap={1}
        sx={{
          p: "20px",
          height: "200px",
          width: isMobileScreen ? "90%" : "60%",
          maxWidth: "900px",
          borderRadius: "10px",
          boxShadow: "10px 10px 20px #dfdfdf,-10px -15px 40px #ffffff",
        }}
      >
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <BarChartOutlined />
          <Typography fontWeight={600}>Added Asset</Typography>
        </Stack>

        <BarChart
          // width={600}
          // height={140}
          series={[
            { data: [35, 44, 24, 34], color: "#ffaf38" },
            { data: [51, 6, 49, 30], color: "#566d7a" },
            { data: [15, 25, 30, 50], color: "#ff9900" },
            { data: [60, 50, 15, 25], color: "#9c958b" },
          ]}
          xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
          margin={{ top: 30, bottom: 30, left: 40, right: 10 }}
        />
      </Stack>

      {/* PieChart */}
      <Stack
        alignItems="center"
        sx={{
          height: "200px",
          width: isMobileScreen ? "90%" : "30%",
          maxWidth: isMobileScreen ? "90%" : "350px",
          p: "20px",
          boxShadow: "10px 10px 20px #dfdfdf,-10px -15px 40px #ffffff",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignSelf: "flex-start" }}>
          <AttachMoney />
          <Typography fontWeight={600} overflow="hidden">
            Depreciation
          </Typography>
        </Box>

        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "series A", color: "#ffaf38" },
                { id: 1, value: 15, label: "series B", color: "#566d7a" },
                { id: 2, value: 20, label: "series C", color: "#ff9900" },
              ],
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          slotProps={{
            legend: isSmallScreen
              ? { hidden: true }
              : {
                  direction: "column",
                },
          }}
          margin={isSmallScreen ? { top: 1, bottom: 1, left: 1, right: 1 } : null}
        />
      </Stack>

      {/* Reports */}
      <Stack
        backgroundColor="#ff9900"
        sx={{
          height: "200px",
          width: isMobileScreen ? "90%" : "30%",
          maxWidth: isMobileScreen ? "90%" : "350px",
          p: "20px",
          borderRadius: "10px",
          boxShadow: "10px 10px 20px #dfdfdf,-10px -15px 40px #ffffff",
        }}
      >
        <Typography fontWeight={600} color="white">
          Reports
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Box className="mcontainer">
      <Typography
        className="dashboard__title"
        sx={{
          fontFamily: "Anton, Impact, Poppins, Roboto",
          fontSize: "2rem",
        }}
      >
        Dashboard
      </Typography>

      <Box className="dashboard__main-content">
        <Box className="dashboard__header" sx={{ mt: "20px", gap: "30px" }}>
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
                color: "#ff9900",
                fontSize: "2rem",
              }}
            >
              {userDetails?.user.username.toUpperCase()}!
            </Typography>
          </Box>

          {/* Ramen */}
          <Box
            sx={{
              bgcolor: "#f5f5f5cb",
              borderRadius: "100%",
              width: isMobileScreen ? "120px" : "180px",
              height: isMobileScreen ? "120px" : "180px",
              position: "relative",
              display: isMobileScreen > "400px" ? "none" : "flex",
            }}
          >
            <Box
              sx={{
                top: "8%",
                left: "-8%",
                bgcolor: "#f7c708ea",
                borderRadius: "100%",
                width: isMobileScreen ? "70px" : "100px",
                height: isMobileScreen ? "70px" : "100px",
                position: "absolute",
              }}
            />
            <DashboardAnimate />
          </Box>
        </Box>

        <Stack className="container" gap={4}>
          <Box
            className="Cards"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              // flexGrow: 1,
              flexDirection: "row",
              gap: isSmallScreen ? 2 : 4,
              p: "20px",
              overflow: "auto",
            }}
          >
            {dashboardItems.map((items, index) => (
              <CardDashboard key={index} title={items.title} icon={items.icon} data={items.data} color={items.color} />
            ))}
          </Box>

          <Stack>
            <GraphDashboard />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
export default Dashboard;
