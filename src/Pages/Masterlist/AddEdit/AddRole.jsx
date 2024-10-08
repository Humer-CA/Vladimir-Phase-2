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
import { AddBox } from "@mui/icons-material";

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

  const permissions = [
    // List of permissions
    "dashboard",
    "masterlist",
    "user-management",
    "fixed-asset",
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

    // Masterlist
    "company",
    "business-unit",
    "department",
    "unit",
    "sub-unit",
    "location",
    "account-title",
    "supplier",
    "unit-of-measurement",

    "division",
    "type-of-request",
    "capex",
    "warehouse",
    "category",
    "status-category",
    "small-tools",

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
    "requisition-received-asset",
    "requisition-rr-summary",
    "requisition-releasing",

    //Asset Movement
    "transfer",
    "pull-out",
    "disposal",

    // Approving
    "pending-request",
    "approved-request",
    "approving-request",
    "approving-transfer",
    "approving-pull-out",
    "approving-disposal",

    // Monitoring
    "request-monitoring",

    // Reports
    "reports",
    "pr-report",
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
    "warehouse",
    "category",
    "status-category",
  ];
  const userManagement = ["user-accounts", "role-management"];
  const settings = ["approver-settings", "form-settings"];
  const assetRequisition = ["requisition", "purchase-request", "requisition-received-asset", "requisition-releasing"];
  const assetMovement = ["transfer", "evaluation", "pull-out", "disposal"];
  const approving = ["approving-request", "approving-transfer", "approving-pull-out", "approving-disposal"];
  const reports = ["pr-report"];

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

  // const MainRoles = ({ label, value }) => {
  //   const convertToCamelCase = (inputString) => {
  //     return inputString
  //       .split(" ")
  //       .map((word, index) =>
  //         index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  //       )
  //       .join("");
  //   };

  //   const newValue = convertToCamelCase(label);

  //   return (
  //     <FormControlLabel
  //       label={label} // "User Management"
  //       value={value} // "user-management"
  //       sx={{ color: "text.main", fontWeight: "bold" }}
  //       disabled={data.action === "view"}
  //       control={
  //         <Checkbox
  //           checked={watch("access_permission").includes(value)}
  //           indeterminate={
  //             watch("access_permission").some((perm) => perm === newValue) &&
  //             !watch("access_permission").every((perm) => perm === newValue)
  //           }
  //           onChange={(e) => {
  //             if (e.target.checked) {
  //               setValue("access_permission", [...new Set([...watch("access_permission"), newValue])]);
  //             } else {
  //               const emptyValue = watch("access_permission").filter((perm) => ![newValue, value].includes(perm));

  //               setValue("access_permission", emptyValue);
  //             }
  //           }}
  //         />
  //       }
  //     />
  //   );
  // };

  // * Reusable Components ------------------------------------------ //
  const CheckboxItem = ({ label, value }) => (
    <FormControlLabel
      disabled={data.action === "view"}
      label={label}
      value={value}
      control={<Checkbox {...register("access_permission")} checked={watch("access_permission")?.includes(value)} />}
    />
  );

  const CheckboxGroup = ({ items, title }) => (
    <Box sx={{ display: "flex", flexDirection: "column", pb: "10px" }}>
      <Typography fontFamily="Anton, Impact" color="secondary.main" pb="5px">
        {title}
      </Typography>

      {items?.map((item) => (
        <CheckboxItem key={item.value} {...item} />
      ))}
    </Box>
  );

  // * Role Components --------------------------------------------- //
  const Children = () => {
    const Main = [
      { label: "Dashboard", value: "dashboard" },
      { label: "Masterlist", value: "masterlist" },
      { label: "User Management", value: "user-management" },
      { label: "Fixed asset", value: "fixed-asset" },
      { label: "Printing of Tag", value: "print-fa" },
      { label: "Settings", value: "settings" },
      { label: "Request Monitoring", value: "request-monitoring" },
      { label: "sample", value: "sample" },
    ];

    const Setup = [
      { label: "Asset Requisition", value: "asset-requisition" },
      { label: "Asset Movement", value: "asset-movement" },
      { label: "Approving", value: "approving" },
      { label: "Asset for Tagging", value: "asset-for-tagging" },
      { label: "Asset List", value: "asset-list" },
      { label: "On Hand", value: "on-hand" },
      { label: "Reports", value: "reports" },
    ];

    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
        <Box>
          <CheckboxGroup items={Main} />
        </Box>

        <Box>
          <CheckboxGroup items={Setup} />
        </Box>
      </Stack>
    );
  };

  const Masterlist = () => {
    const masterlist1 = [
      { label: "Company", value: "company" },
      { label: "Business Unit", value: "business-unit" },
      { label: "Department", value: "department" },
      { label: "Unit", value: "unit" },
      { label: "Sub Unit", value: "sub-unit" },
      { label: "Location", value: "location" },
      { label: "Account Title", value: "account-title" },
      { label: "Supplier", value: "supplier" },
      { label: "Unit of Measurement", value: "unit-of-measurement" },
      { label: "Small Tools", value: "small-tools" },
    ];

    const masterlist2 = [
      { label: "Division", value: "division" },
      { label: "Type of Request", value: "type-of-request" },
      { label: "Capex", value: "capex" },
      { label: "Warehouse", value: "warehouse" },
      { label: "Category", value: "category" },
      { label: "Status Category", value: "status-category" },
    ];
    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
        <CheckboxGroup title="Synching" items={masterlist1} />
        <CheckboxGroup title="Masterlist" items={masterlist2} />
      </Stack>
    );
  };

  const UserManagement = () => {
    const userManagement1 = [
      { label: "User Accounts", value: "user-accounts" },
      { label: "Role Management", value: "role-management" },
    ];

    return (
      <Stack flexDirection="row" justifyContent="space-evenly" flexWrap="wrap">
        <CheckboxGroup items={userManagement1} />
      </Stack>
    );
  };

  const Settings = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
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
    const assetRequisition1 = [
      { label: "Requisition", value: "requisition" },
      { label: "Received Asset", value: "requisition-received-asset" },
      { label: "RR Summary", value: "requisition-rr-summary" },
      { label: "Releasing", value: "requisition-releasing" },
    ];

    const assetRequisition2 = [
      //   { label: "User (Requestor)", value: "user-requestor" },
      //   { label: "User (Approver)", value: "user-approver" },
    ];

    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
        <CheckboxGroup items={assetRequisition1} />
        {/* <CheckboxGroup items={assetRequisition2}  /> */}
      </Stack>
    );
  };

  const AssetMovement = () => {
    const assetMovement1 = [
      { label: "Asset Transfer", value: "transfer" },
      { label: "Asset Pullout", value: "pull-out" },
    ];

    const assetMovement2 = [
      { label: "Asset Evaluation", value: "evaluation" },
      { label: "Asset Disposal", value: "disposal" },
    ];

    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
        <CheckboxGroup items={assetMovement1} />
        <CheckboxGroup items={assetMovement2} />
      </Stack>
    );
  };

  const Approving = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Approving Request"
            value="approving-request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("approving-request")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Approving Transfer"
            value="approving-transfer"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("approving-transfer")}
              />
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
            label="Approving Pull Out"
            value="approving-pull-out"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("approving-pull-out")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Approving Disposal"
            value="approving-disposal"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("approving-disposal")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const Reports = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" gap={1}>
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="PR Report"
            value="pr-report"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("pr-report")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  return (
    <Box className="add-role">
      <Stack flexDirection="row" alignItems="center" gap={1} alignSelf="flex-start" pb={1}>
        {!data.status ? <AddBox color="secondary" sx={{ fontSize: "30px" }} /> : null}
        <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
          {!data.status ? "Add Role" : data.action === "view" ? "Permissions" : "Edit Role"}
        </Typography>
      </Stack>

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
                width: "500px",
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
                                    "unit-of-measurement",
                                    "small-tools",
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
                                    "requisition-received-asset",
                                    "requisition-rr-summary",
                                    "requisition-releasing",
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
                            checked={watch("access_permission").includes("approving")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              approving.some((perm) => watch("access_permission").includes(perm)) &&
                              !approving.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "approving-request",
                                    "approving-transfer",
                                    "approving-pull-out",
                                    "approving-disposal",
                                  ]),
                                ]);
                              } else {
                                const approvingEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...approving, "approving"].includes(perm)
                                );

                                setValue("access_permission", approvingEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Approving />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("reports") && (
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
                        label="Reports"
                        value="reports"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes("reports")}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              reports.some((perm) => watch("access_permission").includes(perm)) &&
                              !reports.every((perm) => watch("access_permission").includes(perm))
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([...watch("access_permission"), "pr-report"]),
                                ]);
                              } else {
                                const reportsEmptyValue = watch("access_permission").filter(
                                  (perm) => ![...reports, "reports"].includes(perm)
                                );

                                setValue("access_permission", reportsEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Reports />
                  </FormControl>
                </Box>
              )}
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
              watch("role_name") === "" || watch("access_permission")?.length === 0 || data.action === "view"
            }
            sx={data.action === "view" ? { display: "none" } : null}
          >
            {!data.status ? "Create" : "Update"}
          </LoadingButton>

          <Button
            variant={data.action === "view" ? "contained" : "outlined"}
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
            disabled={(isPostLoading || isUpdateLoading) === true}
            fullWidth={data.action === "view" ? true : false}
          >
            {!data.status ? "Cancel" : data.action === "view" ? "Close" : "Cancel"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddRole;
