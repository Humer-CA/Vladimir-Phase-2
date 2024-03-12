import React, { useEffect, useState } from "react";
import "../Style/login.scss";
import { vladimirAPI } from "../Api/vladimirAPI";
import CustomTextField from "../Components/Reusable/CustomTextField";
import VladimirLogo1 from "../Img/VladimirLogo1.svg";
import MisLogo from "../Img/MIS LOGO.png";

import { addUserDetails } from "../Redux/StateManagement/userLogin";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { openChangePassword } from "../Redux/StateManagement/changePasswordSlice";

import { Box, Dialog, IconButton, InputAdornment, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { openToast } from "../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import ChangePassword from "../Components/ChangePassword";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = yup.object().shape({
  username: yup.string().required().label("Username"),
  password: yup.string().required().label("Password"),
});

const LoginPage = () => {
  const [loginErr, setLoginErr] = useState(null);
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // console.log(loading);

  const Login = useNavigate();
  const changePassword = useSelector((state) => state.changePassword);
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmitHandler = async (data) => {
    try {
      setloading(true);

      const res = await vladimirAPI.post("/auth/login", data);
      // console.log(res);

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      const { access_permission } = res.data.data.user.role;

      // const masterlistArray = [
      //   "company",
      //   "department",
      //   "location",
      //   "account-title",
      //   "division",
      //   "type-of-request",
      //   "capex",
      //   "category",
      //   "status-category",
      // ];

      // let route;
      // switch (access_permission.split(", ")[0]) {
      //   case "dashboard":
      //     route = "";
      //     break;

      //   case "masterlist":
      //     access_permission
      //       .split(", ")
      //       .reverse()
      //       .forEach((perm) => {
      //         if (masterlistArray.includes(perm)) {
      //           route = `/masterlist/${perm}`;
      //         }
      //       });
      //   // if (access_permission.split(", ").includes("division")) {
      //   //   route = "/masterlist/division";
      //   // }
      // }

      // const route =
      //   access_permission.split(", ")[0] === "dashboard"
      //     ? ""
      //     : access_permission.split(", ")[0];

      // console.log(route);
      // return;

      const route = access_permission.split(", ")[0] === "dashboard" ? "" : access_permission.split(", ")[0];

      dispatch(addUserDetails(res.data.data));
      if (res.data.data.user.username === watch("password")) {
        if (watch("username")) {
          dispatch(openChangePassword());
        }
      } else {
        Login(`/${route}`);
        reset();
      }

      setloading(false);
    } catch (err) {
      setloading(false);
      if (err.request.status === 0) {
        dispatch(
          openToast({
            message: "No Internet Access, Please Try Again.",
            duration: 5000,
            variant: "error",
          })
        );
        return;
      }

      setLoginErr(err.response.data.message);
      setTimeout(() => {
        setLoginErr(null);
      }, 4000);
      setError(err.response.data.message);

      // console.log(err.message);
      // console.log(err.request);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };
    // window.addEventListener("beforeunload", () => localStorage.clear());
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Box className="login">
      <Box className="login__container">
        <Box className="login__logo-container">
          <Box
            className="login__logo"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={VladimirLogo1} alt="Vladimir" width="40%" />

            <Typography
              variant="h4"
              sx={{
                fontFamily: "Gill Sans MT, Poppins, Roboto, Helvetica, Arial",
                letterSpacing: "5px",
                color: "white",
              }}
            >
              VLADIMIR
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} className="login__form">
          {loginErr && <p className="login__error-message">{loginErr}</p>}
          <Box className="login__form-logo">
            <Box>
              <img
                src={VladimirLogo1}
                alt="Vladimir Logo"
                style={{
                  width: "50px",
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Anton, Impact, Roboto, Poppins, Helvetica",
              letterSpacing: "5px",
              color: "secondary",
            }}
          >
            LOGIN
          </Typography>

          <Box className="login__text-field">
            <CustomTextField
              autoComplete="off"
              control={control}
              name="username"
              label="Username"
              type="text"
              size="small"
              color="secondary"
              error={!!errors?.username?.message}
              helperText={errors?.username?.message}
            />

            <CustomTextField
              autoComplete="off"
              control={control}
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              size="small"
              color="secondary"
              error={!!errors?.password?.message}
              helperText={errors?.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {watch("password") === "" ? null : (
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

            <LoadingButton
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              Submit
            </LoadingButton>
          </Box>

          <Box className="login__copyright">
            <img src={MisLogo} alt="" width="50px" />

            <p>
              Powered By MIS All rights reserved <br />
              Copyrights © 2021
            </p>
          </Box>
        </Box>
      </Box>

      <Dialog open={changePassword} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <ChangePassword resetLogin={reset} />
      </Dialog>
    </Box>
  );
};

export default LoginPage;
