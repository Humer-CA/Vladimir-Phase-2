import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addUserAccount.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, ArrowBackIosNewRounded, ArrowForwardIosRounded } from "@mui/icons-material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import { usePostUserApiMutation, useUpdateUserApiMutation } from "../../../Redux/Query/UserManagement/UserAccountsApi";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { useGetRoleAllApiQuery } from "../../../Redux/Query/UserManagement/RoleManagementApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Department";
import { useGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/SubUnit";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  employee_id: yup.string().required(),
  sedar_employee: yup.object().typeError("Employee ID is a required field").required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  department_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Department"),
  subunit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Subunit"),
  // position: yup.string().required(),
  username: yup.string().required().label("Username"),
  role_id: yup.object().required().label("User permission").typeError("User Permission is a required field"),
});

const AddUserAccount = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postUser,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostUserApiMutation();

  const [
    updateUser,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateUserApiMutation();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();

  const {
    data: departmentData = [],
    isLoading: isDepartmentLoading,
    isSuccess: isDepartmentSuccess,
    isError: isDepartmentError,
  } = useGetDepartmentAllApiQuery();

  const {
    data: subUnitData = [],
    isLoading: isSubUnitLoading,
    isSuccess: isSubUnitSuccess,
    isError: isSubUnitError,
  } = useGetSubUnitAllApiQuery();

  const { data: roleData = [], isLoading: isRoleLoading, isError: isRoleError } = useGetRoleAllApiQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    register,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      sedar_employee: null,
      employee_id: null || "",
      firstname: "",
      lastname: "",
      department_id: null,
      subunit_id: null,
      // position: "",
      username: "",
      role_id: null,
    },
  });

  useEffect(() => {
    const errorData = (isPostError || isUpdateError) && (postError?.status === 422 || updateError?.status === 422);

    if (errorData) {
      const errors = (postError?.data || updateError?.data)?.errors || {};

      Object.entries(errors).forEach(([name, [message]]) => setError(name, { type: "validate", message }));
    }
    const showToast = () => {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    };

    errorData && showToast();
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
      setValue("employee_id", data.employee_id);
      setValue("sedar_employee", {
        general_info: {
          full_id_number: data.employee_id,
        },
      });
      setValue("firstname", data.firstname);
      setValue("lastname", data.lastname);
      setValue("department_id", data.department);
      setValue("subunit_id", data.subunit);
      // setValue("position", data.position);
      setValue("username", data.username);
      setValue("role_id", data.role);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      role_id: formData.role_id?.id,
      password: formData.username,
    };

    if (data.status) {
      return updateUser(newFormData);
    }
    postUser(newFormData);
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
    <Box className="add-userAccount">
      <Box className="add-userAccount__title">
        <IconButton onClick={handleCloseDrawer}>
          <ArrowForwardIosRounded color="secondary" />
        </IconButton>

        <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
          {data.status ? "EDIT USER" : "ADD USER"}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-userAccount__wrapper">
        <Box className="add-userAccount__employee">
          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
            EMPLOYEE DETAILS
          </Typography>

          {data.status ? (
            <CustomTextField
              control={control}
              name="employee_id"
              label="Employee ID"
              type="text"
              color="secondary"
              size="small"
              fullWidth
              disabled
            />
          ) : (
            <CustomAutoComplete
              name="sedar_employee"
              control={control}
              size="small"
              disabled={!!data.status}
              required
              includeInputInList
              disablePortal
              fullWidth
              filterOptions={filterOptions}
              options={sedarData}
              loading={isSedarLoading}
              getOptionLabel={(option) => option?.general_info?.full_id_number_full_name}
              isOptionEqualToValue={(option, value) =>
                option?.general_info?.full_id_number === value?.general_info?.full_id_number
              }
              onChange={(_, value) => {
                if (value) {
                  setValue("employee_id", value?.general_info?.full_id_number);
                  setValue("firstname", value?.general_info?.first_name);
                  setValue("lastname", value?.general_info?.last_name);
                  // setValue("department_id", value.unit_info.department_id);
                  // setValue("subunit_id", value.unit_info.subunit_id);
                  // setValue("position", value.position_info.position_name);
                  setValue(
                    "username",
                    value?.general_info?.first_name
                      .split(" ")
                      ?.map((name) => {
                        return name.charAt(0);
                      })
                      .toString()
                      .replace(",", "")
                      .toLowerCase() + value?.general_info?.last_name.toLowerCase().replace(/ /gm, "")
                  );
                } else {
                  setValue("employee_id", null);
                  setValue("firstname", "");
                  setValue("lastname", "");
                  // setValue("department_id", "");
                  // setValue("subunit_id", "");
                  setValue("username", "");
                }

                return value;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee ID"
                  color="secondary"
                  error={!!errors?.sedar_employee?.message || !!errors?.employee_id?.message}
                  helperText={errors?.sedar_employee?.message || errors?.employee_id?.message}
                />
              )}
            />
          )}

          <CustomTextField
            control={control}
            name="firstname"
            label="Firstname"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <CustomTextField
            control={control}
            name="lastname"
            label="Last Name"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <Divider sx={{ py: 0.5 }} />

          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
            CHARGING
          </Typography>

          <CustomAutoComplete
            autoComplete
            name="department_id"
            control={control}
            options={departmentData}
            loading={isDepartmentLoading}
            size="small"
            getOptionLabel={(option) => option.department_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Department"
                error={!!errors?.department_id?.message}
                helperText={errors?.department_id?.message}
              />
            )}
            onChange={(_, value) => {
              setValue("subunit_id", null);
              return value;
            }}
            disablePortal
            fullWidth
          />

          <CustomAutoComplete
            autoComplete
            name="subunit_id"
            control={control}
            options={subUnitData?.filter((item) => item?.department?.id === watch("department_id")?.id)}
            loading={isSubUnitLoading}
            size="small"
            getOptionLabel={(option) => option.subunit_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Subunit"
                error={!!errors?.subunit_id}
                helperText={errors?.subunit_id?.message}
              />
            )}
          />

          <Divider sx={{ py: 0.5 }} />

          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
            USERNAME AND PERMISSION
          </Typography>
          <CustomTextField
            control={control}
            name="username"
            label="Username"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.username?.message}
            helperText={errors?.username?.message}
            fullWidth
            disabled={data.status}
          />
          <CustomAutoComplete
            autoComplete
            name="role_id"
            control={control}
            options={roleData}
            loading={isRoleLoading}
            size="small"
            getOptionLabel={(option) => option.role_name}
            isOptionEqualToValue={(option, value) => option.role_name === value.role_name}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="User Permission"
                error={!!errors?.role_id?.message}
                helperText={errors?.role_id?.message}
              />
            )}
            disablePortal
            fullWidth
          />
          {/* <Box>
            <FormControl
              fullWidth
              component="fieldset"
              sx={{
                border: "1px solid #a6a6a6 ",
                borderRadius: "10px",
                py: "12px",
                px: "10px",
                gap: "10px",
              }}
            >
              <FormLabel component="legend" sx={{ px: "5px" }}>
                List of Approvers
              </FormLabel>

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <CustomAutoComplete
                  autoComplete
                  name="approver"
                  control={control}
                  options={["Approver", "Requestor"]}
                  loading={isRoleLoading}
                  size="small"
                  // getOptionLabel={(option) => option.role_name}
                  // isOptionEqualToValue={(option, value) =>
                  //   option.role_name === value.role_name
                  // }
                  renderInput={(params) => (
                    <TextField
                      color="secondary"
                      {...params}
                      label="Head Approver"
                      error={!!errors?.role_id?.message}
                      helperText={errors?.role_id?.message}
                    />
                  )}
                  fullWidth
                />

                <IconButton size="small" color="primary" sx={{ ml: "5px" }}>
                  <Add />
                </IconButton>
              </Box>
            </FormControl>
          </Box> */}
          <Divider sx={{ pb: 0.5 }} />
          <Box className="add-userAccount__buttons">
            <LoadingButton type="submit" variant="contained" size="small" loading={isUpdateLoading || isPostLoading}>
              {data.status ? "Update" : "Create"}
            </LoadingButton>

            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleCloseDrawer}
              disabled={(isPostLoading || isUpdateLoading) === true}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddUserAccount;
