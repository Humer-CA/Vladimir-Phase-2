import React, { useEffect, useState } from "react";
import "../../../Style/User Management/AddRole.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

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
  FormGroup,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostRoleApiMutation,
  useUpdateRoleApiMutation,
} from "../../../Redux/Query/UserManagement/RoleManagementApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string(),
  role_name: yup.string().required(),
  access_permission: yup.array().required(),
});

const AddRole = (props) => {
  const { data, onUpdateResetHandler } = props;

  const [masterlistChecked, setMasterlistChecked] = useState(false);

  const dispatch = useDispatch();

  const [
    postRole,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostRoleApiMutation();

  const [
    updateRole,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateRoleApiMutation();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role_name: "",
      access_permission: [],
    },
  });
  console.log(watch("access_permission"));

  useEffect(() => {
    if ((isPostError || isUpdateError) && (postError?.status === 422 || updateError?.status === 422)) {
      setError("role_name", {
        type: "validate",
        message: postError?.data?.errors.role_name || updateError?.data?.errors.role_name,
      });
      dispatch(
        openToast({
          message: postError?.data?.errors?.access_permission[0] || updateError?.data?.errors?.access_permission[0],
          duration: 5000,
          variant: "error",
        })
      );
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
      setValue("role_name", data.role_name);
      setValue("access_permission", data.access_permission);
    }
  }, [data]);

  // useEffect(() => {
  //   if (!getValues("access_permission")?.includes("masterlist")) {
  //     // const includeMasterlist = watch("access_permission").some((perm) =>
  //     //   masterlistValue.includes(perm)
  //     // );
  //     // if (includeMasterlist) {
  //     //   setValue("access_permission", [
  //     //     ...watch("access_permission"),
  //     //     "masterlist",
  //     //   ]);d
  //     // }
  //     console.log("aaaaaaaaaaaaaa");
  //   }
  // }, [getValues("access_permission")]);

  // useEffect(() => {
  //   const isMasterlistChecked =
  //     watch("access_permission").includes("masterlist");
  //   if (!isMasterlistChecked && watch("access_permission").length) {
  //     const masterlistEmptyValue = watch("access_permission").filter(
  //       (perm) => !masterlistValue.includes(perm)
  //     );

  //     setValue("access_permission", masterlistEmptyValue);
  //   }
  //   console.log("askjdhajskhdjsa");
  // }, [watch("access_permission")]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateRole(formData);
      return;
    }
    postRole(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  const CheckboxItem = ({ label, value }) => (
    <FormControlLabel
      disabled={data.action === "view"}
      label={label}
      value={value}
      control={<Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes(value)} />}
    />
  );

  const CheckboxGroup = ({ items, ml = 3 }) => (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {items?.map((item) => (
        <CheckboxItem key={item.value} {...item} />
      ))}
    </Box>
  );

  // const Children = () => {
  //   return (
  //     <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
  //       <Box
  //         sx={{
  //           display: "flex",
  //           flexDirection: "column",
  //           ml: 3,
  //         }}
  //       >
  //         <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
  //           <CheckboxItem label="Dashboard" value="dashboard" />
  //           <CheckboxItem label="Masterlist" value="masterlist" />
  //           <CheckboxItem label="User Management" value="user-management" />
  //           <CheckboxItem label="Fixed Assets" value="fixed-assets" />
  //           <CheckboxItem label="Printing of Tag" value="print-fa" />
  //           <CheckboxItem label="Settings" value="settings" />
  //           <CheckboxItem label="Request" value="request" />
  //         </Box>
  //       </Box>

  //       <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="Asset for Tagging"
  //           value="asset-for-tagging"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes(
  //                 "asset-for-tagging"
  //               )}
  //             />
  //           }
  //         />

  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="Asset List"
  //           value="asset-list"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes("asset-list")}
  //             />
  //           }
  //         />

  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="On Hand"
  //           value="on-hand"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes("on-hand")}
  //             />
  //           }
  //         />

  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="Disposal"
  //           value="disposal"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes("disposal")}
  //             />
  //           }
  //         />

  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="Reports"
  //           value="reports"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes("reports")}
  //             />
  //           }
  //         />
  //       </Box>
  //     </Box>
  //   );
  // };

  const Children = () => {
    const firstGroup = [
      { label: "Dashboard", value: "dashboard" },
      { label: "Masterlist", value: "masterlist" },
      { label: "User Management", value: "user-management" },
      { label: "Fixed Assets", value: "fixed-assets" },
      { label: "Printing of Tag", value: "print-fa" },
      { label: "Settings", value: "settings" },
      { label: "Request Monitoring", value: "request-monitoring" },
    ];

    const secondGroup = [
      { label: "Asset Requisition", value: "asset-requisition" },
      { label: "Asset Movement", value: "asset-movement" },
      { label: "Approving", value: "approving" },
      { label: "Asset for Tagging", value: "asset-for-tagging" },
      { label: "Asset List", value: "asset-list" },
      { label: "On Hand", value: "on-hand" },
      { label: "Reports", value: "reports" },
    ];

    return (
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <CheckboxGroup items={firstGroup} ml={3} />
        <CheckboxGroup items={secondGroup} ml={3} />
      </Box>
    );
  };

  const Masterlist = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Company"
            value="company"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("company")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Business Unit"
            value="business-unit"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("business-unit")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Department"
            value="department"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("department")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Unit"
            value="unit"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("unit")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Location"
            value="location"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("location")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Account Title"
            value="account-title"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("account-title")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Sub Unit"
            value="sub-unit"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("sub-unit")} />
            }
          />
        </FormGroup>

        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Supplier"
            value="supplier"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("supplier")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Division"
            value="division"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("division")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Type of Request"
            value="type-of-request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("type-of-request")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Capex"
            value="capex"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("capex")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Category"
            value="category"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("category")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Status Category"
            value="status-category"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("status-category")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const UserManagement = () => {
    const userManagerment1 = [
      { label: "User Accounts", value: "user-accounts" },
      { label: "Role Management", value: "role-management" },
    ];

    const userManagerment2 = [
      { label: "User (Requestor)", value: "user-requestor" },
      { label: "User (Approver)", value: "user-approver" },
    ];

    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <CheckboxGroup items={userManagerment1} ml={3} />
        <CheckboxGroup items={userManagerment2} ml={3} />
        {/* <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="User Accounts"
            value="user-accounts"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("user-accounts")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Role Management"
            value="role-management"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "role-management"
                )}
              />
            }
          />
        </FormGroup> */}
      </Stack>
    );
  };

  const Settings = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Approver Settings"
            value="approver-settings"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("approver-settings")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Form Settings"
            value="form-settings"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("form-settings")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const AssetRequisition = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Requisition"
            value="requisition"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("requisition")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Purchase Request"
            value="purchase-request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("purchase-request")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Receiving"
            value="requisition-receiving"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("requisition-receiving")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Releasing"
            value="requisition-releasing"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("requisition-releasing")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const AssetMovement = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Transfer"
            value="transfer"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("transfer")} />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Pull Out"
            value="pull-out"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("pull-out")} />
            }
          />
        </FormGroup>

        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Evaluation"
            value="evaluation"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("evaluation")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Disposal"
            value="disposal"
            control={
              <Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes("disposal")} />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  // const Approving = () => {
  //   return (
  //     <Stack flexDirection="row" flexWrap="wrap">
  //       <FormGroup
  //         sx={{
  //           display: "flex",
  //           flexDirection: "column",
  //           ml: 3,
  //         }}
  //       >
  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="Pending Request"
  //           value="pending-request"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes("pending-request")}
  //             />
  //           }
  //         />

  //         <FormControlLabel
  //           disabled={data.action === "view"}
  //           label="Approved Request"
  //           value="approved=request"
  //           control={
  //             <Checkbox
  //               {...register("access_permission")}
  //               checked={watch("access_permission")?.includes("approved=request")}
  //             />
  //           }
  //         />
  //       </FormGroup>
  //     </Stack>
  //   );
  // };

  const permissions = [
    // List of permissions
    "dashboard",
    "masterlist",
    "user-management",
    "fixed-assets",
    "print-fa",
    "settings",
    "asset-requisition",
    "asset-movement",
    "approving",
    "monitoring",
    "asset-for-tagging",
    "asset-list",
    "on-hand",
    "disposal",
    "reports",

    // COA
    "company",
    "business-unit",
    "department",
    "unit",
    "subunit",
    "location",
    "account-title",

    "division",
    "type-of-request",
    "capex",
    "category",
    "status-category",

    // UserManagement
    "user-accounts",
    "role-management",
    "user-requestor",
    "user-approver",

    // Settings
    "approver-settings",
    "form-settings",

    // Asset Requisition
    "requisition",
    "purchase-request",
    "requisition-receiving",

    //Asset Movement
    "transfer",
    "pull-out",
    "disposal",

    // Approving
    "pending-request",
    "approved-request",

    // Monitoring
    "request-monitoring",
  ];

  const masterlistValue = [
    "company",
    "business-unit",
    "department",
    "unit",
    "location",
    "account-title",
    "division",
    "type-of-request",
    "capex",
    "category",
    "status-category",
  ];
  const userManagement = ["user-accounts", "role-management"];
  const settings = ["approver-settings", "form-settings"];
  const assetRequisition = ["requisition", "purchase-request", "requisition-receiving"];
  const assetMovement = ["transfer", "evaluation", "pull-out", "disposal"];

  // console.log(watch("access_permission"));

  return (
    <Box className="add-role">
      <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
        {!data.status ? "Add Role" : data.action === "view" ? "Permissions" : "Edit Role"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ mx: "10px" }}>
        <CustomTextField
          className="add-role__textfield"
          required
          control={control}
          inputProps={{ readOnly: data.action === "view" }}
          name="role_name"
          label="Role Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.role_name?.message}
          helperText={errors?.role_name?.message}
          fullWidth
        />

        <Box className="add-role__container">
          <Stack>
            <FormControl
              fullWidth
              component="fieldset"
              className="add-role__wrapper"
              sx={{
                border: "1px solid #a6a6a6",
                borderRadius: "10px",
                px: "10px",
              }}
            >
              <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                <FormControlLabel
                  sx={{ color: "text.main", fontWeight: "bold" }}
                  label={!data.status ? "Select Role" : data.action === "view" ? "Selected Role" : "Select Roles"}
                  value="parent"
                  disabled={data.action === "view"}
                  control={
                    <Checkbox
                      checked={watch("access_permission")?.length ? true : false}
                      indeterminate={
                        watch("access_permission")?.length === 16
                          ? false
                          : watch("access_permission")?.length >= 1 && watch("access_permission")?.length < 15
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("access_permission", permissions);
                        } else {
                          setValue("access_permission", []);
                        }
                      }}
                    />
                  }
                />
              </FormLabel>

              <Children />

              {watch("access_permission").includes("masterlist") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Masterlist"
                        value="masterlist"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes("masterlist")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              masterlistValue.some((perm) => watch("access_permission").includes(perm)) &&
                              !masterlistValue.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "masterlist",
                                    "company",
                                    "business-unit",
                                    "department",
                                    "unit",
                                    "subunit",
                                    "location",
                                    "account-title",
                                    "supplier",
                                    "sub-unit",
                                    "division",
                                    "type-of-request",
                                    "capex",
                                    "category",
                                    "status-category",
                                  ]),
                                ]);
                              } else {
                                const masterlistEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...masterlistValue, "masterlist"].includes(perm)
                                );

                                setValue("access_permission", masterlistEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Masterlist />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("user-management") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="User Management"
                        value="user-management"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes("user-management")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              userManagement.some((perm) => watch("access_permission").includes(perm)) &&
                              !userManagement.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([...watch("access_permission"), "user-accounts", "role-management"]),
                                ]);
                              } else {
                                const userEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...userManagement, "user-management"].includes(perm)
                                );

                                setValue("access_permission", userEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <UserManagement />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("settings") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Settings"
                        value="settings"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes("settings")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              settings.some((perm) => watch("access_permission").includes(perm)) &&
                              !settings.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([...watch("access_permission"), "approver-settings", "form-settings"]),
                                ]);
                              } else {
                                const settingsEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...settings, "settings"].includes(perm)
                                );

                                setValue("access_permission", settingsEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Settings />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("asset-requisition") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Asset Requisition"
                        value="asset-requisition"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes("asset-requisition")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              assetRequisition.some((perm) => watch("access_permission").includes(perm)) &&
                              !assetRequisition.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "requisition",
                                    "purchase-request",
                                    "purchase-order",
                                  ]),
                                ]);
                              } else {
                                const assetRequisitionEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...assetRequisition, "asset-requisition"].includes(perm)
                                );

                                setValue("access_permission", assetRequisitionEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <AssetRequisition />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("asset-movement") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Asset Movement"
                        value="asset-movement"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes("asset-movement")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              assetMovement.some((perm) => watch("access_permission").includes(perm)) &&
                              !assetMovement.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "transfer",
                                    "evaluation",
                                    "pull-out",
                                    "disposal",
                                  ]),
                                ]);
                              } else {
                                const assetMovementEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...assetMovement, "asset-movement"].includes(perm)
                                );

                                setValue("access_permission", assetMovementEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <AssetMovement />
                  </FormControl>
                </Box>
              )}

              {/* 
              {watch("access_permission").includes("approving") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Approving"
                        value="approving"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes(
                              "approving"
                            )}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              approving.some((perm) =>
                                watch("access_permission").includes(perm)
                              ) &&
                              !approving.every((perm) =>
                                watch("access_permission").includes(perm)
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "pending-request",
                                    "approved-request",
                                  ]),
                                ]);
                              } else {
                                const approvingEmptyValue = watch(
                                  "access_permission"
                                ).filter(
                                  (perm) =>
                                    ![...approving, "approving"].includes(perm)
                                );

                                setValue(
                                  "access_permission",
                                  approvingEmptyValue
                                );
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Approving />
                  </FormControl>
                </Box>
              )} */}
            </FormControl>
          </Stack>
        </Box>

        <Divider sx={{ pb: "15px" }} />

        <Stack flexDirection="row" justifyContent="flex-end" gap="20px" sx={{ pt: "15px" }}>
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              // (errors?.role_name ? true : false) ||
              watch("role_name") === undefined ||
              watch("role_name") === "" ||
              watch("access_permission")?.length === 0 ||
              data.action === "view"
            }
            sx={data.action === "view" ? { display: "none" } : null}
          >
            {!data.status ? "Create" : "Update"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
            disabled={(isPostLoading || isUpdateLoading) === true}
          >
            {!data.status ? "Cancel" : data.action === "view" ? "Close" : "Cancel"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddRole;
