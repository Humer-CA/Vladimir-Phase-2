import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Checkbox, Chip, TextField, Typography } from "@mui/material";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import { usePostDivisionApiMutation, useUpdateDivisionApiMutation } from "../../../Redux/Query/Masterlist/Division";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Department";
import { departmentApi } from "../../../Redux/Query/Masterlist/FistoCoa/Department";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),
  sync_id: yup.array().required().label("Department").typeError("Department is required"),
  division_name: yup.string().required().label("Division Name"),
});

const AddDivision = (props) => {
  const { data, onUpdateResetHandler, refetch } = props;
  const dispatch = useDispatch();

  const icon = <CheckBoxOutlineBlank fontSize="small" />;
  const checkedIcon = <CheckBox fontSize="small" />;

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
      sync_id: null || [],
      division_name: "",
    },
  });

  const [
    postDivision,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostDivisionApiMutation();

  const [
    updateDivision,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateDivisionApiMutation();

  const {
    data: departmentData = [],
    isLoading: isDepartmentLoading,
    isSuccess: isDepartmentSuccess,
    isError: isDepartmentError,
    refetch: isDepartmentRefetch,
  } = useGetDepartmentAllApiQuery(null, { refetchOnMountOrArgChange: true });

  // useEffect(() => {
  //   const errorData =
  //     (isPostError || isUpdateError) &&
  //     (postError?.status === 422 || updateError?.status === 422);

  //   if (errorData) {
  //     const errors = (postError?.data || updateError?.data)?.errors || {};

  //     Object.entries(errors).forEach(([name, [message]]) =>
  //       setError(name, { type: "validate", message })
  //     );
  //   }

  //   const showToast = () => {
  //     dispatch(
  //       openToast({
  //         message: "Something went wrong. Please try again.",
  //         duration: 5000,
  //         variant: "error",
  //       })
  //     );
  //   };

  //   errorData && showToast();
  // }, [isPostError, isUpdateError]);

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

      dispatch(departmentApi.util.invalidateTags(["Department"]));

      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
    }
  }, [isPostSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (data.status) {
      setValue("id", data.id);
      setValue("sync_id", data.sync_id);
      setValue("division_name", data.division_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      sync_id: formData.sync_id.map((item) => item.sync_id),
    };

    if (data.status) {
      updateDivision(newFormData);
      return;
    }
    postDivision(newFormData);
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
        {data.action === "view" ? "View Divisions" : data.status ? "Edit Division" : "Add Division"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content">
        <CustomAutoComplete
          readOnly={data.action === "view"}
          autoComplete
          required
          multiple
          disableCloseOnSelect
          name="sync_id"
          control={control}
          options={departmentData}
          loading={isDepartmentLoading}
          size="small"
          getOptionLabel={(option) => option.department_name}
          getOptionDisabled={(option) =>
            option?.division?.division_id !== "-" && !data?.sync_id?.some((item) => item?.sync_id === option?.sync_id)
          }
          isOptionEqualToValue={(option, value) => option.department_name === value.department_name}
          slotProps={{
            popper: {
              placement: "top",
              modifiers: [
                {
                  name: "flip",
                  enabled: true,
                  options: {
                    altBoundary: true,
                    rootBoundary: "document",
                    // padding: 8,
                  },
                },
                {
                  name: "preventOverflow",
                  enabled: true,
                  options: {
                    altAxis: true,
                    altBoundary: false,
                    tether: false,
                    rootBoundary: "document",
                    // padding: 8,
                  },
                },
              ],
            },
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
              {option.department_name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Department"
              error={!!errors?.sync_id?.message}
              helperText={errors?.sync_id?.message}
            />
          )}
        />

        <CustomTextField
          disabled={data.action === "view"}
          control={control}
          name="division_name"
          label="Division Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.division_name}
          helperText={errors?.division_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={watch("sync_id") === null || watch("division_name") === ""}
            sx={data.action === "view" ? { display: "none" } : null}
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
            {data.action === "view" ? "Close" : "Cancel"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDivision;
