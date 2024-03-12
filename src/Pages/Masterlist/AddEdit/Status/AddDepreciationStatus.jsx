import React, { useEffect } from "react";
import "../../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { closeDrawer } from "../../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostDepreciationStatusApiMutation,
  useUpdateDepreciationStatusApiMutation,
} from "../../../../Redux/Query/Masterlist/Status/DepreciationStatus";
import { openToast } from "../../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),

  depreciation_status_name: yup
    .string()
    .required()
    .label("Depreciation Status Name"),
});

const AddDepreciationStatus = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

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
      depreciation_status_name: "",
    },
  });

  const [
    postDepreciationStatus,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostDepreciationStatusApiMutation();

  const [
    updateDepreciationStatus,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateDepreciationStatusApiMutation();

  useEffect(() => {
    const hasError =
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422);
    const errors = (postError?.data || updateError?.data)?.errors || {};
    Object.entries(errors).forEach(([name, [message]]) =>
      setError(name, { type: "validate", message })
    );

    const showToast = () => {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    };

    hasError && showToast();
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
      setValue("depreciation_status_name", data.depreciation_status_name);
      // console.log(data);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateDepreciationStatus(formData);
      return;
    }
    postDepreciationStatus(formData);
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
        {data.status ? "Edit Depreciation Status" : "Add Depreciation Status"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          control={control}
          name="depreciation_status_name"
          label="Depreciation Status Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.depreciation_status_name}
          helperText={errors?.depreciation_status_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={watch("depreciation_status_name") === ""}
          >
            {data.status ? "Update" : "Create"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
            disabled={(isPostLoading || isUpdateLoading) === true}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDepreciationStatus;
