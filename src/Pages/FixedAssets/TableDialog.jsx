import React, { useEffect, useState } from "react";
import "../../../../Style/Fixed Asset/tableCard.scss";

import { useDispatch } from "react-redux";
import { closeTableModal } from "../../Redux/StateManagement/tableDialogSlice";

import { Box, Button, Card, Chip, Divider, IconButton, Typography } from "@mui/material";
import { CheckCircleRounded, Circle, Close, PriceChange, Print } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { usePostPrintApiMutation } from "../../Redux/Query/FixedAsset/FixedAssets";

const TableDialog = (props) => {
  const { data } = props;
  const [tagNumber, setTagNumber] = useState(null);
  const [startDate, setStartDate] = useState("2023-05-20");
  const [endDate, setEndDate] = useState("2023-05-28");

  const dispatch = useDispatch();

  const [
    printAsset,
    { data: printData, isLoading: isPrintLoading, isSuccess: isPrintSuccess, isError: isPrintError, error: printError },
  ] = usePostPrintApiMutation({
    tagNumber: tagNumber,
    startDate: startDate,
    endDate: endDate,
  });

  useEffect(() => {
    // setTagNumber();
    // setVladimirData(data.vladimir_tag_number);
  }, [data]);

  const onPrintHandler = () => {
    printAsset({
      tagNumber: data.vladimir_tag_number,
      startDate: null,
      endDate: null,
    });

    // console.log(vladimirData);
    // printAsset(vladimirData);
  };

  const handleCloseDialog = () => {
    dispatch(closeTableModal());
  };

  return (
    <>
      <Box className="tableCard">
        <IconButton
          sx={{
            alignSelf: "flex-end",
            right: 10,
            top: 10,
            position: "absolute",
          }}
          size="small"
          color="secondary"
          onClick={handleCloseDialog}
        >
          <Close size="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          mt: "20px",
          mb: "10px",
          pr: "5px",
          display: "flex",
          justifyContent: "center",
          alignSelf: "flex-end",
        }}
      >
        <Button variant="contained" size="small" color="secondary" startIcon={<PriceChange color="primary" />}>
          Depreciation
        </Button>

        <LoadingButton
          variant="contained"
          size="small"
          startIcon={<Print />}
          onClick={onPrintHandler}
          sx={{ mx: "10px" }}
        >
          Print
        </LoadingButton>
      </Box>
    </>
  );
};

export default TableDialog;
