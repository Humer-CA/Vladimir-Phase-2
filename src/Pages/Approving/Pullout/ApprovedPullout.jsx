import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";
import NoRecordsFound from "../../../Layout/NoRecordsFound";

// RTK
import { useDispatch, useSelector } from "react-redux";

// MUI
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { notificationApi } from "../../../Redux/Query/Notification";
import { useGetPulloutApprovalApiQuery } from "../../../Redux/Query/Movement/Pullout";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";
import { usePatchPulloutApprovalStatusApiMutation } from "../../../Redux/Query/Approving/PulloutApproval";

const ApprovedPullout = (props) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Approved");
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
    data: approvedPulloutData,
    isLoading: approvalLoading,
    isSuccess: approvalSuccess,
    isError: approvalError,
    error: errorData,
    refetch,
  } = useGetPulloutApprovalApiQuery(
    {
      page: page,
      per_page: perPage,
      search: search,
      status: status,
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleViewPullout = (data) => {
    const view = true;
    const approved = true;

    navigate(`/approving/pullout/${data?.pullout_number}`, {
      state: { ...data, view, approved },
    });
  };

  return (
    <Stack sx={{ height: "calc(100vh - 255px)" }}>
      {approvalLoading && <MasterlistSkeleton category={true} onAdd={true} />}
      {approvalError && <ErrorFetching refetch={refetch} category={approvedPulloutData} error={errorData} />}
      {approvedPulloutData && !approvalError && (
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
                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        Pullout No.
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">Description</TableCell>

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

                    <TableCell className="tbl-cell-category" align="center">
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
                        active={orderBy === `date_requested`}
                        direction={orderBy === `date_requested` ? order : `asc`}
                        onClick={() => onSort(`date_requested`)}
                      >
                        Date Requested
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category  text-center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {approvedPulloutData?.data.length === 0 ? (
                    <NoRecordsFound approvedPulloutData={approvedPulloutData} heightData="small" />
                  ) : (
                    <>
                      {approvalSuccess &&
                        [...approvedPulloutData.data].sort(comparator(order, orderBy))?.map((data) => (
                          <TableRow
                            key={data?.pullout_number}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell-category ">{data?.pullout_number}</TableCell>

                            <TableCell className="tbl-cell-category ">{data?.description}</TableCell>

                            <TableCell className="tbl-cell-category">
                              <Typography fontSize={14} fontWeight={600} color={"secondary"} noWrap>
                                {data.requester?.employee_id}
                              </Typography>
                              <Typography fontSize={12} color={"gray"}>
                                {data.requester?.firstname}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell-category tr-cen-pad45">{data.quantity}</TableCell>

                            <TableCell className="tbl-cell-category text-center">
                              <IconButton onClick={() => handleViewPullout(data)}>
                                <Visibility color="secondary" />
                              </IconButton>
                            </TableCell>

                            <TableCell className="tbl-cell-category text-center capitalized">
                              <Chip
                                size="small"
                                variant="contained"
                                sx={{
                                  background: "#27ff811f",
                                  color: "active.dark",
                                  fontSize: "0.7rem",
                                  px: 1,
                                }}
                                label="APPROVED"
                              />
                            </TableCell>

                            <TableCell className="tbl-cell-category tr-cen-pad45">
                              {Moment(data.asset_request?.date_requested).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell-category text-center">
                              <ActionMenu status={status} data={data} showApprover hideArchive />
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
            total={approvedPulloutData?.total}
            success={approvalSuccess}
            current_page={approvedPulloutData?.current_page}
            per_page={approvedPulloutData?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
          />
        </Box>
      )}
    </Stack>
  );
};

export default ApprovedPullout;
