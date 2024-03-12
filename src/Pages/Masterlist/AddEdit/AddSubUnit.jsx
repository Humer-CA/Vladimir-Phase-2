import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, TextField, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostSubUnitApiMutation,
  useUpdateSubUnitApiMutation,
} from "../../../Redux/Query/Masterlist/SubUnit";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Department";

const schema = yup.object().shape({
  id: yup.string(),

  department_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Department"),

  subunit_name: yup.string().required().label("Sub Unit"),
});

const AddSubUnit = (props) => {
  const { data, onUpdateResetHandler, tagged } = props;
  const dispatch = useDispatch();

  const [
    postSubUnit,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostSubUnitApiMutation();

  const {
    data: departmentData = [],
    isLoading: isDepartmentLoading,
    isSuccess: isDepartmentSuccess,
    isError: isDepartmentError,
    refetch: isDepartmentRefetch,
  } = useGetDepartmentAllApiQuery();

  const [
    updateSubUnit,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateSubUnitApiMutation();

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
      department_id: null,
      subunit_name: "",
    },
  });

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
    if (isPostError && postError?.status === 422) {
      dispatch(
        openToast({
          message: postError?.data?.errors?.subunit_name,
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
    if (data.status) {
      setValue("id", data.id);
      setValue("department_id", data.department);
      setValue("subunit_name", data.subunit_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateSubUnit(formData);
      return;
    }
    postSubUnit(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  console.log(data);
  // console.log(errors);

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {data.status ? "Edit Sub Unit" : "Add Sub Unit"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomAutoComplete
          disabled={data.tagged === true}
          autoComplete
          name="department_id"
          control={control}
          options={departmentData}
          loading={isDepartmentLoading}
          size="small"
          getOptionLabel={(option) =>
            option.department_code + " - " + option.department_name
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Department"
              error={!!errors?.department_id}
              helperText={errors?.department_id?.message}
            />
          )}
        />

        <CustomTextField
          disabled={data.tagged === true}
          control={control}
          name="subunit_name"
          label="Sub Unit"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.subunit_name}
          helperText={errors?.subunit_name?.message}
          fullWidth
        />

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              watch("department_id") === null ||
              watch("department_id") === "" ||
              watch("subunit_name") === null ||
              watch("subunit_name") === ""
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

export default AddSubUnit;
