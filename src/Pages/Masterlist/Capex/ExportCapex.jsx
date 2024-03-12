import React, { useState } from "react";
import moment from "moment";
// import CustomAutoComplete from "../../../../Components/Reusable/CustomAutoComplete";
import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import useExcel from "../../../Hooks/Xlsx";

import { Box, Button, TextField, Typography } from "@mui/material";
import { IosShareRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch } from "react-redux";

import { closeExport } from "../../../Redux/StateManagement/exportFileSlice";
import { useLazyGetExportApiQuery } from "../../../Redux/Query/Masterlist/Capex";
import ExportIcon from "../../../Img/SVG/ExportIcon.svg";

const schema = yup.object().shape({
  id: yup.string(),
  search: yup.string().nullable().label("Search"),
  startDate: yup.string().nullable().typeError("Please provide a start date"),
  endDate: yup.string().nullable().typeError("Please provide a end date"),
});

const ExportFixedAsset = () => {
  const dispatch = useDispatch();

  const { excelExport } = useExcel();

  const [
    trigger,
    {
      data: exportApi,
      isLoading: exportApiLoading,
      isSuccess: exportApiSuccess,
      isFetching: exportApiFetching,
      isError: exportApiError,

      refetch: exportApiRefetch,
    },
  ] = useLazyGetExportApiQuery();

  // const {
  //   data: typeOfRequestData = [],
  //   isLoading: isTypeOfRequestLoading,
  //   isSuccess: isTypeOfRequestSuccess,
  //   isError: isTypeOfRequestError,
  //   refetch: isTypeOfRequestRefetch,
  // } = useGetTypeOfRequestAllApiQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      search: "",
      startDate: null,
      endDate: null,
    },
  });

  const handleExport = async (data) => {
    const newData = {
      ...data,
      startDate: data.startDate === null ? "" : moment(new Date(data.startDate)).format("YYYY-MM-DD"),
      endDate: data.endDate === null ? "" : moment(new Date(data.endDate)).format("YYYY-MM-DD"),
    };

    try {
      // console.log(newData);
      const res = await trigger(newData);
      // console.log(res);

      // const exportData = res.data.map((item) => {
      //   return {
      //     ID: item.id,
      //     CAPEX: item.capex,
      //     "PROJECT NAME": item.project_name,
      //     "SUB CAPEX": item.sub_capex,
      //     "SUB PROJECT": item.sub_project,
      //     Status: item.status,
      //   };
      // });

      const exportData = res.data?.flatMap((item) => {
        if (Array.isArray(item.sub_capex) && item.sub_capex.length > 0) {
          return item.sub_capex?.map((subItem) => ({
            ID: item.id,
            CAPEX: item.capex,
            "PROJECT NAME": item.project_name,
            "SUB CAPEX ID": subItem.sub_capex_id || "-",
            "SUB CAPEX": subItem.sub_capex || "-",
            "SUB PROJECT": subItem.sub_project || "-",
            Status: subItem.status || "-",
          }));
        } else {
          return {
            ID: item.id,
            CAPEX: item.capex,
            "PROJECT NAME": item.project_name,
            "SUB CAPEX ID": "-",
            "SUB CAPEX": "-",
            "SUB PROJECT": "-",
            Status: item.status,
          };
        }
      });

      await excelExport(exportData, `Vladimir-Capex.xlsx`);

      // console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };

  //

  const handleClose = () => {
    dispatch(closeExport());
  };

  const disabledItems = () => {
    return watch("search") === "" && watch("startDate") === null && watch("endDate") === null;
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(handleExport)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Typography variant="h5" color="secondary" sx={{ fontFamily: "Anton" }}>
          Export Capex
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* <CustomAutoComplete
            control={control}
            name="search"
            options={typeOfRequestData}
            loading={isTypeOfRequestLoading}
            size="small"
            getOptionLabel={(option) => option.type_of_request_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Type of Request  "
                error={!!errors?.type_of_request_id}
                helperText={errors?.type_of_request_id?.message}
              />
            )}
          /> */}

          <CustomTextField
            control={control}
            name="search"
            label="🔍︎ Search Filter"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.search}
            helperText={errors?.search?.message}
            fullWidth
          />

          <CustomDatePicker
            control={control}
            name="startDate"
            label="Start Date"
            size="small"
            error={!!errors?.startDate}
            helperText={errors?.startDate?.message}
          />

          <CustomDatePicker
            control={control}
            name="endDate"
            label="End Date"
            size="small"
            error={!!errors?.endDate}
            helperText={errors?.endDate?.message}
          />
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <LoadingButton
            variant="contained"
            loading={exportApiLoading}
            startIcon={
              <IosShareRounded
                // color={disabledItems() ? "gray" : "primary"}
                color={"primary"}
                size="small"
              />
            }
            type="submit"
            color="secondary"
            fullWidth
            // disabled={disabledItems()}
          >
            Export
          </LoadingButton>

          <Button variant="outlined" size="small" color="secondary" onClick={handleClose} fullWidth>
            Close
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ExportFixedAsset;
