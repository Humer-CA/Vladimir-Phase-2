import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostMinorCategoryApiMutation,
  useUpdateMinorCategoryApiMutation,
} from "../../../Redux/Query/Masterlist/Category/MinorCategory";
import { useGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Category/MajorCategory";
// import { useGetDivisionAllApiQuery } from "../../../Redux/Query/Masterlist/Division";

import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import { useGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";

const schema = yup.object().shape({
  id: yup.string(),
  // division_id: yup
  //   .string()
  //   .transform((value) => {
  //     return value?.id.toString();
  //   })
  //   .required(),
  major_category_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Major Category"),

  account_title_sync_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Account Title"),

  minor_category_name: yup.string().required(),
  // urgency_level: yup.string().required(),
  // personally_assign: yup.boolean().required(),
  // evaluate_in_every_movement: yup.boolean().required(),
});

const AddMinorCategory = (props) => {
  const { data, onUpdateResetHandler } = props;
  const [filteredMajorCategoryData, setFilteredMajorCategoryData] = useState(
    []
  );
  const dispatch = useDispatch();

  // const {
  //   data: divisionData = [],
  //   isLoading: isDivisionLoading,
  //   isSuccess: isDivisionSuccess,
  //   isError: isDivisionError,
  //   refetch: isDivisionRefetch,
  // } = useGetDivisionAllApiQuery();

  const {
    data: majorCategoryData = [],
    isLoading: isMajorCategoryLoading,
    isError: isMajorCategoryError,
  } = useGetMajorCategoryAllApiQuery();

  const {
    data: accountTitleData = [],
    isLoading: isAccountTitleLoading,
    isSuccess: isAccountTitleSuccess,
    isError: isAccountTitleError,
    refetch: isAccountTitleRefetch,
  } = useGetAccountTitleAllApiQuery();

  const [
    postMinorCategory,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostMinorCategoryApiMutation();

  const [
    updateMinorCategory,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateMinorCategoryApiMutation();

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
      // division_id: null,
      major_category_id: null,
      account_title_sync_id: null,
      minor_category_name: "",
      // urgency_level: null,
      // personally_assign: null,
      // evaluate_in_every_movement: null,
    },
  });

  useEffect(() => {
    if (
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422)
    ) {
      setError("minor_category_name", {
        type: "validate",
        message:
          postError?.data?.errors.minor_category_name ||
          updateError?.data?.errors.minor_category_name,
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
      // setValue("division_id", {
      //   id: data.division_id,
      //   division_name: data.division_name,
      // });
      setValue("major_category_id", data.major_category);
      setValue("account_title_id", data.account_title);
      setValue("minor_category_name", data.minor_category_name);
      // setValue("urgency_level", data.urgency_level);
      // setValue("personally_assign", data.personally_assign);
      // setValue("evaluate_in_every_movement", data.evaluate_in_every_movement);
    }
    console.log(data);
  }, [data]);

  // useEffect(() => {
  //   const division = watch("division_id");
  //   isDivisionRefetch();
  //   if (division?.division_name && isDivisionSuccess) {
  //     const filteredDivisionData = divisionData?.filter((obj) => {
  //       return obj.division_name === division.division_name;
  //     });
  //     // console.log(divisionData);

  //     setFilteredMajorCategoryData(filteredDivisionData[0]?.major_category);
  //     // console.log(filteredDivisionData[0].major_category);

  //     const isIncluded = filteredDivisionData[0]?.major_category.some(
  //       (category) => {
  //         return category.id === data.major_category_id;
  //       }
  //     );

  //     if (!isIncluded) setValue("major_category_id", null);
  //     // console.log(divisionData);
  //   }
  // }, [watch("division_id"), isDivisionSuccess]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateMinorCategory(formData);
      return;
    }
    postMinorCategory(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  console.log(accountTitleData);

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {data.status ? "Edit Minor Category" : "Add Minor Category"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        {/* <CustomAutoComplete
          autoComplete
          name="division_id"
          control={control}
          options={divisionData}
          loading={isDivisionLoading}
          size="small"
          getOptionLabel={(option) => option.division_name}
          isOptionEqualToValue={(option, value) =>
            option.division_name === value.division_name
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Division"
              error={!!errors?.division_id?.message}
              helperText={errors?.division_id?.message}
            />
          )}
        /> */}

        {/* <CustomAutoComplete
          autoComplete
          name="major_category_id"
          control={control}
          options={filteredMajorCategoryData || []}
          loading={isMajorCategoryLoading}
          size="small"
          getOptionLabel={(option) => option.major_category_name}
          isOptionEqualToValue={(option, value) =>
            option.major_category_name === value.major_category_name
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Major Category"
              error={!!errors?.major_category_id?.message}
              helperText={errors?.major_category_id?.message}
            />
          )}
        /> */}

        <CustomAutoComplete
          autoComplete
          disabled={data.status}
          name="major_category_id"
          control={control}
          options={majorCategoryData}
          loading={isMajorCategoryLoading}
          size="small"
          getOptionLabel={(option) => option.major_category_name}
          isOptionEqualToValue={(option, value) =>
            option.major_category_name === value.major_category_name
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Major Category"
              error={!!errors?.major_category_id?.message}
              helperText={errors?.major_category_id?.message}
            />
          )}
        />

        <CustomAutoComplete
          autoComplete
          name="account_title_sync_id"
          control={control}
          options={accountTitleData}
          loading={isAccountTitleLoading}
          size="small"
          getOptionLabel={(option) =>
            option.account_title_code + " - " + option.account_title_name
          }
          isOptionEqualToValue={(option, value) =>
            option.account_title_code === value.account_title_code
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Account Title  "
              error={!!errors?.account_title_sync_id}
              helperText={errors?.account_title_sync_id?.message}
            />
          )}
        />

        <CustomTextField
          autoComplete="off"
          control={control}
          name="minor_category_name"
          label="Minor Category"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.minor_category_name?.message}
          helperText={errors?.minor_category_name?.message}
          fullWidth
        />

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              watch("minor_category_name") === "" ||
              watch("major_category_id") === "" ||
              watch("account_title_sync_id") === null
              // watch("division_id") === "" ||
              // watch("division_id") === null
            }
          >
            {data.status ? "Update" : "Create"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMinorCategory;
