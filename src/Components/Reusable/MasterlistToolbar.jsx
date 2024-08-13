import React, { useEffect, useState } from "react";
import "../../Style/Masterlist/masterlistToolbar.scss";
import ScanFixedAsset from "../../Pages/FixedAssets/ScanFixedAsset";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
// import { openDrawer } from "../../Redux/StateManagement/drawerSlice";
// import { openDialog } from "../../Redux/StateManagement/dialogSlice";
// import { openImport } from "../../Redux/StateManagement/importFileSlice";
// import { openDatePicker } from "../../Redux/StateManagement/datePickerSlice";
// import { openScan } from "../../Redux/StateManagement/scanFileSlice";

import {
  openDrawer,
  openDialog,
  openAdd,
  openDatePicker,
  openImport,
  openDrawer1,
  openExport,
  openScan,
  openPrint,
} from "../../Redux/StateManagement/booleanStateSlice";

import { LoadingButton } from "@mui/lab";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import {
  AddCard,
  Archive,
  CheckBox,
  FileCopy,
  Filter,
  FilterAlt,
  FilterList,
  LibraryAdd,
  PostAdd,
  Print,
  PrintOutlined,
  PrintRounded,
  QrCodeScannerRounded,
  Sync,
  SystemUpdateAltRounded,
  TransferWithinAStation,
} from "@mui/icons-material";
import { useGetNotificationApiQuery } from "../../Redux/Query/Notification";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";

const MasterlistToolbar = (props) => {
  const {
    path = "",
    onStatusChange = () => {},
    onFaStatusChange = () => {},
    onSearchChange = () => {},
    onSetPage = () => {},
    onSyncHandler = () => {},
    scanAsset,
    onAdd,
    onPrint,
    onImport,
    onSync,
    onTransfer,
    hideArchive,
    faStatus,
    handleAddRequest,
    requestFilter,
    setRequestFilter,
    filter,
    faFilter,
    setFaFilter,
    showPr,
    hideSearch,
    isRequest,
    setIsRequest,
  } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const openAddFa = Boolean(anchorEl);
  const [anchorElImportFa, setAnchorElImportFa] = useState(null);
  const openImportFa = Boolean(anchorElImportFa);
  const [anchorElPrintFa, setAnchorElPrintFa] = useState(null);
  const openPrintFa = Boolean(anchorElPrintFa);
  const [anchorElRequestFilter, setAnchorElRequestFilter] = useState(null);
  const openRequestFilter = Boolean(anchorElRequestFilter);
  const [anchorElFaFilter, setAnchorElFaFilter] = useState(null);
  const openFaFilter = Boolean(anchorElFaFilter);

  const handleClose = () => {
    setAnchorEl(null) ||
      setAnchorElImportFa(null) ||
      setAnchorElPrintFa(null) ||
      setAnchorElRequestFilter(null) ||
      setAnchorElFaFilter(null);
  };

  // const scanFile = useSelector((state) => state.scanFile);
  const { data: notifData, refetch } = useGetNotificationApiQuery(null, { refetchOnMountOrArgChange: true });
  const permissions = useSelector((state) => state.userLogin?.user.role.access_permission);
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const searchHandler = (e) => {
    if (e.key === "Enter") {
      onSearchChange(e.target.value);
      onSetPage(1);
    }
  };

  const statusHandler = (e) => {
    // console.log(e.target.checked);

    if (e.target.checked) {
      onSetPage(1);
      return onStatusChange("deactivated");
    }
    onSetPage(1);
    return onStatusChange("active");
  };

  // const faStatusHandler = (e) => {
  //   if (e.target.checked) {
  //     onSetPage(1);
  //     return onFaStatusChange("Disposed");
  //   }
  //   onSetPage(1);
  //   return onFaStatusChange(
  //     "Good, For Disposal, For Repair, Spare, Write Off, Sold"
  //   );
  // };

  const syncHandler = () => {
    onSyncHandler();
  };

  const handleOpenDrawer = (e) => {
    if (!faStatus) {
      dispatch(openDrawer());
    }
    setAnchorEl(e.currentTarget);
  };

  const handleOpenDialog = () => {
    dispatch(openDialog());
  };

  const handleOpenAddFA = (e) => {
    dispatch(openDrawer());
    setAnchorEl(!e.currentTarget);
  };

  const handleOpenRequestFilter = (e) => {
    setAnchorElRequestFilter(e.currentTarget);
  };

  const handleOpenFaFilter = (e) => {
    setAnchorElFaFilter(e.currentTarget);
  };

  const handleOpenAddCost = (e) => {
    dispatch(openAdd());
    setAnchorEl(!e.currentTarget);
  };

  const handleOpenImport = (e) => {
    if (!faStatus) {
      dispatch(openImport());
    }
    setAnchorElImportFa(e.currentTarget);
  };

  const handleOpenImportFA = (e) => {
    dispatch(openImport());
    setAnchorElImportFa(!e.currentTarget);
  };

  const handleOpenImportCost = (e) => {
    dispatch(openDrawer1());
    setAnchorElImportFa(!e.currentTarget);
  };

  const handleOpenPrint = (e) => {
    setAnchorElPrintFa(e.currentTarget);
  };

  const handleOpenPrintFa = (e) => {
    setIsRequest(0);
    dispatch(openPrint());
    setAnchorElPrintFa(!e.currentTarget);
  };

  const handleOpenPrintRequest = (e) => {
    setIsRequest(1);
    dispatch(openPrint());
    setAnchorElPrintFa(!e.currentTarget);
  };

  const handleOpenAssignedMemo = (e) => {
    dispatch(openDialog());
    setAnchorElPrintFa(!e.currentTarget);
  };

  const handleScan = () => {
    dispatch(openScan());
  };

  const handleFilterChange = (value) => {
    // console.log(value)
    if (requestFilter.includes(value)) {
      setRequestFilter(requestFilter.filter((requestFilter) => requestFilter !== value));
    } else {
      setRequestFilter([...requestFilter, value]);
    }
  };

  const handleFaFilterChange = (value) => {
    if (value === "With Voucher") {
      if (faFilter.includes("With Voucher")) {
        setFaFilter([]);
      } else {
        setFaFilter(["With Voucher"]);
      }
    } else {
      if (faFilter.includes("With Voucher")) {
        return;
      } else {
        if (faFilter.includes(value)) {
          setFaFilter(faFilter.filter((filter) => filter !== value));
        } else {
          setFaFilter([...faFilter, value]);
        }
      }
    }
  };

  const handleVoucherFilterChange = (value) => {};

  return (
    <Box className="masterlist-toolbar">
      <Box className="masterlist-toolbar__container">
        {!hideArchive && (
          <Box>
            <FormControlLabel
              control={<Checkbox size="small" onClick={statusHandler} />}
              label={isSmallScreen ? <Archive sx={{ mt: "5px" }} /> : "ARCHIVED"}
            />
          </Box>
        )}

        {scanAsset && (
          // <Stack
          //   flexDirection="row"
          //   alignItems="center"
          //   gap={1}
          //   sx={{ cursor: "pointer" }}
          //   onClick={handleScan}
          // >
          //   <IconButton
          //     variant="contained"
          //     size="small"
          //     sx={{ height: "30px" }}
          //     onClick={handleScan}
          //   >
          //     <QrCodeScannerRounded />
          //   </IconButton>
          //   {isSmallScreen ? null : (
          //     <Typography fontFamily="Anton, Poppins, Roboto, Arial">
          //       Scan
          //     </Typography>
          //   )}
          // </Stack>

          <Button
            onClick={handleScan}
            startIcon={isSmallScreen ? null : <QrCodeScannerRounded color="primary" />}
            color="secondary"
            variant="contained"
            size="small"
            // sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
          >
            {isSmallScreen ? <QrCodeScannerRounded color="primary" sx={{ fontSize: "20px" }} /> : "Scan"}
          </Button>
        )}

        {/* Printing */}
        <Box className="masterlist-toolbar__addBtn">
          {onPrint && permissions?.split(", ").includes("print-fa") && (
            <Badge color="error" badgeContent={notifData?.toTagCount} variant="dot">
              {" "}
              <Button
                component={Link}
                variant="outlined"
                to={path}
                onClick={handleOpenPrint}
                startIcon={isSmallScreen ? null : <Print color="secondary" />}
                size="small"
                color="secondary"
                sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
              >
                {isSmallScreen ? <Print color="secondary" sx={{ fontSize: "20px" }} /> : "Print"}
              </Button>
            </Badge>
          )}

          {onPrint && (
            <Menu
              anchorEl={anchorElPrintFa}
              open={openPrintFa}
              onClose={handleClose}
              TransitionComponent={Fade}
              disablePortal
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenPrintFa} dense>
                <ListItemIcon>
                  <PrintOutlined />
                </ListItemIcon>
                <ListItemText>Print Fixed Asset</ListItemText>
              </MenuItem>

              <Divider sx={{ mx: 2 }} />

              <MenuItem onClick={handleOpenPrintRequest} dense>
                <ListItemIcon>
                  <Badge color="error" badgeContent={notifData?.toTagCount}>
                    <PrintRounded />
                  </Badge>
                </ListItemIcon>
                <ListItemText>Print Request</ListItemText>
              </MenuItem>

              <Divider sx={{ mx: 2 }} />

              <MenuItem onClick={handleOpenAssignedMemo} dense>
                <ListItemIcon>
                  <FileCopy />
                </ListItemIcon>
                <ListItemText>Assigned Memo</ListItemText>
              </MenuItem>
            </Menu>
          )}

          {/* Import */}
          {onImport && (
            <LoadingButton
              component={Link}
              to={path}
              onClick={handleOpenImport}
              variant="contained"
              startIcon={isSmallScreen ? null : <SystemUpdateAltRounded color="primary" sx={{ fontSize: "20px" }} />}
              size="small"
              color="secondary"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? <SystemUpdateAltRounded color="primary" sx={{ fontSize: "20px" }} /> : "Import"}
            </LoadingButton>
          )}

          {faStatus && (
            <Menu
              anchorEl={anchorElImportFa}
              open={openImportFa}
              onClose={handleClose}
              TransitionComponent={Fade}
              disablePortal
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenImportFA} dense>
                <ListItemIcon>
                  <PostAdd />
                </ListItemIcon>
                <ListItemText>Import Fixed Asset</ListItemText>
              </MenuItem>

              <Divider sx={{ mx: 2 }} />

              <MenuItem onClick={handleOpenImportCost} dense>
                <ListItemIcon>
                  <AddCard />
                </ListItemIcon>
                <ListItemText>Import Additional Cost</ListItemText>
              </MenuItem>
            </Menu>
          )}

          {/* Add */}
          {onAdd && (
            <Button
              component={Link}
              to={path}
              onClick={handleOpenDrawer || handleOpenDialog}
              variant="contained"
              startIcon={isSmallScreen ? null : <LibraryAdd />}
              size="small"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? <LibraryAdd color="black" sx={{ fontSize: "20px" }} /> : "Add"}
            </Button>
          )}

          {faStatus && (
            <Menu
              anchorEl={anchorEl}
              open={openAddFa}
              onClose={handleClose}
              TransitionComponent={Fade}
              disablePortal
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenAddFA} dense>
                <ListItemIcon>
                  <PostAdd />
                </ListItemIcon>
                <ListItemText>Add Fixed Asset</ListItemText>
              </MenuItem>

              <Divider sx={{ mx: 2 }} />

              <MenuItem onClick={handleOpenAddCost} dense disabled>
                <ListItemIcon>
                  <AddCard />
                </ListItemIcon>
                <ListItemText>Additional Cost (TBA)</ListItemText>
              </MenuItem>
            </Menu>
          )}

          {/* Synching */}
          {onSync && (
            <LoadingButton
              component={Link}
              to={path}
              onClick={syncHandler}
              variant="contained"
              startIcon={isSmallScreen ? null : <Sync sx={{ color: "primary.main" }} />}
              size="small"
              color="secondary"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? <Sync sx={{ color: "primary.main" }} /> : "Sync Data"}
            </LoadingButton>
          )}

          {showPr && (
            <Button
              component={Link}
              to={path}
              onClick={handleOpenDrawer || handleOpenDialog}
              variant="contained"
              startIcon={isSmallScreen ? null : <LibraryAdd />}
              size="small"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? <LibraryAdd color="black" sx={{ fontSize: "20px" }} /> : "Add"}
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            // flexWrap: "wrap",
          }}
        >
          {/* {faStatus && (
            <Stack
              flexDirection="row"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer" }}
              onClick={handleScan}
            >
              <Tooltip
                title="Scan Asset"
                TransitionComponent={Zoom}
                placement="top"
                arrow
              >
                <IconButton
                  variant="contained"
                  size="small"
                  sx={{ height: "30px" }}
                  onClick={handleScan}
                >
                  <QrCodeScannerRounded />
                </IconButton>
                 {isSmallScreen ? null : <Typography>Scan Asset</Typography>} 
              </Tooltip>
            </Stack>
          )}*/}

          {faStatus && (
            <>
              <Tooltip title="Filter" TransitionComponent={Zoom} placement="top" arrow>
                <IconButton onClick={handleOpenFaFilter}>
                  <FilterList />
                </IconButton>
              </Tooltip>

              {Boolean(faFilter) && (
                <Menu
                  anchorEl={anchorElFaFilter}
                  open={openFaFilter}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  disablePortal
                  transformOrigin={{ horizontal: "left", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "top" }}
                >
                  <FormGroup>
                    <Stack flexDirection="row" alignItems="center" p="10px" gap="10px">
                      <FilterAlt color="primary" />
                      <Typography fontFamily="Anton, Impact" fontSize="20px" color="secondary">
                        FILTER
                      </Typography>
                    </Stack>
                    <Divider />
                    <MenuItem dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={() => handleFaFilterChange("From Request")}
                            checked={faFilter.includes("From Request")}
                            disabled={faFilter.includes("With Voucher")}
                          />
                        }
                        label="From Request"
                      />
                    </MenuItem>

                    <MenuItem dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={() => handleFaFilterChange("Fixed Asset")}
                            checked={faFilter.includes("Fixed Asset")}
                            disabled={faFilter.includes("With Voucher")}
                          />
                        }
                        label="Fixed Asset"
                      />
                    </MenuItem>

                    <MenuItem dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={() => handleFaFilterChange("To Depreciate")}
                            checked={faFilter.includes("To Depreciate")}
                            disabled={faFilter.includes("With Voucher")}
                          />
                        }
                        label="To Depreciate"
                      />
                    </MenuItem>

                    <MenuItem dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={() => handleFaFilterChange("Additional Cost")}
                            checked={faFilter.includes("Additional Cost")}
                            disabled={faFilter.includes("With Voucher")}
                          />
                        }
                        label="Additional Cost"
                      />
                    </MenuItem>

                    <MenuItem dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={() => handleFaFilterChange("Small Tools")}
                            checked={faFilter.includes("Small Tools")}
                            disabled={faFilter.includes("With Voucher")}
                          />
                        }
                        label="Small Tools"
                      />
                    </MenuItem>

                    <Divider />

                    <MenuItem dense>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            onChange={() => handleFaFilterChange("With Voucher")}
                            checked={faFilter.includes("With Voucher")}
                          />
                        }
                        label="With Voucher"
                      />
                    </MenuItem>
                  </FormGroup>
                </Menu>
              )}
            </>
          )}

          {requestFilter && (
            <Tooltip title="Filter" TransitionComponent={Zoom} placement="top" arrow>
              <IconButton onClick={handleOpenRequestFilter}>
                <FilterList />
              </IconButton>
            </Tooltip>
          )}
          {Boolean(requestFilter) && (
            <Menu
              anchorEl={anchorElRequestFilter}
              open={openRequestFilter}
              onClose={handleClose}
              TransitionComponent={Fade}
              disablePortal
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
              <FormGroup>
                <Stack flexDirection="row" alignItems="center" p="10px" gap="10px">
                  <FilterAlt color="primary" />
                  <Typography fontFamily="Anton, Impact" fontSize="20px" color="secondary">
                    FILTER
                  </Typography>
                </Stack>
                <Divider />
                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("For Approval")}
                        checked={requestFilter.includes("For Approval")}
                      />
                    }
                    label="For Approval"
                  />
                </MenuItem>

                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("For FA Approval")}
                        checked={requestFilter.includes("For FA Approval")}
                      />
                    }
                    label="For FA Approval"
                  />
                </MenuItem>

                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("Sent To Ymir")}
                        checked={requestFilter.includes("Sent To Ymir")}
                      />
                    }
                    label="Sent To Ymir"
                  />
                </MenuItem>

                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("For Tagging")}
                        checked={requestFilter.includes("For Tagging")}
                      />
                    }
                    label="For Tagging"
                  />
                </MenuItem>

                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("For Pickup")}
                        checked={requestFilter.includes("For Pickup")}
                      />
                    }
                    label="For Pickup"
                  />
                </MenuItem>

                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("Released")}
                        checked={requestFilter.includes("Released")}
                      />
                    }
                    label="Released"
                  />
                </MenuItem>

                <MenuItem dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={() => handleFilterChange("Returned")}
                        checked={requestFilter.includes("Returned")}
                      />
                    }
                    label="Returned"
                  />
                </MenuItem>
              </FormGroup>
            </Menu>
          )}

          {!hideSearch && (
            <TextField
              autoComplete="off"
              variant="outlined"
              name="search"
              label="🔍︎ Search"
              // label="🔍 Search"
              type="text"
              size="small"
              color="secondary"
              sx={{
                ".MuiInputBase-root": {
                  borderRadius: "15px",
                  border: ".5px",
                  background: "#f4f4f4",
                  width: "100%",
                  minWidth: "100px",
                },
              }}
              onKeyDown={searchHandler}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MasterlistToolbar;
