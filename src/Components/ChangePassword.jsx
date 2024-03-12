import React, { useEffect, useState } from "react";
import "../Style/changePassword.scss";
import CustomTextField from "./Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";

import { openToast } from "../Redux/StateManagement/toastSlice";
import { closeChangePassword } from "../Redux/StateManagement/changePasswordSlice";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import changePasswordIcon from "../Img/SVG/changePasswordIcon.svg";

import { usePostChangePasswordApiMutation } from "../Redux/Query/ChangePasswordApi";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = yup.object().shape({
  id: yup.string(),
  old_password: yup.string().required().label("Old Password"),
  new_password: yup.string().required().label("New Password"),
  confirm_password: yup.string().required().label("Confirm Password"),
});

const ChangePassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { resetLogin = () => {} } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const [
    postPassword,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostChangePasswordApiMutation();

  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      dispatch(closeChangePassword());
      // redirect to dashboard
      if (location.pathname === "/login") {
        navigate("/", { replace: true });
      }
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("old_password", {
        type: "validate",
        message: postError?.data?.message,
      });
      // setError("new_password", {
      //   type: "validate",
      //   message: postError?.data?.message,
      // });
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);
  // console.log(isPostError);
  // console.log(postError);

  const onSubmitHandler = (formData) => {
    if (formData.new_password !== formData.confirm_password) {
      return (
        setError("new_password", {
          type: "validate",
          message: postError?.data?.message,
        }),
        setError("confirm_password", {
          type: "validate",
          message: "Passwords do not match",
        })
      );
    }
    postPassword(formData);
  };

  const handleCloseDrawer = () => {
    dispatch(closeChangePassword());
    if (location.pathname === "/login") {
      localStorage.clear();
      resetLogin();
    }
  };

  return (
    <Box
      className="change-password"
      component="form"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <img src={changePasswordIcon} alt="icon" width="60px" />

      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        Change Password
      </Typography>

      <Box className="change-password__textField">
        <CustomTextField
          required
          autoFocus
          control={control}
          name="old_password"
          label="Old Password"
          type={showPassword ? "text" : "password"}
          color="secondary"
          size="small"
          error={!!errors?.old_password}
          helperText={errors?.old_password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {watch("old_password") && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <CustomTextField
          required
          control={control}
          name="new_password"
          label="New Password"
          type={showPassword1 ? "text" : "password"}
          color="secondary"
          size="small"
          error={!!errors?.new_password}
          helperText={errors?.new_password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {watch("new_password") && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword1(!showPassword1)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <CustomTextField
          required
          control={control}
          name="confirm_password"
          label="Confirm Password"
          type={showPassword2 ? "text" : "password"}
          color="secondary"
          size="small"
          error={!!errors?.confirm_password}
          helperText={errors?.confirm_password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {watch("confirm_password") && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword2(!showPassword2)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box className="change-password__buttons">
        <LoadingButton
          type="submit"
          variant="contained"
          size="small"
          loading={isPostLoading}
          disabled={
            watch("old_password") === undefined ||
            watch("old_password") === "" ||
            watch("new_password") === undefined ||
            watch("new_password") === "" ||
            watch("confirm_password") === undefined ||
            watch("confirm_password") === ""
          }
        >
          Update
        </LoadingButton>

        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleCloseDrawer}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
