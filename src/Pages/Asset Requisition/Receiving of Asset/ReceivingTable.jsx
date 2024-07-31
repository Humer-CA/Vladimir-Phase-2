import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import ErrorFetching from "../../ErrorFetching";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import {
  useGetByTransactionApiQuery,
  useGetRequisitionApiQuery,
  usePatchRequisitionStatusApiMutation,
  useVoidRequisitionApiMutation,
} from "../../../Redux/Query/Request/Requisition";

// MUI
import {
  Box,
  Button,
  IconButton,
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
import { Help, SyncOutlined, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetAssetReceivingApiQuery,
  useGetAssetReceivedApiQuery,
  usePostReceivingSyncApiMutation,
} from "../../../Redux/Query/Request/AssetReceiving";
import { useLazyGetYmirReceivingAllApiQuery } from "../../../Redux/Query/Masterlist/YmirCoa/YmirApi";

const ReceivingTable = (props) => {
  const { received } = props;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const [
    syncTrigger,
    {
      data: ymirReceivingApi,
      isLoading: ymirReceivingApiLoading,
      isSuccess: ymirReceivingApiSuccess,
      isFetching: ymirReceivingApiFetching,
      isError: ymirReceivingApiError,
      error: syncError,
    },
  ] = useLazyGetYmirReceivingAllApiQuery();

  const [
    postSyncData,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostReceivingSyncApiMutation();

  useEffect(() => {
    if (ymirReceivingApiSuccess) {
      postSyncData(ymirReceivingApi);
    }
  }, [ymirReceivingApiSuccess, ymirReceivingApiFetching]);

  useEffect(() => {
    if (isPostError || ymirReceivingApiError) {
      let message = "Something went wrong. Please try again.";
      let variant = "error";

      if (postError?.status === 404 || postError?.status === 422) {
        message = postError?.data?.errors.detail || postError?.data?.message;
        if (postError?.status === 422) {
          console.log(postError);
          dispatch(closeConfirm());
        }
      }

      dispatch(openToast({ message, duration: 5000, variant }));
    }
  }, [isPostError]);

  useEffect(() => {
    if (ymirReceivingApiError) {
      let message = "Something went wrong. Please try again.";
      let variant = "error";

      if (syncError?.status === 404 || syncError?.status === 422) {
        message = syncError?.data?.message;
        if (syncError?.status === 404) {
          // console.log(syncError);
          dispatch(closeConfirm());
        }
      }

      dispatch(openToast({ message, duration: 5000, variant }));
    }
  }, [ymirReceivingApiError]);

  useEffect(() => {
    if (isPostSuccess && !isPostLoading) {
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
      dispatch(closeConfirm());
    }
  }, [isPostSuccess, isPostLoading]);

  //* Table Sorting -------------------------------------------------------
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

  //* Table Properties ---------------------------------------------------
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: receivingData,
    isLoading: receivingLoading,
    isSuccess: receivingSuccess,
    isError: receivingError,
    error: errorData,
    refetch,
  } = (received ? useGetAssetReceivedApiQuery : useGetAssetReceivingApiQuery)(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleViewData = (data) => {
    navigate(`/asset-requisition/requisition-receiving/${data.transaction_number}`, {
      state: { ...data, received },
    });
  };

  const handleSync = () => {
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
              }}
            >
              SYNC
            </Typography>{" "}
            the data?
          </Box>
        ),
        autoClose: true,

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            await syncTrigger().unwrap;
            refetch();
          } catch (err) {
            if (err?.status === 404) {
              dispatch(
                openToast({
                  message: postData?.message,
                  duration: 5000,
                })
              );
            }
            console.log(err.message);

            dispatch(closeConfirm());
          }
        },
      })
    );
  };

  return (
    <Stack sx={{ height: "calc(100vh - 250px)" }}>
      {receivingLoading && <MasterlistSkeleton onAdd={true} category />}
      {receivingError && <ErrorFetching refetch={refetch} error={errorData} />}
      {receivingData && !receivingError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar onStatusChange={setStatus} onSearchChange={setSearch} onSetPage={setPage} hideArchive />

            {/* <Box className="masterlist-toolbar__addBtn" sx={{ mt: "4px", mr: "10px" }}>
              <Button
                variant="contained"
                startIcon={isSmallScreen ? null : <SyncOutlined color="primary" />}
                size="small"
                color="secondary"
                sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
                onClick={() => handleSync()}
              >
                {isSmallScreen ? <SyncOutlined color="primary" /> : "SYNC"}
              </Button>
            </Box> */}

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
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `transaction_number`}
                          direction={orderBy === `transaction_number` ? order : `asc`}
                          onClick={() => onSort(`transaction_number`)}
                        >
                          Transaction No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">Aqcuisition Details</TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `po_number`}
                          direction={orderBy === `po_number` ? order : `asc`}
                          onClick={() => onSort(`po_number`)}
                        >
                          PR/PO Number
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel>Requestor</TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">View Information</TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `item_count`}
                          direction={orderBy === `item_count` ? order : `asc`}
                          onClick={() => onSort(`item_count`)}
                        >
                          No. of Items
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `received`}
                          direction={orderBy === `received` ? order : `asc`}
                          onClick={() => onSort(`received`)}
                        >
                          Item Status
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Approved
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {receivingData?.data?.length === 0 ? (
                      <NoRecordsFound heightData="small" />
                    ) : (
                      <>
                        {receivingSuccess &&
                          [...receivingData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell">{data.transaction_number}</TableCell>
                              <TableCell className="tbl-cell text-weight">
                                <Typography fontSize={14} fontWeight={600} color="secondary.main">
                                  {data.acquisition_details}
                                </Typography>

                                <Typography fontSize={12} color="secondary.light">
                                  ({data.warehouse?.id}) - {data.warehouse?.warehouse_name}
                                </Typography>
                              </TableCell>
                              <TableCell className="tbl-cell ">
                                <Typography fontSize="12px" color="secondary.main">
                                  {`PR - ${data.pr_number}`}
                                </Typography>
                                <Typography fontSize="12px" color="secondary.main">
                                  {`PO - ${data.po_number}`}
                                </Typography>
                                <Typography fontSize="12px" color="secondary.main">
                                  {`RR - ${data.rr_number}`}
                                </Typography>
                              </TableCell>
                              <TableCell className="tbl-cell ">
                                {`(${data.requestor?.employee_id}) - ${data.requestor?.firstname} ${data.requestor?.lastname}`}
                              </TableCell>

                              <TableCell className="tbl-cell text-center">
                                <Tooltip placement="top" title="View Request Information" arrow>
                                  <IconButton onClick={() => handleViewData(data)}>
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>

                              <TableCell className="tbl-cell tr-cen-pad45">{data.item_count}</TableCell>
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell">
                                <Typography fontSize="12px" color="secondary.main">
                                  {`Ordered - ${data?.ordered}`}
                                </Typography>
                                <Typography fontSize="12px" color="secondary.main">
                                  {`Received - ${data.delivered}`}
                                </Typography>
                                <Typography fontSize="12px" color="secondary.main">
                                  {`Remaining - ${data.remaining}`}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell tr-cen-pad45">
                                {Moment(data.created_at).format("MMM DD, YYYY")}
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
              total={receivingData?.total}
              success={receivingSuccess}
              current_page={receivingData?.current_page}
              per_page={receivingData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};

export default ReceivingTable;
