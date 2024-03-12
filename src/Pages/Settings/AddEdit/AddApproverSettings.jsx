import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  useGetApproverSettingsAllApiQuery,
  useGetApproversApiQuery,
  usePostApproverSettingsApiMutation,
  useUpdateApproverSettingsApiMutation,
} from "../../../Redux/Query/Settings/ApproverSettings";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import { useGetUserAccountAllApiQuery } from "../../../Redux/Query/UserManagement/UserAccountsApi";

const schema = yup.object().shape({
  id: yup.string(),
  approver_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Approver"),
});

const AddApproverSettings = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postApproverSettings,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostApproverSettingsApiMutation();

  const [
    updateApproverSettings,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateApproverSettingsApiMutation();

  const {
    data: userData = [],
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
  } = useGetApproversApiQuery();
  // console.log(userData);

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
      approver_id: null,
    },
  });

  useEffect(() => {
    if (
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422)
    ) {
      setError("approver_id", {
        type: "validate",
        message:
          postError?.data?.errors.approver_id ||
          updateError?.data?.errors.approver_id,
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
      setValue("approver_id", data.approver);
    }
  }, [data]);
  // console.log(data);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateApproverSettings(formData);
      return;
    }
    postApproverSettings(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {data.status ? "Edit Approver" : "Add Approver"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomAutoComplete
          name="approver_id"
          control={control}
          size="small"
          required
          includeInputInList
          fullWidth
          filterOptions={filterOptions}
          options={userData}
          loading={isUserLoading}
          getOptionLabel={(option) =>
            `(${option.employee_id}) - ${option.firstname} ${option.lastname}`
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Approver"
              color="secondary"
              error={!!errors?.approver_id?.message}
              helperText={errors?.approver_id?.message}
            />
          )}
        />

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              watch("approver_id") === null || watch("approver_id") === ""
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

export default AddApproverSettings;
