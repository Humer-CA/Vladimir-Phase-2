import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  useGetRequisitionMonitoringApiQuery,
  useLazyGetRequisitionMonitoringApiQuery,
  useVoidRequisitionApiMutation,
} from "../../Redux/Query/Request/Requisition";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
  Fade,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import { AddBox, AddCircleSharp, IosShareRounded, LibraryAdd, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { closeDialog, openDialog } from "../../Redux/StateManagement/booleanStateSlice";
import RequestTimeline from "./RequestTimeline";
import useExcel from "../../Hooks/Xlsx";
import moment from "moment";

const RequestMonitoring = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [requestFilter, setRequestFilter] = useState([]);
  const [transactionIdData, setTransactionIdData] = useState();
  const viewData = true;

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  const dialog = useSelector((state) => state.booleanState.dialog);

  const { excelExport } = useExcel();

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

  // Table Properties --------------------------------
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const [requestDataTrigger] = useLazyGetRequisitionMonitoringApiQuery();
  // const [requestDataTrigger] = useLazyGetRequisitionAllApiQuery();

  const {
    data: requisitionData,
    isLoading: requisitionLoading,
    isSuccess: requisitionSuccess,
    isError: requisitionError,
    error: errorData,
    refetch,
  } = useGetRequisitionMonitoringApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
      filter: requestFilter,
    },
    { refetchOnMountOrArgChange: true }
  );

  const onVoidHandler = async (id) => {
    dispatch(
      openConfirm({
        icon: Report,
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
              VOID
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await voidRequisitionApi({
              id: id,
              transaction_number: id,
            }).unwrap();
            console.log(result);
            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            dispatch(closeConfirm());
          } catch (err) {
            console.log(err);
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data.message,
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

  const onSetPage = () => {
    setPage(1);
  };

  const handleViewTimeline = (data) => {
    dispatch(openDialog());
    setTransactionIdData(data);
  };

  const handleCloseTimeline = () => {
    dispatch(closeDialog);
  };

  // * Add Button Settings
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const openAdd = Boolean(anchorElAdd);

  const handleOpenAdd = (event) => {
    deleteAllRequest();
    setAnchorElAdd(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElAdd(null);
  };

  const handleEditRequisition = (data) => {
    data?.is_addcost === 1
      ? navigate(`/request-monitoring/${data.transaction_number}`, {
          state: { ...data, viewData },
        })
      : navigate(`/request-monitoring/${data.transaction_number}`, {
          state: { ...data, viewData },
        });
  };

  const isAdditionalCost = requisitionData?.data.map((item) => item.is_addcost);

  const transactionStatus = (data) => {
    let statusColor, hoverColor, textColor, variant;

    switch (data.status) {
      case "Approved":
        statusColor = "success.light";
        hoverColor = "success.main";
        textColor = "white";
        variant = "filled";
        break;

      case "Claimed":
        statusColor = "success.dark";
        hoverColor = "success.dark";
        variant = "filled";
        break;

      case "Sent to ymir for PO":
        statusColor = "ymir.light";
        hoverColor = "ymir.main";
        variant = "filled";
        break;

      case "Returned":
      case "Cancelled":
      case "Returned From Ymir":
        statusColor = "error.light";
        hoverColor = "error.main";
        variant = "filled";
        break;

      default:
        statusColor = "success.main";
        hoverColor = "none";
        textColor = "success.main";
        variant = "outlined";
    }

    return (
      <>
        <Tooltip title={data?.current_approver} placement="top" arrow>
          <Chip
            placement="top"
            onClick={() => handleViewTimeline(data)}
            size="small"
            variant={variant}
            sx={{
              ...(variant === "filled" && {
                backgroundColor: statusColor,
                color: "white",
              }),
              ...(variant === "outlined" && {
                borderColor: statusColor,
                color: textColor,
              }),
              fontSize: "11px",
              px: 1,
              ":hover": {
                ...(variant === "filled" && { backgroundColor: hoverColor }),
                ...(variant === "outlined" && { borderColor: hoverColor, color: textColor }),
              },
            }}
            label={data.status}
          />
        </Tooltip>
      </>
    );
  };

  const isCancelled = requisitionData?.data?.map((item) => item.status).includes("Cancelled");

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Request Monitoring
      </Typography>
      {requisitionLoading && <MasterlistSkeleton />}
      {requisitionError && <ErrorFetching refetch={refetch} error={errorData} />}
      {requisitionData && !requisitionError && (
        <>
          <Box className="request__wrapper">
            <MasterlistToolbar
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              setRequestFilter={setRequestFilter}
              requestFilter={requestFilter}
            />

            <Box>
              <TableContainer className="mcontainer__th-body">
                <Table className="mcontainer__table" stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold!important",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      {/* <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `id`}
                          direction={orderBy === `id` ? order : `asc`}
                          onClick={() => onSort(`id`)}
                        >
                          ID No.
                        </TableSortLabel>
                      </TableCell> */}

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `transaction_number`}
                          direction={orderBy === `transaction_number` ? order : `asc`}
                          onClick={() => onSort(`transaction_number`)}
                        >
                          Transaction No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `acquisition_details`}
                          direction={orderBy === `acquisition_details` ? order : `asc`}
                          onClick={() => onSort(`acquisition_details`)}
                        >
                          Acquisition Details
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `pr_number`}
                          direction={orderBy === `pr_number` ? order : `asc`}
                          onClick={() => onSort(`pr_number`)}
                        >
                          PR Number
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `item_count`}
                          direction={orderBy === `item_count` ? order : `asc`}
                          onClick={() => onSort(`item_count`)}
                        >
                          Quantity
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">View Information</TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `status`}
                          direction={orderBy === `status` ? order : `asc`}
                          onClick={() => onSort(`status`)}
                        >
                          View Status
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Created
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {requisitionData?.data?.length === 0 ? (
                      <NoRecordsFound heightData="medium" />
                    ) : (
                      <>
                        {requisitionSuccess &&
                          [...requisitionData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              {/* <TableCell className="tbl-cell tr-cen-pad45">
                                  {data.id}
                                </TableCell> */}
                              <TableCell className="tbl-cell text-weight">{data.transaction_number}</TableCell>
                              <TableCell className="tbl-cell">
                                <Typography fontSize={14} fontWeight={600} color="secondary.main">
                                  {data.acquisition_details}
                                </Typography>
                                <Typography fontSize={12} color="secondary.light">
                                  ({data.warehouse?.id}) - {data.warehouse?.warehouse_name}
                                </Typography>
                                {/* <Typography fontSize={12} color="primary.main" fontWeight={400}>
                                  {data.is_addcost === 1 && "Additional Cost"}
                                </Typography> */}
                              </TableCell>

                              <TableCell className="tbl-cell">
                                <Typography fontSize={14} fontWeight={600} color="secondary.main">
                                  {data.ymir_pr_number}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell tr-cen-pad45">{data.item_count}</TableCell>
                              <TableCell className="tbl-cell text-center">
                                <Tooltip placement="top" title="View Request Information" arrow>
                                  <IconButton onClick={() => handleEditRequisition(data)}>
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">{transactionStatus(data)}</TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">
                                {data.status === "Cancelled"
                                  ? Moment(data.deleted_at).format("MMM DD, YYYY")
                                  : Moment(data.created_at).format("MMM DD, YYYY")}
                              </TableCell>
                            </TableRow>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <CustomTablePagination
              total={requisitionData?.total}
              success={requisitionSuccess}
              current_page={requisitionData?.current_page}
              per_page={requisitionData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}

      <Dialog
        open={dialog}
        TransitionComponent={Grow}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{ sx: { borderRadius: "10px", maxWidth: "700px" } }}
      >
        <RequestTimeline data={transactionIdData} />
      </Dialog>
    </Box>
  );
};

export default RequestMonitoring;
