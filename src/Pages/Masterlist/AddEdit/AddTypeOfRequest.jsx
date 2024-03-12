import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostTypeOfRequestApiMutation,
  useUpdateTypeOfRequestApiMutation,
} from "../../../Redux/Query/Masterlist/TypeOfRequest";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string(),
  type_of_request_name: yup.string().required().label("Type of Request"),
});

const AddTypeOfRequest = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postTypeOfRequest,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostTypeOfRequestApiMutation();

  const [
    updateTypeOfRequest,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateTypeOfRequestApiMutation();

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
      type_of_request_name: "",
    },
  });

  useEffect(() => {
    if (
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422)
    ) {
      setError("type_of_request", {
        type: "validate",
        message:
          postError?.data?.errors.type_of_request ||
          updateError?.data?.errors.type_of_request,
      });
      setError("type_of_request_name", {
        type: "validate",
        message:
          postError?.data?.errors.type_of_request_name ||
          updateError?.data?.errors.type_of_request_name,
      });
    } else if (
      (isPostError && postError?.status !== 422) ||
      (isUpdateError && updateError?.status !== 422)
    ) {
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
      setValue("type_of_request", data.type_of_request);
      setValue("type_of_request_name", data.type_of_request_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateTypeOfRequest(formData);
      return;
    }
    postTypeOfRequest(formData);
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
        {data.status ? "Edit Type of Request" : "Add Type of Request"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          control={control}
          name="type_of_request_name"
          label="Type of Request"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.type_of_request_name}
          helperText={errors?.type_of_request_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              watch("type_of_request") === null ||
              watch("type_of_request") === "" ||
              watch("type_of_request_name") === null ||
              watch("type_of_request_name") === ""
            }
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

export default AddTypeOfRequest;
