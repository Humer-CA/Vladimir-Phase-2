import React, { useEffect, useMemo, useState } from "react";
import "../../../Style/Fixed Asset/addFixedAsset.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomPatternField from "../../../Components/Reusable/CustomPatternField";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
import CustomRadioGroup from "../../../Components/Reusable/CustomRadioGroup";
import { useGetSedarUsersApiQuery, useLazyGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  useMediaQuery,
} from "@mui/material";
import { ArrowForwardIosRounded, Help, Sync } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

// RTK
import { useDispatch } from "react-redux";
import { closeAdd, closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import {
  useGetMinorCategoryAllApiQuery,
  useLazyGetMinorCategoryAllApiQuery,
} from "../../../Redux/Query/Masterlist/Category/MinorCategory";
import {
  useGetMajorCategoryAllApiQuery,
  useLazyGetMajorCategoryAllApiQuery,
} from "../../../Redux/Query/Masterlist/Category/MajorCategory";
import { useGetDivisionAllApiQuery } from "../../../Redux/Query/Masterlist/Division";
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
} from "../../../Redux/Query/Masterlist/YmirCoa/AccountTitle";
import {
  useGetFixedAssetAllApiQuery,
  useLazyGetFixedAssetAllApiQuery,
  useLazyGetVoucherFaApiQuery,
} from "../../../Redux/Query/FixedAsset/FixedAssets";

import moment from "moment";
// import { useGetCapexAllApiQuery } from "../../../../Redux/Query/Masterlist/Capex";
import { useGetSubCapexAllApiQuery, useLazyGetSubCapexAllApiQuery } from "../../../Redux/Query/Masterlist/SubCapex";
import {
  useGetTypeOfRequestAllApiQuery,
  useLazyGetTypeOfRequestAllApiQuery,
} from "../../../Redux/Query/Masterlist/TypeOfRequest";
import {
  useGetAssetStatusAllApiQuery,
  useLazyGetAssetStatusAllApiQuery,
} from "../../../Redux/Query/Masterlist/Status/AssetStatus";
import {
  useGetAssetMovementStatusAllApiQuery,
  useLazyGetAssetMovementStatusAllApiQuery,
} from "../../../Redux/Query/Masterlist/Status/AssetMovementStatus";
import {
  useGetCycleCountStatusAllApiQuery,
  useLazyGetCycleCountStatusAllApiQuery,
} from "../../../Redux/Query/Masterlist/Status/CycleCountStatus";
import {
  useGetDepreciationStatusAllApiQuery,
  useLazyGetDepreciationStatusAllApiQuery,
} from "../../../Redux/Query/Masterlist/Status/DepreciationStatus";
import {
  usePostAdditionalCostApiMutation,
  useUpdateAdditionalCostApiMutation,
} from "../../../Redux/Query/FixedAsset/AdditionalCost";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import { useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";
import { useLazyGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";

const schema = yup.object().shape({
  id: yup.string(),

  fixed_asset_id: yup
    .string()
    .required()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Vladimir Tag Number"),

  type_of_request_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Type of Request"),

  sub_capex_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .when("type_of_request_id", {
      is: (value) => value === "2",
      then: (yup) => yup.required().typeError("CAPEX is a required field").label("CAPEX"),
    }),

  // project_name: yup.string().when("type_of_request_id", {
  //   is: (value) => value === "2",
  //   then: (yup) => yup.required().label("Project Name"),
  // }),

  charging: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .nullable()
    .label("Charging"),

  is_old_asset: yup.boolean(),

  tag_number: yup.string().when("is_old_asset", {
    is: (value) => value == 1,
    then: (yup) => yup.required().label("Tag Number"),
  }),

  tag_number_old: yup.string().when("is_old_asset", {
    is: (value) => value == 1,
    then: (yup) => yup.required().label("Old Tag Number"),
  }),

  // division_id: yup
  //   .string()
  //   .transform((value) => {
  //     return value?.id.toString();
  //   })
  //   .required()
  //   .label("Division"),
  major_category_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Major Category"),

  minor_category_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Minor Category"),

  company_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Company"),

  business_unit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Business Unit"),

  department_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Department"),

  unit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Unit"),

  subunit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("SubUnit"),

  location_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Location"),

  account_title_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Account Title"),

  asset_description: yup.string().required().label("Asset Description"),
  asset_specification: yup.string().required().label("Asset Specification"),
  acquisition_date: yup.string().required().label("Acquisition Date").typeError("Acquisition Date is a required field"),
  accountability: yup.string().typeError("Accountability is a required field").required().label("Accountability"),

  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),

  // accountable: yup.string().required().label("Accountable"),

  cellphone_number: yup.string().nullable(),
  brand: yup.string(),
  care_of: yup.string().label("Care Of"),

  voucher: yup.string(),
  voucher_date: yup.date().nullable().label("Voucher Date").typeError("Voucher Date is a required field"),
  receipt: yup.string(),
  po_number: yup.number().label("PO Number").typeError("PO Number is a required field"),
  quantity: yup.number().required().typeError("Quantity is a required field"),

  asset_status_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Asset Status"),

  cycle_count_status_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Cycle Count Status"),

  movement_status_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Asset Movement Status"),

  depreciation_status_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Asset Movement Status"),

  depreciation_method: yup
    .string()
    .typeError("Depreciation Method is a required field")
    .required()
    .label("Depreciation Method"),

  est_useful_life: yup.string().required().label("Estimated Useful Life"),
  release_date: yup.string().nullable().typeError("Release Date is a required field").label("Release Date"),
  acquisition_cost: yup.number().required().typeError("Acquisition Cost is a required field"),
  months_depreciated: yup.number().required().typeError("Months Depreciated is a required field"),
  scrap_value: yup.number().required().typeError("Scrap Value is a required field"),
  depreciable_basis: yup.number().required().typeError("Depreciable Basis is a required field"),
  // accumulated_cost: yup.number().required(),
  // start_depreciation: yup
  //   .string()
  //   .required()
  //   .typeError("Start Depreciation is a required field"),
  // end_depreciation: yup
  //   .string()
  //   .required()
  //   .typeError("End Depreciation is a required field"),
  // depreciation_per_year: yup.number().required(),
  // depreciation_per_month: yup.number().required(),
  // remaining_book_value: yup.number().required(),
});

const AddCost = (props) => {
  const { data, onUpdateResetHandler, dataApiRefetch, voucher, disableItems } = props;
  const [poNumber, setPoNumber] = useState("");
  const [rrNumber, setRrNumber] = useState("");

  const dispatch = useDispatch();
  const isFullWidth = useMediaQuery("(max-width: 600px)");

  const [
    getVoucher,
    {
      data: voucherData,
      isLoading: isVoucherLoading,
      isSuccess: isVoucherSuccess,
      isError: isVoucherError,
      error: voucherError,
    },
  ] = useLazyGetVoucherFaApiQuery();
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

  const [
    postAddCost,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostAdditionalCostApiMutation();

  const [
    updateAddCost,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateAdditionalCostApiMutation();

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

  // const {
  //   data: capexData = [],
  //   isLoading: isCapexLoading,
  //   isSuccess: isCapexSuccess,
  //   isError: isCapexError,
  //   refetch: isCapexRefetch,
  // } = useGetCapexAllApiQuery();

  const [
    subCapexTrigger,
    {
      data: subCapexData = [],
      isLoading: isSubCapexLoading,
      isSuccess: isSubCapexSuccess,
      isError: iSsubCapexError,
      refetch: iSsubCapexRefetch,
    },
  ] = useLazyGetSubCapexAllApiQuery();

  // const {
  //   data: divisionData = [],
  //   isLoading: isDivisionLoading,
  //   isSuccess: isDivisionSuccess,
  //   isError: isDivisionError,
  //   refetch: isDivisionRefetch,
  // } = useGetDivisionAllApiQuery();

  const [
    majorCategoryTrigger,
    {
      data: majorCategoryData = [],
      isLoading: isMajorCategoryLoading,
      isSuccess: isMajorCategorySuccess,
      isError: isMajorCategoryError,
      refetch: isMajorCategoryRefetch,
    },
  ] = useLazyGetMajorCategoryAllApiQuery();

  const [
    minorCategoryTrigger,
    {
      data: minorCategoryData = [],
      isLoading: isMinorCategoryLoading,
      isSuccess: isMinorCategorySuccess,
      isError: isMinorCategoryError,
    },
  ] = useLazyGetMinorCategoryAllApiQuery();

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
    assetStatusTrigger,
    {
      data: assetStatusData = [],
      isLoading: isAssetStatusLoading,
      isSuccess: isAssetStatusSuccess,
      isError: isAssetStatusError,
    },
  ] = useLazyGetAssetStatusAllApiQuery();

  const [
    movementTrigger,
    {
      data: movementStatusData = [],
      isLoading: isMovementStatusStatusLoading,
      isSuccess: isMovementStatusStatusSuccess,
      isError: isMovementStatusStatusError,
    },
  ] = useLazyGetAssetMovementStatusAllApiQuery();

  const [
    cycleCountTrigger,
    {
      data: cycleCountStatusData = [],
      isLoading: isCycleCountStatusLoading,
      isSuccess: isCycleCountStatusSuccess,
      isError: isCycleCountStatusError,
    },
  ] = useLazyGetCycleCountStatusAllApiQuery();

  const [
    depreciationTrigger,
    {
      data: depreciationStatusData = [],
      isLoading: isDepreciationStatusLoading,
      isSuccess: isDepreciationStatusSuccess,
      isError: isDepreciationStatusError,
    },
  ] = useLazyGetDepreciationStatusAllApiQuery();

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
      status: true,
      id: "",
      fixed_asset_id: null,

      type_of_request_id: null,
      // sub_capex_id: null,
      // project_name: "",
      charging: null,

      is_old_asset: "0",
      tag_number: "",
      tag_number_old: "",

      // division_id: null,
      major_category_id: null,
      minor_category_id: null,
      company_id: null,
      business_unit_id: null,
      department_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,

      asset_description: "",
      asset_specification: "",
      acquisition_date: null,
      accountability: null,
      accountable: null,
      cellphone_number: null,
      brand: "",
      care_of: "",
      voucher: "",
      voucher_date: null,
      receipt: "",
      po_number: null,
      quantity: 1,
      asset_status_id: null,
      cycle_count_status_id: null,
      movement_status_id: null,
      depreciation_status_id: null,

      depreciation_method: null,
      est_useful_life: "",
      release_date: null,
      acquisition_cost: "",
      months_depreciated: "",
      scrap_value: "",
      depreciable_basis: null,
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
    setPoNumber(data?.po_number);
    setRrNumber(data?.receipt);
    const acquisitionDateFormat = new Date(data.acquisition_date);
    const releaseDateFormat = new Date(data.release_date);
    const voucherDateFormat = new Date(data.voucher_date);
    const startDepreciationFormat = new Date(data.start_depreciation);
    const endDepreciationFormat = new Date(data.end_depreciation);

    if (data.status) {
      setValue("id", data.id);
      setValue("fixed_asset_id", data.fixed_asset);
      setValue("type_of_request_id", data.type_of_request);
      // setValue("sub_capex_id", {
      //   id: data.sub_capex?.id,
      //   sub_capex: data?.sub_capex?.sub_capex,
      //   sub_project: data?.sub_capex?.sub_project,
      // });
      setValue("sub_capex_id", data.sub_capex);
      // setValue("project_name", data.sub_capex?.sub_project);
      setValue("charging", data.department);
      setValue("is_old_asset", data.is_old_asset?.toString());
      setValue("tag_number", data.tag_number);
      setValue("tag_number_old", data.tag_number_old);

      // setValue("division_id", data.division);
      setValue("major_category_id", data.major_category === "-" ? [] : data.major_category);
      setValue("minor_category_id", data.minor_category === "-" ? [] : data.minor_category);

      setValue("company_id", data.company);
      setValue("business_unit_id", data.business_unit);
      setValue("department_id", data.department);
      setValue("unit_id", data.unit);
      setValue("subunit_id", data.subunit);
      setValue("location_id", data.location);
      setValue("account_title_id", data.account_title);

      setValue("asset_description", data.asset_description);
      setValue("asset_specification", data.asset_specification);
      setValue("acquisition_date", acquisitionDateFormat);
      setValue("accountability", data.accountability);

      setValue("accountable", {
        general_info: {
          full_id_number: data.accountable.split(" ")[0],
          full_id_number_full_name: data.accountable,
        },
      });

      setValue("cellphone_number", data.cellphone_number === "-" ? null : data.cellphone_number.slice(2));
      setValue("brand", data.brand);
      setValue("care_of", data.care_of);
      setValue("voucher", data.voucher);
      setValue("voucher_date", data.voucher_date === "-" ? null : voucherDateFormat);
      setValue("receipt", data.receipt);
      setValue("po_number", data.po_number);
      setValue("quantity", data.quantity);
      setValue("asset_status_id", data.asset_status);
      setValue("cycle_count_status_id", data.cycle_count_status);
      setValue("movement_status_id", data.movement_status);

      setValue("depreciation_method", data.depreciation_method);
      setValue("est_useful_life", data.est_useful_life);
      setValue("depreciation_status_id", data.depreciation_status === "-" ? [] : data.depreciation_status);
      setValue("release_date", data.release_date === "-" ? null : releaseDateFormat);
      setValue("acquisition_cost", data.acquisition_cost);
      setValue("months_depreciated", data.months_depreciated);
      setValue("scrap_value", data.scrap_value);
      setValue("depreciable_basis", data.depreciable_basis);
      // setValue("accumulated_cost", data.accumulated_cost);
      // setValue("start_depreciation", startDepreciationFormat);
      // setValue("end_depreciation", endDepreciationFormat);
      // setValue("depreciation_per_year", data.depreciation_per_year);
      // setValue("depreciation_per_month", data.depreciation_per_month);
      // setValue("remaining_book_value", data.remaining_book_value);
    }
  }, [data]);
  useEffect(() => {
    if (watch("acquisition_cost") && watch("scrap_value")) {
      setValue("depreciable_basis", watch("acquisition_cost") - watch("scrap_value"));
    }

    if (watch("depreciable_basis") < 0) {
      setValue("depreciable_basis", 0);
    }

    if (watch("acquisition_cost") - watch("scrap_value") === watch("acquisition_cost")) {
      setValue("depreciable_basis", watch("acquisition_cost"));
    }
  }, [watch("acquisition_cost"), watch("scrap_value")]);

  // SUBMIT HANDLER
  const onSubmitHandler = (formData) => {
    // const hasEmptyField = Object.values(formData).some((value) => value === "");
    // setIsButtonDisabled(hasEmptyField);

    const newObj = {
      ...formData,
      cellphone_number: formData.cellphone_number ? "09" + formData.cellphone_number : null,
      acquisition_date: moment(new Date(formData.acquisition_date)).format("YYYY-MM-DD"),
      release_date:
        formData.release_date === null ? null : moment(new Date(formData.release_date)).format("YYYY-MM-DD"),
      voucher_date:
        formData.voucher_date === null ? null : moment(new Date(formData.voucher_date)).format("YYYY-MM-DD"),
      start_depreciation: moment(new Date(formData.start_depreciation)).format("YYYY-MM"),
      end_depreciation: moment(new Date(formData.end_depreciation)).format("YYYY-MM"),
      accountable: formData.accountable === null ? null : formData.accountable,
      months_depreciated: formData.months_depreciated === null ? 0 : formData.months_depreciated,
      acquisition_cost: formData.acquisition_cost === null ? 0 : formData.acquisition_cost,
      scrap_value: formData.scrap_value === null ? 0 : formData.scrap_value,
      depreciable_basis: formData.depreciable_basis === null ? 0 : formData.depreciable_basis,
    };

    if (data.status) {
      updateAddCost(newObj);
      return;
    }
    postAddCost(newObj);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeAdd()) && dispatch(closeDrawer());
  };

  const handleGetVoucher = (data) => {
    dispatch(
      openConfirm({
        icon: Help,
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
              SYNC
            </Typography>{" "}
            voucher data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await getVoucher({ po_no: poNumber, rr_no: rrNumber }).unwrap();
            const voucherDateFormat = new Date(result?.voucher_date);
            setValue("voucher", result?.voucher_no);
            setValue("voucher_date", voucherDateFormat);
            dispatch(
              openToast({
                message: "Successfully Synched!",
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
            } else if (err?.status === 404) {
              dispatch(
                openToast({
                  message: err.data.errors.detail,
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

  const sxSubtitle = {
    fontWeight: "bold",
    color: "secondary.main",
    fontFamily: "Anton",
    fontSize: "16px",
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="addFixedAsset">
      <Box className="addFixedAsset__title">
        <Stack flexDirection="row" alignItems="center">
          <IconButton onClick={handleCloseDrawer}>
            <ArrowForwardIosRounded color="secondary" />
          </IconButton>
          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
            {data.status ? "Edit Additional Cost" : "Additional Cost"}
          </Typography>
        </Stack>
        {voucher && (
          <Tooltip title="Sync Voucher" arrow>
            <>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<Sync color="primary" />}
                disabled={
                  isVoucherSuccess ||
                  (isVoucherLoading && watch("receipt") === "") ||
                  watch("po_number") === "" ||
                  (watch("voucher") !== "" && watch("voucher_date") !== null)
                }
                onClick={() => handleGetVoucher(data)}
              >
                <Typography fontSize="inherit">Sync</Typography>
              </Button>
            </>
          </Tooltip>
        )}
      </Box>

      <Divider />

      <Box className="addFixedAsset__container">
        <Box className="addFixedAsset__type">
          <Stack width="100%" gap="10px">
            <Typography sx={sxSubtitle}>Vladimir Tag Number</Typography>
            <CustomAutoComplete
              control={control}
              name="fixed_asset_id"
              options={vTagNumberData}
              onOpen={() => (isVTagNumberSuccess ? null : fixedAssetTrigger())}
              loading={isVTagNumberLoading}
              size="small"
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
                setValue("type_of_request_id", value.type_of_request);
                setValue("sub_capex_id", value.sub_capex);
                setValue("charging", value.charging);
                setValue(
                  "major_category_id",
                  value.major_category.major_category_name === "-" ? null : value.major_category
                );
                setValue(
                  "minor_category_id",
                  value.minor_category.minor_category_name === "-" ? null : value.minor_category
                );
                setValue("company_id", value.company);
                setValue("business_unit_id", value.business_unit);
                setValue("department_id", value.department);
                setValue("unit_id", value.unit);
                setValue("subunit_id", value.subunit);
                setValue("location_id", value.location);
                setValue("account_title_id", value.account_title);
                setValue("est_useful_life", value.est_useful_life);
                return value;
              }}
            />
          </Stack>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%",
            }}
          >
            <Typography sx={sxSubtitle}>Type of Asset</Typography>
            <CustomAutoComplete
              control={control}
              name="type_of_request_id"
              options={typeOfRequestData}
              onOpen={() => (isTypeOfRequestSuccess ? null : typeOfRequestTrigger())}
              loading={isTypeOfRequestLoading}
              size="small"
              getOptionLabel={(option) => option.type_of_request_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Type of Request"
                  error={!!errors?.type_of_request_id}
                  helperText={errors?.type_of_request_id?.message}
                />
              )}
              onChange={(_, value) => {
                setValue("sub_capex_id", null);
                // setValue("project_name", "");
                return value;
              }}
            />

            {watch("type_of_request_id")?.type_of_request_name === "Capex" && (
              <CustomAutoComplete
                control={control}
                name="sub_capex_id"
                options={subCapexData}
                onOpen={() => (isSubCapexSuccess ? null : subCapexTrigger())}
                loading={isSubCapexLoading}
                size="small"
                getOptionLabel={(option) => `${option.sub_capex}  (${option.sub_project})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="CAPEX"
                    error={!!errors?.sub_capex_id}
                    helperText={errors?.sub_capex_id?.message}
                  />
                )}
              />
            )}
          </Box>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
          }}
        >
          <Typography sx={sxSubtitle}>Set the Category</Typography>

          <CustomAutoComplete
            autoComplete
            required
            disableClearable
            name="major_category_id"
            control={control}
            options={majorCategoryData}
            onOpen={() => (isMajorCategorySuccess ? null : (majorCategoryTrigger(), minorCategoryTrigger()))}
            loading={isMajorCategoryLoading}
            size="small"
            getOptionLabel={(option) => option.major_category_name}
            isOptionEqualToValue={(option, value) => option.major_category_name === value.major_category_name}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Major Category  "
                error={!!errors?.major_category_id}
                helperText={errors?.major_category_id?.message}
              />
            )}
            onChange={(_, value) => {
              const filteredMajorCategoryData = majorCategoryData?.filter((obj) => {
                return obj.major_category_name === value.major_category_name;
              });
              const isIncluded = filteredMajorCategoryData[0]?.minor_category.some((category) => {
                return category.id === data.minor_category?.minor_category_id;
              });

              if (!isIncluded) {
                setValue("minor_category_id", null);
              }

              setValue("est_useful_life", value.est_useful_life);
              return value;
            }}
          />

          <CustomAutoComplete
            autoComplete
            required
            name="minor_category_id"
            control={control}
            options={
              majorCategoryData?.filter((obj) => {
                return obj?.id === watch("major_category_id")?.id;
              })[0]?.minor_category || []
            }
            loading={isMinorCategoryLoading}
            size="small"
            getOptionLabel={(option) => option.minor_category_name}
            isOptionEqualToValue={(option, value) => option.minor_category_name === value.minor_category_name}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Minor Category  "
                error={!!errors?.minor_category_id}
                helperText={errors?.minor_category_id?.message}
              />
            )}
            onChange={(_, value) => {
              setValue("account_title_id", value.account_title);
              return value;
            }}
          />
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
          }}
        >
          <Typography sx={sxSubtitle}>Chart of Accounts (COA)</Typography>

          {/* OLD Departments */}
          <CustomAutoComplete
            autoComplete
            name="department_id"
            control={control}
            options={departmentData}
            onOpen={() => (isDepartmentSuccess ? null : (departmentTrigger(), companyTrigger(), businessUnitTrigger()))}
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
            onOpen={() => (isCompanySuccess ? null : companyTrigger())}
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
            onOpen={() => (isCompanySuccess ? null : businessUnitTrigger())}
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
            options={
              departmentData?.filter((obj) => {
                return obj?.id === watch("department_id")?.id;
              })[0]?.unit || []
            }
            onOpen={() => (isUnitSuccess ? null : (unitTrigger(), subunitTrigger(), locationTrigger()))}
            loading={isUnitLoading}
            size="small"
            getOptionLabel={(option) => option.unit_code + " - " + option.unit_name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
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
            options={locationData?.filter((item) => {
              return item.departments.some((department) => {
                return department?.sync_id === watch("department_id")?.sync_id;
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
            disabled
            control={control}
            options={accountTitleData}
            onOpen={() => (isAccountTitleSuccess ? null : accountTitleTrigger())}
            loading={isAccountTitleLoading}
            size="small"
            // disabled
            getOptionLabel={(option) => option.account_title_code + " - " + option.account_title_name}
            isOptionEqualToValue={(option, value) => option.account_title_code === value.account_title_code}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Account Title  "
                error={!!errors?.account_title_id}
                helperText={errors?.account_title_id?.message}
              />
            )}
          />
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "100%",
          }}
        >
          <Typography sx={sxSubtitle}>Asset Information</Typography>

          <CustomTextField
            control={control}
            name="asset_description"
            label="Asset Description"
            type="text"
            color="secondary"
            size="small"
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
            color="secondary"
            size="small"
            error={!!errors?.asset_specification}
            helperText={errors?.asset_specification?.message}
            fullWidth
            multiline
          />

          <CustomDatePicker
            control={control}
            name="acquisition_date"
            label="Acquisition Date"
            size="small"
            views={["year", "month", "day"]}
            openTo="year"
            error={!!errors?.acquisition_date}
            helperText={errors?.acquisition_date?.message}
            fullWidth={isFullWidth ? true : false}
            maxDate={new Date()}
            reduceAnimations
          />

          <CustomAutoComplete
            autoComplete
            name="accountability"
            control={control}
            options={["Personal Issued", "Common"]}
            size="small"
            isOptionEqualToValue={(option, value) => option === value}
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Accountability  "
                error={!!errors?.accountability}
                helperText={errors?.accountability?.message}
              />
            )}
            onChange={(_, value) => {
              if (value === "Personal Issued") {
                setValue("accountable", value.accountable);
              } else {
                setValue("accountable", null);
              }
              return value;
            }}
          />

          {watch("accountability") === "Personal Issued" && (
            <CustomAutoComplete
              name="accountable"
              control={control}
              size="small"
              includeInputInList
              disablePortal
              filterOptions={filterOptions}
              options={sedarData}
              onOpen={() => (isSedarSuccess ? null : sedarTrigger())}
              loading={isSedarLoading}
              getOptionLabel={
                (option) => option.general_info?.full_id_number_full_name
                // `(${option.general_info?.full_id_number}) - ${option.general_info?.full_name}`
              }
              isOptionEqualToValue={(option, value) =>
                option.general_info?.full_id_number === value.general_info?.full_id_number
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Accountable"
                  color="secondary"
                  error={!!errors?.accountable?.message}
                  helperText={errors?.accountable?.message}
                />
              )}
            />
          )}

          <CustomPatternField
            control={control}
            color="secondary"
            name="cellphone_number"
            label="Cellphone # (optional)"
            type="text"
            size="small"
            error={!!errors?.cellphone_number}
            helperText={errors?.cellphone_number?.message}
            format="(09##) - ### - ####"
            // allowEmptyFormatting
            valueIsNumericString
            fullWidth
          />

          <CustomTextField
            autoComplete="off"
            control={control}
            name="brand"
            label="Brand (optional)"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.brand}
            helperText={errors?.brand?.message}
            fullWidth
          />

          <CustomTextField
            autoComplete="off"
            control={control}
            name="care_of"
            label="Care of (optional)"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.care_of}
            helperText={errors?.care_of?.message}
            fullWidth
          />

          <Box className="addFixedAsset__status">
            <CustomTextField
              autoComplete="off"
              control={control}
              name="voucher"
              label="Voucher (optional)"
              color="secondary"
              size="small"
              error={!!errors?.voucher}
              helperText={errors?.voucher?.message}
              fullWidth
            />

            <CustomDatePicker
              control={control}
              name="voucher_date"
              label="Voucher Date"
              size="small"
              views={["year", "month", "day"]}
              openTo="year"
              error={!!errors?.voucher_date}
              helperText={errors?.voucher_date?.message}
              fullWidth={isFullWidth ? true : false}
              maxDate={new Date()}
              reduceAnimations
            />
          </Box>

          <CustomTextField
            autoComplete="off"
            control={control}
            name="receipt"
            label="Receipt (optional)"
            color="secondary"
            size="small"
            error={!!errors?.receipt}
            helperText={errors?.receipt?.message}
            disabled={disableItems}
            fullWidth
          />

          <CustomNumberField
            autoComplete="off"
            control={control}
            name="po_number"
            label="Purchase Order #"
            color="secondary"
            error={!!errors?.po_number}
            helperText={errors?.po_number?.message}
            disabled={disableItems}
            fullWidth
          />

          <Box className="addFixedAsset__status">
            <CustomNumberField
              autoComplete="off"
              control={control}
              name="quantity"
              label="Quantity"
              type="number"
              color="secondary"
              size="small"
              disabled
              error={!!errors?.quantity}
              helperText={errors?.quantity?.message}
              fullWidth={isFullWidth ? true : false}
            />

            <CustomAutoComplete
              autoComplete
              size="small"
              name="asset_status_id"
              control={control}
              options={assetStatusData}
              onOpen={() => (isAssetStatusSuccess ? null : assetStatusTrigger())}
              loading={isAssetStatusLoading}
              getOptionLabel={(option) => option.asset_status_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Asset Status"
                  error={!!errors?.asset_status}
                  helperText={errors?.asset_status?.message}
                />
              )}
              fullWidth
            />
          </Box>

          <Box className="addFixedAsset__status">
            <CustomAutoComplete
              autoComplete
              size="small"
              name="cycle_count_status_id"
              control={control}
              options={cycleCountStatusData}
              onOpen={() => (isCycleCountStatusSuccess ? null : cycleCountTrigger())}
              loading={isCycleCountStatusLoading}
              getOptionLabel={(option) => option.cycle_count_status_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Cycle Count Status"
                  error={!!errors?.cycle_count_status}
                  helperText={errors?.cycle_count_status?.message}
                />
              )}
              fullWidth
            />

            <CustomAutoComplete
              autoComplete
              size="small"
              name="movement_status_id"
              control={control}
              options={movementStatusData}
              onOpen={() => (isMovementStatusStatusSuccess ? null : movementTrigger())}
              loading={isMovementStatusStatusLoading}
              getOptionLabel={(option) => option.movement_status_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Movement Status"
                  error={!!errors?.movement_status}
                  helperText={errors?.movement_status?.message}
                />
              )}
              fullWidth
            />
          </Box>
        </Box>

        <Divider />

        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%",
              mb: "5px",
            }}
          >
            <Typography sx={sxSubtitle}>Depreciation</Typography>

            <CustomAutoComplete
              autoComplete
              name="depreciation_method"
              control={control}
              options={["STL", "One Time", "Supplier Rebase"]}
              size="small"
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Depreciation Method"
                  error={!!errors?.depreciation_method}
                  helperText={errors?.depreciation_method?.message}
                />
              )}
              onChange={(_, value) => {
                if (value === "Supplier Rebase") {
                  setValue(
                    "depreciation_status_id",
                    depreciationStatusData.find((item) => item.depreciation_status_name === "Fully Depreciated")
                  );
                  setValue("acquisition_cost", 0);
                  setValue("months_depreciated", 0);
                  setValue("scrap_value", 0);
                  setValue("depreciable_basis", 0);
                } else {
                  setValue("depreciation_status_id", null);
                }
                return value;
              }}
            />

            <CustomAutoComplete
              autoComplete
              disabled={watch("depreciation_method") === "Supplier Rebase"}
              size="small"
              name="depreciation_status_id"
              control={control}
              options={depreciationStatusData}
              onOpen={() => (isDepreciationStatusSuccess ? null : depreciationTrigger())}
              loading={isDepreciationStatusLoading}
              getOptionLabel={(option) => option.depreciation_status_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  color="secondary"
                  {...params}
                  label="Depreciation Status"
                  error={!!errors?.depreciation_status_id}
                  helperText={errors?.depreciation_status_id?.message}
                />
              )}
              fullWidth
            />

            {watch("depreciation_method") !== "Supplier Rebase" && (
              <CustomDatePicker
                control={control}
                name="release_date"
                label="Release Date"
                size="small"
                views={["year", "month", "day"]}
                openTo="year"
                error={!!errors?.release_date}
                helperText={errors?.release_date?.message}
                fullWidth={isFullWidth ? true : false}
                minDate={watch("acquisition_date")}
                maxDate={new Date()}
                onChange={(e) => {
                  const selectedDate = new Date(e);
                  const today = new Date();
                  const monthsDepreciated =
                    selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() === today.getMonth()
                      ? 0
                      : moment().diff(moment(selectedDate).add(1, "months"), "months") + 1;
                  setValue("months_depreciated", monthsDepreciated);
                  return e;
                }}
                reduceAnimations
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "viewHeightModifier",
                        enabled: true,
                        phase: "beforeWrite",
                        fn: ({ state }) => {
                          state.styles.popper.height = "320px";
                          if (state.placement.includes("top-start")) {
                            state.styles.popper = {
                              ...state.styles.popper,
                              display: "flex",
                              alignItems: "flex-end",
                            };
                          }
                          if (state.placement.includes("bottom")) {
                            state.styles.popper = {
                              ...state.styles.popper,
                              display: "block",
                            };
                          }
                        },
                      },
                    ],
                  },
                }}
              />
            )}

            <Box className="addFixedAsset__status">
              <CustomNumberField
                control={control}
                disabled
                color="secondary"
                name="est_useful_life"
                label="Estimated Useful Life"
                type="text"
                size="small"
                error={!!errors?.est_useful_life}
                helperText={errors?.est_useful_life?.message}
                fullWidth={watch("depreciation_method") !== "Supplier Rebase" ? (isFullWidth ? true : false) : true}
              />

              {watch("depreciation_method") !== "Supplier Rebase" && (
                <CustomNumberField
                  autoComplete="off"
                  // disabled
                  control={control}
                  name="months_depreciated"
                  label="Months Depreciated"
                  color="secondary"
                  size="small"
                  error={!!errors?.months_depreciated}
                  helperText={errors?.months_depreciated?.message}
                  thousandSeparator
                  fullWidth={isFullWidth ? true : false}
                />
              )}
            </Box>

            {watch("depreciation_method") !== "Supplier Rebase" && (
              <Box className="addFixedAsset__status">
                <CustomNumberField
                  autoComplete="off"
                  control={control}
                  name="acquisition_cost"
                  label="Acquisition Cost"
                  color="secondary"
                  size="small"
                  error={!!errors?.acquisition_cost}
                  helperText={errors?.acquisition_cost?.message}
                  prefix="₱"
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue >= 1;
                  }}
                  thousandSeparator
                  fullWidth={isFullWidth ? true : false}
                  // onChange={(_, value) => {
                  //   setValue("scrap_value", 0);
                  //   setValue("depreciable_basis", watch("acquisition_cost"));
                  //   return value;
                  // }}
                />

                <CustomNumberField
                  autoComplete="off"
                  control={control}
                  color="secondary"
                  name="scrap_value"
                  label="Scrap Value"
                  size="small"
                  error={!!errors?.scrap_value}
                  helperText={errors?.scrap_value?.message}
                  prefix="₱"
                  thousandSeparator
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    return floatValue <= watch("acquisition_cost");
                  }}
                  fullWidth={isFullWidth ? true : false}
                />
              </Box>
            )}

            {watch("depreciation_method") !== "Supplier Rebase" && (
              <CustomNumberField
                // autoComplete="off"
                control={control}
                disabled
                name="depreciable_basis"
                label="Depreciable Basis"
                color="secondary"
                size="small"
                prefix="₱"
                thousandSeparator
                fullWidth
                error={!!errors?.depreciable_basis}
                helperText={errors?.depreciable_basis?.message}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box className="addFixedAsset__buttons">
        <LoadingButton
          type="submit"
          variant="contained"
          size="small"
          loading={isUpdateLoading || isPostLoading}
          disabled={!isValid && !isVoucherSuccess}
        >
          {data.status ? "Update" : "Create"}
        </LoadingButton>

        <Button variant="outlined" color="secondary" size="small" onClick={handleCloseDrawer}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddCost;
