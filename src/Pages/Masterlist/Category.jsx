import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs, Typography } from "@mui/material";
// import CategoryList from "../Category/CategoryList";
import MajorCategory from "./Category/MajorCategory";
import MinorCategory from "./Category/MinorCategory";

const Category = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}
      >
        Category Management
      </Typography>

      <Box>
        <TabContext value={value}>
          <Tabs onChange={handleChange} value={value}>
            {/* <Tab
              label="Category List"
              value="0"
              className={value === "0" ? "tab__background" : null}
            /> */}

            <Tab
              label="Major Category"
              value="1"
              className={value === "1" ? "tab__background" : null}
            />

            <Tab
              label="Minor Category"
              value="2"
              className={value === "2" ? "tab__background" : null}
            />
          </Tabs>

          {/* <TabPanel sx={{ p: 0 }} value="0" index="0">
            <CategoryList />
          </TabPanel> */}

          <TabPanel sx={{ p: 0 }} value="1" index="1">
            <MajorCategory />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="2" index="2">
            <MinorCategory />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default Category;
