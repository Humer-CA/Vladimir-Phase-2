import React, { useEffect, useState } from "react";
import "../../../index.scss";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import ErrorFetching from "../../ErrorFetching";
import { LoadingData } from "../../../Components/LottieFiles/LottieComponents";
import AddReceivingInfo from "../../../Pages/Asset Requisition/Received Asset/AddReceivedInfo";

import {
  Box,
  Button,
  Card,
  Dialog,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Add,
  AddBox,
  ArrowBackIosRounded,
  Info,
  MoreVert,
  RemoveCircle,
  Report,
  Visibility,
  Warning,
} from "@mui/icons-material";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { closeDialog, closeDialog1, openDialog, openDialog1 } from "../../../Redux/StateManagement/booleanStateSlice";
import {
  useGetItemPerTransactionApiQuery,
  useCancelAssetReceivingApiMutation,
  useRemoveInclusionApiMutation,
} from "../../../Redux/Query/Request/AssetReceiving";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";
import AddInclusion from "./AddInclusion";
import ViewReceivedReceipt from "./ViewReceivedReceipt";

const ViewRequestReceiving = () => {
  const { state: transactionData } = useLocation();
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [mainData, setMainData] = useState(null);
  const [cardData, setCardData] = useState(null);
  const isSmallScreen = useMediaQuery("(max-width: 1375px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dialog = useSelector((state) => state.booleanState.dialog);
  const dialog1 = useSelector((state) => state.booleanState.dialogMultiple.dialog1);

  const {
    data: receivingData,
    isLoading: isReceivingLoading,
    isSuccess: isReceivingSuccess,
    isError: isReceivingError,
    error: errorData,
    refetch,
  } = useGetItemPerTransactionApiQuery(
    {
      page: page,
      per_page: perPage,
      transaction_number: transactionData?.transaction_number,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [removeInclusionData] = useRemoveInclusionApiMutation();
  const [cancelPo] = useCancelAssetReceivingApiMutation();

  // console.log("receivingData:", receivingData);
  // console.log("transactionData:", transactionData);

  // useEffect(() => {
  //   if (receivingData?.total_remaining === 0) {
  //     navigate(-1);
  //   }
  // }, [receivingData]);

  // Table Sorting --------------------------------
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const comparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const onSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const handleOpenDialog = (data) => {
    // console.log("data", data);
    setMainData(data);
    dispatch(openDialog());
    handleClose();
  };

  const handleOpenReceipt = (data) => {
    dispatch(openDialog1());
    setCardData(data);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const MenuItems = (data) => (
    <Menu
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem onClick={() => handleOpenDialog(data)} dense>
        <ListItemIcon>
          <AddBox />
        </ListItemIcon>
        <ListItemText disableTypography align="left">
          {transactionData?.data?.inclusion ? "Edit Info" : "Add Info"}
        </ListItemText>
      </MenuItem>
      <MenuItem onClick={() => removeInclusion(data)} dense disabled={transactionData?.data?.inclusion === null}>
        <ListItemIcon>
          <RemoveCircle />
        </ListItemIcon>
        <ListItemText>Remove Info</ListItemText>
      </MenuItem>
    </Menu>
  );

  const removeInclusion = (data) => {
    handleClose();
    dispatch(
      openConfirm({
        icon: Warning,
        iconColor: "warning",
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
              REMOVE
            </Typography>{" "}
            this Data?
          </Box>
        ),
        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const res = await removeInclusionData({
              reference_number: data?.data?.reference_number,
            }).unwrap();
            // console.log(res);
            dispatch(closeDialog());
            dispatch(
              openToast({
                message: "Transfer Request Successfully Added",
                duration: 5000,
              })
            );
          } catch (err) {
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err?.data?.errors?.detail || err.data.message,
                  duration: 5000,
                  variant: "error",
                })
              );
            } else if (err?.status !== 422) {
              console.error(err);
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

  return (
    <>
      {isReceivingError && <ErrorFetching refetch={refetch} error={errorData} />}
      {!isReceivingError && (
        <Box className="mcontainer">
          <Button
            variant="text"
            color="secondary"
            size="small"
            startIcon={<ArrowBackIosRounded color="secondary" />}
            onClick={() => {
              navigate(-1);
              // setApprovingValue("2");
            }}
            disableRipple
            sx={{ width: "90px", marginLeft: "-15px", "&:hover": { backgroundColor: "transparent" } }}
          >
            Back
          </Button>

          <Box className="request__wrapper" p={2} pb={0}>
            {/* TABLE */}
            <Box className="request__table">
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem", pb: 1 }}>
                {`${transactionData ? "TRANSACTION NO." : "CURRENT ASSET"}`}{" "}
                {transactionData && transactionData?.transaction_number}
              </Typography>

              <TableContainer className="request__th-body  request__wrapper" sx={{ height: "calc(100vh - 300px)" }}>
                <Table className="request__table " stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold!important",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `reference_number`}
                          direction={orderBy === `reference_number` ? order : `asc`}
                          onClick={() => onSort(`reference_number`)}
                        >
                          Ref Number
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `type_of_request`}
                          direction={orderBy === `type_of_request` ? order : `asc`}
                          onClick={() => onSort(`type_of_request`)}
                        >
                          Type of Request
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `ymir_pr_number`}
                          direction={orderBy === `ymir_pr_number` ? order : `asc`}
                          onClick={() => onSort(`ymir_pr_number`)}
                        >
                          PR Number
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `rr_number`}
                          direction={orderBy === `rr_number` ? order : `asc`}
                          onClick={() => onSort(`rr_number`)}
                        >
                          View RR
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">Asset Information</TableCell>
                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `received`}
                          direction={orderBy === `received` ? order : `asc`}
                          onClick={() => onSort(`received`)}
                        >
                          Item Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell" align="center">
                        Action
                      </TableCell>
                      {/* {!transactionData?.received && <TableCell className="tbl-cell text-center">Action</TableCell>} */}
                    </TableRow>
                  </TableHead>

                  <TableBody position="relative">
                    {isReceivingLoading ? (
                      <LoadingData />
                    ) : receivingData?.data.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {isReceivingSuccess &&
                          [...receivingData?.data]?.sort(comparator(order, orderBy))?.map((data, index) => (
                            // <Tooltip
                            //   key={index}
                            //   title={data?.remaining === 0 ? null : "Click to Receive Items"}
                            //   placement="left"
                            //   arrow
                            // >
                            <TableRow
                              key={data.id}
                              hover={data?.is_removed === 1 ? false : true}
                              sx={{
                                // cursor: transactionData?.received ? null : "pointer",
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                                bgcolor:
                                  (data?.received === data?.ordered ? "#ff00002f" : data?.is_removed) === 1
                                    ? "#ff00002f"
                                    : null,
                                "*": { color: data?.is_removed === 1 ? "black!important" : null },
                              }}
                            >
                              <TableCell className="tbl-cell">{data.reference_number}</TableCell>
                              <TableCell className="tbl-cell text-weight">
                                <Typography fontWeight={600}>{data.type_of_request?.type_of_request_name}</Typography>
                                <Typography fontSize="12px" fontWeight="bold" color="quaternary.light">
                                  {data.attachment_type}
                                </Typography>
                              </TableCell>
                              <TableCell className="tbl-cell">
                                {/* <Typography fontSize={12}>PR - {data.pr_number}</Typography> */}
                                <Typography fontSize={12}>PR - {data.ymir_pr_number}</Typography>
                                <Typography fontSize={12}>PO - {data.po_number}</Typography>
                                <Typography fontSize={12}>RR - {data.rr_number}</Typography>
                              </TableCell>

                              <TableCell className="tbl-cell">
                                <IconButton onClick={() => handleOpenReceipt(data?.rr_received)}>
                                  <Visibility />
                                </IconButton>
                              </TableCell>

                              <TableCell className="tbl-cell">
                                <Typography fontSize="14px" fontWeight="bold">
                                  {data.asset_description}
                                </Typography>
                                <Typography fontSize="12px">{data.asset_specification}</Typography>
                              </TableCell>

                              <TableCell className="tbl-cell">
                                <Typography fontSize={10} color="gray">
                                  {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  {`(${data.business_unit?.business_unit_code}) - ${data.business_unit?.business_unit_name}`}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  {`(${data.unit?.unit_code}) - ${data.unit?.unit_name}`}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  {`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell">
                                <Typography fontSize={12}>Ordered - {data.ordered}</Typography>
                                <Typography fontSize={12}>Received - {data.delivered}</Typography>
                                <Typography fontSize={12}>Remaining - {data.remaining}</Typography>
                                <Typography fontSize={12}>Cancelled - {data.cancelled}</Typography>
                              </TableCell>

                              {/* {!transactionData?.received && (
                                <TableCell className="tbl-cell text-center">
                                  {data?.is_removed !== 1 && (
                                    <IconButton
                                      disabled={data?.remaining === 0}
                                      onClick={() => onCancelHandler(data)}
                                      sx={{ color: "error.main", ":hover": { color: "red" } }}
                                    >
                                      <Tooltip
                                        title={data?.delivered !== 0 ? "Cancel Remaining" : "Cancel Request"}
                                        placement="top"
                                        arrow
                                      >
                                        <RemoveCircle />
                                      </Tooltip>
                                    </IconButton>
                                  )}
                                </TableCell>
                              )} */}

                              {/* <TableCell  className="tbl-cell" align="center"> */}
                              {/* {data?.type_of_request?.type_of_request_name === "Small Tools" && ( */}
                              <TableCell className="tbl-cell" align="center">
                                <Stack alignItems="center" justifyContent="center">
                                  <Tooltip title="Add Information" placement="top" arrow>
                                    <IconButton onClick={handleOpen}>
                                      <MoreVert />
                                    </IconButton>
                                  </Tooltip>
                                  <MenuItems data={data} />
                                </Stack>
                              </TableCell>
                              {/* )} */}
                            </TableRow>
                            // </Tooltip>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Buttons */}
              <Box className="mcontainer__pagination-export" width="100%" marginInline="auto">
                <Typography fontFamily="Anton, Impact, Roboto" fontSize="18px" color="secondary.main">
                  Transactions : {receivingData?.data?.length} request
                </Typography>

                <CustomTablePagination
                  total={receivingData?.total}
                  success={isReceivingSuccess}
                  current_page={receivingData?.current_page}
                  per_page={receivingData?.per_page}
                  onPageChange={pageHandler}
                  onRowsPerPageChange={perPageHandler}
                  removeShadow
                />
              </Box>
            </Box>
          </Box>

          <Dialog
            open={dialog}
            TransitionComponent={Grow}
            onClose={() => dispatch(closeDialog())}
            sx={{
              ".MuiPaper-root": {
                padding: "20px",
                margin: 0,
                gap: "5px",
                // minWidth: "700px",
                maxWidth: "900px",
                borderRadius: "10px",
                width: "90%",
              },
            }}
          >
            {/* <AddReceivingInfo data={mainData} /> */}
            <AddInclusion data={mainData?.data} receivingData={receivingData?.data} />
          </Dialog>

          <Dialog
            open={dialog1}
            onClose={() => dispatch(closeDialog1())}
            sx={{
              ".MuiPaper-root": {
                padding: "20px",
                margin: 0,
                maxWidth: "800px",
                borderRadius: "10px",
              },
            }}
          >
            <ViewReceivedReceipt data={cardData} />
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default ViewRequestReceiving;
