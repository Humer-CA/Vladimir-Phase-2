import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostModuleApiMutation,
  useUpdateModuleApiMutation,
} from "../../../Redux/Query/ModulesApi";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string(),
  module_name: yup.string().required().label("Module Name"),
});

const AddModules = (props) => {
  const { data, onUpdateResetHandler } = props;

  const dispatch = useDispatch();

  const [
    postModule,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostModuleApiMutation();
  // console.log(isPostError);
  // console.log(postError);

  const [
    updateModule,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateModuleApiMutation();

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
      module_name: "",
    },
  });
  // console.log(errors);

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("module_name", {
        type: "validate",
        message: postError?.data?.error,
      });
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
      setValue("module_name", data.module_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      return updateModule(formData);
    }
    postModule(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {data.status ? "Edit Module" : "Add Module"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
        autoComplete="off"
      >
        <CustomTextField
          required
          control={control}
          name="module_name"
          label="Module Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.module_name}
          helperText={errors?.module_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              (errors?.module_name ? true : false) ||
              watch("module_name") === undefined ||
              watch("module_name") === ""
            }
          >
            {data.status ? "Update" : "Create"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddModules;
