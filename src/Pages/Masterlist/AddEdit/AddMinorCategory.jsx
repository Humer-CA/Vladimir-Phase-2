import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostMinorCategoryApiMutation,
  useUpdateMinorCategoryApiMutation,
} from "../../../Redux/Query/Masterlist/Category/MinorCategory";
// import { useGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Category/MajorCategory";
// import { useGetDivisionAllApiQuery } from "../../../Redux/Query/Masterlist/Division";

import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import { useGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/AccountTitle";
import { useGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Category/MajorCategory";
// import { useGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Masterlist";

const schema = yup.object().shape({
  id: yup.string(),

  major_category_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Major Category"),

  minor_category_name: yup.string().required(),

  depreciation_credit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Depreciation Credit"),
  depreciation_debit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Depreciation Debit"),
  initial_credit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Initial Credit"),
  initial_debit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Initial Debit"),
});

const AddMinorCategory = (props) => {
  const { data, onUpdateResetHandler } = props;
  const [filteredMajorCategoryData, setFilteredMajorCategoryData] = useState([]);
  const dispatch = useDispatch();

  const {
    data: majorCategoryData = [],
    isLoading: isMajorCategoryLoading,
    isError: isMajorCategoryError,
  } = useGetMajorCategoryAllApiQuery();

  const {
    data: accountTitleData = [],
    isLoading: isAccountTitleLoading,
    isSuccess: isAccountTitleSuccess,
    isError: isAccountTitleError,
    refetch: isAccountTitleRefetch,
  } = useGetAccountTitleAllApiQuery();

  const [
    postMinorCategory,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostMinorCategoryApiMutation();

  const [
    updateMinorCategory,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateMinorCategoryApiMutation();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    setError,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      major_category_id: null,
      minor_category_name: "",
      depreciation_credit_id: null,
      depreciation_debit_id: null,
      initial_credit_id: null,
      initial_debit_id: null,
    },
  });

  useEffect(() => {
    if ((isPostError || isUpdateError) && (postError?.status === 422 || updateError?.status === 422)) {
      setError("minor_category_name", {
        type: "validate",
        message: postError?.data?.errors.minor_category_name || updateError?.data?.errors.minor_category_name,
      });
    } else if ((isPostError && postError?.status !== 422) || (isUpdateError && updateError?.status !== 422)) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError, isUpdateError]);

  useEffect(() => {
    if (isPostSuccess || isUpdateSuccess) {
      reset();
      handleCloseDrawer();
      dispatch(
        openToast({
          message: postData?.message || updateData?.message,
          duration: 5000,
        })
      );

      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
    }
  }, [isPostSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (data.status) {
      setValue("id", data.id);
      // setValue("division_id", {
      //   id: data.division_id,
      //   division_name: data.division_name,
      // });
      setValue("major_category_id", data.major_category);
      setValue("minor_category_name", data.minor_category_name);

      setValue("depreciation_credit_id", data.depreciation_credit);
      setValue("depreciation_debit_id", data.depreciation_debit);
      setValue("initial_credit_id", data.initial_credit);
      setValue("initial_debit_id", data.initial_debit);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateMinorCategory(formData);
      return;
    }
    postMinorCategory(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  return (
    <Box className="add-masterlist">
      <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
        {data.status ? "Edit Minor Category" : "Add Minor Category"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content">
        <CustomAutoComplete
          autoComplete
          disabled={data.status}
          name="major_category_id"
          control={control}
          options={majorCategoryData}
          loading={isMajorCategoryLoading}
          size="small"
          getOptionLabel={(option) => option.major_category_name}
          isOptionEqualToValue={(option, value) => option.major_category_name === value.major_category_name}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Major Category"
              error={!!errors?.major_category_id?.message}
              helperText={errors?.major_category_id?.message}
            />
          )}
        />

        <CustomTextField
          autoComplete="off"
          control={control}
          name="minor_category_name"
          label="Minor Category Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.minor_category_name?.message}
          helperText={errors?.minor_category_name?.message}
          fullWidth
        />

        {/* Depreciation Debit and Credit */}
        <Stack gap={2}>
          <Typography fontFamily="Anton" color="secondary">
            Accounting Entries
          </Typography>

          <CustomAutoComplete
            autoComplete
            name="initial_debit_id"
            control={control}
            options={accountTitleData}
            loading={isAccountTitleLoading}
            size="small"
            getOptionLabel={(option) => option.account_title_code + " - " + option.account_title_name}
            isOptionEqualToValue={(option, value) => option.account_title_code === value.account_title_code}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Initial Debit"
                error={!!errors?.initial_debit_id}
                helperText={errors?.initial_debit_id?.message}
              />
            )}
          />

          <CustomAutoComplete
            autoComplete
            name="initial_credit_id"
            control={control}
            options={accountTitleData}
            loading={isAccountTitleLoading}
            size="small"
            getOptionLabel={(option) => option.account_title_code + " - " + option.account_title_name}
            isOptionEqualToValue={(option, value) => option.account_title_code === value.account_title_code}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Initial Credit"
                error={!!errors?.initial_credit_id}
                helperText={errors?.initial_credit_id?.message}
              />
            )}
          />

          <CustomAutoComplete
            autoComplete
            name="depreciation_debit_id"
            control={control}
            options={accountTitleData}
            loading={isAccountTitleLoading}
            size="small"
            getOptionLabel={(option) => option.account_title_code + " - " + option.account_title_name}
            isOptionEqualToValue={(option, value) => option.account_title_code === value.account_title_code}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Depreciation Debit"
                error={!!errors?.depreciation_debit_id}
                helperText={errors?.depreciation_debit_id?.message}
              />
            )}
          />

          <CustomAutoComplete
            autoComplete
            name="depreciation_credit_id"
            control={control}
            options={accountTitleData}
            loading={isAccountTitleLoading}
            size="small"
            getOptionLabel={(option) => option.account_title_code + " - " + option.account_title_name}
            isOptionEqualToValue={(option, value) => option.account_title_code === value.account_title_code}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Depreciation Credit"
                error={!!errors?.depreciation_credit_id}
                helperText={errors?.depreciation_credit_id?.message}
              />
            )}
          />
        </Stack>

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={!isValid}
          >
            {data.status ? "Update" : "Create"}
          </LoadingButton>

          <Button variant="outlined" color="secondary" size="small" onClick={handleCloseDrawer}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMinorCategory;
