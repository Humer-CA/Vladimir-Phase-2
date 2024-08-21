import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import { usePostCapexApiMutation, useUpdateCapexApiMutation } from "../../../Redux/Query/Masterlist/Capex";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string(),
  capex: yup.string().required(),
  project_name: yup.string().required().label("Project Name"),
});

const AddCapex = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postCapex,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostCapexApiMutation();

  const [
    updateCapex,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateCapexApiMutation();

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
      capex: "",
      project_name: "",
    },
  });

  useEffect(() => {
    if (isPostError || isUpdateError) {
      let message = "Something went wrong. Please try again.";
      let variant = "error";

      if ((postError || updateError)?.status === 404 || (postError || updateError)?.status === 422) {
        message = (postError || updateError)?.data?.errors.detail || (postError || updateError)?.data?.errors.capex[0];
        if ((postError || updateError)?.status === 422) {
          console.log(postError || updateError);
        }
      }

      dispatch(openToast({ message, duration: 5000, variant }));
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
      setValue("capex", data.capex);
      setValue("project_name", data.project_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateCapex(formData);
      return;
    }
    postCapex(formData);
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
        {data.status ? "Edit Capex" : "Add Capex"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content">
        <CustomTextField
          control={control}
          name="capex"
          label="Capex"
          type="text"
          color="secondary"
          size="small"
          disabled={data.status}
          error={!!errors?.capex}
          helperText={errors?.capex?.message}
          fullWidth
        />
        <CustomTextField
          control={control}
          name="project_name"
          label="Project Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.project_name}
          helperText={errors?.project_name?.message}
          fullWidth
        />
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

export default AddCapex;
