import React, { useEffect, useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Badge, Box, Button, Dialog, Drawer, Stack, Tab, Tabs, Typography } from "@mui/material";

import { useGetNotificationApiQuery } from "../../../Redux/Query/Notification";
import { useLocation } from "react-router-dom";
import ReceivingTable from "../../Asset Requisition/Received Asset/ReceivedAssetTable";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import { Add, AddBox } from "@mui/icons-material";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch, useSelector } from "react-redux";
import AddCost from "../AddEdit/AddCost";
import Elixir from "./Elixir";

const AdditionalCost = () => {
  const [value, setValue] = useState("1");
  const location = useLocation();

  const dispatch = useDispatch();

  const dialog = useSelector((state) => state.booleanState.dialog);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenAddCost = () => {
    dispatch(openDialog());
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}>
        Additional Cost
      </Typography>

      <Box>
        <TabContext value={value}>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Tabs onChange={handleChange} value={value}>
              <Tab label="GENUS ETD" value="1" className={value === "1" ? "tab__background" : null} />
              <Tab label="ELIXIR ETD" value="2" className={value === "2" ? "tab__background" : null} />
              <Tab label="YMIR" value="3" className={value === "3" ? "tab__background" : null} />
            </Tabs>
            <Button variant="contained" size="small" startIcon={<AddBox />} onClick={handleOpenAddCost}>
              Add
            </Button>
          </Stack>

          <TabPanel sx={{ p: 0 }} value="1" index="1">
            <ReceivingTable />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="2" index="2">
            <Elixir />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="3" index="3">
            <ReceivingTable />
          </TabPanel>
        </TabContext>
      </Box>

      <Drawer anchor="right" open={dialog} onClose={() => dispatch(closeDialog())}>
        <AddCost />
      </Drawer>
    </Box>
  );
};

export default AdditionalCost;
