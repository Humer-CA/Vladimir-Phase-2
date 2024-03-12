import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { closeDialog, closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";

import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

import {
  useAddPurchaseRequestApiMutation,
  useGetPurchaseRequestAllApiQuery,
} from "../../../Redux/Query/Request/PurchaseRequest";
import { useGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Company";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

const schema = yup.object().shape({
  id: yup.string(),
  transaction_number: yup.number(),
  pr_number: yup.string().required(),
  business_unit_id: yup.object().required(),
});

const AddPr = (props) => {
  const { data: transactionData } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [
    postPr,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = useAddPurchaseRequestApiMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      pr_number: "",
      business_unit_id: null,
      transaction_number: transactionData?.data?.transaction_number,
    },
  });
  const { data: companyData = [], isLoading: isCompanyLoading } = useGetCompanyAllApiQuery();

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("business_unit_id", {
        type: "validate",
        message: postError?.data?.errors.business_unit_id,
      }) ||
        setError("pr_number", {
          type: "validate",
          message: postError?.data?.errors.pr_number,
        }) ||
        dispatch(
          openToast({
            message: postError?.data?.errors.detail || Object.entries(postError?.data?.errors).at(0).at(1).at(0),
            duration: 5000,
            variant: "error",
          })
        );
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDialog();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
      navigate(-1);
    }
  }, [isPostSuccess]);

  const onSubmitHandler = (formData) => {
    // console.log(formData)
    const newFormData = {
      transaction_number: transactionData?.data[0]?.transaction_number,
      pr_number: formData?.pr_number,
      business_unit_id: formData?.business_unit_id?.id,
    };
    postPr(newFormData);
    // console.log("formData", newFormData);
  };

  // console.log(transactionData?.data[0]?.transaction_number);

  const handleCloseDialog = () => {
    dispatch(closeDialog());
  };

  return (
    <Stack width="100%" gap={2}>
      <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
        Add PR Number
      </Typography>

      <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2}>
          <CustomAutoComplete
            control={control}
            name="business_unit_id"
            loading={isCompanyLoading}
            options={companyData}
            getOptionLabel={(option) => option?.company_name}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            size="small"
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label={"Business Operation"}
                error={!!errors?.business_unit_id?.message}
                helperText={errors?.business_unit_id?.message}
              />
            )}
          />

          {/* -----------------NumberField---------------------- */}
          {/* <CustomNumberField
            control={control}
            name="pr_number"
            label="PR Number"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.pr_number}
            helperText={errors?.pr_number?.message}
            fullWidth
          /> */}

          {/* -----------------NumberField---------------------- */}
          <CustomTextField
            control={control}
            name="pr_number"
            label="PR Number"
            // type="text"
            color="secondary"
            size="small"
            error={!!errors?.pr_number}
            helperText={errors?.pr_number?.message}
            fullWidth
          />
        </Stack>

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isPostLoading}
            disabled={watch("pr_number") === "" || watch("business_unit_id") === null}
          >
            Add
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDialog}
            disabled={isPostLoading === true}
          >
            Cancel
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default AddPr;
