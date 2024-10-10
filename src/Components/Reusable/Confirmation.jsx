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
    onDismiss,
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
    formState: { errors, isValid },
    control,
    register,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { remarks: "" },
  });

  const handleClose = () => {
    dispatch(closeConfirm());
    onDismiss && onDismiss();
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
      console.log(error?.errors?.remarks[0]);
    }
  };

  return remarks ? (
    <Box className="confirmation" width="100%" component="form" onSubmit={handleSubmit(handleConfirm)}>
      <Stack flexDirection="row" alignItems="center" gap={1} justifySelf="flex-start">
        <SvgIcon
          component={icon}
          htmlColor={iconColor}
          // htmlColor="info"
          sx={{ fontSize: "40px", ...iconProps }}
        />
        <DialogTitle
          className="confirmation__title"
          color="secondary"
          sx={{ fontFamily: "Anton", fontSize: "1.5rem", padding: 0 }}
        >
          Confirmation
        </DialogTitle>
      </Stack>

      <DialogContent sx={{ p: 1, px: 0, alignSelf: "flex-start", width: "100%" }}>
        <DialogContentText component="div" align="left" pl={1}>
          {message}
        </DialogContentText>
      </DialogContent>

      <Stack gap={1.5} pt={1}>
        <Typography fontFamily="Anton" fontWeight="bold" fontSize={18} color="secondary" align="left">
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
          minRows={4}
          maxRows={6}
          multiline
          sx={{ minHeight: "200px" }}
          error={!!errors?.remarks}
          helperText={errors?.remarks?.message}
        />

        {/* <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-textarea" color="secondary" sx={{ bgcolor: "white" }}>
            Remarks*
          </InputLabel>
          <OutlinedInput
            {...register}
            name="remarks"
            size="small"
            color="secondary"
            required
            inputComponent={TextareaAutosize}
            inputProps={{
              minRows: 4,
              style: {
                resize: "none",
                padding: "12px 16px",
                height: "20px",
                maxHeight: "150px",
                minHeight: "100%",
                fontSize: "14px",
                overflow: "auto",
              },
            }}
            label="Remarks*"
            sx={{
              borderRadius: "10px",
            }}
          />
        </FormControl> */}
      </Stack>

      {/* <DialogActions> */}
      <Stack justifyContent="flex-end" flexDirection="row" gap={2} marginTop={3}>
        <LoadingButton
          color="primary"
          // onClick={handleConfirm}
          loading={loading}
          type="submit"
          variant="contained"
          size="small"
          disabled={watch("remarks") === "" || watch("remarks") === " "}
        >
          Yes
        </LoadingButton>

        <Button
          autoFocus
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          disabled={loading === true}
          size="small"
        >
          No
        </Button>
      </Stack>
      {/* </DialogActions> */}
    </Box>
  ) : (
    <Box className="confirmation" component="form" onSubmit={handleSubmit(handleConfirm)}>
      <SvgIcon
        component={icon}
        htmlColor={iconColor}
        // htmlColor="info"
        sx={{ fontSize: "50px", alignSelf: "center", ...iconProps }}
      />
      <DialogTitle
        className="confirmation__title"
        color="secondary"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem", padding: 0 }}
      >
        Confirmation
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>

      {/* <DialogActions> */}
      <Stack alignContent="flex-start" justifyContent="center" flexDirection="row" gap={2} marginTop={3}>
        <LoadingButton
          color="primary"
          // onClick={handleConfirm}
          loading={loading}
          type="submit"
          variant="contained"
          size="small"
        >
          Yes
        </LoadingButton>

        <Button
          autoFocus
          variant="outlined"
          color="secondary"
          onClick={handleClose}
          disabled={loading === true}
          size="small"
        >
          No
        </Button>
      </Stack>
      {/* </DialogActions> */}
    </Box>
  );
};

export default Confirmation;
