import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from "@mui/material";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import SignatureCanvas from "react-signature-canvas";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { LoadingButton } from "@mui/lab";
import { closeDialog, closeDialog1, openDialog1 } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { usePutAssetReleasingMutation, usePutSaveReleasingMutation } from "../../../Redux/Query/Request/AssetReleasing";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { Info, Refresh, Remove, Save } from "@mui/icons-material";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { notificationApi } from "../../../Redux/Query/Notification";
import { useLazyGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Company";
import { useLazyGetBusinessUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/BusinessUnit";
import { useLazyGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Department";
import { useLazyGetUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Unit";
import { useLazyGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import { useLazyGetLocationAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/Location";
import { useLazyGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";
import CustomImgAttachment from "../../../Components/Reusable/CustomImgAttachment";
import AttachmentActive from "../../../Img/SVG/SVG/AttachmentActive.svg";

const schema = yup.object().shape({
  department_id: yup.object().required().label("Department").typeError("Department is a required field"),
  company_id: yup.object().required().label("Company").typeError("Company is a required field"),
  business_unit_id: yup.object().required().label("Business Unit").typeError("Business Unit is a required field"),
  unit_id: yup.object().required().label("Unit").typeError("Unit is a required field"),
  subunit_id: yup.object().required().label("Subunit").typeError("Subunit is a required field"),
  location_id: yup.object().required().label("Location").typeError("Location is a required field"),
  // account_title_id: yup.object().required().label("Account Title").typeError("Account Title is a required field"),
  accountability: yup.string().required().typeError("Accountability is a required field"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),
  received_by: yup.object().required().typeError("Received By is a required field"),

  receiver_img: yup.mixed().required().label("Receiver Image").typeError("Receiver Image is a required field"),
  assignment_memo_img: yup.mixed().required().label("Assignment Memo").typeError("Assignment Memo is a required field"),
  authorization_memo_img: yup
    .mixed()
    .required()
    .label("Authorization Letter")
    .typeError("Authorization Letter is a required field"),
});

const schemaSave = yup.object().shape({
  accountability: yup.string().required().typeError("Accountability is a required field"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),
});

const AddReleasingInfo = (props) => {
  const { data, refetch, warehouseNumber, hideWN, commonData, personalData } = props;
  const [signature, setSignature] = useState();
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [currentSchema, setCurrentSchema] = useState(schema);

  const signatureRef = useRef();
  const receiverMemoRef = useRef(null);
  const assignmentMemoRef = useRef(null);
  const authorizationLetterRef = useRef(null);

  const dialog = useSelector((state) => state.booleanState?.dialogMultiple?.dialog1);
  const dialog1 = useSelector((state) => state.booleanState?.dialogMultiple?.dialog2);

  const {
    handleSubmit,
    control,
    watch,
    register,
    reset,
    setValue,
    setError,
    trigger,
    clearErrors,
    formState: { errors, isDirty, isValid, isValidating },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(currentSchema),
    defaultValues: {
      warehouse_number_id: warehouseNumber?.warehouse_number_id,
      department_id: null,
      company_id: null,
      business_unit_id: null,
      unit_id: null,
      subunit_id: null,
      location_id: null,
      // account_title_id: null,
      accountability: null,
      accountable: null,
      received_by: null,

      // Attachments
      receiver_img: null,
      assignment_memo_img: null,
      authorization_memo_img: null,
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

  const [
    saveData,
    { data: savedData, isSuccess: isSavedSuccess, isLoading: isSavedLoading, isError: isSavedError, error: savedError },
  ] = usePutSaveReleasingMutation();

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
      refetch();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

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
    // width: "100%",
    pb: "10px",
  };

  const sxSubtitle = {
    fontWeight: "bold",
    color: "secondary.main",
    fontFamily: "Anton",
    fontSize: "16px",
  };

  const onSubmitHandler = async (formData) => {
    // console.log(formData);
    // fileToBase64
    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // Formats
    const receiverImgBase64 = formData?.receiver_img && (await fileToBase64(formData.receiver_img));
    const assignmentMemoImgBase64 = formData?.assignment_memo_img && (await fileToBase64(formData.assignment_memo_img));
    const authorizationLetterImgBase64 =
      formData?.authorization_memo_img && (await fileToBase64(formData.authorization_memo_img));

    const saveFormData = {
      accountability: formData.accountability,
      accountable: formData?.accountable?.general_info?.full_id_number_full_name?.toString(),
    };

    const newFormData = {
      ...formData,
      department_id: handleSaveValidation() ? null : formData?.department_id?.id?.toString(),
      company_id: handleSaveValidation() ? null : formData.company_id?.id?.toString(),
      business_unit_id: handleSaveValidation() ? null : formData.business_unit_id?.id?.toString(),
      unit_id: handleSaveValidation() ? null : formData.unit_id?.id?.toString(),
      subunit_id: handleSaveValidation() ? null : formData.subunit_id?.id?.toString(),
      location_id: handleSaveValidation() ? null : formData?.location_id?.id?.toString(),
      // account_title_id: formData?.account_title_id.id?.toString(),
      accountable: formData?.accountable?.general_info?.full_id_number_full_name?.toString(),
      received_by: formData?.received_by?.general_info?.full_id_number_full_name?.toString(),
      // signature: signature,
      receiver_img: receiverImgBase64,
      assignment_memo_img: assignmentMemoImgBase64,
      authorization_memo_img: authorizationLetterImgBase64,
    };

    console.log(formData);

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
              {handleSaveValidation() ? "SAVE" : "RELEASE"}
            </Typography>{" "}
            this {handleSaveValidation() ? "data" : "item"}?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = handleSaveValidation()
              ? await saveData(saveFormData).unwrap()
              : await releaseItems(newFormData).unwrap();
            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            // dispatch(notificationApi.util.resetApiState());
            dispatch(notificationApi.util.invalidateTags(["Notif"]));
            dispatch(closeConfirm());
            dispatch(closeDialog());
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

  // const isCanvasEmpty = () => {
  //   const canvas = signatureRef.current.getCanvas();
  //   const ctx = canvas.getContext("2d", { willReadFrequently: true });
  //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  //   const isEmpty = !imageData.some((alpha) => alpha !== 0);
  //   return isEmpty;
  // };

  // const handleSaveSignature = () => {
  //   const signatureDataURL = signatureRef.current.toDataURL();
  //   !isCanvasEmpty()
  //     ? (setSignature(signatureDataURL),
  //       setTrimmedDataURL(signatureRef.current.getTrimmedCanvas().toDataURL("image/png"), { willReadFrequently: true }),
  //       handleCloseSignature())
  //     : null;
  // };

  // const handleClearSignature = () => {
  //   signatureRef.current.clear();
  // };

  // Images
  const handleCloseSignature = () => {
    dispatch(closeDialog1());
  };

  const UpdateField = ({ value, label, watch }) => {
    const handleViewImage = () => {
      const url = URL.createObjectURL(watch);
      // console.log("Object URL created:", url);
      setViewImage(url);
      dispatch(openDialog1());
    };

    return (
      <Stack flexDirection="row" gap={1} alignItems="center">
        <Tooltip title={watch && "Click to view Image"} placement="top" arrow>
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
              input: { cursor: "pointer" },
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
            onClick={() => (watch === null ? null : handleViewImage())}
          />
        </Tooltip>
      </Stack>
    );
  };

  const RemoveFile = ({ title, value }) => {
    return (
      <Tooltip title={`Remove ${title}`} placement="top" arrow>
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

  const handleCloseView = () => {
    dispatch(closeDialog1());
  };

  const handleSaveValidation = () => {
    return !(
      commonData === (watch("accountability") === "Common") ||
      personalData === (watch("accountability") === "Personal Issued")
    );
  };

  useEffect(() => {
    setCurrentSchema(handleSaveValidation() ? schemaSave : schema);
  }, [watch("accountability")]);

  useEffect(() => {
    reset({}, { keepDefaultValues: true, resolver: yupResolver(currentSchema) });
  }, [currentSchema, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} gap={1} px={3} overflow="auto">
      <Typography
        className="mcontainer__title"
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.6rem", textAlign: "center", mb: "5px" }}
      >
        Releasing
      </Typography>

      <Divider sx={{ mb: "20px" }} />

      <Stack gap={2} pb={3}>
        {!hideWN && <Typography sx={sxSubtitle}>Warehouse Number</Typography>}
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
                label={watch("warehouse_number_id") !== null ? "Warehouse Number" : "No Data"}
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
      </Stack>

      <Stack flexDirection="row" justifyContent="center" gap={4} overflow="auto">
        <Stack gap={2} width="220px">
          <Box sx={BoxStyle}>
            <Typography sx={sxSubtitle}>Accountability</Typography>
            <CustomAutoComplete
              autoComplete
              name="accountability"
              control={control}
              options={["Personal Issued", "Common"]}
              size="small"
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(_, value) => {
                reset({
                  department_id: null,
                  company_id: null,
                  business_unit_id: null,
                  unit_id: null,
                  subunit_id: null,
                  location_id: null,
                  // account_title_id: null,
                  accountability: value,
                  accountable: null,
                  received_by: null,

                  // Attachments
                  receiver_img: null,
                  assignment_memo_img: null,
                  authorization_memo_img: null,
                });
              }}
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
              disabled={handleSaveValidation()}
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

            {/* Signature */}
            {/* {trimmedDataURL ? (
                <Box
                  sx={{ display: "grid", placeContent: "center", border: "1px solid gray", borderRadius: "10px", p: 2 }}
                >
                  <img src={trimmedDataURL} alt="Trimmed Signature" height="100px" width="200px" />
                </Box>
              ) : null}
              <Button onClick={() => dispatch(openDialog1())}>{signature ? "Change Sign" : "Add Signature"}</Button> */}
          </Box>

          <Box sx={BoxStyle} pt={0.5}>
            <Typography sx={sxSubtitle}>Attachments</Typography>
            <Stack flexDirection="row" gap={1} alignItems="center">
              {watch("receiver_img") !== null ? (
                <UpdateField
                  label={"Receiver Image"}
                  value={watch("receiver_img")?.name}
                  watch={watch("receiver_img")}
                />
              ) : (
                <CustomImgAttachment
                  control={control}
                  name="receiver_img"
                  label="Receiver Image"
                  disabled={handleSaveValidation()}
                  inputRef={receiverMemoRef}
                  error={!!errors?.receiver_img?.message}
                  helperText={errors?.receiver_img?.message}
                />
              )}
              {watch("receiver_img") !== null && <RemoveFile title="Receiver Image" value="receiver_img" />}
            </Stack>

            <Stack flexDirection="row" gap={1} alignItems="center">
              {watch("assignment_memo_img") !== null ? (
                <UpdateField
                  label={"Assignment Memo"}
                  value={watch("assignment_memo_img")?.name}
                  watch={watch("assignment_memo_img")}
                />
              ) : (
                <CustomImgAttachment
                  control={control}
                  name="assignment_memo_img"
                  label="Assignment Memo"
                  disabled={handleSaveValidation()}
                  inputRef={assignmentMemoRef}
                  error={!!errors?.assignment_memo_img?.message}
                  helperText={errors?.assignment_memo_img?.message}
                />
              )}
              {watch("assignment_memo_img") !== null && (
                <RemoveFile title="Assignment Memo" value="assignment_memo_img" />
              )}
            </Stack>

            <Stack flexDirection="row" gap={1} alignItems="center">
              {watch("authorization_memo_img") !== null ? (
                <UpdateField
                  label={"Authorization Letter"}
                  value={watch("authorization_memo_img")?.name}
                  watch={watch("authorization_memo_img")}
                />
              ) : (
                <CustomImgAttachment
                  control={control}
                  name="authorization_memo_img"
                  label="Authorization Letter"
                  disabled={handleSaveValidation()}
                  inputRef={authorizationLetterRef}
                  error={!!errors?.authorization_memo_img?.message}
                  helperText={errors?.authorization_memo_img?.message}
                />
              )}
              {watch("authorization_memo_img") !== null && (
                <RemoveFile title="Authorization Letter" value="authorization_memo_img" />
              )}
            </Stack>
          </Box>
        </Stack>

        <Stack sx={BoxStyle} width="250px">
          <Typography sx={sxSubtitle}>Charging Information</Typography>
          <CustomAutoComplete
            autoComplete
            control={control}
            name="department_id"
            options={departmentData}
            onOpen={() => (isDepartmentSuccess ? null : (departmentTrigger(), companyTrigger(), businessUnitTrigger()))}
            loading={isDepartmentLoading}
            disabled={handleSaveValidation()}
            disableClearable
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
            disabled={handleSaveValidation()}
            disableClearable
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
            disabled={handleSaveValidation()}
            disableClearable
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
            disabled={handleSaveValidation()}
            disableClearable
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
          /> */}
        </Stack>
      </Stack>

      <Divider flexItem sx={{ my: "10px" }} />

      <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
        <LoadingButton
          variant="contained"
          color={handleSaveValidation() ? "tertiary" : "primary"}
          loading={isPostLoading}
          size="small"
          type="submit"
          sx={{ color: handleSaveValidation() && "white" }}
          disabled={!isValid}
        >
          {handleSaveValidation() ? "Save" : "Release"}
        </LoadingButton>

        <Button variant="outlined" color="secondary" size="small" onClick={() => dispatch(closeDialog())}>
          Cancel
        </Button>
      </Stack>

      {/* <Dialog open={dialog} onClose={handleCloseSignature}>
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
            <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
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
      </Dialog> */}

      <Dialog open={dialog} onClose={handleCloseView}>
        <Box p={2} borderRadius="10px">
          <Typography fontFamily="Anton, Impact, Roboto" fontSize={20} color="secondary.main" px={1}>
            View Image
          </Typography>
          <Stack justifyContent="space-between" p={2} gap={2}>
            <img src={viewImage} alt="Assignment Memo" />

            <Button variant="outlined" size="small" color="secondary" onClick={handleCloseSignature}>
              Close
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AddReleasingInfo;
