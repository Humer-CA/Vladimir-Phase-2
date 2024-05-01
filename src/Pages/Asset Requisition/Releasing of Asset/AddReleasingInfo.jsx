import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from "@mui/material";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import SignatureCanvas from "react-signature-canvas";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { LoadingButton } from "@mui/lab";
import { closeDialog, closeDialog1, openDialog1 } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { usePutAssetReleasingMutation } from "../../../Redux/Query/Request/AssetReleasing";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { Info, Refresh, Save } from "@mui/icons-material";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { notificationApi } from "../../../Redux/Query/Notification";
import { useLazyGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Company";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import { useLazyGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";
import { useLazyGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import { useLazyGetLocationAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Location";
import { useLazyGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";

const schema = yup.object().shape({
  warehouse_number_id: yup.array(),
  department_id: yup.object().required().label("Department").typeError("Department is a required field"),
  company_id: yup.object().required().label("Company").typeError("Company is a required field"),
  business_unit_id: yup.object().required().label("Business Unit").typeError("Business Unit is a required field"),
  unit_id: yup.object().required().label("Unit").typeError("Unit is a required field"),
  subunit_id: yup.object().required().label("Subunit").typeError("Subunit is a required field"),
  location_id: yup.object().required().label("Location").typeError("Location is a required field"),
  account_title_id: yup.object().required().label("Account Title").typeError("Account Title is a required field"),
  accountability: yup.string().required().typeError("Accountability is a required field"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),
  received_by: yup.object().required().typeError("Received By is a required field"),
});

const AddReleasingInfo = (props) => {
  const { data, refetch, warehouseNumber } = props;
  const [signature, setSignature] = useState();
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);

  const signatureRef = useRef();
  const dialog = useSelector((state) => state.booleanState?.dialogMultiple?.dialog1);

  const {
    handleSubmit,
    control,
    watch,
    register,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      department_id: null,
      company_id: null,
      business_unit_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,
      accountability: null,
      accountable: null,
      received_by: null,
    },
  });

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

  const dispatch = useDispatch();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
    error: sedarError,
  } = useGetSedarUsersApiQuery();

  const [
    releaseItems,
    { data: postData, isSuccess: isPostSuccess, isLoading: isPostLoading, isError: isPostError, error: postError },
  ] = usePutAssetReleasingMutation();

  useEffect(() => {
    const errorData = isPostError && postError?.status === 422;

    if (errorData) {
      const errors = postError?.data?.errors || {};
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
  }, [isPostError]);

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDialog();
      // refetch();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  useEffect(() => {
    setValue("warehouse_number_id", warehouseNumber?.warehouse_number_id);
  }, [warehouseNumber]);

  // console.log(watch("warehouse_number_id"));

  const handleCloseDialog = () => {
    dispatch(closeDialog());
  };

  const filterOptions = createFilterOptions({
    limit: 50,
    matchFrom: "any",
  });

  const BoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    pb: "10px",
  };

  const sxSubtitle = {
    fontWeight: "bold",
    color: "secondary.main",
    fontFamily: "Anton",
    fontSize: "16px",
  };

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      warehouse_number_id: warehouseNumber ? formData?.warehouse_number_id : [data?.warehouse_number?.id],
      department_id: formData?.department_id.id?.toString(),
      company_id: formData.company_id.id?.toString(),
      business_unit_id: formData.business_unit_id.id?.toString(),
      unit_id: formData.unit_id.id?.toString(),
      subunit_id: formData.subunit_id.id?.toString(),
      location_id: formData?.location_id.id?.toString(),
      account_title_id: formData?.account_title_id.id?.toString(),
      accountable: formData?.accountable?.general_info?.full_id_number_full_name?.toString(),
      received_by: formData?.received_by?.general_info?.full_id_number_full_name?.toString(),
      signature: signature,
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
              RELEASE
            </Typography>{" "}
            this Item?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await releaseItems(newFormData).unwrap();
            // console.log(result);
            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            // dispatch(notificationApi.util.resetApiState());
            dispatch(notificationApi.util.invalidateTags(["Notif"]));
            dispatch(closeConfirm());
          } catch (err) {
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data?.errors?.signature[0] || err.data.message,
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

  const isCanvasEmpty = () => {
    const canvas = signatureRef.current.getCanvas();
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const isEmpty = !imageData.some((alpha) => alpha !== 0);
    return isEmpty;
  };

  const handleSaveSignature = () => {
    const signatureDataURL = signatureRef.current.toDataURL();
    !isCanvasEmpty()
      ? (setSignature(signatureDataURL),
        setTrimmedDataURL(signatureRef.current.getTrimmedCanvas().toDataURL("image/png"), { willReadFrequently: true }),
        handleCloseSignature())
      : null;
  };

  const handleClearSignature = () => {
    signatureRef.current.clear();
  };

  const handleCloseSignature = () => {
    dispatch(closeDialog1());
  };

  return (
    <Box className="mcontainer" component="form" onSubmit={handleSubmit(onSubmitHandler)} gap={1}>
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem", textAlign: "center" }}>
        Releasing
      </Typography>

      <Divider sx={{ mb: "20px" }} />

      <Stack flexDirection="row" gap={3} overflow="auto">
        <Stack width="50%">
          <Stack gap={2}>
            <Typography sx={sxSubtitle}>Warehouse Number</Typography>
            {warehouseNumber && (
              <Autocomplete
                {...register}
                readOnly
                required
                multiple
                name="warehouse_number_id"
                options={warehouseNumber?.warehouse_number_id}
                value={warehouseNumber?.warehouse_number_id}
                size="small"
                renderInput={(params) => (
                  <TextField
                    label={watch("warehouse_number_id") ? "Warehouse Number" : "No Data"}
                    color="secondary"
                    sx={{
                      ".MuiInputBase-root ": { borderRadius: "10px" },
                      pointer: "default",
                    }}
                    {...params}
                    // label={`${name}`}
                  />
                )}
              />
            )}

            <Box sx={BoxStyle}>
              <Typography sx={sxSubtitle}>Accountability</Typography>
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
              />

              {watch("accountability") === "Personal Issued" && (
                <CustomAutoComplete
                  name="accountable"
                  control={control}
                  size="small"
                  includeInputInList
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
                      label="Accountable"
                      color="secondary"
                      error={!!errors?.accountable?.message}
                      helperText={errors?.accountable?.message}
                    />
                  )}
                />
              )}

              <CustomAutoComplete
                autoComplete
                name="received_by"
                control={control}
                filterOptions={filterOptions}
                options={sedarData}
                loading={isSedarLoading}
                size="small"
                getOptionLabel={(option) => option.general_info?.full_id_number_full_name}
                isOptionEqualToValue={(option, value) =>
                  option.general_info?.full_id_number === value.general_info?.full_id_number
                }
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Received By"
                    error={!!errors?.received_by}
                    helperText={errors?.received_by?.message}
                  />
                )}
              />
            </Box>
          </Stack>

          <Stack py={1}>
            {trimmedDataURL ? (
              <Box sx={{ border: "1px solid gray", borderRadius: "10px", p: 2 }}>
                <img src={trimmedDataURL} alt="Trimmed Signature" height="100px" width="100%" />
              </Box>
            ) : null}
            {/* {signature ? <></>} */}
            <Button onClick={() => dispatch(openDialog1())}>{signature ? "Change Sign" : "Add Signature"}</Button>
          </Stack>
        </Stack>

        <Box sx={BoxStyle} maxWidth="50%" height="100%">
          <Typography sx={sxSubtitle}>Charging Information</Typography>
          <CustomAutoComplete
            autoComplete
            control={control}
            name="department_id"
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
        </Box>
      </Stack>

      <Stack flexDirection="row" alignSelf="flex-end" gap={2} p={1}>
        <LoadingButton variant="contained" loading={isPostLoading} size="small" type="submit" disabled={!isDirty}>
          Release
        </LoadingButton>

        <Button variant="outlined" color="secondary" size="small" onClick={() => dispatch(closeDialog())}>
          Cancel
        </Button>
      </Stack>

      <Dialog open={dialog} onClose={handleCloseSignature}>
        <Box p={2}>
          <Typography fontFamily="Anton, Impact, Roboto" fontSize={20} color="secondary.main" p={1}>
            ADD SIGNATURE
          </Typography>
          <Stack gap={2} position="relative" willreadfrequently="true">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{ width: 400, height: 200, className: "signCanvas" }}
              willreadfrequently="true"
            />
            <Stack flexDirection="row" alignSelf="flex-end" gap={2}>
              <IconButton onClick={() => handleClearSignature()} sx={{ position: "absolute", top: 10, left: 10 }}>
                <Tooltip title="Clear" placement="right" arrow>
                  <Refresh />
                </Tooltip>
              </IconButton>
              <Button variant="contained" startIcon={<Save />} size="small" onClick={() => handleSaveSignature()}>
                Save
              </Button>
              <Button variant="outlined" size="small" color="secondary" onClick={handleCloseSignature}>
                Close
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddReleasingInfo;
