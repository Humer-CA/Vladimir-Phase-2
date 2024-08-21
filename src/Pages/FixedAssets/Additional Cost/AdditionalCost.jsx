import React, { useEffect, useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Badge, Box, Tab, Tabs, Typography } from "@mui/material";

import { useGetNotificationApiQuery } from "../../../Redux/Query/Notification";
import { useLocation } from "react-router-dom";

const AdditionalCost = () => {
  const [value, setValue] = useState("1");
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}>
        Received Asset
      </Typography>

      <Box>
        <TabContext value={value}>
          <Tabs onChange={handleChange} value={value}>
            <Tab label="GENUS ETD" value="1" className={value === "1" ? "tab__background" : null} />
            <Tab label="ELIXIR ETD" value="2" className={value === "2" ? "tab__background" : null} />
            <Tab label="YMIR" value="2" className={value === "3" ? "tab__background" : null} />
          </Tabs>

          <TabPanel sx={{ p: 0 }} value="1" index="1">
            <ReceivingTable />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="2" index="2">
            <ReceivingTable />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default AdditionalCost;
