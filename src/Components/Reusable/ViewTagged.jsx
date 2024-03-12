import React, { useEffect, useState } from "react";
import CustomAutoComplete from "../../Components/Reusable/CustomAutoComplete";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  TextField,
  Typography,
} from "@mui/material";

import {
  closeDialog,
  closeDrawer,
} from "../../Redux/StateManagement/booleanStateSlice";

import { useDispatch } from "react-redux";

const ViewTagged = (props) => {
  const {
    data = null,
    mapData,
    name,
    onViewResetLocationHandler,
    refetch,
  } = props;
  const [value, setValue] = useState([]);
  const dispatch = useDispatch();

  const handleCloseDialog = () => {
    dispatch(closeDialog());
    // onViewResetLocationHandler();
  };

  // console.log(data);
  // const mapData = data?.locations.map((items) => {
  //   setState(`${items.location_code} -  ${items.location_name}`);
  //   // console.log(`${items.location_code} -  ${items.location_name}`);
  //   // `${items.location_name} -  ${items.location_code}`;
  // });

  useEffect(() => {
    if (data.id) {
      setValue(mapData);
    } else if (data) {
      setValue(mapData);
    }
  }, [data]);

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {`View ${name}`}
      </Typography>

      <Box className="add-masterlist__content" sx={{ px: "10px" }}>
        <Autocomplete
          readOnly
          autoComplete
          required
          multiple
          name="id"
          options={value}
          value={value}
          size="small"
          renderInput={(params) => (
            <TextField
              color="secondary"
              sx={{
                ".MuiInputBase-root ": { borderRadius: "10px" },
                pointer: "default",
                overflow: "auto",
                // label: {
                //   zIndex: 2,
                // },
                maxHeight: "300px",
              }}
              {...params}
              // label={`${name}`}
            />
          )}
        />

        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleCloseDialog}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ViewTagged;
