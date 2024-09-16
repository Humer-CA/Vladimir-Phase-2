import React, { useEffect, useState } from "react";
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

import { useGetTypeOfRequestAllApiQuery } from "../../../Redux/Query/Masterlist/TypeOfRequest";
import { closeExport } from "../../../Redux/StateManagement/booleanStateSlice";
import { useLazyGetExportApiQuery } from "../../../Redux/Query/FixedAsset/FixedAssets";
import ExportIcon from "../../../Img/SVG/ExportIcon.svg";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { useLazyGetPrWithExportApiQuery } from "../../../Redux/Query/Request/PurchaseRequest";

const schema = yup.object().shape({
  id: yup.string(),
  from: yup.string().required().typeError("Please provide a FROM date"),
  to: yup.string().required().typeError("Please provide a TO date"),
});

const ExportPr = () => {
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
      error: exportError,
      refetch: exportApiRefetch,
    },
  ] = useLazyGetPrWithExportApiQuery();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      from: null,
      to: null,
      export: null,
    },
  });

  useEffect(() => {
    if (exportApiError && exportError?.status === 422) {
      dispatch(
        openToast({
          message: exportError?.data?.message,
          duration: 5000,
          variant: "error",
        })
      );
    } else if (exportApiError && exportError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [exportApiError]);

  const handleExport = async (formData) => {
    try {
      const res = await trigger({
        search: "",
        page: "",
        perPage: "",
        from: moment(formData?.from).format("MMM DD, YYYY"),
        to: moment(formData?.to).format("MMM DD, YYYY"),
        export: 1,
      }).unwrap();
      //   console.log(res);
      const newObj = res?.flatMap((item) => {
        return {
          ymir_pr_number: item?.ymir_pr_number,
          pr_number: item?.pr_number,
          item_status: item?.item_status,
          status: item?.status,
          asset_description: item?.asset_description,
          asset_specification: item?.asset_specification,
          brand: item?.brand,
          transaction_number: item?.transaction_number,
          acquisition_details: item?.acquisition_details,
          company_code: item?.company_code,
          company: item?.company,
          business_unit_code: item?.business_unit_code,
          business_unit: item?.business_unit,
          department_code: item?.department_code,
          department: item?.department,
          unit_code: item?.unit_code,
          unit: item?.unit,
          subunit_code: item?.subunit_code,
          subunit: item?.subunit,
          location_code: item?.location_code,
          location: item?.location,
          account_title_code: item?.account_title_code,
          account_title: item?.account_title,
          date_needed: moment(item?.date_needed).format("MMM DD, YYYY"),
          created_at: moment(item?.created_at).format("MMM DD, YYYY"),
        };
      });

      await excelExport(newObj, "Vladimir-PR-Reports.xlsx");
      dispatch(
        openToast({
          message: "Successfully Exported",
          duration: 5000,
          variant: "success",
        })
      );
      dispatch(closeExport());
    } catch (err) {
      if (err?.status === 422) {
        dispatch(
          openToast({
            message: err.data.errors?.detail,
            duration: 5000,
            variant: "error",
          })
        );
      } else if (err?.status !== 422) {
        dispatch(
          openToast({
            message: "Something went wrong. Please try again.",
            duration: 5000,
            variant: "error",
          })
        );
      }
    }
  };

  //

  const handleClose = () => {
    dispatch(closeExport());
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
          Export Asset
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <CustomDatePicker
            control={control}
            name="from"
            label="From"
            size="small"
            error={!!errors?.from}
            helperText={errors?.from?.message}
          />

          <CustomDatePicker
            control={control}
            name="to"
            label="To"
            size="small"
            disabled={!watch("from")}
            minDate={watch("from")}
            maxDate={new Date()}
            error={!!errors?.to}
            helperText={errors?.to?.message}
          />
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <LoadingButton
            variant="contained"
            loading={exportApiLoading}
            startIcon={
              exportApiLoading ? null : (
                <IosShareRounded
                  // color={disabledItems() ? "gray" : "primary"}
                  color={!isValid ? "gray" : "primary"}
                  size="small"
                />
              )
            }
            type="submit"
            color="secondary"
            disabled={!isValid}
          >
            Export
          </LoadingButton>

          <Button variant="outlined" size="small" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ExportPr;
