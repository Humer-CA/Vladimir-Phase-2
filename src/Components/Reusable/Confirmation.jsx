import React, { useEffect, useState } from "react";
import "../../Style/confirmation.scss";
import CustomTextField from "../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// RTK
import { closeConfirm } from "../../Redux/StateManagement/confirmSlice";
import { useDispatch } from "react-redux";

// MUI
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  remarks: yup.string().nullable(),
});

const Confirmation = (props) => {
  const dispatch = useDispatch();

  const {
    message,
    icon,
    iconProps,
    iconColor,
    onConfirm,
    loading,
    autoClose,
    remarks,
    // control,
    status,
  } = props;

  // const {
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  //   reset,
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues: { remarks: "" },
  // });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { remarks: "" },
  });

  const handleClose = () => {
    dispatch(closeConfirm());
  };

  // WORKING --------------------------
  // const handleConfirm = async () => {
  //   await onConfirm();
  //   if (!autoClose) {
  //     dispatch(closeConfirm());
  //   }
  // };

  // TESTING ---------------------------
  const handleConfirm = async ({ remarks }) => {
    // console.log(remarks)
    try {
      await onConfirm(remarks);
      if (!autoClose) {
        dispatch(closeConfirm());
      }
    } catch (error) {
      // Handle form submission errors (if any)
    }
  };

  // const handleConfirm = async (formData) => {
  //   try {
  //     await onConfirm(formData.remarks); // Pass the remarks value to onConfirm
  //   } catch (error) {
  //     // Handle form submission errors (if any)
  //   }
  // };

  return (
    <Box className="confirmation" component="form" onSubmit={handleSubmit(handleConfirm)}>
      <SvgIcon
        component={icon}
        htmlColor={iconColor}
        // htmlColor="info"
        sx={{ fontSize: "50px", ...iconProps }}
      />
      <DialogTitle
        className="confirmation__title"
        color="secondary"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem", padding: 0 }}
      >
        Confirmation
      </DialogTitle>

      <DialogContent sx={{ padding: 0, paddingBottom: remarks ? 2 : 0 }}>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>

      {remarks && (
        <Stack gap={1} width="90%">
          <Typography fontFamily="Anton" fontWeight="bold" fontSize={20} color="secondary">
            Remarks
          </Typography>

          <CustomTextField
            control={control}
            required
            name="remarks"
            label="Remarks"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            multiline
            error={!!errors?.remarks}
            helperText={errors?.remarks?.message}
          />
        </Stack>
      )}

      {/* <DialogActions> */}
      <Stack alignContent="flex-start" justifyContent="center" flexDirection="row" gap={2} marginTop={3}>
        <LoadingButton
          color="primary"
          // onClick={handleConfirm}
          loading={loading}
          type="submit"
          variant="contained"
        >
          Yes
        </LoadingButton>

        <Button autoFocus variant="outlined" color="secondary" onClick={handleClose} disabled={loading === true}>
          No
        </Button>
      </Stack>
      {/* </DialogActions> */}
    </Box>
  );
};

export default Confirmation;
