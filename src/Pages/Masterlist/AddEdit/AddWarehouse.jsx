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
import { usePostWarehouseApiMutation, useUpdateWarehouseApiMutation } from "../../../Redux/Query/Masterlist/Warehouse";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { departmentApi } from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),
  sync_id: yup.array().required().label("Department").typeError("Department is required"),
  warehouse_name: yup.string().required().label("Warehouse Name"),
});

const AddWarehouse = (props) => {
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
      warehouse_name: "",
    },
  });

  const [
    postWarehouse,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostWarehouseApiMutation();

  const [
    updateWarehouse,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateWarehouseApiMutation();

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
      setValue("warehouse_name", data.warehouse_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateWarehouse(formData);
      return;
    }
    postWarehouse(formData);
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
        {data.action === "view" ? "View Warehouses" : data.status ? "Edit Warehouse" : "Add Warehouse"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content">
        <CustomTextField
          disabled={data.action === "view"}
          control={control}
          name="warehouse_name"
          label="Warehouse Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.warehouse_name}
          helperText={errors?.warehouse_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={watch("sync_id") === null || watch("warehouse_name") === ""}
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

export default AddWarehouse;
