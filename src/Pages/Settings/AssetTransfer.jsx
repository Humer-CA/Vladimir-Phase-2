import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import ErrorFetching from "../ErrorFetching";
import AddAssetTransfer from "./AddEdit/AddAssetTransfer";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";
import {
  useGetAssetTransferApiQuery,
  usePostAssetTransferStatusApiMutation,
  useDeleteAssetTransferApiMutation,
  useGetAssetTransferIdApiQuery,
} from "../../Redux/Query/Settings/AssetTransfer";

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
import { Help, Report, ReportProblem, Warning } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ViewTagged from "../../Components/Reusable/ViewTagged";
import { closeDrawer, openDrawer } from "../../Redux/StateManagement/booleanStateSlice";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
// import AddAssetTransfer from "../Masterlist/AddEdit/Settings/AddAssetTransfer";

const AssetTransfer = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateAssetTransfer, setUpdateAssetTransfer] = useState({
    status: false,
    id: null,
    requester_id: null,
    approver_id: [],
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
    data: assetTransferData,
    isLoading: assetTransferLoading,
    isSuccess: assetTransferSuccess,
    isError: assetTransferError,
    error: errorData,
    refetch,
  } = useGetAssetTransferApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postAssetTransferStatusApi, { isLoading: isStatusLoading }] = usePostAssetTransferStatusApiMutation();

  const [deleteAssetTransferApi, { isLoading }] = useDeleteAssetTransferApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = async (id, action = "update") => {
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
            const result = await postAssetTransferStatusApi({
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

  const onDeleteHandler = async (id) => {
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
              DELETE
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await deleteAssetTransferApi({ id: id, subunit_id: id }).unwrap();
            console.log(result);
            setPage(1);
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

  const onUpdateHandler = (props) => {
    const { id, unit, subunit, approvers } = props;
    setUpdateAssetTransfer({
      status: true,
      action: "update",
      unit,
      subunit,
      approvers,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateAssetTransfer({
      status: false,
      unit_id: null,
      subunit_id: null,
      approvers: [],
    });
  };

  const onViewHandler = (props) => {
    const { unit, subunit, approvers } = props;
    setUpdateAssetTransfer({
      status: true,
      action: "view",
      unit,
      subunit,
      approvers,
    });
  };

  const handleViewApprovers = (data) => {
    onViewHandler(data);
    dispatch(openDrawer());
    dispatch(closeConfirm());
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <>
      {assetTransferLoading && <MasterlistSkeleton category={true} onAdd={true} />}
      {assetTransferError && <ErrorFetching refetch={refetch} category={assetTransferData} error={errorData} />}
      {assetTransferData && !assetTransferError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              path="#"
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              onAdd={() => {}}
              hideArchive={true}
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
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `subunit_name`}
                          direction={orderBy === `subunit_name` ? order : `asc`}
                          onClick={() => onSort(`subunit_name`)}
                        >
                          Sub Unit
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `unit_name`}
                          direction={orderBy === `unit_name` ? order : `asc`}
                          onClick={() => onSort(`unit_name`)}
                        >
                          Unit
                        </TableSortLabel>
                      </TableCell>

                      <TableCell align="center" className="tbl-cell">
                        Approvers
                      </TableCell>

                      {/* <TableCell className="tbl-cell text-center">
                        Status
                      </TableCell> */}

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
                    {assetTransferData?.data?.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {assetTransferSuccess &&
                          [...assetTransferData?.data]?.sort(comparator(order, orderBy))?.map((data, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell capitalized">{data?.subunit?.subunit_name}</TableCell>

                              <TableCell className="tbl-cell capitalized">{data?.unit?.unit_name}</TableCell>

                              <TableCell align="center" className="tbl-cell text-weight capitalized">
                                <Button
                                  sx={{
                                    textTransform: "capitalize",
                                    textDecoration: "underline",
                                  }}
                                  variant="text"
                                  size="small"
                                  color="link"
                                  onClick={() => handleViewApprovers(data)}
                                >
                                  <Typography fontSize={13}>View</Typography>
                                </Button>
                              </TableCell>

                              <TableCell className="tbl-cell tr-cen-pad45">
                                {Moment(data.created_at).format("MMM DD, YYYY")}
                              </TableCell>

                              <TableCell className="tbl-cell ">
                                <ActionMenu
                                  status={status}
                                  data={data}
                                  hideArchive={true}
                                  showDelete={true}
                                  onUpdateHandler={onUpdateHandler}
                                  onArchiveRestoreHandler={onArchiveRestoreHandler}
                                  onDeleteHandler={onDeleteHandler}
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
              total={assetTransferData?.total}
              success={assetTransferSuccess}
              current_page={assetTransferData?.current_page}
              per_page={assetTransferData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}

      <Dialog
        open={drawer}
        PaperProps={{
          sx: { borderRadius: "10px", maxWidth: "1200px" },
        }}
      >
        <AddAssetTransfer data={updateAssetTransfer} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </>
  );
};

export default AssetTransfer;
