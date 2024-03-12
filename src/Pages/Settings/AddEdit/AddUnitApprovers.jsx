import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import { ReactSortable } from "react-sortablejs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
  IconButton,
  Avatar,
  Autocomplete,
  Tooltip,
  Zoom,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import { useGetApproverSettingsAllApiQuery } from "../../../Redux/Query/Settings/ApproverSettings";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import { Add, Close, DragIndicator } from "@mui/icons-material";
import {
  useArrangeUnitApproversApiMutation,
  usePostUnitApproversApiMutation,
} from "../../../Redux/Query/Settings/UnitApprovers";
// import { useGetUserAccountAllApiQuery } from "../../../Redux/Query/UserManagement/UserAccountsApi";
import { useGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/SubUnit";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Department";

const schema = yup.object().shape({
  id: yup.string(),

  department_id: yup.object().required().typeError("Sub Unit is required").label("Department"),
  subunit_id: yup.object().required().typeError("Sub Unit is required").label("Sub Unit"),

  approver_id: yup.array().required().label("Approver"),
});

const AddUnitApprovers = (props) => {
  const { data, onUpdateResetHandler } = props;
  const [selectedApprovers, setSelectedApprovers] = useState(null);
  const dispatch = useDispatch();

  const [
    postUnitApprovers,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostUnitApproversApiMutation();

  const [
    updateApproverSettings,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useArrangeUnitApproversApiMutation();

  // const {
  //   data: userAccount = [],
  //   isLoading: isUserAccountLoading,
  //   isSuccess: isUserAccountSuccess,
  //   isError: isUserAccountError,
  // } = useGetUserAccountAllApiQuery();

  const {
    data: departmentData = [],
    isLoading: isDepartmentLoading,
    isSuccess: isDepartmentSuccess,
    isError: isDepartmentError,
    refetch: isDepartmentRefetch,
  } = useGetDepartmentAllApiQuery();

  const {
    data: subUnitData = [],
    isLoading: isSubUnitLoading,
    isSuccess: isSubUnitSuccess,
    isError: isSubUnitError,
  } = useGetSubUnitAllApiQuery();

  const {
    data: approverData = [],
    isLoading: isApproverLoading,
    isSuccess: isApproverSuccess,
    isError: isApproverError,
  } = useGetApproverSettingsAllApiQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      department_id: null,
      subunit_id: null,
      approver_id: [],
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
      setValue("department_id", data.department);
      setValue("subunit_id", data.subunit);
      setValue(
        "approver_id",
        data.approvers?.map((item) => {
          return {
            id: item.approver_id,
            approver: {
              id: item.approver_id,
              employee_id: item.employee_id,
              firstname: item.first_name,
              lastname: item.last_name,
            },
          };
        })
      );
    }
  }, [data]);

  const addApproverHandler = () => {
    setValue("approver_id", [...watch("approver_id"), selectedApprovers]);
    setSelectedApprovers(null);
  };

  const deleteApproverHandler = (id) => {
    const filteredApprovers = watch("approver_id").filter((item) => item?.id !== id);
    setValue("approver_id", filteredApprovers);
  };

  const setListApprovers = (list) => {
    setValue("approver_id", list);
  };

  const onSubmitHandler = (formData) => {
    const newFormData = {
      subunit_id: formData.subunit_id?.id,
      approver_id: formData.approver_id?.map((item) => item?.id),
    };

    if (data.status) {
      updateApproverSettings(newFormData);
      return;
    }

    postUnitApprovers(newFormData);
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
    <Box className="add-masterlist" width="550px">
      <Typography
        color="secondary.main"
        sx={{
          fontFamily: "Anton",
          fontSize: "1.5rem",
          alignSelf: "center",
        }}
      >
        {data.action === "view" ? "View Approvers" : data.action === "update" ? "Update Approvers" : "Assign Approvers"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="add-masterlist__content" gap={1.5}>
        <Divider />

        {/* <CustomAutoComplete
          name="subunit_id"
          control={control}
          size="small"
          required
          fullWidth
          disabled={data.action === "view" || data.action === "update"}
          // includeInputInList
          filterOptions={filterOptions}
          options={subUnitData}
          loading={isSubUnitLoading}
          getOptionLabel={(option) =>
            `(${option.subunit_code}) - ${option.subunit_name}`
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sub Unit"
              color="secondary"
              error={!!errors?.subunit_id?.message}
              helperText={errors?.subunit_id?.message}
            />
          )}
          onChange={(_, value) => {
            setSelectedApprovers(null);
            setValue("approvers_id", []);
            return value;
          }}
        /> */}

        <CustomAutoComplete
          autoComplete
          name="department_id"
          control={control}
          options={departmentData}
          loading={isDepartmentLoading}
          size="small"
          disabled={data.status}
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
          fullWidth
          onChange={(_, value) => {
            setValue("subunit_id", null);
            return value;
          }}
        />

        <CustomAutoComplete
          autoComplete
          name="subunit_id"
          control={control}
          options={subUnitData?.filter((item) => item?.department?.id === watch("department_id")?.id)}
          loading={isSubUnitLoading}
          size="small"
          disabled={data.status}
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

        <Stack
          sx={{
            outline: "1px solid lightgray",
            borderRadius: "12px",
            p: 2,
          }}
        >
          <Stack flexDirection="row" gap={2} width="100%" alignItems="flex-start">
            <Autocomplete
              value={selectedApprovers}
              loading={isApproverLoading}
              disabled={data.action === "view"}
              size="small"
              fullWidth
              filterOptions={filterOptions}
              getOptionDisabled={(option) => {
                return (
                  option?.approver?.employee_id === watch("subunit_id")?.employee_id ||
                  watch("approver_id").some((data) => data?.id === option.id)
                );
              }}
              options={
                approverData
                //   approverData?.filter(
                //   (item) => item?.subunit?.id === watch("subunit_id")?.id
                // )
              }
              getOptionLabel={(option) =>
                `(${option?.approver?.employee_id}) - ${option?.approver?.firstname} ${option?.approver?.lastname}`
              }
              isOptionEqualToValue={(option, value) => {
                return option?.id === value?.id;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Approver"
                  color="secondary"
                  error={!!errors?.approver_id?.message}
                  helperText={errors?.approver_id?.message}
                />
              )}
              onChange={(_, value) => {
                // console.log(selectedApprovers);
                setSelectedApprovers(() => value);
              }}
            />

            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                addApproverHandler();
              }}
              disabled={selectedApprovers === null}
              sx={{
                width: "100px",
                gap: 0.5,
                alignSelf: "flex-start",
                justifySelf: "center",
                mt: "5px",
              }}
            >
              <Add
                sx={{
                  fontSize: "18px",
                  color: selectedApprovers === null ? "gray" : "primary.main",
                }}
              />
              <Typography sx={{ textTransform: "capitalized" }}>Add</Typography>
            </Button>
          </Stack>

          <Stack>
            <Box
              maxHeight="330px"
              overflow="overlay"
              pr="3px"
              mr="-3px"
              sx={{ cursor: data.action === "view" ? "" : "pointer" }}
            >
              <ReactSortable
                disabled={data.action === "view"}
                group="groupName"
                animation={200}
                delayOnTouchStart={true}
                delay={2}
                list={watch("approver_id")}
                setList={setListApprovers}
              >
                {watch("approver_id")?.map((approver, index) => (
                  <Stack key={index} flexDirection="row" justifyContent="space-between" alignItems="center" my={1}>
                    <Stack
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      p={1}
                      sx={{
                        backgroundColor: "background.light",
                        width: "100%",
                        borderRadius: "8px",
                      }}
                    >
                      <Stack flexDirection="row" alignItems="center" gap={2.5}>
                        <DragIndicator sx={{ color: "black.light" }} />
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: data.action === "view" ? "gray" : "primary.main",
                            fontSize: "16px",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Stack>
                          <Typography>{`${approver?.approver?.firstname} ${approver?.approver?.lastname}`}</Typography>
                          <Typography fontSize="12px" color="gray" mt="-2px">
                            {approver?.approver?.employee_id}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Tooltip title="Remove" TransitionComponent={Zoom} arrow>
                        <span>
                          <IconButton
                            aria-label="Delete"
                            disabled={data.action === "view"}
                            onClick={() => {
                              deleteApproverHandler(approver?.id);
                            }}
                          >
                            <Close sx={{ fontSize: "18px" }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>
                ))}
              </ReactSortable>
            </Box>
          </Stack>
        </Stack>

        <Divider />

        <Box className="add-masterlist__buttons">
          {data.action === "view" ? (
            ""
          ) : (
            <LoadingButton type="submit" variant="contained" size="small" loading={isPostLoading || isUpdateLoading}>
              {data.status ? "Update" : "Create"}
            </LoadingButton>
          )}

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
            disabled={isPostLoading || isUpdateLoading}
          >
            {data.action === "view" ? "Close" : "Cancel"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddUnitApprovers;
