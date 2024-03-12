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
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Help, LibraryAdd, Report, ReportProblem, Visibility } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import RequestTimeline from "../RequestTimeline";
import {
  useGetPurchaseRequestApiQuery,
  useGetPurchaseRequestWithPrApiQuery,
} from "../../../Redux/Query/Request/PurchaseRequest";

const PurchaseRequestTable = (props) => {
  const { withPr } = props;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  //   const [transactionIdData, setTransactionIdData] = useState();

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  //   const drawer = useSelector((state) => state.booleanState.drawer);
  //   const dialog = useSelector((state) => state.booleanState.dialog);

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
    data: purchaseRequestData,
    isLoading: purchaseRequestLoading,
    isSuccess: purchaseRequestSuccess,
    isError: purchaseRequestError,
    error: errorData,
    refetch,
  } = (withPr ? useGetPurchaseRequestWithPrApiQuery : useGetPurchaseRequestApiQuery)(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const dispatch = useDispatch();

  const handleViewData = (data) => {
    navigate(`/asset-requisition/purchase-request/${data.transaction_number}`, {
      state: { ...data, withPr },
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Stack sx={{ height: "calc(100vh - 255px)" }}>
      {purchaseRequestLoading && <MasterlistSkeleton onAdd={true} />}
      {purchaseRequestError && <ErrorFetching refetch={refetch} error={errorData} />}
      {purchaseRequestData && !purchaseRequestError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar onStatusChange={setStatus} onSearchChange={setSearch} onSetPage={setPage} hideArchive />

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
                      <TableCell className="tbl-cell">Acquisition Details</TableCell>

                      {withPr && (
                        <TableCell className="tbl-cell">
                          <TableSortLabel
                            active={orderBy === `pr_number`}
                            direction={orderBy === `pr_number` ? order : `asc`}
                            onClick={() => onSort(`pr_number`)}
                          >
                            PR Number
                          </TableSortLabel>
                        </TableCell>
                      )}

                      <TableCell className="tbl-cell">
                        <TableSortLabel>Requestor</TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `item_count`}
                          direction={orderBy === `item_count` ? order : `asc`}
                          onClick={() => onSort(`item_count`)}
                        >
                          No. of Items
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">View Information</TableCell>

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
                    {purchaseRequestData?.data?.length === 0 ? (
                      <NoRecordsFound category />
                    ) : (
                      <>
                        {purchaseRequestSuccess &&
                          [...purchaseRequestData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell">{data.transaction_number}</TableCell>
                              <TableCell className="tbl-cell text-weight">{data.acquisition_details}</TableCell>
                              {withPr && <TableCell className="tbl-cell ">{data.pr_number}</TableCell>}
                              <TableCell className="tbl-cell ">
                                {`(${data.requestor?.employee_id}) - ${data.requestor?.firstname} ${data.requestor?.lastname}`}
                              </TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">{data.item_count}</TableCell>
                              <TableCell className="tbl-cell text-center">
                                <Tooltip placement="top" title="View Request Information" arrow>
                                  <IconButton onClick={() => handleViewData(data)}>
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
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
              total={purchaseRequestData?.total}
              success={purchaseRequestSuccess}
              current_page={purchaseRequestData?.current_page}
              per_page={purchaseRequestData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};

export default PurchaseRequestTable;
