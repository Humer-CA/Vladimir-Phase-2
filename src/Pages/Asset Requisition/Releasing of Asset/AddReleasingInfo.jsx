import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
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

const schema = yup.object().shape({
  warehouse_number_id: yup.array(),
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
      accountability: null,
      accountable: null,
      received_by: null,
    },
  });

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

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      warehouse_number_id: warehouseNumber ? formData?.warehouse_number_id : [data?.warehouse_number?.id],
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

  const handleSaveSignature = () => {
    const signatureDataURL = signatureRef.current.toDataURL();
    setSignature(signatureDataURL);
    setTrimmedDataURL(signatureRef.current.getTrimmedCanvas().toDataURL("image/png"));
    handleCloseSignature();
  };

  const handleClearSignature = () => {
    signatureRef.current.clear();
  };

  const handleCloseSignature = () => {
    dispatch(closeDialog1());
  };

  return (
    <Box className="mcontainer" component="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem", textAlign: "center" }}>
        Releasing
      </Typography>
      <Stack gap={2}>
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

        <Stack>
          {trimmedDataURL ? (
            <Box sx={{ border: "1px solid gray", borderRadius: "10px", p: 2 }}>
              <img src={trimmedDataURL} alt="Trimmed Signature" height="100px" width="100%" />
            </Box>
          ) : null}
          {/* {signature ? <></>} */}
          <Button onClick={() => dispatch(openDialog1())}>{signature ? "Change Sign" : "Add Signature"}</Button>
        </Stack>

        <Stack flexDirection="row" alignSelf="flex-end" gap={2}>
          <LoadingButton variant="contained" loading={isPostLoading} size="small" type="submit" disabled={!isDirty}>
            Release
          </LoadingButton>

          <Button variant="outlined" color="secondary" size="small" onClick={() => dispatch(closeDialog())}>
            Cancel
          </Button>
        </Stack>
      </Stack>

      <Dialog open={dialog} onClose={handleCloseSignature}>
        <Box p={2}>
          <Typography fontFamily="Anton, Impact, Roboto" fontSize={20} color="secondary.main" p={1}>
            ADD SIGNATURE
          </Typography>
          <Stack gap={2} position="relative">
            <SignatureCanvas ref={signatureRef} canvasProps={{ width: 400, height: 200, className: "signCanvas" }} />
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
