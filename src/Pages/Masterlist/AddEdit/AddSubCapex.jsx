import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Stack, Typography } from "@mui/material";

import { useDispatch } from "react-redux";
import { usePostSubCapexApiMutation, useUpdateSubCapexApiMutation } from "../../../Redux/Query/Masterlist/Capex";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";

const schema = yup.object().shape({
  id: yup.string(),
  capex_id: yup.number(),
  sub_capex: yup.string().required(),
  sub_project: yup.string().required().label("Project Name"),
});

const AddSubCapex = (props) => {
  const { data, capex, capexId, onUpdateResetHandler, setSubCapexDialog } = props;
  const dispatch = useDispatch();

  const [
    postSubCapex,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostSubCapexApiMutation();

  const [
    updateSubCapex,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateSubCapexApiMutation();

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
      capex_id: capexId,
      capex: capex,
      sub_capex: "",
      sub_project: "",
    },
  });

  useEffect(() => {
    if (isPostSuccess || isUpdateSuccess) {
      reset();
      setSubCapexDialog(false);
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
    const hasError = (isPostError || isUpdateError) && (postError?.status === 422 || updateError?.status === 422);
    const errors = (postError?.data || updateError?.data)?.errors || {};
    Object.entries(errors).forEach(([name, [message]]) => setError(name, { type: "validate", message }));

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

  // console.log(data.sub_capex);

  useEffect(() => {
    if (data.status) {
      setValue("id", data.id);
      setValue("capex_id", data.capex_id);
      setValue("capex", capex);
      setValue("sub_capex", data.sub_capex);
      setValue("sub_project", data.sub_project);
    }
  }, [data]);

  // console.log(data);

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      capex_id: capexId,
    };
    if (data.status) {
      updateSubCapex(newFormData);
      return;
    }
    postSubCapex(newFormData);
  };

  const closeDialog = () => {
    onUpdateResetHandler();
    setSubCapexDialog(false);
  };

  // console.log(capexId);
  // console.log(data);
  // console.log(errors);

  return (
    <Box className="add-masterlist">
      <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
        {data.status ? "Edit Sub Capex" : "Add Sub Capex"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content">
        <Stack flexDirection="row" gap={1}>
          <CustomTextField
            control={control}
            name="capex"
            label="Capex"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.capex_id}
            helperText={errors?.capex_id?.message}
            fullWidth
            // format={capex}
            // prefix={`${capex}-`}
            disabled
          />

          <CustomTextField
            control={control}
            name="sub_capex"
            label="Sub Capex"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.sub_capex}
            helperText={errors?.sub_capex?.message}
            disabled={data.status}
            inputProps={{
              maxLength: 3,
            }}
          />
        </Stack>

        <CustomTextField
          control={control}
          name="sub_project"
          label="Project Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.sub_project}
          helperText={errors?.sub_project?.message}
          fullWidth
        />

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={watch("sub_capex") === "" || watch("sub_project") === ""}
          >
            {data.status ? "Update" : "Create"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => closeDialog()}
            disabled={(isPostLoading || isUpdateLoading) === true}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddSubCapex;
