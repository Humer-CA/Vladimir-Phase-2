import React, { useEffect, useRef, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
// import AddMajorCategory from "../AddEdit/AddMajorCategory";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../Pages/ErrorFetching";
import NoRecordsFound from "../../Layout/NoRecordsFound";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { closeConfirm, openConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

// MUI
import {
  Box,
  Chip,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Help, Report, ReportProblem, Visibility } from "@mui/icons-material";
import {
  useGetApprovalApiQuery,
  useLazyGetNextRequestQuery,
  usePatchApprovalStatusApiMutation,
} from "../../Redux/Query/Approving/Approval";
import { openDrawer } from "../../Redux/StateManagement/booleanStateSlice";
import { useNavigate } from "react-router-dom";

import { notificationApi } from "../../Redux/Query/Notification";

const PendingRequest = (props) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("For Approval");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const drawer = useSelector((state) => state.booleanState.drawer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Table Sorting --------------------------------

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  // const [remarks, setRemarks] = useState("");

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

  const onSetPage = () => {
    setPage(1);
  };

  // CRUD -------------------------------------------

  const {
    data: approvalData,
    isLoading: approvalLoading,
    isSuccess: approvalSuccess,
    isError: approvalError,
    error: errorData,
    refetch,
  } = useGetApprovalApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  // console.log(approvalData)

  const [patchApprovalStatus, { isLoading }] = usePatchApprovalStatusApiMutation();

  // CONFIRMATION
  const onApprovalApproveHandler = (id) => {
    // return console.log(id);
    dispatch(
      openConfirm({
        icon: Help,
        iconColor: "info",
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Raleway",
              }}
            >
              APPROVE
            </Typography>{" "}
            this request?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await patchApprovalStatus({
              action: "Approve",
              asset_approval_id: id,
            }).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            dispatch(closeConfirm());
            // notifRefetch();
            // dispatch(notificationApi.util.resetApiState());
            dispatch(notificationApi.util.invalidateTags(["Notif"]));
          } catch (err) {
            if (err?.status === 422) {
              dispatch(
                openToast({
                  // message: err.data.message,
                  message: err.data.errors?.detail,
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

  const onApprovalReturnHandler = (id) => {
    dispatch(
      openConfirm({
        icon: Report,
        iconColor: "warning",
        message: (
          <Stack gap={2}>
            <Box>
              <Typography> Are you sure you want to</Typography>
              <Typography
                sx={{
                  display: "inline-block",
                  color: "secondary.main",
                  fontWeight: "bold",
                  fontFamily: "Raleway",
                }}
              >
                RETURN
              </Typography>{" "}
              this request?
            </Box>
          </Stack>
        ),
        remarks: true,

        onConfirm: async (data) => {
          try {
            dispatch(onLoading());
            const result = await patchApprovalStatus({
              action: "Return",
              asset_approval_id: id,
              remarks: data,
            }).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            dispatch(closeConfirm());
          } catch (err) {
            if (err?.status === 422) {
              dispatch(
                openToast({
                  // message: err.data.message,
                  message: err?.data?.errors?.detail,
                  duration: 5000,
                  variant: "error",
                })
              );
            } else if (err?.status !== 422) {
              console.log(err);
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

  const handleViewRequisition = (data) => {
    navigate(`/approving/${data.transaction_number}`, {
      state: { ...data },
    });
  };

  return (
    <Stack sx={{ height: "calc(100vh - 255px)" }}>
      {approvalLoading && <MasterlistSkeleton category={true} onAdd={true} />}
      {approvalError && <ErrorFetching refetch={refetch} category={approvalData} error={errorData} />}
      {approvalData && !approvalError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            // onAdd={() => {}}
            hideArchive
          />

          <Box>
            <TableContainer className="mcontainer__th-body-category">
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
                    <TableCell className="tbl-cell-category text-center">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        ID No.
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">Transaction No.</TableCell>

                    <TableCell className="tbl-cell-category">Acquisition Details</TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `requestor`}
                        direction={orderBy === `requestor` ? order : `asc`}
                        onClick={() => onSort(`requestor`)}
                      >
                        Requestor
                      </TableSortLabel>
                    </TableCell>
                    {/* 
                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `requestor`}
                        direction={orderBy === `requestor` ? order : `asc`}
                        onClick={() => onSort(`requestor`)}
                      >
                        Approver
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `quantity`}
                        direction={orderBy === `quantity` ? order : `asc`}
                        onClick={() => onSort(`quantity`)}
                      >
                        Quantity
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category" align="center">
                      View
                    </TableCell>

                    <TableCell className="tbl-cell-category" align="center">
                      Status
                    </TableCell>

                    <TableCell className="tbl-cell-category text-center">
                      <TableSortLabel
                        active={orderBy === `created_at`}
                        direction={orderBy === `created_at` ? order : `asc`}
                        onClick={() => onSort(`created_at`)}
                      >
                        Date Requested
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category  text-center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {approvalData?.data.length === 0 ? (
                    <NoRecordsFound approvalData={approvalData} category />
                  ) : (
                    <>
                      {approvalSuccess &&
                        [...approvalData.data].sort(comparator(order, orderBy))?.map((data) => (
                          <TableRow
                            key={data.id}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell-category tr-cen-pad45">{data.id}</TableCell>

                            <TableCell className="tbl-cell-category ">
                              {data.asset_request?.transaction_number}
                            </TableCell>

                            <TableCell className="tbl-cell-category ">
                              {data.asset_request?.acquisition_details}
                            </TableCell>

                            <TableCell className="tbl-cell-category">
                              <Typography fontSize={14} fontWeight={600} color={"secondary"} noWrap>
                                {data.requester?.employee_id}
                              </Typography>
                              <Typography fontSize={12} color={"gray"}>
                                {data.requester?.firstname}
                              </Typography>
                            </TableCell>

                            {/* <TableCell className="tbl-cell-category">
                                <Typography
                                  fontSize={14}
                                  fontWeight={600}
                                  color={"secondary"}
                                  noWrap
                                >
                                  {data.approver?.employee_id}
                                </Typography>
                                <Typography fontSize={12} color={"gray"}>
                                  {data.approver?.firstname}
                                </Typography>
                              </TableCell> */}

                            <TableCell className="tbl-cell-category ">{data.number_of_item}</TableCell>

                            <TableCell className="tbl-cell-category text-center">
                              <IconButton onClick={() => handleViewRequisition(data)}>
                                <Visibility color="secondary" />
                              </IconButton>
                            </TableCell>

                            <TableCell className="tbl-cell-category text-center capitalized">
                              {data.status === "For Approval" && (
                                <Chip
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    background: "#f5cc2a2f",
                                    color: "#c59e00",
                                    fontSize: "0.7rem",
                                    px: 1,
                                  }}
                                  label="PENDING"
                                />
                              )}
                            </TableCell>

                            <TableCell className="tbl-cell-category tr-cen-pad45">
                              {Moment(data.asset_request?.date_requested).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell-category text-center">
                              <ActionMenu
                                status={status}
                                data={data}
                                showApprover
                                onApprovalApproveHandler={onApprovalApproveHandler}
                                onApprovalReturnHandler={onApprovalReturnHandler}
                                hideArchive
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className="mcontainer__pagination">
            <TablePagination
              rowsPerPageOptions={[
                5, 10, 15, 50,
                // {
                //   label: "All",
                //   value: parseInt(majorCategoryData?.total),
                // },
              ]}
              component="div"
              count={approvalSuccess ? approvalData.total : 0}
              page={approvalSuccess ? approvalData.current_page - 1 : 0}
              rowsPerPage={approvalSuccess ? parseInt(approvalData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default PendingRequest;
