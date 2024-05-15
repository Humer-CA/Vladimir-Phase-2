import React, { useEffect, useRef, useState } from "react";
import "../../../Style/Request/request.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomAttachment from "../../../Components/Reusable/CustomAttachment";
import { LoadingData } from "../../../Components/LottieFiles/LottieComponents";
import { useGetSedarUsersApiQuery, useLazyGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import {
  requestContainerApi,
  useDeleteRequestContainerAllApiMutation,
  useDeleteRequestContainerApiMutation,
} from "../../../Redux/Query/Request/RequestContainer";
import AttachmentIcon from "../../../Img/SVG/SVG/Attachment.svg";
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
import {
  Add,
  AddAlert,
  AddToPhotos,
  ArrowBackIosRounded,
  Create,
  Delete,
  Folder,
  Info,
  Remove,
  RemoveCircle,
  Report,
  Save,
  SaveAlt,
  Update,
  Warning,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { closeDialog, closeDrawer, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import { useLazyGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Company";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import {
  useGetDepartmentAllApiQuery,
  useLazyGetDepartmentAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";
import { useLazyGetUnitOfMeasurementAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/UnitOfMeasurement";

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
import {
  useGetByTransactionApiQuery,
  usePostRequisitionApiMutation,
  usePostResubmitRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
  useDeleteRequisitionReferenceApiMutation,
  useGetByTransactionPageApiQuery,
} from "../../../Redux/Query/Request/Requisition";

import {
  useGetTypeOfRequestAllApiQuery,
  useLazyGetTypeOfRequestAllApiQuery,
} from "../../../Redux/Query/Masterlist/TypeOfRequest";
import { useLocation, useNavigate } from "react-router-dom";

import {
  // useGetRequestContainerAllApiQuery,
  useGetRequestContainerAllApiQuery,
  usePostRequestContainerApiMutation,
  useUpdateRequestContainerApiMutation,
} from "../../../Redux/Query/Request/RequestContainer";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { usePostRequisitionSmsApiMutation } from "../../../Redux/Query/Request/RequisitionSms";
import ErrorFetching from "../../ErrorFetching";
import {
  useGetFixedAssetAllApiQuery,
  useLazyGetFixedAssetAllApiQuery,
} from "../../../Redux/Query/FixedAsset/FixedAssets";
import moment from "moment";
import CustomMultipleAttachment from "../../../Components/CustomMultipleAttachment";

const schema = yup.object().shape({
  id: yup.string(),
  type_of_request_id: yup.object().required().label("Type of Request").typeError("Type of Request is a required field"),
  // .when("type_of_request", {
  //   is: (value) => value === "Personal Issued",
  //   then: (yup) => yup.label("CIP Number").required().typeError("CIP Number is a required field"),
  // })
  cip_number: yup.string().nullable(),

  department_id: yup.object().required().label("Department").typeError("Department is a required field"),
  company_id: yup.object().required().label("Company").typeError("Company is a required field"),
  business_unit_id: yup.object().required().label("Business Unit").typeError("Business Unit is a required field"),
  unit_id: yup.object().required().label("Unit").typeError("Unit is a required field"),
  subunit_id: yup.object().required().label("Subunit").typeError("Subunit is a required field"),
  location_id: yup.object().required().label("Location").typeError("Location is a required field"),
  account_title_id: yup.object().required().label("Account Title").typeError("Account Title is a required field"),
  accountability: yup.string().typeError("Accountability is a required field").required().label("Accountability"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),

  description: yup.string().required().label("Acquisition Details"),
  asset_description: yup.string().required().label("Asset Description"),
  asset_specification: yup.string().required().label("Asset Specification"),
  date_needed: yup.string().required().label("Date Needed").typeError("Date Needed is a required field"),
  brand: yup.string().label("Brand"),
  quantity: yup.number().required().label("Quantity"),
  uom_id: yup.object().required().label("UOM").typeError("UOM is a required field"),
  cellphone_number: yup.string().nullable().label("Cellphone Number"),
  additional_info: yup.string().nullable().label("Additional Info"),

  letter_of_request: yup
    .mixed()
    .label("Letter of Request")
    .when("attachment_type", {
      is: (value) => value === "Unbudgeted",
      then: (yup) => yup.label("Letter of Request").required().typeError("Letter of Request is a required field"),
    }),
  quotation: yup.mixed().label("Quotation"),
  specification_form: yup.mixed().label("Specification"),
  tool_of_trade: yup.mixed().label("Tool of Trade"),
  attachments: yup.mixed().label("Attachments"),
});

const AddTransfer = (props) => {
  const [updateRequest, setUpdateRequest] = useState({
    id: null,
    type_of_request_id: null,
    cip_number: "" || null,
    attachment_type: null,

    department_id: null,
    company_id: null,
    business_unit_id: null,
    unit_id: null,
    subunit_id: null,
    location_id: null,
    account_title_id: null,

    asset_description: "",
    asset_specification: "",
    date_needed: null,
    brand: "",
    accountability: null,
    accountable: null,
    cellphone_number: "",
    quantity: 1,
    uom_id: null,
    additional_info: "",

    letter_of_request: null,
    quotation: null,
    specification_form: null,
    tool_of_trade: null,
    attachments: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [disable, setDisable] = useState(true);
  const [editRequest, setEditRequest] = useState(false);

  const { state: transactionData } = useLocation();
  const dialog = useSelector((state) => state.booleanState.dialog);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const AttachmentRef = useRef(null);

  const [
    postRequisition,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostRequisitionApiMutation();

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
    resubmitRequest,
    {
      data: resubmitData,
      isLoading: isResubmitLoading,
      isSuccess: isResubmitSuccess,
      isError: isResubmitError,
      error: resubmitError,
    },
  ] = usePostResubmitRequisitionApiMutation();

  const [
    postRequestSms,
    { data: smsData, isLoading: isSmsLoading, isSuccess: isSmsSuccess, isError: isSmsError, error: smsError },
  ] = usePostRequisitionSmsApiMutation();

  // QUERY
  const [
    typeOfRequestTrigger,
    {
      data: typeOfRequestData = [],
      isLoading: isTypeOfRequestLoading,
      isSuccess: isTypeOfRequestSuccess,
      isError: isTypeOfRequestError,
      refetch: isTypeOfRequestRefetch,
    },
  ] = useLazyGetTypeOfRequestAllApiQuery();

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
    uomTrigger,
    {
      data: uomData = [],
      isLoading: isUnitOfMeasurementLoading,
      isSuccess: isUnitOfMeasurementSuccess,
      isError: isUnitOfMeasurementError,
      refetch: isUnitOfMeasurementRefetch,
    },
  ] = useLazyGetUnitOfMeasurementAllApiQuery();

  const {
    data: addRequestAllApi = [],
    isLoading: isRequestLoading,
    isSuccess: isRequestSuccess,
    isError: isRequestError,
    error: errorRequest,
    refetch: isRequestRefetch,
  } = useGetRequestContainerAllApiQuery({ page: page, per_page: perPage }, { refetchOnMountOrArgChange: true });

  const {
    data: transactionDataApi = [],
    isLoading: isTransactionLoading,
    isLoading: isTransactionSuccess,
    isError: isTransactionError,
    error: errorTransaction,
    refetch: isTransactionRefetch,
  } = useGetByTransactionApiQuery(
    { transaction_number: transactionData?.transaction_number },
    { refetchOnMountOrArgChange: true }
  );

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
      company_id: null,
      business_unit_id: null,
      department_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,
      remarks: "",
      attachments: null,
      asset: [{ id: null, fixed_asset_id: null, care_of: null, date_created: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "asset",
  });
  const [rowData, setRowData] = useState(fields.map(() => ({ account: null, date_created: null })));

  // console.log("rowData", rowData);

  useEffect(() => {
    if (isPostError) {
      if (postError?.status === 422) {
        dispatch(
          openToast({
            message: postError?.data?.errors.detail || postError?.data?.errors.pr_number[0],
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
      const dateNeededFormat = updateRequest?.date_needed === "-" ? null : new Date(updateRequest?.date_needed);
      const cellphoneNumber = updateRequest?.cellphone_number === "-" ? "" : updateRequest?.cellphone_number.slice(2);
      const attachmentFormat = (fields) => (updateRequest?.[fields] === "-" ? "" : updateRequest?.[fields]);

      setValue("type_of_request_id", updateRequest?.type_of_request);
      setValue("cip_number", updateRequest?.cip_number);
      setValue("attachment_type", updateRequest?.attachment_type);
      setValue("department_id", updateRequest?.department);
      setValue("company_id", updateRequest?.company);
      setValue("business_unit_id", updateRequest?.business_unit);
      setValue("unit_id", updateRequest?.unit);
      setValue("subunit_id", updateRequest?.subunit);
      setValue("location_id", updateRequest?.location);
      setValue("account_title_id", updateRequest?.account_title);
      setValue("accountability", updateRequest?.accountability);
      setValue("accountable", accountable);
      setValue("description", updateRequest?.description);

      // ASSET INFO
      setValue("asset_description", updateRequest?.asset_description);
      setValue("asset_specification", updateRequest?.asset_specification);
      setValue("date_needed", dateNeededFormat);
      setValue("quantity", updateRequest?.quantity);
      setValue("uom_id", updateRequest?.unit_of_measure);
      setValue("brand", updateRequest?.brand);
      setValue("cellphone_number", cellphoneNumber);
      setValue("additional_info", updateRequest?.additional_info);

      // ATTACHMENTS
      setValue("letter_of_request", attachmentFormat("letter_of_request"));
      setValue("quotation", attachmentFormat("quotation"));
      setValue("specification_form", attachmentFormat("specification_form"));
      setValue("tool_of_trade", attachmentFormat("tool_of_trade"));
      setValue("attachments", attachmentFormat("attachments"));

      // console.log(attachmentFormat("attachments"));
    }
  }, [updateRequest]);

  // Table Sorting --------------------------------
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

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  const attachmentValidation = (fieldName, formData) => {
    const validateAdd = addRequestAllApi?.data.find((item) => item.id === updateRequest.id);
    const validate = transactionDataApi.find((item) => item.id === updateRequest.id);

    if (watch(`${fieldName}`) === null) {
      return "";
    } else if (updateRequest[fieldName] !== null)
      if ((validateAdd || validate)?.attachments?.[fieldName]?.file_name === updateRequest?.[fieldName]?.file_name) {
        return "x";
      } else {
        return formData?.[fieldName];
      }
    else {
      return formData?.[fieldName];
    }
  };

  const onSubmitHandler = () => {
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
              {transactionDataApi.length === 0 ? "CREATE" : "RESUBMIT"}
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            if (transactionData) {
              if (transactionDataApi[0]?.can_resubmit === 0) {
                await resubmitRequest(...transactionDataApi).unwrap();
                // console.log(res?.message);
                dispatch(
                  openToast({
                    message: "Successfully Resubmitted",
                    duration: 5000,
                  })
                );
                navigate(-1);
                deleteAllRequest();
                return;
              } else if (transactionDataApi[0]?.can_resubmit === 1) {
                await resubmitRequest({
                  transaction_number: transactionData?.transaction_number,
                  ...transactionDataApi,
                }).unwrap();
                dispatch(
                  openToast({
                    message: "Successfully Resubmitted",
                    duration: 5000,
                  })
                );
                navigate(-1);
                return;
              }
            } else {
              const res = await postRequisition(addRequestAllApi).unwrap();
              deleteAllRequest();
              reset({
                letter_of_request: null,
                quotation: null,
                specification_form: null,
                tool_of_trade: null,
                attachments: null,
              });

              dispatch(
                openToast({
                  message: res?.message,
                  duration: 5000,
                })
              );
            }

            const smsData = {
              system_name: "Vladimir",
              message: "You have a pending approval",
              mobile_number: "+639913117181",
            };

            postRequestSms(smsData);
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
    console.log(value);
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
      can_resubmit,
      reference_number,
      description,
      company,
      business_unit,
      department,
      unit,
      subunit,
      location,
      account_title,
      accountability,
      accountable,

      attachments,
    } = props;
    setUpdateRequest({
      id,
      description,
      company,
      business_unit,
      department,
      unit,
      subunit,
      location,
      account_title,
      remarks,
      attachments,
      asset: [{ id, fixed_asset_id, care_of, date_created }],
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRequest({
      id: "",
      description: "",
      company_id: null,
      business_unit_id: null,
      department_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,
      remarks: "",
      attachments: null,
      asset: [{ asset_id: null, fixed_asset_id: null, care_of: null, date_created: null }],
    });
  };

  // console.log(updateEntries.map((item) => item[1]?.attachments?.letter_of_request?.file_name));

  const formInputs = () => {
    return (
      <Box>
        <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem", pt: 1 }}>
          ADD TRANSFER REQUEST
        </Typography>

        {/* <Divider /> */}

        <Box id="requestForm" className="request__form" component="form" onSubmit={handleSubmit()}>
          <Stack gap={2} py={2}>
            <Box sx={BoxStyle}>
              {/* <Typography sx={sxSubtitle}>Request Information</Typography> */}
              <CustomTextField
                control={control}
                name="description"
                label="Description"
                type="text"
                onBlur={() => handleAcquisitionDetails()}
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
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
                  const companyID = companyData?.find((item) => item.sync_id === value.company.company_sync_id);
                  const businessUnitID = businessUnitData?.find(
                    (item) => item.sync_id === value.business_unit.business_unit_sync_id
                  );

                  if (value) {
                    setValue("company_id", companyID);
                    setValue("business_unit_id", businessUnitID);
                  } else {
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
                autoComplete
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
                    error={!!errors?.company_id}
                    helperText={errors?.company_id?.message}
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
                    error={!!errors?.business_unit_id}
                    helperText={errors?.business_unit_id?.message}
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
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
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

        {/* <LoadingButton
          loading={isLoading}
          form="requestForm"
          variant="contained"
          type="submit"
          size="small"
          disabled={!transactionData ? !isDirty : updateToggle}
          fullWidth
          sx={{ gap: 1 }}
        >
          {transactionData ? <Update /> : editRequest ? <Update /> : <AddToPhotos />}{" "}
          <Typography>{transactionData ? "UPDATE" : editRequest ? "UPDATE" : "ADD"}</Typography>
        </LoadingButton> */}
        {/* <Divider orientation="vertical" /> */}
      </Box>
    );
  };
  // console.log("editRequest", editRequest);
  // console.log("updateRequest", updateRequest);

  const handleAppendItem = () => append({ id: null, fixed_asset_id: null, care_of: null, date_created: null });

  const handleAcquisitionDetails = () => {
    if (watch("description") === "" || addRequestAllApi?.data.length === 0) {
      return null;
    } else if (updateRequest?.description !== watch("description")) {
      return dispatch(
        openConfirm({
          icon: Warning,
          iconColor: "alert",
          message: (
            <Box>
              <Typography>Are you sure you want to change</Typography>
              <Typography
                sx={{
                  display: "inline-block",
                  color: "secondary.main",
                  fontWeight: "bold",
                }}
              >
                ACQUISITION DETAILS?
              </Typography>
              <Typography>
                it will apply to all Items after clicking {transactionData ? "Update" : editRequest ? "Update" : "Add"}
              </Typography>
            </Box>
          ),

          onConfirm: () => {
            dispatch(closeConfirm());
          },
          onDismiss: () => {
            setValue("description", updateRequest?.description);
          },
        })
      );
    }
  };

  const handleShowItems = (data) => {
    transactionData && data?.po_number && data?.is_removed === 0 && dispatch(openDialog()) && setItemData(data);
  };

  // * Page / Limit
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  const sxSubtitle = {
    fontWeight: "bold",
    color: "secondary.main",
    fontFamily: "Anton",
    fontSize: "16px",
  };

  const BoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    pb: "10px",
  };

  return (
    <>
      {errorRequest && errorTransaction ? (
        <ErrorFetching refetch={isRequestRefetch || isTransactionRefetch} error={errorRequest || errorTransaction} />
      ) : (
        <Box className="mcontainer" sx={{ height: "calc(100vh - 380px)" }}>
          <Button
            variant="text"
            color="secondary"
            size="small"
            startIcon={<ArrowBackIosRounded color="secondary" />}
            onClick={() => {
              navigate(-1);
              deleteAllRequest();
            }}
            disableRipple
            sx={{ width: "90px", ml: "-15px", mt: "-5px", pb: "10px", "&:hover": { backgroundColor: "transparent" } }}
          >
            <Typography color="secondary.main">Back</Typography>
          </Button>

          <Box className="request mcontainer__wrapper" p={2}>
            {/* FORM */}
            {transactionData ? (transactionData?.process_count === 1 ? formInputs() : null) : formInputs()}

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
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Autocomplete
                            {...register}
                            name="fixed_asset_id"
                            options={vTagNumberData}
                            onOpen={() => (isVTagNumberSuccess ? null : fixedAssetTrigger())}
                            loading={isVTagNumberLoading}
                            size="small"
                            filterOptions={filterOptions}
                            getOptionLabel={(option) =>
                              "(" + option.vladimir_tag_number + ")" + " - " + option.asset_description
                            }
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                              <TextField
                                color="secondary"
                                {...params}
                                label="Tag Number"
                                error={!!errors?.fixed_asset_id}
                                helperText={errors?.fixed_asset_id?.message}
                              />
                            )}
                            onChange={(_, value) => {
                              const account = vTagNumberData.find((data) => data?.id === value?.id);

                              console.log("value", value);
                              console.log("account", account);

                              if (value) {
                                setValue(
                                  "accountableAccount",
                                  account.accountable === "-" ? "Common" : account.accountable
                                );
                                setValue("dateCreated", account.created_at);
                              } else {
                                setValue("accountableAccount", null);
                                setValue("dateCreated", null);
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
                            {...register("accountableAccount")}
                            variant="outlined"
                            name="accountableAccount"
                            // label="accountableAccount"
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
                              },
                              ml: "-10px",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            {...register("dateCreated")}
                            variant="outlined"
                            name="dateCreated"
                            // label="createdAt"
                            disabled
                            type="text"
                            error={!!errors?.dateCreated}
                            helperText={errors?.dateCreated?.message}
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
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Add />}
                            onClick={() => handleAppendItem()}
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

              {/* {(isTransactionSuccess || isRequestSuccess) && (
              <CustomTablePagination
                total={(transactionDataApiPage || addRequestAllApi)?.total}
                success={isTransactionSuccess || isRequestSuccess}
                current_page={(transactionDataApiPage || addRequestAllApi)?.current_page}
                per_page={(transactionDataApiPage || addRequestAllApi)?.per_page}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            )} */}

              {/* Buttons */}
              <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
                <Typography
                  fontFamily="Anton, Impact, Roboto"
                  fontSize="18px"
                  color="secondary.main"
                  sx={{ pt: "10px" }}
                >
                  {transactionData ? "Transactions" : "Added"} :{" "}
                  {transactionData ? transactionDataApi?.length : addRequestAllApi?.data?.length} request
                </Typography>
                <Stack flexDirection="row" justifyContent="flex-end" gap={2} sx={{ pt: "10px" }}>
                  {/* {transactionData && transactionDataApi[0]?.can_edit === 1 && ( */}
                  {transactionDataApi[0]?.can_edit === 1 ? (
                    <LoadingButton
                      onClick={onSubmitHandler}
                      variant="contained"
                      size="small"
                      color="secondary"
                      startIcon={<SaveAlt color={"primary"} />}
                      loading={isPostLoading || isUpdateLoading}
                    >
                      Resubmit
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      onClick={onSubmitHandler}
                      variant="contained"
                      size="small"
                      color="secondary"
                      startIcon={<Create color={"primary"} />}
                      loading={isPostLoading || isUpdateLoading}
                    >
                      Create
                    </LoadingButton>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>
      )}

      {/* <Dialog
        open={dialog}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{
          sx: { borderRadius: "10px", width: "100%", maxWidth: "80%", p: 2, pb: 0 },
        }}
      >
        <ViewItemRequest data={itemData} />
      </Dialog> */}
    </>
  );
};

export default AddTransfer;
