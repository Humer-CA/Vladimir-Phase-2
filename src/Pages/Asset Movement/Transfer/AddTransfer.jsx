import React, { useEffect, useRef, useState } from "react";
import "../../../Style/Request/request.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import { useLazyGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";

import AttachmentActive from "../../../Img/SVG/SVG/AttachmentActive.svg";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Autocomplete,
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
import { Add, ArrowBackIosRounded, Create, Info, Remove, RemoveCircle } from "@mui/icons-material";
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
} from "../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";
import { useGetByTransactionApiQuery, useUpdateRequisitionApiMutation } from "../../../Redux/Query/Request/Requisition";

import { useLocation, useNavigate } from "react-router-dom";

import { usePostRequisitionSmsApiMutation } from "../../../Redux/Query/Request/RequisitionSms";
import ErrorFetching from "../../ErrorFetching";
import { useLazyGetFixedAssetAllApiQuery } from "../../../Redux/Query/FixedAsset/FixedAssets";
import moment from "moment";
import CustomMultipleAttachment from "../../../Components/CustomMultipleAttachment";
import { usePostTransferApiMutation } from "../../../Redux/Query/Movement/Transfer";
import { onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";

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
  account_title_id: yup.object().required().label("Account Title").typeError("Account Title is a required field"),

  remarks: yup.string().nullable().label("Remarks"),
  attachments: yup.mixed().label("Attachments"),
  assets: yup.array().of(
    yup.object().shape({
      asset_id: yup.string(),
      fixed_asset_id: yup.number().required("Fixed Asset is a Required Field"),
      asset_accountable: yup.string(),
      created_at: yup.date(),
    })
  ),
});

const AddTransfer = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: transactionData } = useLocation();
  const AttachmentRef = useRef(null);

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
    account_title_id: null,

    remarks: null,
    attachments: null,

    assets: [{ fixed_asset_id: null, asset_accountable: "", created_at: null }],
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
  ] = useLazyGetFixedAssetAllApiQuery();

  //* useForm --------------------------------------------------------------------
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isDirty },
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
      account_title_id: null,

      remarks: "",
      attachments: null,

      assets: [{ fixed_asset_id: null, asset_accountable: "", created_at: null }],
    },
  });

  //* Append Table ---------------------------------------------------------------
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });
  const handleAppendItem = () => append({ fixed_asset_id: null, asset_accountable: null, created_at: null });

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
    if (updateRequest.id) {
      const accountable = {
        general_info: {
          full_id_number: updateRequest.accountable.split(" ")[0],
          full_id_number_full_name: updateRequest.accountable,
        },
      };
      const attachmentFormat = (fields) => (updateRequest?.[fields] === "-" ? "" : updateRequest?.[fields]);

      setValue("description", updateRequest.description);
      setValue("department_id", updateRequest?.department);
      setValue("company_id", updateRequest?.company);
      setValue("business_unit_id", updateRequest?.business_unit);
      setValue("unit_id", updateRequest?.unit);
      setValue("subunit_id", updateRequest?.subunit);
      setValue("location_id", updateRequest?.location);
      setValue("account_title_id", updateRequest?.account_title);
      setValue("accountability", updateRequest?.accountability);
      setValue("accountable", accountable);

      setValue("remarks", updateRequest?.remarks);
      setValue("attachments", attachmentFormat("attachments"));

      setValue("assets", attachmentFormat("assets"));
    }
  }, [updateRequest]);

  //* Table Sorting ----------------------------------------------------------------
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const comparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const onSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //* Form functions ----------------------------------------------------------------
  const onSubmitHandler = (formData) => {
    const createdAtFormat = {
      formattedAssets: formData.assets.map((item) => ({
        created_at: moment(item.created_at).format("MMM DD, YYYY"),
      })),
    };
    const updatingCoa = (fields, name) =>
      updateRequest ? formData?.[fields]?.id : formData?.[fields]?.[name]?.id.toString();

    const accountableFormat =
      formData?.accountable === null ? "" : formData?.accountable?.general_info?.full_id_number_full_name?.toString();

    const attachmentValidation = (fieldName, formData) => {
      return formData?.[fieldName];
      // if (watch(`${fieldName}`) === null) {
      //   return "";
      // } else if (updateRequest)
      //   if (formData?.[fieldName]?.file_name === updateRequest?.[fieldName][0]?.file_name) {
      //     return "x";
      //   } else {
      //     return formData?.[fieldName];
      //   }
      // else {
      //   return formData?.[fieldName];
      // }
    };

    const newFormData = {
      ...formData,
      department_id: formData?.department_id.id?.toString(),
      company_id: updatingCoa("company_id", "company"),
      business_unit_id: updatingCoa("business_unit_id", "business_unit"),
      unit_id: formData.unit_id.id?.toString(),
      subunit_id: formData.subunit_id.id?.toString(),
      location_id: formData?.location_id.id?.toString(),
      account_title_id: formData?.account_title_id.id?.toString(),
      accountability: formData?.accountability?.toString(),
      accountable: accountableFormat,
      created_at: createdAtFormat,

      attachments: attachmentValidation("attachments", formData),
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
              {updateRequest ? "CREATE" : "RESUBMIT"}
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const res = await postTransfer(newFormData).unwrap();
            reset();
            dispatch(
              openToast({
                message: res?.message,
                duration: 5000,
              })
            );

            // const smsData = {
            //   system_name: "Vladimir",
            //   message: "You have a pending approval",
            //   mobile_number: "+639913117181",
            // };

            // postRequestSms(smsData);
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

  const onDeleteHandler = async (id) => {
    dispatch(
      openConfirm({
        icon: Report,
        iconColor: "warning",
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
              DELETE
            </Typography>{" "}
            this Item?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await deleteRequest(id).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
            console.log(err);
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data.message,
                  duration: 5000,
                  variant: "error",
                })
              );
            } else if (err?.status !== 422) {
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
      <Tooltip title={`Remove ${title}`} arrow>
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
              borderRadius: "12px",
              // color: "#636363",
            },

            ".MuiInputLabel-root.Mui-disabled": {
              backgroundColor: "transparent",
              color: "text.main",
            },

            ".Mui-disabled": {
              backgroundColor: "background.light",
              borderRadius: "12px",
              color: "text.main",
            },
          }}
        />
      </Stack>
    );
  };

  const onUpdateHandler = (props) => {
    const {
      id,
      description,
      accountability,
      accountable,

      company,
      business_unit,
      department,
      unit,
      subunit,
      location,
      account_title,

      remarks,
      attachments,
      assets: [{ fixed_asset_id, asset_accountable, created_at }],
    } = props;
    setUpdateRequest({
      id,
      description,
      accountability,
      accountable,

      company,
      business_unit,
      department,
      unit,
      subunit,
      location,
      account_title,

      remarks,
      attachments,
      assets: [{ fixed_asset_id, asset_accountable, created_at }],
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRequest({
      description: "",
      accountability: null,
      accountable: null,

      company_id: null,
      business_unit_id: null,
      department_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,
      remarks: "",
      attachments: null,
      assets: [{ fixed_asset_id: null, asset_accountable: "", created_at: null }],
    });
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  // console.log(watch("attachments"));

  //* Styles ----------------------------------------------------------------
  const BoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    pb: "10px",
  };

  return (
    <>
      <Box className="mcontainer" sx={{ height: "calc(100vh - 380px)" }}>
        <Button
          variant="text"
          color="secondary"
          size="small"
          startIcon={<ArrowBackIosRounded color="secondary" />}
          onClick={() => {
            navigate(-1);
          }}
          disableRipple
          sx={{ width: "90px", ml: "-15px", mt: "-5px", pb: "10px", "&:hover": { backgroundColor: "transparent" } }}
        >
          <Typography color="secondary.main">Back</Typography>
        </Button>

        <Box className="request mcontainer__wrapper" p={2} component="form" onSubmit={handleSubmit(onSubmitHandler)}>
          <Box>
            <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem", pt: 1 }}>
              ADD TRANSFER REQUEST
            </Typography>

            <Box id="requestForm" className="request__form">
              <Stack gap={2} py={2}>
                <Box sx={BoxStyle}>
                  <CustomTextField
                    control={control}
                    name="description"
                    label="Description"
                    type="text"
                    error={!!errors?.description}
                    helperText={errors?.description?.message}
                    fullWidth
                    multiline
                  />
                  <CustomAutoComplete
                    autoComplete
                    name="accountability"
                    control={control}
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

                  <CustomAutoComplete
                    autoComplete
                    control={control}
                    name="department_id"
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

                  <CustomAutoComplete
                    name="account_title_id"
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
                  />

                  <CustomTextField
                    control={control}
                    name="remarks"
                    label="Remarks"
                    type="text"
                    error={!!errors?.remarks}
                    helperText={errors?.remarks?.message}
                    fullWidth
                    multiline
                  />
                </Box>

                <Stack flexDirection="row" gap={1} alignItems="center">
                  {watch("attachments") !== null ? (
                    <UpdateField label={"Attachments"} value={watch("attachments")?.length} />
                  ) : (
                    <CustomMultipleAttachment
                      control={control}
                      name="attachments"
                      label="Attachments"
                      inputRef={AttachmentRef}
                      error={!!errors?.attachments?.message}
                      helperText={errors?.attachments?.message}
                    />
                  )}

                  {watch("attachments") !== null && <RemoveFile title="Attachments" value="attachments" />}
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* TABLE */}
          <Box className="request__table">
            <TableContainer
              className="mcontainer__th-body  mcontainer__wrapper"
              sx={{ height: "calc(100vh - 260px)", pt: 0 }}
            >
              <Table className="mcontainer__table " stickyHeader>
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
                    <TableCell className="tbl-cell">Date Created</TableCell>
                    <TableCell className="tbl-cell" align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>
                        <Autocomplete
                          {...register(`assets.${index}.fixed_asset_id`)}
                          options={vTagNumberData}
                          onOpen={() => (isVTagNumberSuccess ? null : fixedAssetTrigger())}
                          loading={isVTagNumberLoading}
                          size="small"
                          value={vTagNumberData.find((item) => item.id === item)}
                          filterOptions={filterOptions}
                          getOptionLabel={(option) =>
                            "(" + option.vladimir_tag_number + ")" + " - " + option.asset_description
                          }
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          renderInput={(params) => (
                            <TextField
                              required
                              color="secondary"
                              {...params}
                              label="Tag Number"
                              // error={`${!!errors}?.assets.${index}.fixed_asset_id`}
                              // helperText={`${errors}?.assets.${index}.fixed_asset_id?.message`}
                            />
                          )}
                          getOptionDisabled={(option) => !!fields.find((item) => item.fixed_asset_id === option.id)}
                          onChange={(_, value) => {
                            if (value) {
                              setValue(`assets.${index}.fixed_asset_id`, value.id);
                              setValue(
                                `assets.${index}.asset_accountable`,
                                value.accountable === "-" ? "Common" : value.accountable
                              );
                              setValue(`assets.${index}.created_at`, value.created_at);
                            } else {
                              setValue(`assets.${index}.fixed_asset_id`, null);
                              setValue(`assets.${index}.asset_accountable`, null);
                              setValue(`assets.${index}.created_at`, null);
                            }
                          }}
                          sx={{
                            ".MuiInputBase-root": {
                              borderRadius: "12px",
                              // backgroundColor: "white",
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
                      </TableCell>

                      <TableCell>
                        <TextField
                          {...register(`assets.${index}.asset_accountable`)}
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
                          fullWidth
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          {...register(`assets.${index}.created_at`)}
                          variant="outlined"
                          disabled
                          type="text"
                          // error={!!errors?.dateCreated}
                          // helperText={errors?.dateCreated?.message}
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
                            },
                            ml: "-10px",
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <IconButton onClick={() => remove(index)} disabled={fields.length === 1}>
                          <Tooltip title="Delete Row" placement="top" arrow>
                            <RemoveCircle color={fields.length === 1 ? "gray" : "warning"} />
                          </Tooltip>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell colSpan={99}>
                      <Stack flexDirection="row" gap={2}>
                        <Button variant="contained" size="small" startIcon={<Add />} onClick={() => handleAppendItem()}>
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
            <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
              <Typography fontFamily="Anton, Impact, Roboto" fontSize="16px" color="secondary.main" sx={{ pt: "10px" }}>
                Added: {fields.length} Asset(s)
              </Typography>
              <Stack flexDirection="row" justifyContent="flex-end" gap={2} sx={{ pt: "10px" }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  color="secondary"
                  // disabled={watch(`assets.${index}.fixed_asset_id`)}
                  startIcon={<Create color={"primary"} />}
                  loading={isPostLoading || isUpdateLoading}
                >
                  Create
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddTransfer;
