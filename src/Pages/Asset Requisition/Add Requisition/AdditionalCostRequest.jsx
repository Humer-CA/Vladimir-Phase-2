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

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Box,
  Button,
  Chip,
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
  AddAlert,
  AddToPhotos,
  ArrowBackIosRounded,
  Create,
  Info,
  Remove,
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
import {
  useGetCompanyAllApiQuery,
  useLazyGetCompanyAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/Company";
import {
  useGetDepartmentAllApiQuery,
  useLazyGetDepartmentAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import {
  useGetLocationAllApiQuery,
  useLazyGetLocationAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/Location";
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
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import {
  useGetSubUnitAllApiQuery,
  useLazyGetSubUnitAllApiQuery,
} from "../../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import {
  useGetRequestContainerAllApiQuery,
  usePostRequestContainerApiMutation,
  useUpdateRequestContainerApiMutation,
} from "../../../Redux/Query/Request/RequestContainer";
import axios from "axios";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { usePostRequisitionSmsApiMutation } from "../../../Redux/Query/Request/RequisitionSms";
import CustomPatternField from "../../../Components/Reusable/CustomPatternField";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";
import ErrorFetching from "../../ErrorFetching";
import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
import {
  useGetFixedAssetAllApiQuery,
  useLazyGetFixedAssetAllApiQuery,
} from "../../../Redux/Query/FixedAsset/FixedAssets";
import moment from "moment";
import ViewItemRequest from "../ViewItemRequest";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import { useGetUnitAllApiQuery, useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";
import { useLazyGetUnitOfMeasurementAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/UnitOfMeasurement";
import { useLazyGetWarehouseAllApiQuery } from "../../../Redux/Query/Masterlist/Warehouse";

const schema = yup.object().shape({
  id: yup.string(),

  fixed_asset_id: yup
    .object()
    .required()
    .label("Vladimir Tag Number")
    .typeError("Vladimir Tag Number is a required field"),
  type_of_request_id: yup.object().required().label("Type of Request").typeError("Type of Request is a required field"),
  // .when("type_of_request", {
  //   is: (value) => value === "Personal Issued",
  //   then: (yup) => yup.label("CIP Number").required().typeError("CIP Number is a required field"),
  // })
  cip_number: yup.string().nullable(),
  attachment_type: yup.string().required().label("Attachment Type").typeError("Attachment Type is a required field"),
  receiving_warehouse_id: yup.object().required().label("Warehouse").typeError("Warehouse is a required field"),

  department_id: yup.object().required().label("Department").typeError("Department is a required field"),
  company_id: yup.object().required().label("Company").typeError("Company is a required field"),
  business_unit_id: yup.object().required().label("Business Unit").typeError("Business Unit is a required field"),
  unit_id: yup.object().required().label("Unit").typeError("Unit is a required field"),
  subunit_id: yup.object().required().label("Subunit").typeError("Subunit is a required field"),
  location_id: yup.object().required().label("Location").typeError("Location is a required field"),
  // account_title_id: yup.object().required().label("Account Title").typeError("Account Title is a required field"),
  accountability: yup.string().typeError("Accountability is a required field").required().label("Accountability"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),

  acquisition_details: yup.string().required().label("Acquisition Details"),
  asset_description: yup.string().required().label("Asset Description"),
  asset_specification: yup.string().required().label("Asset Specification"),
  date_needed: yup.date().typeError("Date Needed is a required field"),
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
  other_attachments: yup
    .mixed()
    .label("Other Attachment")
    .when("type_of_request", {
      is: (value) => value === "Capex",
      then: (yup) => yup.label("Other Attachments").required().typeError("Other Attachments is a required field"),
    }),
});

const AdditionalCostRequest = (props) => {
  const [updateRequest, setUpdateRequest] = useState({
    id: null,
    fixed_asset_id: null,
    type_of_request_id: null,
    cip_number: "",
    attachment_type: null,
    receiving_warehouse_id: null,

    department_id: null,
    company_id: null,
    business_unit_id: null,
    unit_id: null,
    subunit_id: null,
    location_id: null,
    // account_title_id: null,

    asset_description: "",
    asset_specification: "",
    brand: "",
    date_needed: null,
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
    other_attachments: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateToggle, setUpdateToggle] = useState(true);
  const [disable, setDisable] = useState(true);
  const [itemData, setItemData] = useState(null);
  const [editRequest, setEditRequest] = useState(false);

  const { state: transactionData } = useLocation();
  const dialog = useSelector((state) => state.booleanState.dialog);

  const isFullWidth = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const LetterOfRequestRef = useRef(null);
  const QuotationRef = useRef(null);
  const SpecificationRef = useRef(null);
  const ToolOfTradeRef = useRef(null);
  const OthersRef = useRef(null);

  const attachmentType = ["Budgeted", "Unbudgeted"];

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
    warehouseTrigger,
    {
      data: warehouseData = [],
      isLoading: isWarehouseLoading,
      isSuccess: isWarehouseSuccess,
      isError: isWarehouseError,
      refetch: isWarehouseRefetch,
    },
  ] = useLazyGetWarehouseAllApiQuery();

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

  const [postRequest, { data: postRequestData }] = usePostRequestContainerApiMutation();
  const [upDateRequest, { data: updateRequestData }] = useUpdateRequestContainerApiMutation();
  const [deleteRequest, { data: deleteRequestData }] = useDeleteRequestContainerApiMutation();
  const [deleteAllRequest, { data: deleteAllRequestData }] = useDeleteRequestContainerAllApiMutation();
  const [deleteRequestContainer, { data: deleteRequestContainerData }] = useDeleteRequisitionReferenceApiMutation();

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
      fixed_asset_id: null,
      type_of_request_id: null,
      cip_number: "",
      attachment_type: null,
      receiving_warehouse_id: null,

      department_id: null,
      company_id: null,
      business_unit_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      // account_title_id: null,
      acquisition_details: "",

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
      other_attachments: null,
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
          message: postError?.data?.errors.detail || Object.entries(postError?.data?.errors).at(0).at(1).at(0),
          duration: 5000,
          variant: "error",
        })
      );
    };

    errorData && showToast();
  }, [isPostError, isUpdateError]);

  useEffect(() => {
    if (transactionData?.additionalCost) {
      setDisable(false);
    }
    !transactionData && setDisable(false);
    // deleteAllRequest();
  }, [transactionData]);

  // console.log("updateRequest", updateRequest);
  // console.log("fixed_asset_id", updateRequest?.fixed_asset_id);

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

      setValue("fixed_asset_id", updateRequest?.fixed_asset_id);
      setValue("type_of_request_id", updateRequest?.type_of_request);
      setValue("cip_number", updateRequest?.cip_number);
      setValue("attachment_type", updateRequest?.attachment_type);
      setValue("receiving_warehouse_id", updateRequest?.warehouse);
      setValue("department_id", updateRequest?.department);
      setValue("company_id", updateRequest?.company);
      setValue("business_unit_id", updateRequest?.business_unit);
      setValue("unit_id", updateRequest?.unit);
      setValue("subunit_id", updateRequest?.subunit);
      setValue("location_id", updateRequest?.location);
      // setValue("account_title_id", updateRequest?.account_title);
      setValue("accountability", updateRequest?.accountability);
      setValue("accountable", accountable);
      setValue("acquisition_details", updateRequest?.acquisition_details);

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
      setValue("other_attachments", attachmentFormat("other_attachments"));
    }
  }, [updateRequest]);

  // console.log("errors", errors);

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

  const handleEditRequestData = () => {
    if (transactionData && updateRequest) {
      transactionDataApi[0]?.can_edit === 1 || transactionData?.status === "Return";
    } else if (editRequest) {
      setEditRequest(true) && false;
    } else {
      setEditRequest(false) && true;
    }
  };

  const handleCloseDrawer = () => {
    dispatch(closeDrawer());
  };

  const attachmentValidation = (fieldName, formData) => {
    const validate = transactionDataApi.find((item) => item.id === updateRequest.id);
    if (watch(`${fieldName}`) === null) {
      return "";
    } else if (updateRequest[fieldName] !== null)
      if (validate?.attachments?.[fieldName]?.file_name === updateRequest?.[fieldName]?.file_name) {
        return "x";
      } else {
        return formData?.[fieldName];
      }
    else {
      return formData?.[fieldName];
    }
  };

  console.log(errors);

  //  * CONTAINER
  // Adding of Request
  const addRequestHandler = (formData) => {
    const cipNumberFormat = formData?.cip_number === "" ? "" : formData?.cip_number?.toString();
    const updatingCoa = (fields, name) =>
      updateRequest ? formData?.[fields]?.id : formData?.[fields]?.[name]?.id.toString();
    const accountableFormat =
      formData?.accountable === null ? "" : formData?.accountable?.general_info?.full_id_number_full_name?.toString();
    const dateNeededFormat = moment(new Date(formData.date_needed)).format("YYYY-MM-DD");
    const cpFormat = formData?.cellphone_number === "" ? "" : "09" + formData?.cellphone_number?.toString();

    const data = {
      is_addcost: 1,
      fixed_asset_id: formData?.fixed_asset_id?.id?.toString(),
      type_of_request_id: formData?.type_of_request_id?.id?.toString(),
      cip_number: cipNumberFormat,
      attachment_type: formData?.attachment_type?.toString(),
      receiving_warehouse_id: formData?.receiving_warehouse_id?.id?.toString(),

      department_id: formData?.department_id.id?.toString(),
      company_id: updatingCoa("company_id", "company"),
      business_unit_id: updatingCoa("business_unit_id", "business_unit"),
      unit_id: formData.unit_id.id?.toString(),
      subunit_id: formData.subunit_id.id?.toString(),
      location_id: formData?.location_id.id?.toString(),
      // account_title_id: formData?.account_title_id.id?.toString(),
      accountability: formData?.accountability?.toString(),
      accountable: accountableFormat,

      acquisition_details: formData?.acquisition_details?.toString(),
      asset_description: formData?.asset_description?.toString(),
      asset_specification: formData?.asset_specification?.toString(),
      date_needed: moment(new Date(formData.date_needed)).format("YYYY-MM-DD"),
      cellphone_number: formData?.cellphone_number === "" ? "" : "09" + formData?.cellphone_number.toString(),

      brand: formData?.brand?.toString(),
      quantity: formData?.quantity?.toString(),
      uom_id: formData?.uom_id?.id?.toString(),
      additional_info: formData?.additional_info?.toString(),

      letter_of_request: updateRequest && attachmentValidation("letter_of_request", formData),

      quotation: updateRequest && attachmentValidation("quotation", formData),
      specification_form: updateRequest && attachmentValidation("specification_form", formData),
      tool_of_trade: updateRequest && attachmentValidation("tool_of_trade", formData),
      other_attachments: updateRequest && attachmentValidation("other_attachments", formData),
    };

    const payload = new FormData();
    Object.entries(data).forEach((item) => {
      const [name, value] = item;
      payload.append(name, value);
    });

    const token = localStorage.getItem("token");

    const submitData = () => {
      setIsLoading(true);
      axios
        .post(
          `${process.env.VLADIMIR_BASE_URL}/${
            transactionData
              ? `update-request/${updateRequest?.reference_number}`
              : editRequest
              ? `update-container/${updateRequest?.id}`
              : "request-container"
          }`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // Authorization: `Bearer 583|KavZ7vEXyUY7FiHQGIMcTImftzyRnZorxbtn4S9a`,
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          dispatch(
            openToast({
              message: result?.data?.message || result?.data?.message,
              duration: 5000,
            })
          );
          setIsLoading(false);
          transactionData
            ? reset()
            : reset({
                fixed_asset_id: formData?.fixed_asset_id,
                type_of_request_id: formData?.type_of_request_id,
                attachment_type: formData?.attachment_type,
                receiving_warehouse_id: formData?.receiving_warehouse_id,

                company_id: formData?.company_id,
                business_unit_id: formData?.business_unit_id,
                department_id: formData?.department_id,
                unit_id: formData?.unit_id,
                subunit_id: formData?.subunit_id,
                location_id: formData?.location_id,
                // account_title_id: formData?.account_title_id,
                acquisition_details: formData?.acquisition_details,

                asset_description: "",
                asset_specification: "",
                brand: "",
                date_needed: null,
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
                other_attachments: null,
              });
        })
        .then(() => {
          transactionData ? setDisable(true) : setDisable(false);
          setUpdateToggle(true);
          isTransactionRefetch();
          dispatch(requestContainerApi.util.invalidateTags(["RequestContainer"]));
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          dispatch(
            openToast({
              message:
                (Object.entries(err?.response?.data?.errors).at(0).at(1).at(0) &&
                  err?.response?.data?.errors?.detail) ||
                err?.response?.data?.errors[0]?.detail ||
                err?.response?.data?.message,
              duration: 5000,
              variant: "error",
            })
          );
        });
    };

    const validation = () => {
      const coaValidation = (name, value) => {
        transactionDataApi.every((item) => item?.[name]?.id !== watch(value)?.id);
      };
      if (transactionData) {
        return (
          (transactionData &&
            (coaValidation("department", "department_id") ||
              coaValidation("unit", "unit_id") ||
              coaValidation("subunit", "subunit_id") ||
              coaValidation("location", "location_id"))) ||
          false
        );
      } else {
        if (addRequestAllApi.every((item) => item?.department?.id !== watch("department_id")?.id)) {
          return true;
        }
        if (addRequestAllApi.every((item) => item?.unit?.id !== watch("unit_id")?.id)) {
          return true;
        }
        if (addRequestAllApi.every((item) => item?.subunit?.id !== watch("subunit_id")?.id)) {
          return true;
        }
        if (addRequestAllApi.every((item) => item?.location?.id !== watch("location_id")?.id)) {
          return true;
        }
        return false;
      }
    };

    const addConfirmation = () => {
      dispatch(
        openConfirm({
          icon: Warning,
          iconColor: "alert",
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
                CHANGE THE COA?
              </Typography>
              <Typography>it will apply to all Items</Typography>
            </Box>
          ),

          onConfirm: () => {
            dispatch(onLoading());
            submitData();
            dispatch(closeConfirm());
          },
        })
      );
    };

    transactionData
      ? validation()
        ? addConfirmation()
        : submitData()
      : addRequestAllApi.length === 0
      ? submitData()
      : validation()
      ? addConfirmation()
      : submitData();
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
                const res = await resubmitRequest(...transactionDataApi).unwrap();

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
                const res = await resubmitRequest({
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
              // console.log(res?.message);
              deleteAllRequest();
              reset({
                letter_of_request: null,
                quotation: null,
                specification_form: null,
                tool_of_trade: null,
                other_attachments: null,
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
            if (transactionData) {
              if (transactionDataApi[0]?.can_resubmit === 0) {
                const res = await resubmitRequest(...transactionDataApi).unwrap();
                console.log(res?.message);

                navigate(-1);
                deleteAllRequest();
              } else if (transactionDataApi[0]?.can_resubmit === 1) {
                resubmitRequest({
                  transaction_number: transactionData?.transaction_number,
                  ...transactionDataApi,
                });
                navigate(-1);

                return;
              }
            } else {
              const res = await postRequisition(addRequestAllApi).unwrap();
              console.log(res?.message);
              deleteAllRequest();
              reset({
                letter_of_request: null,
                quotation: null,
                specification_form: null,
                tool_of_trade: null,
                other_attachments: null,
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

  const onDeleteReferenceHandler = async (id) => {
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
            let result = await deleteRequestContainer(id).unwrap();
            // console.log(result);
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
          value={value}
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

  const onUpdateHandler = (props) => {
    const {
      id,
      can_resubmit,
      reference_number,
      fixed_asset,
      type_of_request,
      cip_number,
      attachment_type,
      warehouse,

      department,
      company,
      business_unit,
      unit,
      subunit,
      location,
      // account_title,
      accountability,
      accountable,

      acquisition_details,
      asset_description,
      asset_specification,
      date_needed,
      quantity,
      unit_of_measure,
      brand,
      cellphone_number,
      additional_info,
      attachments,
    } = props;
    setUpdateRequest({
      id,
      can_resubmit,
      fixed_asset_id: fixed_asset,
      reference_number,
      type_of_request,
      cip_number,
      attachment_type,
      warehouse,

      department,
      company,
      business_unit,
      unit,
      subunit,
      location,
      // account_title,
      accountability,
      accountable,
      acquisition_details,

      asset_description,
      asset_specification,
      date_needed,
      brand,
      quantity,
      unit_of_measure,
      cellphone_number,
      additional_info,

      letter_of_request: attachments?.letter_of_request,
      quotation: attachments?.quotation,
      specification_form: attachments?.specification_form,
      tool_of_trade: attachments?.tool_of_trade,
      other_attachments: attachments?.other_attachments,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRequest({
      can_resubmit: null,
      fixed_asset_id: null,
      type_of_request_id: null,
      cip_number: "",
      attachment_type: null,
      receiving_warehouse_id: null,

      company_id: null,
      business_unit_id: null,
      department_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      // account_title_id: null,
      acquisition_details: "",

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
      other_attachments: null,
    });
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

  const formInputs = () => {
    return (
      <Box>
        <Typography color="primary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
          ADDITIONAL COST
        </Typography>

        <Divider />

        <Box id="requestForm" className="request__form" component="form" onSubmit={handleSubmit(addRequestHandler)}>
          <Stack gap={2}>
            <Box sx={BoxStyle}>
              <Typography sx={sxSubtitle}>Request Information</Typography>
              <CustomAutoComplete
                control={control}
                name="fixed_asset_id"
                options={vTagNumberData}
                onOpen={() => (isVTagNumberSuccess ? null : fixedAssetTrigger())}
                loading={isVTagNumberLoading}
                disabled={
                  addRequestAllApi.length !== 0 ? true : updateRequest || addRequestAllApi === 0 ? disable : false
                }
                size="small"
                filterOptions={filterOptions}
                getOptionLabel={(option) => "(" + option.vladimir_tag_number + ")" + " - " + option.asset_description}
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
                  if (value) {
                    setValue("type_of_request_id", value?.type_of_request);
                    setValue("attachment_type", value?.attachment_type);
                    setValue("receiving_warehouse_id", value?.receiving_warehouse_id);
                    setValue("department_id", value?.department);
                    setValue("company_id", value?.company);
                    setValue("business_unit_id", value?.business_unit);
                    setValue("unit_id", value?.unit);
                    setValue("subunit_id", value?.subunit);
                    setValue("location_id", value?.location);
                    // setValue("account_title_id", value?.account_title);
                    setValue("accountability", value?.accountability);
                    value.accountability === "Personal Issued" &&
                      setValue("accountable", {
                        general_info: {
                          full_id_number: value.accountable.split(" ")[0],
                          full_id_number_full_name: value.accountable,
                        },
                      });
                  } else {
                    setValue("type_of_request_id", null);
                    setValue("attachment_type", null);
                    setValue("receiving_warehouse_id", null);
                    setValue("department_id", null);
                    setValue("company_id", null);
                    setValue("business_unit_id", null);
                    setValue("unit_id", null);
                    setValue("subunit_id", null);
                    setValue("location_id", null);
                    // setValue("account_title_id", null);
                    setValue("accountability", null);
                    setValue("accountable", null);
                  }
                  // console.log("value", value);
                  return value;
                }}
              />

              <CustomAutoComplete
                control={control}
                name="type_of_request_id"
                options={typeOfRequestData}
                onOpen={() => (isTypeOfRequestSuccess ? null : typeOfRequestTrigger())}
                loading={isTypeOfRequestLoading}
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.length !== 0}
                disabled={updateRequest && disable}
                getOptionLabel={(option) => option.type_of_request_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    label="Type of Request"
                    error={!!errors?.type_of_request_id}
                    helperText={errors?.type_of_request_id?.message}
                  />
                )}
                onChange={(_, value) => {
                  setValue("cip_number", "");
                  return value;
                }}
              />

              {watch("type_of_request_id")?.type_of_request_name === "Capex" && (
                <CustomTextField
                  control={control}
                  name="cip_number"
                  label="CIP Number (Optional)"
                  type="text"
                  disabled={updateRequest && disable}
                  error={!!errors?.cip_number}
                  helperText={errors?.cip_number?.message}
                  fullWidth
                  multiline
                />
              )}

              <CustomTextField
                control={control}
                name="acquisition_details"
                label="Acquisition Details"
                type="text"
                disabled={updateRequest && disable}
                onBlur={() => handleAcquisitionDetails()}
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.length !== 0}
                error={!!errors?.acquisition_details}
                helperText={errors?.acquisition_details?.message}
                fullWidth
                multiline
              />

              <CustomAutoComplete
                control={control}
                name="attachment_type"
                options={attachmentType}
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.length !== 0}

                disabled={updateRequest && disable}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    label="Attachment Type"
                    error={!!errors?.attachment_type}
                    helperText={errors?.attachment_type?.message}
                  />
                )}
              />

              <CustomAutoComplete
                control={control}
                name="receiving_warehouse_id"
                options={warehouseData}
                onOpen={() => (isWarehouseSuccess ? null : warehouseTrigger())}
                loading={isWarehouseLoading}
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.length !== 0}
                disabled={updateRequest && disable}
                getOptionLabel={(option) => option.warehouse_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    label="Warehouse"
                    error={!!errors?.receiving_warehouse_id}
                    helperText={errors?.receiving_warehouse_id?.message}
                  />
                )}
              />
            </Box>

            <Divider />

            <Box sx={BoxStyle}>
              <Typography sx={sxSubtitle}>Charging Information</Typography>
              <CustomAutoComplete
                autoComplete
                control={control}
                name="department_id"
                disabled={updateRequest && disable}
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
                disabled={updateRequest && disable}
                options={departmentData?.filter((obj) => obj?.id === watch("department_id")?.id)[0]?.unit || []}
                onOpen={() =>
                  isUnitSuccess ? null : (departmentTrigger(), unitTrigger(), subunitTrigger(), locationTrigger())
                }
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
                disabled={updateRequest && disable}
                options={
                  unitData?.filter((obj) => {
                    return obj?.id === watch("unit_id")?.id;
                  })[0]?.subunit || []
                }
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
                disabled={updateRequest && disable}
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
                control={control}
                // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.length !== 0}
                options={accountTitleData}
                onOpen={() => (isAccountTitleSuccess ? null : accountTitleTrigger())}
                loading={isAccountTitleLoading}
                disabled={updateRequest && disable}
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

              <CustomAutoComplete
                autoComplete
                name="accountability"
                control={control}
                options={["Personal Issued", "Common"]}
                disabled={updateRequest && disable}
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
                  disabled={updateRequest && disable}
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
            </Box>

            <Divider />

            <Box sx={BoxStyle}>
              <Typography sx={sxSubtitle}>Asset Information</Typography>
              <CustomTextField
                control={control}
                name="asset_description"
                label="Asset Description"
                type="text"
                disabled={updateRequest && disable}
                error={!!errors?.asset_description}
                helperText={errors?.asset_description?.message}
                fullWidth
                multiline
              />
              <CustomTextField
                control={control}
                name="asset_specification"
                label="Asset Specification"
                type="text"
                disabled={updateRequest && disable}
                error={!!errors?.asset_specification}
                helperText={errors?.asset_specification?.message}
                fullWidth
                multiline
              />

              <CustomTextField
                control={control}
                name="brand"
                label="Brand"
                type="text"
                disabled={updateRequest && disable}
                error={!!errors?.brand}
                helperText={errors?.brand?.message}
                fullWidth
              />

              <CustomDatePicker
                control={control}
                name="date_needed"
                label="Date Needed"
                size="small"
                disabled={updateRequest && disable}
                error={!!errors?.date_needed}
                helperText={errors?.date_needed?.message}
                minDate={new Date()}
                reduceAnimations
              />

              <CustomNumberField
                control={control}
                name="quantity"
                label="Quantity"
                type="number"
                disabled={updateRequest && disable}
                error={!!errors?.quantity}
                helperText={errors?.quantity?.message}
                fullWidth
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return floatValue >= 1;
                }}
              />

              <CustomAutoComplete
                control={control}
                name="uom_id"
                options={uomData}
                onOpen={() => (isUnitOfMeasurementSuccess ? null : uomTrigger())}
                loading={isUnitOfMeasurementLoading}
                disabled={updateRequest && disable}
                getOptionLabel={(option) => option.uom_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    label="UOM"
                    error={!!errors?.uom_id}
                    helperText={errors?.uom_id?.message}
                  />
                )}
              />

              <CustomPatternField
                control={control}
                name="cellphone_number"
                label="Cellphone # (Optional)"
                type="text"
                disabled={updateRequest && disable}
                error={!!errors?.cellphone_number}
                helperText={errors?.cellphone_number?.message}
                format="(09##) - ### - ####"
                // allowEmptyFormatting
                valueIsNumericString
                fullWidth
              />
              <CustomTextField
                control={control}
                name="additional_info"
                label="Additional Info. (Optional)"
                type="text"
                disabled={updateRequest && disable}
                fullWidth
                multiline
              />
            </Box>

            <Divider />

            {/* Attachments */}
            <Box sx={BoxStyle}>
              <Typography sx={sxSubtitle}>Attachments</Typography>
              <Stack flexDirection="row" gap={1} alignItems="center">
                {watch("letter_of_request") !== null ? (
                  <UpdateField
                    label={"Letter of Request"}
                    // value={
                    //   transactionDataApi.length === 0
                    //     ? watch("letter_of_request")?.name || updateRequest?.letter_of_request?.file_name
                    //     : watch("letter_of_request")?.name
                    // }
                    value={watch("letter_of_request")?.name || updateRequest?.letter_of_request?.file_name}
                  />
                ) : (
                  <CustomAttachment
                    control={control}
                    name="letter_of_request"
                    label="Letter of Request"
                    disabled={updateRequest && disable}
                    inputRef={LetterOfRequestRef}
                    error={!!errors?.letter_of_request?.message}
                    helperText={errors?.letter_of_request?.message}
                  />
                )}

                {watch("letter_of_request") !== null && (
                  <RemoveFile title="Letter of Request" value="letter_of_request" />
                )}
              </Stack>

              <Stack flexDirection="row" gap={1} alignItems="center">
                {watch("quotation") !== null ? (
                  <UpdateField
                    label={"Quotation"}
                    value={watch("quotation")?.name || updateRequest?.quotation?.file_name}
                  />
                ) : (
                  <CustomAttachment
                    control={control}
                    name="quotation"
                    label="Quotation"
                    disabled={updateRequest && disable}
                    inputRef={QuotationRef}
                  />
                )}
                {watch("quotation") !== null && <RemoveFile title="Quotation" value="quotation" />}
              </Stack>

              <Stack flexDirection="row" gap={1} alignItems="center">
                {watch("specification_form") !== null ? (
                  <UpdateField
                    label={"Specification Form"}
                    value={watch("specification_form")?.name || updateRequest?.specification_form?.file_name}
                  />
                ) : (
                  <CustomAttachment
                    control={control}
                    name="specification_form"
                    label="Specification (Form)"
                    disabled={updateRequest && disable}
                    inputRef={SpecificationRef}
                    // updateData={updateRequest}
                  />
                )}
                {watch("specification_form") !== null && (
                  <RemoveFile title="Specification" value="specification_form" />
                )}
              </Stack>

              <Stack flexDirection="row" gap={1} alignItems="center">
                {watch("tool_of_trade") !== null ? (
                  <UpdateField
                    label={"Tool of Trade"}
                    value={watch("tool_of_trade")?.name || updateRequest?.tool_of_trade?.file_name}
                  />
                ) : (
                  <CustomAttachment
                    control={control}
                    name="tool_of_trade"
                    label="Tool of Trade"
                    disabled={updateRequest && disable}
                    inputRef={ToolOfTradeRef}
                  />
                )}
                {watch("tool_of_trade") !== null && <RemoveFile title="Tool of Trade" value="tool_of_trade" />}
              </Stack>

              <Stack flexDirection="row" gap={1} alignItems="center">
                {watch("other_attachments") !== null ? (
                  <UpdateField
                    label={"Other Attachments"}
                    value={watch("other_attachments")?.name || updateRequest?.other_attachments?.file_name}
                  />
                ) : (
                  <CustomAttachment
                    control={control}
                    name="other_attachments"
                    label="Other Attachments"
                    disabled={updateRequest && disable}
                    inputRef={OthersRef}
                    error={!!errors?.other_attachments?.message}
                    helperText={errors?.other_attachments?.message}
                  />
                )}
                {watch("other_attachments") !== null && (
                  <RemoveFile title="Other Attachments" value="other_attachments" />
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ pb: 1, mb: 1 }} />

        <LoadingButton
          loading={isLoading}
          form="requestForm"
          variant="contained"
          type="submit"
          size="small"
          disabled={!transactionData ? !isValid : updateToggle}
          fullWidth
          sx={{ gap: 1 }}
        >
          {transactionData ? <Update /> : <AddToPhotos />} <Typography>{transactionData ? "UPDATE" : "ADD"}</Typography>
        </LoadingButton>
        <Divider orientation="vertical" />
      </Box>
    );
  };

  const handleAcquisitionDetails = () => {
    if (watch("acquisition_details") === "" || addRequestAllApi.length === 0) {
      return null;
    } else if (updateRequest?.acquisition_details !== watch("acquisition_details")) {
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
            setValue("acquisition_details", updateRequest?.acquisition_details);
          },
        })
      );
    }
  };

  const handleShowItems = (data) => {
    transactionData && data?.po_number && data?.is_removed === 0 && dispatch(openDialog()) && setItemData(data);
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
            Back
          </Button>

          <Box className="request request__wrapper" p={2}>
            {/* FORM */}
            {transactionData ? (transactionData?.process_count === 1 ? formInputs() : null) : formInputs()}

            {/* TABLE */}
            <Box className="request__table">
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
                  {`${transactionData ? "TRANSACTION NO." : "FIXED ASSET"}`}{" "}
                  {transactionData && transactionData?.transaction_number}
                </Typography>

                {transactionData && (
                  <Chip
                    size="small"
                    variant="filled"
                    sx={{
                      color: "white",
                      fontSize: "0.7rem",
                      backgroundColor: "tertiary.light",
                    }}
                    label={transactionData?.status}
                  />
                )}
              </Stack>
              <TableContainer className="request__th-body  request__wrapper">
                <Table className="request__table " stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold!important",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      <TableCell className="tbl-cell">{transactionData ? "Ref No." : "Index"}</TableCell>
                      <TableCell className="tbl-cell">Vladimir Tag Number</TableCell>
                      <TableCell className="tbl-cell">Type of Request</TableCell>
                      <TableCell className="tbl-cell">Acquisition Details</TableCell>
                      {/* <TableCell className="tbl-cell">Attachment Type</TableCell> */}
                      <TableCell className="tbl-cell">Warehouse</TableCell>
                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                      <TableCell className="tbl-cell">Accountability</TableCell>
                      <TableCell className="tbl-cell">Asset Information</TableCell>
                      <TableCell className="tbl-cell">Brand</TableCell>
                      <TableCell className="tbl-cell">Date Needed</TableCell>

                      {addRequestAllApi && !transactionDataApi[0]?.po_number && (
                        <>
                          <TableCell className="tbl-cell text-center">Quantity</TableCell>
                          <TableCell className="tbl-cell text-center">UOM</TableCell>
                        </>
                      )}
                      {transactionData && transactionDataApi[0]?.po_number && (
                        <>
                          <TableCell className="tbl-cell text-center">Ordered</TableCell>
                          <TableCell className="tbl-cell text-center">Delivered</TableCell>
                          <TableCell className="tbl-cell text-center">Remaining</TableCell>
                          <TableCell className="tbl-cell text-center">Cancelled</TableCell>
                        </>
                      )}
                      {transactionData &&
                        // transactionDataApi[0]?.po_number &&
                        transactionDataApi[0]?.is_removed === 1 && (
                          <>
                            <TableCell className="tbl-cell text-center">Ordered</TableCell>
                            <TableCell className="tbl-cell text-center">Delivered</TableCell>
                            <TableCell className="tbl-cell text-center">Remaining</TableCell>
                            <TableCell className="tbl-cell text-center">Cancelled</TableCell>
                          </>
                        )}

                      <TableCell className="tbl-cell">Cellphone #</TableCell>
                      <TableCell className="tbl-cell">Additional Info.</TableCell>
                      <TableCell className="tbl-cell">Attachments</TableCell>
                      {transactionData?.status === "For Approval of Approver 1" && (
                        <TableCell className="tbl-cell">Action</TableCell>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(updateRequest && isTransactionLoading) || isRequestLoading ? (
                      <LoadingData />
                    ) : (transactionData ? transactionDataApi?.length === 0 : addRequestAllApi?.length === 0) ? (
                      <NoRecordsFound heightData="small" />
                    ) : (
                      <>
                        {(transactionData ? transactionDataApi : addRequestAllApi)?.map((data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                              bgcolor: data?.is_removed === 1 ? "#ff00002f" : null,
                              "*": { color: data?.is_removed === 1 ? "black!important" : null },
                            }}
                          >
                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell tr-cen-pad45 ">
                              {transactionData ? data?.reference_number : index + 1}
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              <Typography fontSize={14} fontWeight={600}>
                                {data.fixed_asset?.vladimir_tag_number || data.fixed_asset}
                              </Typography>
                              <Typography fontSize={12} fontWeight={600} color="primary.main">
                                {data.is_addcost === 1 && "Additional Cost"}
                              </Typography>
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              <Typography fontWeight={600}>{data.type_of_request?.type_of_request_name}</Typography>
                              <Typography
                                fontWeight={400}
                                fontSize={12}
                                color={data.attachment_type === "Budgeted" ? "success.main" : "primary.dark"}
                              >
                                {data.attachment_type}
                              </Typography>
                            </TableCell>
                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.acquisition_details}
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.warehouse?.warehouse_name}
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.business_unit?.business_unit_code}) - ${data.business_unit?.business_unit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.unit?.unit_code}) - ${data.unit?.unit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                              </Typography>
                              {/* <Typography fontSize={10} color="gray">
                                {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                              </Typography> */}
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.accountability === "Personal Issued" ? (
                                <>
                                  <Typography fontSize={12}>
                                    {data?.accountable?.general_info?.full_id_number || data?.accountable}
                                  </Typography>
                                  <Typography fontSize={12}>{data?.accountable?.general_info?.full_name}</Typography>
                                </>
                              ) : (
                                "Common"
                              )}
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              <Typography fontWeight={600} fontSize="14px" color="secondary.main">
                                {data.asset_description}
                              </Typography>
                              <Typography fontSize="12px" color="text.light">
                                {data.asset_specification}
                              </Typography>
                            </TableCell>
                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.brand}
                            </TableCell>
                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.date_needed}
                            </TableCell>

                            {addRequestAllApi && !data.po_number && (
                              <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                {data.quantity}
                              </TableCell>
                            )}

                            {addRequestAllApi && !data.po_number && (
                              <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                {data.unit_of_measure?.uom_name}
                              </TableCell>
                            )}

                            {transactionData && data.po_number && (
                              <>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.ordered}
                                </TableCell>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.delivered}
                                </TableCell>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.remaining}
                                </TableCell>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.cancelled}
                                </TableCell>
                              </>
                            )}

                            {!addRequestAllApi && transactionData && !data.po_number && data?.is_removed === 1 && (
                              <>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.ordered}
                                </TableCell>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.delivered}
                                </TableCell>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.remaining}
                                </TableCell>
                                <TableCell onClick={() => handleShowItems(data)} className="tbl-cell text-center">
                                  {data.cancelled}
                                </TableCell>
                              </>
                            )}

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.cellphone_number === null ? "-" : data.cellphone_number}
                            </TableCell>
                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data.additional_info}
                            </TableCell>

                            <TableCell onClick={() => handleShowItems(data)} className="tbl-cell">
                              {data?.attachments?.letter_of_request && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Letter of Request:
                                  </Typography>
                                  {data?.attachments?.letter_of_request?.file_name}
                                </Stack>
                              )}

                              {data?.attachments?.quotation && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Quotation:
                                  </Typography>
                                  {data?.attachments?.quotation?.file_name}
                                </Stack>
                              )}

                              {data?.attachments?.specification_form && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Specification:
                                  </Typography>
                                  {data?.attachments?.specification_form?.file_name}
                                </Stack>
                              )}

                              {data?.attachments?.tool_of_trade && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Tool of Trade:
                                  </Typography>
                                  {data?.attachments?.tool_of_trade?.file_name}
                                </Stack>
                              )}

                              {data?.attachments?.other_attachments && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Other Attachment:
                                  </Typography>
                                  {data?.attachments?.other_attachments?.file_name}
                                </Stack>
                              )}
                            </TableCell>
                            {transactionData?.status === "For Approval of Approver 1" && (
                              <TableCell className="tbl-cell">
                                {data?.is_removed === 0 && (
                                  <ActionMenu
                                    // DATA
                                    data={data}
                                    status={data?.status}
                                    hideArchive
                                    addRequestAllApi
                                    transactionData={transactionData ? true : false}
                                    // EDIT request
                                    editRequestData={() => handleEditRequestData()}
                                    editRequest={editRequest}
                                    setEditRequest={setEditRequest}
                                    setDisable={setDisable}
                                    onUpdateHandler={onUpdateHandler}
                                    onUpdateResetHandler={onUpdateResetHandler}
                                    setUpdateToggle={setUpdateToggle}
                                    //DELETE request
                                    onDeleteHandler={
                                      (transactionData && addRequestAllApi?.length === 0) ||
                                      addRequestAllApi?.length === 1
                                        ? false
                                        : onDeleteHandler
                                    }
                                    disableDelete={
                                      transactionDataApi?.length === 1 && data.status !== "For Approval of Approver 1"
                                        ? true
                                        : false
                                    }
                                    onDeleteReferenceHandler={
                                      transactionData &&
                                      transactionData?.item_count !== 1 &&
                                      transactionDataApi.length !== 1 &&
                                      onDeleteReferenceHandler
                                    }
                                  />
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Buttons */}
              <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
                <Typography
                  fontFamily="Anton, Impact, Roboto"
                  fontSize="18px"
                  color="secondary.main"
                  sx={{ pt: "10px" }}
                >
                  {transactionData ? "Transactions" : "Added"} :{" "}
                  {transactionData ? transactionDataApi?.length : addRequestAllApi?.length} request
                </Typography>

                {transactionData?.status === "For Approval of Approver 1" && (
                  <Stack flexDirection="row" justifyContent="flex-end" gap={2} sx={{ pt: "10px" }}>
                    {transactionData?.status === "For Approval of Approver 1" ||
                    transactionData?.status === "Returned" ? (
                      <LoadingButton
                        onClick={onSubmitHandler}
                        variant="contained"
                        size="small"
                        color="secondary"
                        startIcon={<SaveAlt color={"primary"} />}
                        disabled={
                          transactionDataApi[0]?.can_edit === 0
                            ? isTransactionLoading
                              ? disable
                              : null
                            : transactionDataApi.length === 0
                            ? true
                            : false
                        }
                        loading={isPostLoading}
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
                        disabled={isRequestLoading || addRequestAllApi?.length === 0}
                        loading={isPostLoading}
                      >
                        Create
                      </LoadingButton>
                    )}
                  </Stack>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      )}

      <Dialog
        open={dialog}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{
          sx: { borderRadius: "10px", width: "100%", maxWidth: "80%", p: 2, pb: 0 },
        }}
      >
        <ViewItemRequest data={itemData} />
      </Dialog>
    </>
  );
};

export default AdditionalCostRequest;
