import React, { useEffect, useRef, useState } from "react";
import "../../../Style/Request/request.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomAttachment from "../../../Components/Reusable/CustomAttachment";
import { LoadingData } from "../../../Components/LottieFiles/LottieComponents";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
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
import { useDispatch } from "react-redux";
import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Company";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Department";
import { useGetLocationAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Location";
import { useGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";
import {
  useGetByTransactionApiQuery,
  usePostRequisitionApiMutation,
  usePostResubmitRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
  useDeleteRequisitionReferenceApiMutation,
  useGetByTransactionPageApiQuery,
} from "../../../Redux/Query/Request/Requisition";

import { useGetTypeOfRequestAllApiQuery } from "../../../Redux/Query/Masterlist/TypeOfRequest";
import { useLocation, useNavigate } from "react-router-dom";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import { useGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/SubUnit";
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

const schema = yup.object().shape({
  id: yup.string(),

  type_of_request_id: yup.object().required().label("Type of Request").typeError("Type of Request is a required field"),
  attachment_type: yup.string().required().label("Attachment Type").typeError("Attachment Type is a required field"),

  // company_id: yup
  //   .string()
  //   .transform((value) => {
  //     return value?.id.toString();
  //   })
  //   .required()
  //   .label("Company"),

  subunit_id: yup.object().required().label("Subunit").typeError("Subunit is a required field"),
  department_id: yup.object().required().label("Department").typeError("Department is a required field"),
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
  acquisition_details: yup.string().required().label("Acquisition Details"),

  asset_description: yup.string().required().label("Asset Description"),
  asset_specification: yup.string().required().label("Asset Specification"),
  brand: yup.string().required().label("Brand"),
  quantity: yup.number().required().label("Quantity"),
  cellphone_number: yup.string().nullable().label("Cellphone Number"),
  additional_info: yup.string().nullable().label("Additional Info"),

  letter_of_request: yup.mixed().label("Letter of Request"),
  quotation: yup.mixed().label("Quotation"),
  specification_form: yup.mixed().label("Specification"),
  tool_of_trade: yup.mixed().label("Tool of Trade"),
  other_attachments: yup.mixed().label("Other Attachment"),
});

const AdditionalCostRequest = (props) => {
  const [updateRequest, setUpdateRequest] = useState({
    id: null,
    is_addcost: null,
    type_of_request_id: null,
    attachment_type: null,

    company_id: null,
    department_id: null,
    subunit_id: null,
    location_id: null,
    account_title_id: null,

    asset_description: "",
    asset_specification: "",
    brand: "",
    accountability: null,
    accountable: null,
    cellphone_number: "",
    quantity: 1,
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

  const { state: transactionData } = useLocation();

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

  const {
    data: typeOfRequestData = [],
    isLoading: isTypeOfRequestLoading,
    isSuccess: isTypeOfRequestSuccess,
    isError: isTypeOfRequestError,
    refetch: isTypeOfRequestRefetch,
  } = useGetTypeOfRequestAllApiQuery();

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
    data: locationData = [],
    isLoading: isLocationLoading,
    isSuccess: isLocationSuccess,
    isError: isLocationError,
    refetch: isLocationRefetch,
  } = useGetLocationAllApiQuery();

  const {
    data: accountTitleData = [],
    isLoading: isAccountTitleLoading,
    isSuccess: isAccountTitleSuccess,
    isError: isAccountTitleError,
    refetch: isAccountTitleRefetch,
  } = useGetAccountTitleAllApiQuery();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();

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

  const [postRequest, { data: postRequestData }] = usePostRequestContainerApiMutation();
  const [upDateRequest, { data: updateRequestData }] = useUpdateRequestContainerApiMutation();
  const [deleteRequest, { data: deleteRequestData }] = useDeleteRequestContainerApiMutation();
  const [deleteAllRequest, { data: deleteAllRequestData }] = useDeleteRequestContainerAllApiMutation();
  const [deleteRequestContainer, { data: deleteRequestContainerData }] = useDeleteRequisitionReferenceApiMutation();

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
      type_of_request_id: null,
      attachment_type: null,

      company_id: null,
      department_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,
      acquisition_details: "",

      asset_description: "",
      asset_specification: "",
      brand: "",
      accountability: null,
      accountable: null,
      cellphone_number: "",
      quantity: 1,
      additional_info: "",

      letter_of_request: null,
      quotation: null,
      specification_form: null,
      tool_of_trade: null,
      other_attachments: null,
    },
  });

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

  // useEffect(() => {
  //   if (isPostSuccess || isUpdateSuccess) {
  //     reset();
  //     handleCloseDrawer();
  //     dispatch(
  //       openToast({
  //         message: postData?.message || updateData?.message,
  //         duration: 5000,
  //       })
  //     );

  //     // setTimeout(() => {
  //     //   onUpdateResetHandler();
  //     // }, 500);
  //   }
  // }, [isPostSuccess, isUpdateSuccess]);

  useEffect(() => {
    !transactionData && setDisable(false);
    // deleteAllRequest();
  }, []);

  // useEffect(() => {
  //   if (transactionDataApi)
  //     transactionDataApi?.map((transaction) => {
  //       setValue("type_of_request_id", transaction?.type_of_request);
  //       setValue("attachment_type", transaction?.attachment_type);
  //       setValue("department_id", transaction?.department);
  //       setValue("company_id", transaction?.company);
  //       setValue("subunit_id", transaction?.subunit);
  //       setValue("location_id", transaction?.location);
  //       setValue("account_title_id", transaction?.account_title);
  //       setValue("acquisition_details", transaction?.acquisition_details);
  //     });
  //   // setShowEdit(true)
  // }, [transactionDataApi]);

  useEffect(() => {
    if (updateRequest.id) {
      setValue("type_of_request_id", updateRequest?.type_of_request);
      setValue("attachment_type", updateRequest?.attachment_type);
      setValue("department_id", updateRequest?.department);
      setValue("company_id", updateRequest?.company?.id);
      setValue("subunit_id", updateRequest?.subunit);
      setValue("location_id", updateRequest?.location);
      setValue("account_title_id", updateRequest?.account_title);
      setValue("accountability", updateRequest?.accountability);
      setValue("accountable", updateRequest?.accountable);
      setValue("acquisition_details", updateRequest?.acquisition_details);
      // ASSET INFO
      setValue("asset_description", updateRequest?.asset_description);
      setValue("asset_specification", updateRequest?.asset_specification);
      setValue("quantity", updateRequest?.quantity);
      setValue("brand", updateRequest?.brand);
      setValue("cellphone_number", updateRequest?.cellphone_number === "-" ? "" : updateRequest?.cellphone_number);
      setValue("additional_info", updateRequest?.additional_info);
      // ATTACHMENTS
      setValue("letter_of_request", updateRequest?.letter_of_request === "-" ? "" : updateRequest?.letter_of_request);
      setValue("quotation", updateRequest?.quotation === "-" ? "" : updateRequest?.quotation);
      setValue(
        "specification_form",
        updateRequest?.specification_form === "-" ? "" : updateRequest?.specification_form
      );
      setValue("tool_of_trade", updateRequest?.tool_of_trade === "-" ? "" : updateRequest?.tool_of_trade);
      setValue("other_attachments", updateRequest?.other_attachments === "-" ? "" : updateRequest?.other_attachments);
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

  //  * CONTAINER
  // Adding of Request
  const addRequestHandler = (formData) => {
    const data = {
      type_of_request_id: formData?.type_of_request_id?.id?.toString(),
      attachment_type: formData?.attachment_type?.toString(),

      department_id: formData?.department_id.id?.toString(),
      company_id: updateRequest ? formData?.company_id : formData?.company_id?.company?.company_id.toString(),
      subunit_id: formData.subunit_id.id?.toString(),
      location_id: formData?.location_id.id?.toString(),
      account_title_id: formData?.account_title_id.id?.toString(),
      accountability: formData?.accountability?.toString(),
      accountable:
        formData?.accountable === null ? "" : formData?.accountable?.general_info?.full_id_number_full_name?.toString(),
      acquisition_details: formData?.acquisition_details?.toString(),

      asset_description: formData?.asset_description?.toString(),
      asset_specification: formData?.asset_specification?.toString(),
      cellphone_number: formData?.cellphone_number === "" ? "" : "09" + formData?.cellphone_number?.toString(),

      brand: formData?.brand?.toString(),
      quantity: formData?.quantity?.toString(),
      additional_info: formData?.additional_info?.toString(),

      letter_of_request:
        updateRequest &&
        (watch("letter_of_request") === null
          ? ""
          : updateRequest.letter_of_request !== null
          ? transactionDataApi[0]?.attachments?.letter_of_request?.file_name ===
            updateRequest?.letter_of_request?.file_name
            ? "x"
            : formData.letter_of_request
          : formData.letter_of_request),

      quotation:
        updateRequest && watch("quotation") === null
          ? ""
          : updateRequest.quotation !== null
          ? transactionDataApi[0]?.attachments?.quotation?.file_name === updateRequest?.quotation?.file_name
            ? "x"
            : formData.quotation
          : formData.quotation,

      specification_form:
        updateRequest && watch("specification_form") === null
          ? ""
          : updateRequest.specification_form !== null
          ? transactionDataApi[0]?.attachments?.specification_form?.file_name ===
            updateRequest?.specification_form?.file_name
            ? "x"
            : formData.specification_form
          : formData.specification_form,

      tool_of_trade:
        updateRequest && watch("tool_of_trade") === null
          ? ""
          : updateRequest.tool_of_trade !== null
          ? transactionDataApi[0]?.attachments?.tool_of_trade?.file_name === updateRequest?.tool_of_trade?.file_name
            ? "x"
            : formData.tool_of_trade
          : formData.tool_of_trade,

      other_attachments:
        updateRequest && watch("other_attachments") === null
          ? ""
          : updateRequest.other_attachments !== null
          ? transactionDataApi[0]?.attachments?.other_attachments?.file_name ===
            updateRequest?.other_attachments?.file_name
            ? "x"
            : formData.other_attachments
          : formData.other_attachments,

      // // (watch("other_attachments") === null
      // //   ? ""
      // //   : updateRequest.other_attachments !== null
      // //   ? transactionDataApi[0]?.attachments?.other_attachments?.file_name ===
      // //     updateRequest?.other_attachments?.file_name
      // //     ? "x"
      // //     : formData.other_attachments
      // //   : formData.other_attachments),
    };

    // console.log("data", data);

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
            transactionData ? `update-request/${updateRequest?.reference_number}` : "request-container"
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
        })
        .then(() => {
          transactionData ? setDisable(true) : setDisable(false);
          setUpdateToggle(true);
          isTransactionRefetch();
          dispatch(requestContainerApi.util.invalidateTags(["RequestContainer"]));

          transactionData
            ? reset()
            : reset({
                type_of_request_id: formData?.type_of_request_id,
                attachment_type: formData?.attachment_type,
                company_id: formData?.company_id,
                department_id: formData?.department_id,
                subunit_id: formData?.subunit_id,
                location_id: formData?.location_id,
                account_title_id: formData?.account_title_id,
                acquisition_details: formData?.acquisition_details,
                letter_of_request: null,
                quotation: null,
                specification_form: null,
                tool_of_trade: null,
                other_attachments: null,
              });
          // setShowEdit(false)
        })
        .catch((err) => {
          // console.log(err);
          setIsLoading(false);
          dispatch(
            openToast({
              message:
                err?.response?.data?.errors?.detail ||
                err?.response?.data?.errors[0]?.detail ||
                err?.response?.data?.message,
              duration: 5000,
              variant: "error",
            })
          );
        })
        .finally(() => {
          setIsLoading(false);
          // updateRequest
          //   ? reset()
          //   :
          // reset({
          //   company_id: formData?.company_id,
          //   department_id: formData?.department_id,
          //   subunit_id: formData?.subunit_id,
          //   location_id: formData?.location_id,
          //   account_title_id: formData?.account_title_id,
          //   acquisition_details: formData?.acquisition_details,
          //   letter_of_request: null,
          //   quotation: null,
          //   specification_form: null,
          //   tool_of_trade: null,
          //   other_attachments: null,
          // });
        });
    };

    // const validation = () => {
    //   if (transactionData) {
    //     console.log("UPDATE trigger");
    //     if (transactionDataApi.every((item) => item?.department?.id !== watch("department_id")?.id)) {
    //       console.log("change the department");
    //       return true;
    //     }
    //     if (transactionDataApi.every((item) => item?.subunit?.id !== watch("subunit_id")?.id)) {
    //       console.log("change the subunit");
    //       return true;
    //     }
    //     if (transactionDataApi.every((item) => item?.location?.id !== watch("location_id")?.id)) {
    //       console.log("change the location");
    //       return true;
    //     }
    //     return false;
    //   } else {
    //     console.log("ADD trigger");
    //     if (addRequestAllApi?.data.every((item) => item?.department?.id !== watch("department_id")?.id)) {
    //       console.log("change the department");
    //       return true;
    //     }
    //     if (addRequestAllApi?.data.every((item) => item?.subunit?.id !== watch("subunit_id")?.id)) {
    //       console.log("change the subunit");
    //       return true;
    //     }
    //     if (addRequestAllApi?.data.every((item) => item?.location?.id !== watch("location_id")?.id)) {
    //       console.log("change the location");
    //       return true;
    //     }
    //     return false;
    //   }
    // };

    const validation = () => {
      const data = transactionData ? transactionDataApi : addRequestAllApi?.data;
      console.log(transactionData ? "UPDATE trigger" : "ADD trigger");

      const fieldsToCheck = ["department_id", "subunit_id", "location_id"];

      for (const field of fieldsToCheck) {
        if (data.every((item) => item?.[field]?.id !== watch(field)?.id)) {
          console.log(`change the ${field}`);
          return true || { field };
        }
      }

      return false;
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

    transactionData // check if update
      ? validation() // if update check validation
        ? addConfirmation() // if validation is true show confirmation
        : submitData() // else submit the update
      : addRequestAllApi?.data.length === 0
      ? submitData()
      : validation()
      ? addConfirmation()
      : submitData();
    // : console.log("submit add") && submitData();
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

  const onVoidReferenceHandler = async (id) => {
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
      type_of_request,
      attachment_type,
      department,
      company,
      subunit,
      location,
      account_title,
      accountability,
      accountable,
      acquisition_details,
      asset_description,
      asset_specification,
      quantity,
      brand,
      cellphone_number,
      additional_info,
      attachments,
    } = props;
    setUpdateRequest({
      id,
      can_resubmit,
      reference_number,
      type_of_request,
      attachment_type,
      department,
      company,
      subunit,
      location,
      account_title,
      accountability,
      accountable,
      acquisition_details,

      asset_description,
      asset_specification,
      quantity,
      brand,
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
      type_of_request_id: null,
      attachment_type: null,

      company_id: null,
      department_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,
      acquisition_details: "",

      asset_description: "",
      asset_specification: "",
      brand: "",
      accountability: null,
      accountable: null,
      cellphone_number: "",
      quantity: 1,
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

  // console.log(transactionData);

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
            <Box>
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
                ASSET
              </Typography>

              <Divider />

              <Box
                id="requestForm"
                className="request__form"
                component="form"
                onSubmit={handleSubmit(addRequestHandler)}
              >
                <Stack gap={2}>
                  <Box sx={BoxStyle}>
                    <Typography sx={sxSubtitle}>Request Information</Typography>

                    <CustomAutoComplete
                      control={control}
                      name="type_of_request_id"
                      options={typeOfRequestData}
                      loading={isTypeOfRequestLoading}
                      // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
                      // disabled={transactionDataApi[0]?.can_edit === 0}
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
                    />

                    <CustomAutoComplete
                      control={control}
                      name="attachment_type"
                      options={attachmentType}
                      // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
                      // disabled={transactionDataApi[0]?.can_edit === 0}

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
                  </Box>

                  <Divider />

                  <Box sx={BoxStyle}>
                    <Typography sx={sxSubtitle}>Charging Information</Typography>

                    {/* OLD Departments */}
                    <CustomAutoComplete
                      autoComplete
                      name="department_id"
                      control={control}
                      options={departmentData}
                      loading={isDepartmentLoading}
                      disabled={updateRequest && disable}
                      // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                      getOptionLabel={(option) => option.department_name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          color="secondary"
                          label="Department"
                          error={!!errors?.department_id?.message}
                          helperText={errors?.department_id?.message}
                        />
                      )}
                      fullWidth
                      onChange={(_, value) => {
                        const Company = departmentData?.map((mapitem) => mapitem?.company);
                        const companyValue = Company.find((item) => item?.company_id === value.company.company_id);

                        if (value) {
                          setValue("company_id", companyValue?.company_id);
                        } else {
                          setValue("company_id", null);
                        }

                        setValue("subunit_id", null);
                        setValue("location_id", null);

                        return value;
                      }}
                    />

                    <CustomAutoComplete
                      autoComplete
                      name="subunit_id"
                      control={control}
                      // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                      options={subUnitData?.filter((item) => item?.department?.id === watch("department_id")?.id)}
                      loading={isSubUnitLoading}
                      disabled={updateRequest && disable}
                      getOptionLabel={(option) => option.subunit_name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          color="secondary"
                          label="Subunit"
                          error={!!errors?.subunit_id}
                          helperText={errors?.subunit_id?.message}
                        />
                      )}
                    />

                    {/* <CustomAutoComplete
                    autoComplete
                    name="company_id"
                    control={control}
                    options={companyData}
                    loading={isCompanyLoading}
                    
                    getOptionLabel={(option) =>
                      option.company_code + " - " + option.company_name
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.company_id === value.company_id
                    }
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Company"
                        error={!!errors?.company_id}
                        helperText={errors?.company_id?.message}
                      />
                    )}
                    // disabled
                  /> */}

                    <CustomAutoComplete
                      autoComplete
                      name="location_id"
                      control={control}
                      // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                      options={locationData?.filter((item) => {
                        return item.departments.some((department) => {
                          return department?.sync_id === watch("department_id")?.sync_id;
                        });
                      })}
                      loading={isLocationLoading}
                      disabled={updateRequest && disable}
                      getOptionLabel={(option) => option.location_code + " - " + option.location_name}
                      isOptionEqualToValue={(option, value) => option.location_id === value.location_id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          color="secondary"
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
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                      options={accountTitleData}
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
                    />

                    <CustomAutoComplete
                      autoComplete
                      name="accountability"
                      control={control}
                      options={["Personal Issued", "Common"]}
                      // disabled={transactionDataApi[0]?.can_edit === 0}
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
                    />

                    {watch("accountability") === "Personal Issued" && (
                      <CustomAutoComplete
                        name="accountable"
                        control={control}
                        includeInputInList
                        disablePortal
                        disabled={transactionDataApi[0]?.can_edit === 0}
                        filterOptions={filterOptions}
                        options={sedarData}
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
                      name="acquisition_details"
                      label="Acquisition Details"
                      type="text"
                      disabled={updateRequest && disable}
                      // disabled={transactionData ? transactionData?.length !== 0 : addRequestAllApi?.data?.length !== 0}
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                      error={!!errors?.acquisition_details}
                      helperText={errors?.acquisition_details?.message}
                      fullWidth
                      multiline
                    />
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
                      // disabled={transactionDataApi[0]?.can_edit === 0}
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
                      // disabled={transactionDataApi[0]?.can_edit === 0}
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
                      // disabled={transactionDataApi[0]?.can_edit === 0}
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
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                      // isAllowed={(values) => {
                      //   const { floatValue } = values;
                      //   return floatValue >= 1;
                      // }}
                    />
                    <CustomPatternField
                      control={control}
                      name="cellphone_number"
                      label="Cellphone # (optional)"
                      type="text"
                      disabled={updateRequest && disable}
                      error={!!errors?.cellphone_number}
                      helperText={errors?.cellphone_number?.message}
                      format="(09##) - ### - ####"
                      // allowEmptyFormatting
                      valueIsNumericString
                      fullWidth
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                    />
                    <CustomTextField
                      control={control}
                      name="additional_info"
                      label="Additional Info. (Optional)"
                      type="text"
                      disabled={updateRequest && disable}
                      fullWidth
                      multiline
                      // disabled={transactionDataApi[0]?.can_edit === 0}
                    />
                  </Box>

                  <Divider />

                  <Box sx={BoxStyle}>
                    <Typography sx={sxSubtitle}>Attachments</Typography>
                    <Stack flexDirection="row" gap={1} alignItems="center">
                      {watch("letter_of_request") !== null ? (
                        <UpdateField
                          label={"Letter of Request"}
                          value={
                            transactionDataApi.length
                              ? watch("letter_of_request")?.name || updateRequest?.letter_of_request?.file_name
                              : watch("letter_of_request")?.name
                          }
                        />
                      ) : (
                        <CustomAttachment
                          control={control}
                          name="letter_of_request"
                          label="Letter of Request"
                          disabled={updateRequest && disable}
                          inputRef={LetterOfRequestRef}
                          // disabled={transactionDataApi[0]?.can_edit === 0}
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
                          // disabled={transactionDataApi[0]?.can_edit === 0}
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
                          updateData={updateRequest}
                          // disabled={transactionDataApi[0]?.can_edit === 0}
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
                          // disabled={transactionDataApi[0]?.can_edit === 0}
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
                          // disabled={transactionDataApi[0]?.can_edit === 0}
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
                disabled={!transactionData ? !isDirty : updateToggle}
                fullWidth
                sx={{ gap: 1 }}
              >
                {transactionData ? <Update /> : <AddToPhotos />}{" "}
                <Typography variant="p">{transactionData ? "UPDATE" : "ADD"}</Typography>
              </LoadingButton>
              <Divider orientation="vertical" />
            </Box>
            {/* TABLE */}

            <Box className="request__table">
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
                {`${transactionData ? "TRANSACTION NO." : "CURRENT ASSET"}`}{" "}
                {transactionData && transactionData?.transaction_number}
              </Typography>

              <TableContainer
                className="mcontainer__th-body  mcontainer__wrapper"
                sx={{ height: "calc(100vh - 290px)", pt: 0 }}
              >
                <Table className="mcontainer__table " stickyHeader>
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
                      <TableCell className="tbl-cell">Type of Request</TableCell>
                      <TableCell className="tbl-cell">Attachment Type</TableCell>
                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                      <TableCell className="tbl-cell">Accountability</TableCell>
                      <TableCell className="tbl-cell">Asset Information</TableCell>
                      <TableCell className="tbl-cell text-center">Quantity</TableCell>
                      <TableCell className="tbl-cell">Cellphone #</TableCell>
                      <TableCell className="tbl-cell">Additional Info.</TableCell>
                      <TableCell className="tbl-cell">Attachments</TableCell>
                      <TableCell className="tbl-cell">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(updateRequest && isTransactionLoading) || isRequestLoading ? (
                      <LoadingData />
                    ) : (transactionData ? transactionDataApi?.length === 0 : addRequestAllApi?.data?.length === 0) ? (
                      <NoRecordsFound request />
                    ) : (
                      <>
                        {(transactionData ? transactionDataApi : addRequestAllApi?.data)?.map((data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell tr-cen-pad45 text-weight">
                              {transactionData ? data?.reference_number : index + 1}
                            </TableCell>
                            <TableCell className="tbl-cell">{data.type_of_request?.type_of_request_name}</TableCell>
                            <TableCell className="tbl-cell">{data.attachment_type}</TableCell>
                            <TableCell className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                              </Typography>
                            </TableCell>
                            <TableCell className="tbl-cell">
                              {data.accountability === "Personal Issued" ? (
                                <>
                                  <Box>{data?.accountable?.general_info?.full_id_number || data?.accountable}</Box>
                                  <Box>{data?.accountable?.general_info?.full_name}</Box>
                                </>
                              ) : (
                                "Common"
                              )}
                            </TableCell>
                            <TableCell className="tbl-cell">
                              <Typography fontWeight={600} fontSize="14px" color="secondary.main">
                                {data.asset_description}
                              </Typography>
                              <Typography fontSize="12px" color="text.light">
                                {data.asset_specification}
                              </Typography>
                            </TableCell>
                            <TableCell className="tbl-cell text-center">{data.quantity}</TableCell>
                            <TableCell className="tbl-cell">
                              {data.cellphone_number === null ? "-" : data.cellphone_number}
                            </TableCell>
                            <TableCell className="tbl-cell">{data.additional_info}</TableCell>
                            <TableCell className="tbl-cell">
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
                            <TableCell className="tbl-cell">
                              <ActionMenu
                                hideArchive
                                setDisable={setDisable}
                                status={data?.status}
                                data={data}
                                editRequest={
                                  transactionDataApi[0]?.can_edit === 1 || transactionData?.status === "Return"
                                    ? true
                                    : false
                                }
                                onDeleteHandler={!transactionData && onDeleteHandler}
                                onDeleteReferenceHandler={
                                  transactionData &&
                                  transactionData.item_count !== 1 &&
                                  transactionDataApi.length !== 1 &&
                                  onVoidReferenceHandler

                                  // // transactionData
                                  // //   ? transactionData?.item_count !== 1
                                  // //     ? transactionDataApi.length !== 1
                                  // //       ? onVoidReferenceHandler
                                  // //       : false
                                  // //     : false
                                  // //   : false
                                }
                                onUpdateHandler={onUpdateHandler}
                                onUpdateResetHandler={onUpdateResetHandler}
                                setUpdateToggle={setUpdateToggle}
                                // setShowEdit={setShowEdit}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
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
                      disabled={
                        updateRequest
                          ? isTransactionLoading
                            ? disable
                            : null
                          : transactionDataApi.length === 0
                          ? true
                          : false
                      }
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
                      disabled={isRequestLoading || addRequestAllApi?.data?.length === 0}
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
    </>
  );
};

export default AddRequisition;
