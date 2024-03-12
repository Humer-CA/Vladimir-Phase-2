import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import { usePostDivisionStatusApiMutation, useGetDivisionApiQuery } from "../../Redux/Query/Masterlist/Division";

import { useSelector } from "react-redux";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
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
import { Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import AddDivision from "./AddEdit/AddDivision";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import { openDrawer } from "../../Redux/StateManagement/booleanStateSlice";

const Division = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateDivision, setUpdateDivision] = useState({
    status: false,
    id: null,
    sync_id: null,
    division_name: "",
  });

  const drawer = useSelector((state) => state.booleanState.drawer);
  const dispatch = useDispatch();

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

  const {
    data: divisionData,
    isLoading: divisionLoading,
    isSuccess: divisionSuccess,
    isError: divisionError,
    error: errorData,
    refetch,
  } = useGetDivisionApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postDivisionStatusApi, { isLoading }] = usePostDivisionStatusApiMutation();

  // console.log(divisionData);

  const onArchiveRestoreHandler = async (id) => {
    dispatch(
      openConfirm({
        icon: status === "active" ? ReportProblem : Help,
        iconColor: status === "active" ? "alert" : "info",
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
              {status === "active" ? "ARCHIVE" : "ACTIVATE"}
            </Typography>{" "}
            this data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await postDivisionStatusApi({
              id: id,
              status: status === "active" ? false : true,
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

  const onUpdateHandler = (props) => {
    const { id, division_name, sync_id } = props;
    setUpdateDivision({
      status: true,
      id: id,
      sync_id: sync_id,
      division_name: division_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateDivision({
      status: false,
      id: null,
      sync_id: [],
      division_name: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  const onViewDepartmentHandler = (props) => {
    const { id, division_name, sync_id } = props;
    setUpdateDivision({
      status: true,
      action: "view",
      id: id,
      sync_id: sync_id,
      division_name: division_name,
    });
  };

  const handleViewDepartment = (data) => {
    onViewDepartmentHandler(data);
    dispatch(openDrawer());
    dispatch(closeConfirm());
  };

  // console.log(divisionData);

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Division
      </Typography>

      {divisionLoading && <MasterlistSkeleton onAdd={true} />}
      {divisionError && <ErrorFetching refetch={refetch} error={errorData} />}
      {divisionData && !divisionError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            onAdd={() => {}}
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
                    <TableCell className="tbl-cell text-center">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        ID No.
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel
                        active={orderBy === `division_name`}
                        direction={orderBy === `division_name` ? order : `asc`}
                        onClick={() => onSort(`division_name`)}
                      >
                        Division
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell text-center">Department</TableCell>

                    <TableCell className="tbl-cell text-center">Status</TableCell>

                    <TableCell className="tbl-cell text-center">
                      <TableSortLabel
                        active={orderBy === `created_at`}
                        direction={orderBy === `created_at` ? order : `asc`}
                        onClick={() => onSort(`created_at`)}
                      >
                        Date Created
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {divisionData.data.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {divisionSuccess &&
                        [...divisionData.data].sort(comparator(order, orderBy)).map((data) => (
                          <TableRow
                            key={data.id}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell tr-cen-pad45">{data.id}</TableCell>

                            <TableCell className="tbl-cell text-weight">{data.division_name}</TableCell>

                            <TableCell className="tbl-cell text-weight text-center">
                              <Button
                                sx={{
                                  textTransform: "capitalize",
                                  textDecoration: "underline",
                                }}
                                variant="text"
                                size="small"
                                color="link"
                                onClick={() => handleViewDepartment(data)}
                              >
                                <Typography fontSize={13}>View</Typography>
                              </Button>
                            </TableCell>

                            <TableCell className="tbl-cell text-center">
                              {data.is_active ? (
                                <Chip
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    background: "#27ff811f",
                                    color: "active.dark",
                                    fontSize: "0.7rem",
                                    px: 1,
                                  }}
                                  label="ACTIVE"
                                />
                              ) : (
                                <Chip
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    background: "#fc3e3e34",
                                    color: "error.light",
                                    fontSize: "0.7rem",
                                    px: 1,
                                  }}
                                  label="INACTIVE"
                                />
                              )}
                            </TableCell>

                            <TableCell className="tbl-cell tr-cen-pad45">
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell ">
                              <ActionMenu
                                status={status}
                                data={data}
                                onUpdateHandler={onUpdateHandler}
                                onArchiveRestoreHandler={onArchiveRestoreHandler}
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
              rowsPerPageOptions={[5, 10, 15, { label: "All", value: parseInt(divisionData?.total) }]}
              component="div"
              count={divisionSuccess ? divisionData.total : 0}
              page={divisionSuccess ? divisionData.current_page - 1 : 0}
              rowsPerPage={divisionSuccess ? parseInt(divisionData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </Box>
      )}

      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddDivision data={updateDivision} refetch={refetch} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </Box>
  );
};

export default Division;
