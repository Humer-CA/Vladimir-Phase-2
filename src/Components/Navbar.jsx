import React, { useState } from "react";
import "../Style/navbar.scss";
import PropTypes from "prop-types";
import { vladimirAPI } from "../Api/vladimirAPI";
import ChangePassword from "./ChangePassword";
import IpSetup from "./IpSetup";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { closeChangePassword, openChangePassword } from "../Redux/StateManagement/changePasswordSlice";
import { openIpSetupDialog } from "../Redux/StateManagement/ipSetupSlice";

import { removeUserDetails } from "../Redux/StateManagement/userLogin";
import { toggleSidebar } from "../Redux/StateManagement/sidebar";

import {
  ConnectingAirportsOutlined,
  KeyboardDoubleArrowLeftRounded,
  NotificationsRounded,
  Padding,
  Password,
  Router,
} from "@mui/icons-material";

import { MenuRounded, Help, Info, Settings, Logout, Menu as MenuIcon } from "@mui/icons-material";

import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  ListItemIcon,
  Fade,
  ListItemText,
  Divider,
  Tooltip,
  Zoom,
  Dialog,
} from "@mui/material";

function ListItemLink(props) {
  const { to, open, ...other } = props;
  const primary = breadcrumbNameMap[to];

  let icon = null;
  if (open != null) {
    icon = open ? <ExpandLess /> : <ExpandMore />;
  }

  return (
    <li>
      <ListItem button component={RouterLink} to={to} {...other}>
        <ListItemText primary={primary} />
        {icon}
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  open: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

const Navbar = () => {
  const collapse = useSelector((state) => state.sidebar.open);
  const userDetails = useSelector((state) => state.userLogin);
  const changePassword = useSelector((state) => state.changePassword);
  const ipSetup = useSelector((state) => state.ipSetup);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogout = useNavigate();
  const location = useLocation();

  const permissions = useSelector((state) => state.userLogin?.user.role.access_permission);

  const pathnames = location.pathname.split("/").filter((x) => x);

  // Menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);

  const open = Boolean(anchorEl);
  const openSettings = Boolean(anchorElSettings);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null) || setAnchorElSettings(null);
  };

  const handleOpenSettings = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleMenuCollapse = () => {
    dispatch(toggleSidebar());
  };

  const onIpSetupHandler = () => {
    // dispatch(openIpSetupDialog());
    navigate(
      `/printer-ip-configuration`
      // , { state: data }
    );
    handleClose();
  };

  const changePasswordHandler = () => {
    dispatch(openChangePassword());
    handleClose();
  };

  const onLogoutHandler = async () => {
    try {
      const res = await vladimirAPI.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(removeUserDetails());
      userLogout("/login");
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(removeUserDetails());
      userLogout("/login");
    }
  };

  return (
    <>
      <Box>
        <Box className="navbar">
          <Box>
            {collapse ? (
              <IconButton onClick={handleMenuCollapse}>
                <KeyboardDoubleArrowLeftRounded />
              </IconButton>
            ) : (
              <IconButton onClick={handleMenuCollapse}>
                <MenuRounded />
              </IconButton>
            )}
          </Box>

          {/* Notification --------------------------------------------- */}
          <Box className="navbar__user-container">
            <Tooltip title="Notification" TransitionComponent={Zoom} arrow>
              <IconButton color="secondary">
                <NotificationsRounded />
              </IconButton>
            </Tooltip>

            {/* Settings --------------------------------------------- */}
            <Tooltip title="Settings" TransitionComponent={Zoom} arrow>
              <Box className="navbar__iconBtn">
                <IconButton color="secondary" variant="contained" onClick={handleOpenSettings}>
                  <Settings />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Account --------------------------------------------- */}
            <Tooltip title="Account" TransitionComponent={Zoom} arrow>
              <IconButton onClick={handleOpen}>
                <Avatar
                  sx={{
                    cursor: "pointer",
                    height: "30px",
                    width: "30px",
                    bgcolor: "primary.main",
                  }}
                >
                  {userDetails?.user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Breadcrumbs classaria-label="breadcrumb" sx={{ ml: 3, userSelect: "none" }}>
          {permissions.split(", ").includes("dashboard") && (
            <LinkRouter underline="hover" color="inherit" to="/">
              Home
            </LinkRouter>
          )}
          {pathnames?.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            const breadcrumbName = value.replace(/-/g, " ");

            return last ? (
              <Typography color="secondary" sx={{ fontWeight: "bold" }} key={to} textTransform="capitalize">
                {/* {breadcrumbNameMap[to]} */}
                {breadcrumbName}
              </Typography>
            ) : (
              <LinkRouter underline="hover" color="inherit" textTransform="capitalize" to={to} key={to}>
                {/* {breadcrumbNameMap[to]} */}
                {breadcrumbName}
              </LinkRouter>
            );
          })}
          dispatch(closeIpSetupDialog());
        </Breadcrumbs>
      </Box>

      {/* Settings --------------------------------------------- */}
      <Menu
        anchorEl={anchorElSettings}
        open={openSettings}
        onClose={handleClose}
        TransitionComponent={Fade}
        disablePortal
      >
        <Box className="navbar__menu-settings">
          <Settings color="secondary" />

          <Typography
            sx={{
              padding: "5px",
              fontWeight: "bold",
              pl: 2,
            }}
            color="text.light"
          >
            Settings
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, my: 0.5 }} />

        <MenuItem onClick={onIpSetupHandler} dense>
          <ListItemIcon>
            <Router />
          </ListItemIcon>
          <ListItemText>IP Configuration</ListItemText>
        </MenuItem>
      </Menu>

      {/* Account --------------------------------------------- */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} TransitionComponent={Fade} disablePortal>
        <Box className="navbar__menu-settings">
          <Avatar
            sx={{
              cursor: "pointer",
              height: "20px",
              width: "20px",
              bgcolor: "primary.main",
            }}
          />
          <Typography
            sx={{
              padding: "5px",
              fontWeight: "bold",
              pl: 2,
            }}
            color="text.light"
          >
            {userDetails?.user.username.charAt(0).toUpperCase() + userDetails?.user.username.slice(1)}
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, my: 0.5 }} />

        <MenuItem onClick={handleClose} dense>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleClose} dense>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText>About</ListItemText>
        </MenuItem>

        <Divider sx={{ mx: 2 }} />

        <MenuItem onClick={changePasswordHandler} dense>
          <ListItemIcon>
            <Password />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>

        <Divider sx={{ mx: 2 }} />

        <MenuItem onClick={onLogoutHandler} dense>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={changePassword}
        onClose={() => dispatch(closeChangePassword())}
        PaperProps={{
          sx: { borderRadius: "10px", width: "100%", maxWidth: "320px" },
        }}
      >
        <ChangePassword />
      </Dialog>

      {/* <Dialog
        open={ipSetup}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "10px",
            maxWidth: "85%",
            height: "85%",
            p: "20px 30px",
            overflow: "overflow",
          },
        }}
      >
        <IpSetup />
      </Dialog> */}
    </>
  );
};

export default Navbar;
