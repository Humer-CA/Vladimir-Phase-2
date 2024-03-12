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
  usePostAssetStatusApiMutation,
  useUpdateAssetStatusApiMutation,
} from "../../../../Redux/Query/Masterlist/Status/AssetStatus";
import { openToast } from "../../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),

  asset_status_name: yup.string().required().label("Asset Status Name"),
});

const AddAssetStatus = (props) => {
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
      asset_status_name: "",
    },
  });

  const [
    postAssetStatus,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostAssetStatusApiMutation();

  const [
    updateAssetStatus,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateAssetStatusApiMutation();

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
      setValue("asset_status_name", data.asset_status_name);
      // console.log(data);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateAssetStatus(formData);
      return;
    }
    postAssetStatus(formData);
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
        {data.status ? "Edit Asset Status" : "Add Asset Status"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          control={control}
          name="asset_status_name"
          label="Asset Status Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.asset_status_name}
          helperText={errors?.asset_status_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={watch("asset_status_name") === ""}
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

export default AddAssetStatus;
