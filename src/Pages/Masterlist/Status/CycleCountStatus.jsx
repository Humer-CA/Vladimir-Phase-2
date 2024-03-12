import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import AddCycleCountStatus from "../AddEdit/Status/AddCycleCountStatus";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";
import NoRecordsFound from "../../../Layout/NoRecordsFound";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import { useSelector } from "react-redux";

import {
  useGetCycleCountStatusApiQuery,
  usePatchCycleCountStatusStatusApiMutation,
} from "../../../Redux/Query/Masterlist/Status/CycleCountStatus";

// MUI
import {
  Box,
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

const CycleCountStatus = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateCycleCountStatus, setUpdateCycleCountStatus] = useState({
    status: false,
    id: null,
    cycle_count_status_name: "",
  });

  const drawer = useSelector((state) => state.booleanState.drawer);

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
    data: cycleCountStatusData,
    isLoading: cycleCountStatusLoading,
    isSuccess: cycleCountStatusSuccess,
    isError: cycleCountStatusError,
    error: errorData,
    refetch,
  } = useGetCycleCountStatusApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [patchCycleCountStatusApi, { isLoading }] = usePatchCycleCountStatusStatusApiMutation();

  const dispatch = useDispatch();

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
            const result = await patchCycleCountStatusApi({
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
    const { id, cycle_count_status_name } = props;
    setUpdateCycleCountStatus({
      status: true,
      id: id,
      cycle_count_status_name: cycle_count_status_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateCycleCountStatus({
      status: false,
      id: null,
      cycle_count_status_name: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  // console.log(CycleCountStatusData);

  return (
    <>
      {cycleCountStatusLoading && <MasterlistSkeleton category={true} onAdd={true} />}

      {cycleCountStatusError && <ErrorFetching refetch={refetch} category={cycleCountStatusData} error={errorData} />}

      {cycleCountStatusData && !cycleCountStatusError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            onAdd={() => {}}
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
                        active={orderBy === `cycle_count_status_name`}
                        direction={orderBy === `cycle_count_status_name` ? order : `asc`}
                        onClick={() => onSort(`cycle_count_status_name`)}
                      >
                        Cycle Count Status
                      </TableSortLabel>
                    </TableCell>

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
                  {cycleCountStatusData.data.length === 0 ? (
                    <NoRecordsFound category />
                  ) : (
                    <>
                      {cycleCountStatusSuccess &&
                        [...cycleCountStatusData.data].sort(comparator(order, orderBy))?.map((data) => (
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

                            <TableCell className="tbl-cell text-weight">{data.cycle_count_status_name}</TableCell>

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
                                hideEdit={true}
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
              rowsPerPageOptions={[5, 10, 15, { label: "All", value: parseInt(cycleCountStatusData?.total) }]}
              component="div"
              count={cycleCountStatusSuccess ? cycleCountStatusData.total : 0}
              page={cycleCountStatusSuccess ? cycleCountStatusData.current_page - 1 : 0}
              rowsPerPage={cycleCountStatusSuccess ? parseInt(cycleCountStatusData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </Box>
      )}
      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddCycleCountStatus data={updateCycleCountStatus} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </>
  );
};

export default CycleCountStatus;
