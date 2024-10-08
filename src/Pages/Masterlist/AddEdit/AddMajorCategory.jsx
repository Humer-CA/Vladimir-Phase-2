import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
// import {
//   usePostMajorCategoryApiMutation,
//   useUpdateMajorCategoryApiMutation,
// } from "../../../Redux/Query/Masterlist/Category/MajorCategory";

// import { useGetDivisionAllApiQuery } from "../../../Redux/Query/Masterlist/Division";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import {
  usePostMajorCategoryApiMutation,
  useUpdateMajorCategoryApiMutation,
} from "../../../Redux/Query/Masterlist/Category/MajorCategory";

const schema = yup.object().shape({
  id: yup.string(),
  major_category_name: yup.string().required().typeError("Major Category Name is required"),
  est_useful_life: yup.number().required(),
});

const AddMajorCategory = (props) => {
  const { data, onUpdateResetHandler } = props;

  const dispatch = useDispatch();

  const [
    postMajorCategory,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostMajorCategoryApiMutation();

  const [
    updateMajorCategory,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateMajorCategoryApiMutation();

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
      major_category_name: "",
      est_useful_life: null,
    },
  });

  useEffect(() => {
    if ((isPostError || isUpdateError) && (postError?.status === 422 || updateError?.status === 422)) {
      setError("major_category_name", {
        type: "validate",
        message: postError?.data?.errors.major_category_name || updateError?.data?.errors.major_category_name,
      });
    } else if ((isPostError && postError?.status !== 422) || (isUpdateError && updateError?.status !== 422)) {
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
      setValue("major_category_name", data.major_category_name);
      setValue("est_useful_life", data.est_useful_life);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateMajorCategory(formData);
      return;
    }
    postMajorCategory(formData);
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
        {data.status ? "Edit Major Category" : "Add Major Category"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content">
        <CustomTextField
          control={control}
          name="major_category_name"
          label="Major Category Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.major_category_name}
          helperText={errors?.major_category_name?.message}
          fullWidth
        />

        <CustomNumberField
          control={control}
          name="est_useful_life"
          color="secondary"
          label="Estimated Useful Life"
          error={!!errors?.est_useful_life}
          helperText={errors?.est_useful_life?.message}
          isAllowed={(values) => {
            const { floatValue } = values;
            return floatValue >= 0.1 && floatValue <= 100;
          }}
          // onChange={(e) => {
          //   const inputValue = e.target.value;
          //   if (inputValue === 0) {
          //     setValue("est_useful_life", inputValue);
          //   } else {
          //     setValue("est_useful_life", null);
          //   }
          // }}
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

export default AddMajorCategory;
