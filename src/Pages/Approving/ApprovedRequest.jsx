import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import { Help, ReportProblem, Visibility } from "@mui/icons-material";
import { useGetApprovalApiQuery, usePatchApprovalStatusApiMutation } from "../../Redux/Query/Approving/Approval";
import { useNavigate } from "react-router-dom";

const ApprovedRequest = (props) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Approved");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const drawer = useSelector((state) => state.booleanState.drawer);

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

  // console.log(approvalData);
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

                    <TableCell className="tbl-cell-category">
                      {/* <TableSortLabel
                        active={orderBy === `major_category_name`}
                        direction={
                          orderBy === `major_category_name` ? order : `asc`
                        }
                        onClick={() => onSort(`major_category_name`)}
                      >
                    </TableSortLabel> */}
                      Transaction No.
                    </TableCell>

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

                    {/* <TableCell className="tbl-cell-category">
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
                        active={orderBy === `division_id`}
                        direction={orderBy === `division_id` ? order : `asc`}
                        onClick={() => onSort(`division_id`)}
                      >
                        Quantity of PO
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

                    <TableCell className="tbl-cell-category text-center">
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
                  {approvalData.data.length === 0 ? (
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

                            <TableCell className="tbl-cell-category" align="center">
                              <IconButton onClick={() => handleViewRequisition(data)}>
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
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell-category tr-cen-pad45">
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

export default ApprovedRequest;
