import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import AddAssetMovementStatus from "../AddEdit/Status/AddAssetMovementStatus";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";
import NoRecordsFound from "../../../Layout/NoRecordsFound";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import { useSelector } from "react-redux";

import {
  useGetAssetMovementStatusApiQuery,
  usePatchAssetMovementStatusStatusApiMutation,
} from "../../../Redux/Query/Masterlist/Status/AssetMovementStatus";

// MUI
import {
  Box,
  Chip,
  Dialog,
  Grow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Help, ReportProblem } from "@mui/icons-material";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

const AssetMovementStatus = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateAssetMovementStatus, setUpdateAssetMovementStatus] = useState({
    status: false,
    id: null,
    movement_status_name: "",
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
    data: assetMovementStatusData,
    isLoading: assetMovementStatusLoading,
    isSuccess: assetMovementStatusSuccess,
    isError: assetMovementStatusError,
    error: errorData,
    refetch,
  } = useGetAssetMovementStatusApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [patchAssetMovementStatusApi, { isLoading }] = usePatchAssetMovementStatusStatusApiMutation();

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
            const result = await patchAssetMovementStatusApi({
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
    const { id, movement_status_name } = props;
    setUpdateAssetMovementStatus({
      status: true,
      id: id,
      movement_status_name: movement_status_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateAssetMovementStatus({
      status: false,
      id: null,
      movement_status_name: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  // console.log(AssetMovementStatusData);

  return (
    <>
      {assetMovementStatusLoading && <MasterlistSkeleton category={true} onAdd={true} />}

      {assetMovementStatusError && (
        <ErrorFetching refetch={refetch} category={assetMovementStatusData} error={errorData} />
      )}

      {assetMovementStatusData && !assetMovementStatusError && (
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
                        active={orderBy === `movement_status_name`}
                        direction={orderBy === `movement_status_name` ? order : `asc`}
                        onClick={() => onSort(`movement_status_name`)}
                      >
                        Asset Movement Status
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
                  {assetMovementStatusData.data.length === 0 ? (
                    <NoRecordsFound heightData="small" />
                  ) : (
                    <>
                      {assetMovementStatusSuccess &&
                        [...assetMovementStatusData.data].sort(comparator(order, orderBy))?.map((data) => (
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

                            <TableCell className="tbl-cell text-weight">{data.movement_status_name}</TableCell>

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
                                hideEdit
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

          <CustomTablePagination
            total={assetMovementStatusData?.total}
            success={assetMovementStatusSuccess}
            current_page={assetMovementStatusData?.current_page}
            per_page={assetMovementStatusData?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
          />
        </Box>
      )}
      <Dialog open={drawer} TransitionComponent={Grow} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddAssetMovementStatus data={updateAssetMovementStatus} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </>
  );
};

export default AssetMovementStatus;
