import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../../Style/Fixed Asset/AddFA.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomPatternField from "../../../Components/Reusable/CustomPatternField";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
import { useLazyGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// RTK
import { useDispatch } from "react-redux";
import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useLazyGetMinorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Category/MinorCategory";
// import { useLazyGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Category/MajorCategory";
import { useLazyGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Company";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import { useLazyGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";
import { useLazyGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import { useLazyGetLocationAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Location";
import { useLazyGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/AccountTitle";
import {
  useLazyGetVoucherFaApiQuery,
  usePostFixedAssetApiMutation,
  useUpdateFixedAssetApiMutation,
} from "../../../Redux/Query/FixedAsset/FixedAssets";

import moment from "moment";
import { useLazyGetSubCapexAllApiQuery } from "../../../Redux/Query/Masterlist/SubCapex";
import { useLazyGetTypeOfRequestAllApiQuery } from "../../../Redux/Query/Masterlist/TypeOfRequest";
import { useLazyGetAssetStatusAllApiQuery } from "../../../Redux/Query/Masterlist/Status/AssetStatus";
import { useLazyGetAssetMovementStatusAllApiQuery } from "../../../Redux/Query/Masterlist/Status/AssetMovementStatus";
import { useLazyGetCycleCountStatusAllApiQuery } from "../../../Redux/Query/Masterlist/Status/CycleCountStatus";
import { useLazyGetDepreciationStatusAllApiQuery } from "../../../Redux/Query/Masterlist/Status/DepreciationStatus";
import { AddBox, Close } from "@mui/icons-material";
import { useLazyGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Masterlist/Category/MajorCategory";

const schema = yup.object().shape({
  id: yup.string(),
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
  _number_old: yup.string().when("is_old_asset", {
    is: (value) => value == 1,
    then: (yup) => yup.required().label("Old Tag Number"),
  }),

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
    .label("Sub Unit"),
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
  voucher_date: yup.string().nullable().label("Voucher Date").typeError("Voucher Date is a required field"),
  receipt: yup.string(),
  quantity: yup.number().required().typeError("Quantity is a required field"),
  asset_status_id: yup
    .string()
    .transform((value) => value?.id.toString())
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
  po_number: yup.string().required().label("PO Number"),
  depreciation_status_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Depreciation Status"),
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
});

const AddFa = (props) => {
  const { data, onUpdateResetHandler, dataApiRefetch, voucher, disableItems } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [poNumber, setPoNumber] = useState("");
  const [rrNumber, setRrNumber] = useState("");

  const isFullWidth = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();

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
    postFixedAsset,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostFixedAssetApiMutation();

  const [
    updateFixedAsset,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateFixedAssetApiMutation();

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
    subCapexTrigger,
    {
      data: subCapexData = [],
      isLoading: isSubCapexLoading,
      isSuccess: isSubCapexSuccess,
      isError: iSsubCapexError,
      refetch: iSsubCapexRefetch,
    },
  ] = useLazyGetSubCapexAllApiQuery();

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
      id: "",

      type_of_request_id: null,
      sub_capex_id: null,
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
      po_number: "",
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
      depreciable_basis: "",
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
      setValue("type_of_request_id", data.type_of_request);

      setValue("sub_capex_id", data.sub_capex);
      setValue("charging", data.department);
      setValue("is_old_asset", data.is_old_asset?.toString());
      setValue("tag_number", data.tag_number);
      setValue("tag_number_old", data.tag_number_old);

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

      setValue("depreciation_method", data.depreciation_status === "-" ? null : data.depreciation_method);
      setValue("est_useful_life", data.est_useful_life);
      setValue("depreciation_status_id", data.depreciation_status === "-" ? null : data.depreciation_status);
      setValue("release_date", data.release_date === "-" ? null : releaseDateFormat);
      setValue("acquisition_cost", data.acquisition_cost);
      setValue("months_depreciated", data.months_depreciated);
      setValue("scrap_value", data.scrap_value);
      setValue("depreciable_basis", data.depreciable_basis);
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
    const newObj = {
      ...formData,
      cellphone_number: formData.cellphone_number ? "09" + formData.cellphone_number : null,
      acquisition_date: moment(new Date(formData.acquisition_date)).format("YYYY-MM-DD"),
      release_date:
        formData.release_date === null ? null : moment(new Date(formData.release_date)).format("YYYY-MM-DD"),
      voucher_date:
        formData.voucher_date === null ? null : moment(new Date(formData.voucher_date)).format("YYYY-MM-DD"),
      start_depreciation:
        formData.start_depreciation === null ? null : moment(new Date(formData.start_depreciation)).format("YYYY-MM"),
      end_depreciation:
        formData.end_depreciation === null ? null : moment(new Date(formData.end_depreciation)).format("YYYY-MM"),
      accountable: formData.accountable === null ? null : formData.accountable,
      months_depreciated: formData.months_depreciated === null ? 0 : formData.months_depreciated,
      acquisition_cost: formData.acquisition_cost === null ? 0 : formData.acquisition_cost,
      scrap_value: formData.scrap_value === null ? 0 : formData.scrap_value,
      depreciable_basis: formData.depreciable_basis === null ? 0 : formData.depreciable_basis,
    };

    if (data.status) {
      updateFixedAsset(newObj);
      return;
    }
    postFixedAsset(newObj);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
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

  const steps = ["Type of Asset", "Chart of Accounts", "Asset Information", "Depreciation"];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleDisableNext = () => {
  //   let disableButton = activeStep;
  //   switch (disableButton) {
  //     case 0:
  //       if (!(watch("type_of_request_id") && watch("major_category_id") && watch("minor_category_id"))) {
  //         return true;
  //       } else return false;

  //     case 1:
  //       if (!(watch("department_id") && watch("unit_id") && watch("subunit_id") && watch("location_id"))) {
  //         return true;
  //       } else return false;
  //     case 2:
  //       if (
  //         !(
  //           watch("asset_description") &&
  //           watch("asset_specification") &&
  //           watch("acquisition_date") &&
  //           (watch("accountability") && watch("accountability") === "Common" ? true : watch("accountable")) &&
  //           watch("po_number") &&
  //           watch("asset_status_id") &&
  //           watch("cycle_count_status_id") &&
  //           watch("movement_status_id")
  //         )
  //       ) {
  //         return true;
  //       } else return false;
  //     case 3:
  //       if (
  //         !(
  //           watch("depreciation_method") &&
  //           watch("depreciation_status") &&
  //           watch("months_depreciated") &&
  //           watch("acquisition_cost") &&
  //           watch("scrap_value")
  //         )
  //       ) {
  //         return true;
  //       } else return false;
  //     default:
  //       return false;
  //   }
  // };

  const handleDisableNext = () => {
    const stepsConditions = [
      // Case 0: Check type_of_request_id, major_category_id, and minor_category_id
      ["type_of_request_id", "major_category_id", "minor_category_id"],
      // Case 1: Check department_id, unit_id, subunit_id, and location_id
      ["department_id", "unit_id", "subunit_id", "location_id"],
      // Case 2: Check various fields including conditional logic for accountability
      [
        "asset_description",
        "asset_specification",
        "acquisition_date",
        "po_number",
        "asset_status_id",
        "cycle_count_status_id",
        "movement_status_id",
        () => watch("accountability") === "Common" || watch("accountable"),
      ],
      // Case 3: Check depreciation fields
      ["depreciation_method", "depreciation_status", "months_depreciated", "acquisition_cost", "scrap_value"],
    ];

    const conditions = stepsConditions[activeStep];
    if (!conditions) return false; // Default case
    return conditions.some((condition) => (typeof condition === "function" ? !condition() : !watch(condition)));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="AddFa">
      <Box className="AddFa__title">
        <Stack flexDirection="row" alignItems="center">
          <AddBox color="secondary" sx={{ fontSize: "30px" }} />
          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem", ml: 1 }}>
            {data.status ? "Edit Fixed Asset" : "Add Fixed Asset"}
          </Typography>
        </Stack>

        <Tooltip title="Close" placement="right" arrow>
          <IconButton variant="outlined" color="secondary" size="small" onClick={handleCloseDrawer}>
            <Close />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      <Stepper activeStep={activeStep} sx={{ py: 3 }}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps} sx={{ ".Mui-completed > svg": { color: "success.main" } }}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Divider />

      <Box className="AddFa__container">
        {activeStep === 0 && (
          <Stack gap={3}>
            <Box className="addFixedAsset__type">
              <Stack flexDirection="column" gap={2} width="100%">
                <Typography sx={sxSubtitle}>Type of Asset</Typography>
                <CustomAutoComplete
                  control={control}
                  name="type_of_request_id"
                  options={typeOfRequestData}
                  loading={isTypeOfRequestLoading}
                  disableClearable
                  size="small"
                  onOpen={() => (isTypeOfRequestSuccess ? false : typeOfRequestTrigger())}
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
              </Stack>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "100%",
              }}
            >
              <Typography sx={sxSubtitle}>Set the Category</Typography>

              <CustomAutoComplete
                autoComplete
                required
                name="major_category_id"
                control={control}
                options={majorCategoryData}
                onOpen={() => (isMajorCategorySuccess ? null : majorCategoryTrigger())}
                loading={isMajorCategoryLoading}
                disableClearable
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
                    setValue("account_title_id", null);
                  }

                  setValue("est_useful_life", value.est_useful_life);
                  return value;
                }}
              />

              <CustomAutoComplete
                autoComplete
                required
                name="minor_category_id"
                disableClearable
                control={control}
                options={
                  majorCategoryData?.filter((obj) => {
                    return obj?.id === watch("major_category_id")?.id;
                  })[0]?.minor_category || []
                }
                onOpen={() => (isMinorCategorySuccess ? null : minorCategoryTrigger())}
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
                  setValue("account_title_id", value ? value.account_title : null);
                  return value;
                }}
              />
            </Box>
          </Stack>
        )}

        {activeStep === 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
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
              onOpen={() => (isBusinessUnitSuccess ? null : businessUnitTrigger())}
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
                return item.subunit.some((subunit) => {
                  return subunit?.id === watch("subunit_id")?.id;
                });
              })}
              loading={isLocationLoading}
              size="small"
              getOptionLabel={(option) => option.location_code + " - " + option.location_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
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
              onOpen={() => (isAccountTitleSuccess ? null : accountTitleTrigger())}
              options={accountTitleData}
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
        )}

        {activeStep === 2 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
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
              disabled={data?.print_count >= 1}
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
              // views={["year", "month", "day"]}
              // openTo="year"
              error={!!errors?.acquisition_date}
              helperText={errors?.acquisition_date?.message}
              fullWidth={isFullWidth ? true : false}
              maxDate={new Date()}
              reduceAnimations
            />

            <Stack flexDirection="row" gap={1}>
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
                  setValue("accountable", null);
                  return value;
                }}
                fullWidth
              />

              <CustomAutoComplete
                name="accountable"
                control={control}
                size="small"
                includeInputInList
                // disablePortal
                filterOptions={filterOptions}
                options={sedarData}
                onOpen={() => (isSedarSuccess ? null : sedarTrigger())}
                loading={isSedarLoading}
                disabled={watch("accountability") === "Common" || watch("accountability") === null}
                getOptionLabel={(option) => option.general_info?.full_id_number_full_name}
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
                fullWidth
              />
            </Stack>

            <CustomPatternField
              control={control}
              color="secondary"
              name="cellphone_number"
              label="Cellphone # (Optional)"
              optional
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
              label="Brand (Optional)"
              optional
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
              label="Care of (Optional)"
              optional
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
                label="Voucher (Optional)"
                type="text"
                color="secondary"
                size="small"
                disabled
                error={!!errors?.voucher}
                helperText={errors?.voucher?.message}
                fullWidth
              />

              <CustomDatePicker
                control={control}
                name="voucher_date"
                label="Voucher Date"
                size="small"
                disabled
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
              label="Receipt (Optional)"
              optional
              type="text"
              color="secondary"
              size="small"
              error={!!errors?.receipt}
              helperText={errors?.receipt?.message}
              disabled={disableItems}
              fullWidth
            />

            <CustomTextField
              autoComplete="off"
              control={control}
              name="po_number"
              label="Purchase Order #"
              type="text"
              color="secondary"
              size="small"
              error={!!errors?.po_number}
              helperText={errors?.po_number?.message}
              disabled={disableItems}
              fullWidth
            />

            <Box className="addFixedAsset__status">
              <CustomNumberField
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
                onOpen={() => (isAssetStatusSuccess ? null : assetStatusTrigger())}
                options={assetStatusData}
                loading={isAssetStatusLoading}
                getOptionLabel={(option) => option.asset_status_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Asset Status"
                    error={!!errors?.asset_status_id}
                    helperText={errors?.asset_status_id?.message}
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
                    error={!!errors?.cycle_count_status_id}
                    helperText={errors?.cycle_count_status_id?.message}
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
                    error={!!errors?.movement_status_id}
                    helperText={errors?.movement_status_id?.message}
                  />
                )}
                fullWidth
              />
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
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
                onOpen={() => (isDepreciationStatusSuccess ? null : depreciationTrigger())}
                options={depreciationStatusData}
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
                  disabled
                  // views={["year", "month", "day"]}
                  // openTo="year"
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
                  fullWidth={watch("depreciation_method") !== "Supplier Rebase" ? (isFullWidth ? false : true) : true}
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
                    // isAllowed={(values) => {
                    //   const { floatValue } = values;
                    //   return floatValue >= 1;
                    // }}
                    thousandSeparator
                    fullWidth
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
                    disabled={data?.status}
                    error={!!errors?.acquisition_cost}
                    helperText={errors?.acquisition_cost?.message}
                    prefix="₱"
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      return floatValue >= 1;
                    }}
                    thousandSeparator
                    fullWidth
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
                    fullWidth
                  />
                </Box>
              )}

              {watch("depreciation_method") !== "Supplier Rebase" && (
                <CustomNumberField
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
        )}
      </Box>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep === steps.length - 1 ? (
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={!isValid}
          >
            {data.status ? "Update" : "Create"}
          </LoadingButton>
        ) : (
          <Button variant="contained" size="small" onClick={handleNext} disabled={handleDisableNext()}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AddFa;
