import React, { useEffect, useState } from "react";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import { usePostCalcDepreApiMutation } from "../../Redux/Query/FixedAsset/FixedAssets";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Card, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Close, CurrencyExchangeRounded, Watch } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import CustomDatePicker from "../../Components/Reusable/CustomDatePicker";

const schema = yup.object().shape({
  id: yup.string(),
  endDate: yup.string().typeError("Please enter a validate date").label("End Date"),
});

const Depreciation = (props) => {
  const { setViewDepre, calcDepreApi } = props;
  // const { state: data } = useLocation();

  const isSmallScreen = useMediaQuery("(max-width: 730px)");

  const dispatch = useDispatch();

  const {
    formState: { errors },
    control,
    handleSubmit,
    setError,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      endDate: null,
    },
  });

  const [
    postCalcDepreApi,
    {
      data: postData,
      isLoading: calcDepreApiLoading,
      isSuccess: isPostSuccess,
      isFetching: calcDepreApiFetching,
      isError: isPostError,
      error: postError,

      refetch: calcDepreApiRefetch,
    },
  ] = usePostCalcDepreApiMutation();

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("endDate", {
        type: "validate",
        message: postError?.data?.message,
      });
    }
  }, [isPostError]);

  const handleDepreciation = (formData) => {
    const newDate = {
      ...data,
      date: moment(new Date(formData.endDate)).format("YYYY-MM"),
    };
    postCalcDepreApi(newDate);
  };

  const handleClose = () => {
    setViewDepre(false);
  };

  const sxProps = {
    textField: {
      size: "small",
      sx: {
        "& .Mui-focused.MuiFormLabel-root": {
          color: "secondary.main",
        },

        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#344955!important",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "10px",
        },
      },
      error: !!errors?.endDate,
      helperText: errors?.endDate?.message,
    },
  };

  const data = calcDepreApi?.data;

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(handleDepreciation)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: " flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              pl: "5px",
              mb: "10px",
            }}
          >
            <CurrencyExchangeRounded size="small" color="secondary" />

            <Typography
              color="secondary.main"
              sx={{
                fontFamily: "Anton",
                fontSize: "1.5rem",
                justifyContent: "flex-start",
                alignSelf: "center",
              }}
            >
              Depreciation
            </Typography>
          </Box>

          <IconButton color="secondary" variant="outlined" onClick={handleClose} sx={{ mr: "-15px", mt: "-25px" }}>
            <Close size="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            position: "relative",
            gap: "10px",
            px: "5px",
            flexWrap: "wrap",
            height: "340px",
            overflow: "auto",
          }}
        >
          <Card
            sx={{
              backgroundColor: "secondary.main",
              minWidth: "300px",
              height: "maxContent",
              flexGrow: "1",
              // flex: "1",
              alignSelf: "stretched",
              p: "10px 20px",
              borderRadius: "5px",
            }}
          >
            <Box>
              <Typography
                color="secondary.main"
                sx={{
                  fontFamily: "Anton",
                  fontSize: "1rem",
                  color: "primary.main",
                }}
              >
                Information
              </Typography>

              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  // gap: isSmallScreen ? 0 : "15px",
                }}
              >
                <Box className="tableCard__propertiesCapex">
                  Depreciation Method:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    {data?.depreciation_method}
                  </Typography>
                </Box>

                <Box className="tableCard__propertiesCapex">
                  Estimated Useful Life:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    {data?.est_useful_life}
                  </Typography>
                </Box>

                <Box className="tableCard__propertiesCapex">
                  Aquisition Date:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    {data?.acquisition_date}
                  </Typography>
                </Box>

                <Box className="tableCard__propertiesCapex">
                  Aquisition Cost:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    ₱{data?.acquisition_cost?.toLocaleString()}
                  </Typography>
                </Box>

                <Box className="tableCard__propertiesCapex">
                  Months Depreciated:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    {data?.months_depreciated}
                  </Typography>
                </Box>

                <Box className="tableCard__propertiesCapex">
                  Scrap Value:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    ₱{data?.scrap_value?.toLocaleString()}
                  </Typography>
                </Box>

                <Box className="tableCard__propertiesCapex">
                  Depreciable Basis:
                  <Typography className="tableCard__infoCapex" fontSize="14px">
                    ₱{data?.depreciable_basis?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          <Box sx={{ flexDirection: "column", flex: "1", minWidth: "300px" }}>
            <Card
              className="tableCard__card"
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: "10px",
              }}
            >
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "rem" }}>
                Formula
              </Typography>

              <Box>
                <Box className="tableCard__properties">
                  Accumulated Cost:
                  <Typography className="tableCard__info" fontSize="14px">
                    ₱
                    {postData
                      ? postData?.data?.accumulated_cost?.toLocaleString()
                      : calcDepreApi?.data?.accumulated_cost?.toLocaleString()}
                  </Typography>
                </Box>

                <Box className="tableCard__properties">
                  Depreciation per Year:
                  <Typography className="tableCard__info" fontSize="14px">
                    ₱
                    {postData
                      ? postData?.data?.depreciation_per_year?.toLocaleString()
                      : calcDepreApi?.data?.depreciation_per_year?.toLocaleString()}
                  </Typography>
                </Box>

                <Box className="tableCard__properties">
                  Depreciation per Month:
                  <Typography className="tableCard__info" fontSize="14px">
                    ₱
                    {postData
                      ? postData?.data?.depreciation_per_month?.toLocaleString()
                      : calcDepreApi?.data?.depreciation_per_month?.toLocaleString()}
                  </Typography>
                </Box>

                <Box className="tableCard__properties">
                  Remaining Book Value:
                  <Typography className="tableCard__info" fontSize="14px">
                    ₱
                    {postData
                      ? postData?.data?.remaining_book_value?.toLocaleString()
                      : calcDepreApi?.data?.remaining_book_value?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* <Card className="tableCard__card">
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "rem" }}>
                Date Setup
              </Typography>

              <Box className="tableCard__properties">
                Start Date:
                <Typography className="tableCard__info" fontSize="14px">
                  {data.start_depreciation}
                </Typography>
              </Box>

              <Box className="tableCard__properties">
                End Depreciation:
                <Typography className="tableCard__info" fontSize="14px">
                  {data.end_depreciation}
                </Typography>
              </Box>

              <Box className="tableCard__properties" sx={{ flexDirection: "column" }}>
                <Typography fontSize="14px" sx={{ mb: "10px" }}>
                  End Date Value:
                </Typography>

                <CustomDatePicker
                  control={control}
                  name="endDate"
                  label="End Date"
                  size="small"
                  views={["month", "year"]}
                  error={!!errors?.endDate?.message}
                  helperText={errors?.endDate?.message}
                />
              </Box>
            </Card> */}
          </Box>
        </Box>

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            float: "right",
            gap: "10px",
            mt: "10px",
          }}
        >
          <LoadingButton
            variant="contained"
            type="submit"
            size="small"
            loading={calcDepreApiLoading}
            disabled={watch("endDate") === "" || watch("endDate") === null}
          >
            Run Depreciation
          </LoadingButton>
        </Box> */}
      </Box>
    </>
  );
};

export default Depreciation;
