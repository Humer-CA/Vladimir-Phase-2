import React, { useEffect, useRef, useState } from "react";
import "../../../Style/Request/request.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import { useLazyGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";

import AttachmentActive from "../../../Img/SVG/AttachmentActive.svg";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  ArrowBackIosRounded,
  BorderColor,
  Cancel,
  Create,
  Edit,
  Info,
  Remove,
  RemoveCircle,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

// RTK
import { useDispatch } from "react-redux";
import { useLazyGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Company";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import {
  useGetDepartmentAllApiQuery,
  useLazyGetDepartmentAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";

import {
  useGetLocationAllApiQuery,
  useLazyGetLocationAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/Location";
import {
  useGetSubUnitAllApiQuery,
  useLazyGetSubUnitAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import {
  useGetAccountTitleAllApiQuery,
  useLazyGetAccountTitleAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/AccountTitle";
import { useGetByTransactionApiQuery, useUpdateRequisitionApiMutation } from "../../../Redux/Query/Request/Requisition";

import { useLocation, useNavigate } from "react-router-dom";

import { usePostRequisitionSmsApiMutation } from "../../../Redux/Query/Request/RequisitionSms";
import ErrorFetching from "../../ErrorFetching";
import { useLazyGetFixedAssetAllApiQuery } from "../../../Redux/Query/FixedAsset/FixedAssets";
import moment from "moment";
import CustomMultipleAttachment from "../../../Components/CustomMultipleAttachment";
import {
  useGetTransferNumberApiQuery,
  useLazyGetFixedAssetTransferAllApiQuery,
  usePostTransferApiMutation,
} from "../../../Redux/Query/Movement/Transfer";
import { onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import axios from "axios";

const schema = yup.object().shape({
  id: yup.string(),
  description: yup.string().required().label("Acquisition Details"),
  accountability: yup.string().typeError("Accountability is a required field").required().label("Accountability"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),

  department_id: yup.object().required().label("Department").typeError("Department is a required field"),
  company_id: yup.object().required().label("Company").typeError("Company is a required field"),
  business_unit_id: yup.object().required().label("Business Unit").typeError("Business Unit is a required field"),
  unit_id: yup.object().required().label("Unit").typeError("Unit is a required field"),
  subunit_id: yup.object().required().label("Subunit").typeError("Subunit is a required field"),
  location_id: yup.object().required().label("Location").typeError("Location is a required field"),
  // account_title_id: yup.object().required().label("Account Title").typeError("Account Title is a required field"),

  remarks: yup.string().label("Remarks"),
  attachments: yup.mixed().required().label("Attachments"),
  asset: yup.array().of(
    yup.object().shape({
      asset_id: yup.string(),
      fixed_asset_id: yup.object().required("Fixed Asset is a Required Field"),
      asset_accountable: yup.string(),
      created_at: yup.date(),
    })
  ),
});

const AddTransfer = (props) => {
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const AttachmentRef = useRef(null);
  const { state: transactionData } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateRequest, setUpdateRequest] = useState({
    id: "",
    description: "",
    accountability: null,
    accountable: null,

    department_id: null,
    company_id: null,
    business_unit_id: null,
    unit_id: null,
    subunit_id: null,
    location_id: null,
    // account_title_id: null,

    remarks: "",
    attachments: null,

    asset: [{ id: null, fixed_asset_id: null, asset_accountable: "", created_at: null }],
  });

  const [
    postTransfer,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostTransferApiMutation();

  const [
    updateRequisition,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateRequisitionApiMutation();

  const [
    postRequestSms,
    { data: smsData, isLoading: isSmsLoading, isSuccess: isSmsSuccess, isError: isSmsError, error: smsError },
  ] = usePostRequisitionSmsApiMutation();

  //* QUERY ------------------------------------------------------------------

  const {
    data: transferData = [],
    isLoading: isTransferLoading,
    isSuccess: isTransferSuccess,
    isError: isTransferError,
    refetch: isTransferRefetch,
  } = useGetTransferNumberApiQuery(
    { transfer_number: transactionData?.transfer_number },
    { refetchOnMountOrArgChange: true }
  );

  const data = transferData?.at(0);
  // console.log(data);

  const [
    companyTrigger,
    {
      data: companyData = [],
      isLoading: isCompanyLoading,
      isSuccess: isCompanySuccess,
      isError: isCompanyError,
      refetch: isCompanyRefetch,
    },
  ] = useLazyGetCompanyAllApiQuery();

  const [
    businessUnitTrigger,
    {
      data: businessUnitData = [],
      isLoading: isBusinessUnitLoading,
      isSuccess: isBusinessUnitSuccess,
      isError: isBusinessUnitError,
      refetch: isBusinessUnitRefetch,
    },
  ] = useLazyGetBusinessUnitAllApiQuery();

  const [
    departmentTrigger,
    {
      data: departmentData = [],
      isLoading: isDepartmentLoading,
      isSuccess: isDepartmentSuccess,
      isError: isDepartmentError,
      refetch: isDepartmentRefetch,
    },
  ] = useLazyGetDepartmentAllApiQuery();

  const [
    unitTrigger,
    {
      data: unitData = [],
      isLoading: isUnitLoading,
      isSuccess: isUnitSuccess,
      isError: isUnitError,
      refetch: isUnitRefetch,
    },
  ] = useLazyGetUnitAllApiQuery();

  const [
    subunitTrigger,
    {
      data: subUnitData = [],
      isLoading: isSubUnitLoading,
      isSuccess: isSubUnitSuccess,
      isError: isSubUnitError,
      refetch: isSubUnitRefetch,
    },
  ] = useLazyGetSubUnitAllApiQuery();

  const [
    locationTrigger,
    {
      data: locationData = [],
      isLoading: isLocationLoading,
      isSuccess: isLocationSuccess,
      isError: isLocationError,
      refetch: isLocationRefetch,
    },
  ] = useLazyGetLocationAllApiQuery();

  const [
    accountTitleTrigger,
    {
      data: accountTitleData = [],
      isLoading: isAccountTitleLoading,
      isSuccess: isAccountTitleSuccess,
      isError: isAccountTitleError,
      refetch: isAccountTitleRefetch,
    },
  ] = useLazyGetAccountTitleAllApiQuery();

  const [
    sedarTrigger,
    { data: sedarData = [], isLoading: isSedarLoading, isSuccess: isSedarSuccess, isError: isSedarError },
  ] = useLazyGetSedarUsersApiQuery();

  const [
    fixedAssetTrigger,
    {
      data: vTagNumberData = [],
      isLoading: isVTagNumberLoading,
      isSuccess: isVTagNumberSuccess,
      isError: isVTagNumberError,
      error: vTagNumberError,
    },
  ] = useLazyGetFixedAssetTransferAllApiQuery({}, { refetchOnMountOrArgChange: true });

  //* useForm --------------------------------------------------------------------
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isDirty, isValid },
    setError,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      description: "",
      accountability: null,
      accountable: null,

      department_id: null,
      company_id: null,
      business_unit_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      // account_title_id: null,

      remarks: "",
      attachments: null,

      asset: [{ id: null, fixed_asset_id: null, asset_accountable: "", created_at: null }],
    },
  });

  //* Append Table ---------------------------------------------------------------
  const { fields, append, remove } = useFieldArray({
    control,
    name: "asset",
  });
  const handleAppendItem = () => append({ id: null, fixed_asset_id: null, asset_accountable: "", created_at: null });

  //* useEffects() ----------------------------------------------------------------
  useEffect(() => {
    if (isPostError) {
      if (postError?.status === 422) {
        dispatch(
          openToast({
            message: postError?.data?.errors.detail,
            duration: 5000,
            variant: "error",
          })
        );
      } else {
        dispatch(
          openToast({
            message: "Something went wrong. Please try again.",
            duration: 5000,
            variant: "error",
          })
        );
      }
    }
  }, [isPostError]);

  useEffect(() => {
    if (data) {
      fixedAssetTrigger();
      const accountable = {
        general_info: {
          full_id_number: data?.accountable?.split(" ")[0],
          full_id_number_full_name: data?.accountable,
        },
      };
      const attachmentFormat = data?.attachments === null ? "" : data?.attachments;

      setValue("description", data?.description);
      setValue("accountability", data?.accountability);
      setValue("accountable", accountable);
      setValue("department_id", data?.department);
      setValue("company_id", data?.company);
      setValue("business_unit_id", data?.business_unit);
      setValue("unit_id", data?.unit);
      setValue("subunit_id", data?.subunit);
      setValue("location_id", data?.location);
      // setValue("account_title_id", data?.account_title);
      setValue("remarks", data?.remarks);
      setValue("attachments", attachmentFormat);
      setValue(
        "asset",
        data?.asset.map((asset) => ({
          id: asset.id,
          // fixed_asset_id: {
          //   id: asset?.vladimir_tag_number.id,
          //   vladimir_tag_number: asset?.vladimir_tag_number?.vladimir_tag_number,
          //   asset_description: asset?.vladimir_tag_number?.asset_description,
          // },
          fixed_asset_id: asset,
          asset_accountable: asset.accountable === "-" ? "Common" : asset.accountable,
          created_at: asset.created_at || asset.acquisition_date,
        }))
      );
    }
  }, [data, edit]);

  // console.log("asset", watch("asset"));
  // console.log("asset", data?.asset);

  //* Form functions ----------------------------------------------------------------
  const onSubmitHandler = (formData) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const updatingCoa = (fields, name) =>
      updateRequest ? formData?.[fields]?.id : formData?.[fields]?.[name]?.id.toString();
    const accountableFormat =
      formData?.accountable === null ? "" : formData?.accountable?.general_info?.full_id_number_full_name?.toString();

    const data = {
      ...formData,
      department_id: formData?.department_id.id?.toString(),
      company_id: updatingCoa("company_id", "company"),
      business_unit_id: updatingCoa("business_unit_id", "business_unit"),
      unit_id: formData.unit_id.id?.toString(),
      subunit_id: formData.subunit_id.id?.toString(),
      location_id: formData?.location_id.id?.toString(),
      // account_title_id: formData?.account_title_id.id?.toString(),
      accountability: formData?.accountability?.toString(),
      accountable: accountableFormat,
      attachments: formData?.attachments,

      asset: formData?.asset?.map((item) => ({
        fixed_asset_id: item.fixed_asset_id.id,
      })),
    };
    const submitData = async () => {
      setIsLoading(true);
      await axios
        .post(
          `${process.env.VLADIMIR_BASE_URL}/${
            edit ? `update-transfer-request/${transactionData?.transfer_number}` : "asset-transfer"
          }`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Error submitting form!");
        });
    };
    dispatch(
      openConfirm({
        icon: Info,
        iconColor: "info",
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
              }}
            >
              {!edit ? "CREATE" : "UPDATE"}
            </Typography>{" "}
            this Data?
          </Box>
        ),
        onConfirm: async () => {
          try {
            dispatch(onLoading());
            await submitData();
            reset();
            navigate(-1);
            dispatch(
              openToast({
                message: "Transfer Request Successfully Added",
                duration: 5000,
              })
            );
          } catch (err) {
            console.log(err);
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err?.data?.errors?.detail || err.data.message,
                  duration: 5000,
                  variant: "error",
                })
              );
            } else if (err?.status !== 422) {
              console.error(err);
              dispatch(
                openToast({
                  message: "Something went wrong. Please try again.",
                  duration: 5000,
                  variant: "error",
                })
              );
            }
          }
        },
      })
    );
  };

  const RemoveFile = ({ title, value }) => {
    return (
      <Tooltip title="attachment" arrow>
        <IconButton
          onClick={() => {
            setValue(value, null);
            // ref.current.files = [];
          }}
          size="small"
          sx={{
            backgroundColor: "error.main",
            color: "white",
            ":hover": { backgroundColor: "error.main" },
            height: "25px",
            width: "25px",
          }}
        >
          <Remove />
        </IconButton>
      </Tooltip>
    );
  };

  const UpdateField = ({ value, label }) => {
    return (
      <Stack flexDirection="row" gap={1} alignItems="center">
        <TextField
          type="text"
          size="small"
          label={label}
          autoComplete="off"
          color="secondary"
          disabled={edit ? false : transactionData?.view}
          value={value ? `${value} file(s) selected` : null}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={AttachmentActive} width="20px" />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            ".MuiInputBase-root": {
              borderRadius: "10px",
              // color: "#636363",
            },

            ".MuiInputLabel-root.Mui-disabled": {
              backgroundColor: "transparent",
              color: "text.main",
            },

            ".Mui-disabled": {
              backgroundColor: "background.light",
              borderRadius: "10px",
              color: "text.main",
            },
          }}
        />
      </Stack>
    );
  };

  // const onUpdateHandler = (props) => {
  //   const {
  //     id,
  //     description,
  //     accountability,
  //     accountable,

  //     company,
  //     business_unit,
  //     department,
  //     unit,
  //     subunit,
  //     location,
  //     account_title,

  //     remarks,
  //     attachments,
  //     asset: [{ fixed_asset_id, asset_accountable, created_at }],
  //   } = props;
  //   setUpdateRequest({
  //     id,
  //     description,
  //     accountability,
  //     accountable,

  //     company,
  //     business_unit,
  //     department,
  //     unit,
  //     subunit,
  //     location,
  //     account_title,

  //     remarks,
  //     attachments,
  //     asset: [{ fixed_asset_id, asset_accountable, created_at }],
  //   });
  // };

  // const onUpdateResetHandler = () => {
  //   setUpdateRequest({
  //     description: "",
  //     accountability: null,
  //     accountable: null,

  //     company_id: null,
  //     business_unit_id: null,
  //     department_id: null,
  //     unit_id: null,
  //     subunit_id: null,
  //     location_id: null,
  //     // account_title_id: null,
  //     remarks: "",
  //     attachments: null,

  //     asset: [{ id: null, fixed_asset_id: null, asset_accountable: "", created_at: null }],
  //   });
  // };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  return (
    <>
      <Box className="mcontainer">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
          <Button
            variant="text"
            color="secondary"
            size="small"
            startIcon={<ArrowBackIosRounded color="secondary" />}
            onClick={() => {
              navigate(-1);
            }}
            disableRipple
            sx={{ mt: "-5px", "&:hover": { backgroundColor: "transparent" } }}
          >
            Back
          </Button>

          {!transactionData?.view
            ? null
            : !edit
            ? !transactionData?.approved && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<BorderColor color="secondary" />}
                  onClick={() => setEdit(true)}
                  sx={{ color: "secondary.main", mb: "10px" }}
                >
                  Edit
                </Button>
              )
            : !transactionData?.approved && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<Cancel color="secondary" />}
                  onClick={() => setEdit(false)}
                  sx={{ color: "secondary.main", mb: "10px" }}
                >
                  Cancel Edit
                </Button>
              )}
        </Stack>

        <Box className="request request__wrapper" p={2} component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Stack>
            <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
              {`${transactionData?.view ? (edit ? "EDIT INFORMATION" : "VIEW INFORMATION") : "ADD TRANSFER REQUEST"} `}
            </Typography>

            <Stack id="requestForm" className="request__form" gap={2} pb={1}>
              <Stack gap={2}>
                <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "16px" }}>
                  TRANSFER DETAILS
                </Typography>
                <CustomTextField
                  control={control}
                  name="description"
                  disabled={edit ? false : transactionData?.view}
                  label="Description"
                  type="text"
                  error={!!errors?.description}
                  helperText={errors?.description?.message}
                  fullWidth
                  multiline
                />

                <CustomAutoComplete
                  control={control}
                  name="accountability"
                  disabled={edit ? false : transactionData?.view}
                  options={["Personal Issued", "Common"]}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      color="secondary"
                      label="Accountability  "
                      error={!!errors?.accountability}
                      helperText={errors?.accountability?.message}
                    />
                  )}
                  onChange={(_, value) => {
                    setValue("accountable", null);
                    return value;
                  }}
                />

                {watch("accountability") === "Personal Issued" && (
                  <CustomAutoComplete
                    name="accountable"
                    disabled={edit ? false : transactionData?.view}
                    control={control}
                    includeInputInList
                    disablePortal
                    filterOptions={filterOptions}
                    options={sedarData}
                    onOpen={() => (isSedarSuccess ? null : sedarTrigger())}
                    loading={isSedarLoading}
                    getOptionLabel={(option) => option.general_info?.full_id_number_full_name}
                    isOptionEqualToValue={(option, value) =>
                      option.general_info?.full_id_number === value.general_info?.full_id_number
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        color="secondary"
                        label="Accountable"
                        error={!!errors?.accountable?.message}
                        helperText={errors?.accountable?.message}
                      />
                    )}
                  />
                )}

                <CustomTextField
                  control={control}
                  name="remarks"
                  disabled={edit ? false : transactionData?.view}
                  label="Remarks (Optional)"
                  optional
                  type="text"
                  error={!!errors?.remarks}
                  helperText={errors?.remarks?.message}
                  fullWidth
                  multiline
                />
              </Stack>

              <Stack gap={2}>
                <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "16px" }}>
                  CHART OF ACCOUNT
                </Typography>

                <CustomAutoComplete
                  autoComplete
                  control={control}
                  name="department_id"
                  disabled={edit ? false : transactionData?.view}
                  options={departmentData}
                  onOpen={() =>
                    isDepartmentSuccess ? null : (departmentTrigger(), companyTrigger(), businessUnitTrigger())
                  }
                  loading={isDepartmentLoading}
                  size="small"
                  // clearIcon={null}
                  getOptionLabel={(option) => option.department_code + " - " + option.department_name}
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
                  onChange={(_, value) => {
                    if (value) {
                      const companyID = companyData?.find((item) => item.sync_id === value.company.company_sync_id);
                      const businessUnitID = businessUnitData?.find(
                        (item) => item.sync_id === value.business_unit.business_unit_sync_id
                      );

                      setValue("company_id", companyID);
                      setValue("business_unit_id", businessUnitID);
                    } else if (value === null) {
                      setValue("company_id", null);
                      setValue("business_unit_id", null);
                    }
                    setValue("unit_id", null);
                    setValue("subunit_id", null);
                    setValue("location_id", null);
                    return value;
                  }}
                />

                <CustomAutoComplete
                  name="company_id"
                  control={control}
                  options={companyData}
                  onOpen={() => (isCompanySuccess ? null : company())}
                  loading={isCompanyLoading}
                  size="small"
                  getOptionLabel={(option) => option.company_code + " - " + option.company_name}
                  isOptionEqualToValue={(option, value) => option.company_id === value.company_id}
                  renderInput={(params) => (
                    <TextField
                      color="secondary"
                      {...params}
                      label="Company"
                      // error={!!errors?.company_id}
                      // helperText={errors?.company_id?.message}
                    />
                  )}
                  disabled
                />

                <CustomAutoComplete
                  autoComplete
                  name="business_unit_id"
                  control={control}
                  options={businessUnitData}
                  loading={isBusinessUnitLoading}
                  size="small"
                  getOptionLabel={(option) => option.business_unit_code + " - " + option.business_unit_name}
                  isOptionEqualToValue={(option, value) => option.business_unit_id === value.business_unit_id}
                  renderInput={(params) => (
                    <TextField
                      color="secondary"
                      {...params}
                      label="Business Unit"
                      // error={!!errors?.business_unit_id}
                      // helperText={errors?.business_unit_id?.message}
                    />
                  )}
                  disabled
                />

                <CustomAutoComplete
                  autoComplete
                  name="unit_id"
                  disabled={edit ? false : transactionData?.view}
                  control={control}
                  options={departmentData?.filter((obj) => obj?.id === watch("department_id")?.id)[0]?.unit || []}
                  onOpen={() => (isUnitSuccess ? null : (unitTrigger(), subunitTrigger(), locationTrigger()))}
                  loading={isUnitLoading}
                  size="small"
                  getOptionLabel={(option) => option.unit_code + " - " + option.unit_name}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      color="secondary"
                      {...params}
                      label="Unit"
                      error={!!errors?.unit_id}
                      helperText={errors?.unit_id?.message}
                    />
                  )}
                  onChange={(_, value) => {
                    setValue("subunit_id", null);
                    setValue("location_id", null);
                    return value;
                  }}
                />

                <CustomAutoComplete
                  autoComplete
                  name="subunit_id"
                  disabled={edit ? false : transactionData?.view}
                  control={control}
                  options={unitData?.filter((obj) => obj?.id === watch("unit_id")?.id)[0]?.subunit || []}
                  loading={isSubUnitLoading}
                  size="small"
                  getOptionLabel={(option) => option.subunit_code + " - " + option.subunit_name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      color="secondary"
                      {...params}
                      label="Sub Unit"
                      error={!!errors?.subunit_id}
                      helperText={errors?.subunit_id?.message}
                    />
                  )}
                />

                <CustomAutoComplete
                  autoComplete
                  name="location_id"
                  disabled={edit ? false : transactionData?.view}
                  control={control}
                  options={locationData?.filter((item) => {
                    return item.subunit.some((subunit) => {
                      return subunit?.sync_id === watch("subunit_id")?.sync_id;
                    });
                  })}
                  loading={isLocationLoading}
                  size="small"
                  getOptionLabel={(option) => option.location_code + " - " + option.location_name}
                  isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                  renderInput={(params) => (
                    <TextField
                      color="secondary"
                      {...params}
                      label="Location"
                      error={!!errors?.location_id}
                      helperText={errors?.location_id?.message}
                    />
                  )}
                />

                {/* <CustomAutoComplete
                      name="account_title_id"
                      disabled={edit ? false : transactionData?.view}
                      control={control}
                      options={accountTitleData}
                      onOpen={() => (isAccountTitleSuccess ? null : accountTitleTrigger())}
                      loading={isAccountTitleLoading}
                      getOptionLabel={(option) => option.account_title_code + " - " + option.account_title_name}
                      isOptionEqualToValue={(option, value) => option.account_title_code === value.account_title_code}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          color="secondary"
                          label="Account Title  "
                          error={!!errors?.account_title_id}
                          helperText={errors?.account_title_id?.message}
                        />
                      )}
                    /> */}
              </Stack>

              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "16px" }}>
                ATTACHMENTS
              </Typography>

              <Stack flexDirection="row" gap={1} alignItems="center">
                {watch("attachments") !== null ? (
                  <UpdateField label={"Attachments"} value={watch("attachments")?.length} />
                ) : (
                  <CustomMultipleAttachment
                    control={control}
                    name="attachments"
                    disabled={edit ? false : transactionData?.view}
                    label="Attachments"
                    inputRef={AttachmentRef}
                    error={!!errors?.attachments?.message}
                    helperText={errors?.attachments?.message}
                  />
                )}

                {watch("attachments") !== null && (!transactionData?.view || edit) && (
                  <RemoveFile title="Attachments" value="attachments" />
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* TABLE */}
          <Box className="request__table">
            <TableContainer className="request__th-body  request__wrapper" sx={{ height: "calc(100vh - 280px)" }}>
              <Table className="request__table " stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      "& > *": {
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <TableCell className="tbl-cell">{transactionData ? "Ref No." : "Index"}</TableCell>
                    <TableCell className="tbl-cell">Asset</TableCell>
                    <TableCell className="tbl-cell">Accountability</TableCell>
                    <TableCell className="tbl-cell">Acquisition Date</TableCell>
                    <TableCell className="tbl-cell" align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id} id="appendedRow" className={`rowItem ${item.id ? "animateRow" : ""}`}>
                      <TableCell sx={{ pl: "30px" }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: "primary.main",
                            fontSize: "14px",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`asset.${index}.fixed_asset_id`}
                          render={({ field: { ref, value, onChange } }) => (
                            <Autocomplete
                              options={vTagNumberData}
                              onOpen={() => (isVTagNumberSuccess ? null : fixedAssetTrigger())}
                              loading={isVTagNumberLoading}
                              disabled={edit ? false : transactionData?.view}
                              size="small"
                              value={value}
                              filterOptions={filterOptions}
                              getOptionLabel={(option) =>
                                `(${option.vladimir_tag_number}) - ${option.asset_description}`
                              }
                              isOptionEqualToValue={(option, value) => option?.id === value?.id}
                              renderInput={(params) => (
                                <TextField required color="secondary" {...params} label="Tag Number" />
                              )}
                              getOptionDisabled={(option) =>
                                !!fields.find((item) => item.fixed_asset_id?.id === option.id) && option?.transfer === 1
                              }
                              // getOptionDisabled={(option) => !!fields.find((item) => console.log(item))}
                              onChange={(_, newValue) => {
                                if (newValue) {
                                  // onChange(newValue.id);
                                  onChange(newValue);
                                  setValue(
                                    `asset.${index}.asset_accountable`,
                                    newValue.accountable === "-" ? "Common" : newValue.accountable
                                  );
                                  setValue(`asset.${index}.created_at`, newValue.created_at);
                                } else {
                                  onChange(null);
                                  setValue(`asset.${index}.asset_accountable`, "");
                                  setValue(`asset.${index}.created_at`, null);
                                }
                              }}
                              sx={{
                                ".MuiInputBase-root": {
                                  borderRadius: "10px",
                                },
                                ".MuiInputLabel-root.Mui-disabled": {
                                  backgroundColor: "transparent",
                                },
                                ".Mui-disabled": {
                                  backgroundColor: "background.light",
                                },
                                minWidth: "200px",
                                maxWidth: "550px",
                              }}
                            />
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          {...register(`asset.${index}.asset_accountable`)}
                          variant="outlined"
                          disabled
                          type="text"
                          error={!!errors?.accountableAccount}
                          helperText={errors?.accountableAccount?.message}
                          sx={{
                            backgroundColor: "transparent",
                            border: "none",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiInputBase-input": {
                              backgroundColor: "transparent",
                              textOverflow: "ellipsis",
                            },
                            ml: "-10px",
                            minWidth: "250px",
                          }}
                          inputProps={{ color: "red" }}
                          fullWidth
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          {...register(`asset.${index}.created_at`)}
                          variant="outlined"
                          disabled
                          type="date"
                          sx={{
                            backgroundColor: "transparent",
                            border: "none",
                            ml: "-10px",
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiInputBase-input": {
                              backgroundColor: "transparent",
                            },
                            "& .Mui-disabled": {
                              color: "red",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          onClick={() => remove(index)}
                          disabled={edit ? false : fields.length === 1 || transactionData?.view}
                        >
                          <Tooltip title="Delete Row" placement="top" arrow>
                            <RemoveCircle
                              color={
                                fields.length === 1 || transactionData?.view ? (edit ? "warning" : "gray") : "warning"
                              }
                            />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={99}>
                      <Stack flexDirection="row" gap={2}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Add />}
                          onClick={() => handleAppendItem()}
                          disabled={
                            watch(`asset`).some((item) => item?.fixed_asset_id === null)
                              ? true
                              : edit
                              ? false
                              : transactionData?.view
                          }
                        >
                          Add Row
                        </Button>
                        {/* <Button
                            variant="contained"
                            size="small"
                            color="warning"
                            startIcon={<Delete />}
                            onClick={() => reset()}
                          >
                            Remove All
                          </Button> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Buttons */}
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Typography fontFamily="Anton, Impact, Roboto" fontSize="16px" color="secondary.main" pt="10px">
                Added: {fields.length} Asset(s)
              </Typography>
              <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
                {(!transactionData?.view || edit) && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="small"
                    color="secondary"
                    startIcon={<Create color={"primary"} />}
                    loading={isPostLoading || isUpdateLoading}
                    disabled={!isValid}
                    sx={{ mt: "10px" }}
                  >
                    {edit ? "Update" : "Create"}
                  </LoadingButton>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddTransfer;
