import React, { useEffect, useState } from "react";

import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import AddSubUnit from "./AddEdit/AddSubUnit";
import ActionMenu from "../../Components/Reusable/ActionMenu";

import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  useGetSubUnitApiQuery,
  usePatchSubUnitApiMutation,
  usePostSubUnitApiMutation,
} from "../../Redux/Query/Masterlist/YmirCoa/SubUnit";
import { closeConfirm, onLoading, openConfirm } from "../../Redux/StateManagement/confirmSlice";

import {
  Box,
  Button,
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
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import Moment from "moment";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import CustomChip from "../../Components/Reusable/CustomChip";
import { Help, ReportProblem } from "@mui/icons-material";
import ViewTagged from "../../Components/Reusable/ViewTagged";
import { openDialog } from "../../Redux/StateManagement/booleanStateSlice";
import { useLazyGetYmirSubUnitAllApiQuery } from "../../Redux/Query/Masterlist/YmirCoa/YmirApi";

const SubUnit = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");
  const [viewLocation, setViewLocation] = useState({
    id: null,
    sync_id: null,
    location_name: "",
  });

  const dispatch = useDispatch();
  // const drawer = useSelector((state) => state.booleanState.drawer);
  const dialog = useSelector((state) => state.booleanState.dialog);

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
  const limitHandler = (e) => {
    setPage(1);
    setLimit(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const onSetPage = () => {
    setPage(1);
  };

  const [
    trigger,
    {
      data: ymirSubUnitApi,
      isLoading: ymirSubUnitApiLoading,
      isSuccess: ymirSubUnitApiSuccess,
      isFetching: ymirSubUnitApiFetching,
      isError: ymirSubUnitApiError,

      refetch: ymirSubUnitApiRefetch,
    },
  ] = useLazyGetYmirSubUnitAllApiQuery();

  const {
    data: subUnitData,
    isLoading: subUnitLoading,
    isSuccess: subUnitSuccess,
    isError: subUnitError,
    error: errorData,
    refetch,
  } = useGetSubUnitApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    postSubUnit,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostSubUnitApiMutation();

  useEffect(() => {
    if (ymirSubUnitApiSuccess) {
      postSubUnit(ymirSubUnitApi);
    }
  }, [ymirSubUnitApiSuccess, ymirSubUnitApiFetching]);

  useEffect(() => {
    if (isPostError) {
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

  const onSyncHandler = async () => {
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
            await trigger();
            refetch();
          } catch (err) {
            console.log(err.message);
            dispatch(
              openToast({
                message: postData?.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          }
        },
      })
    );
  };

  const onViewLocationHandler = (props) => {
    const { id, location, sync_id } = props;
    setViewLocation({
      id: id,
      sync_id: sync_id,
      location: location,
    });
  };

  const handleViewLocation = (data) => {
    // console.log(data);
    onViewLocationHandler(data);
    dispatch(openDialog());
  };

  const filteredData = subUnitData?.data
    ?.find((item) => item.id === viewLocation.id)
    ?.location?.map((mapItem) => {
      // console.log(mapItem?.location_status);
      if (mapItem?.location_status === true) {
        return `${mapItem?.location_code} - ${mapItem?.location_name}`;
      } else {
        return "";
      }
    });

  // console.log(filteredData);
  const mapLocationData = [...new Set(filteredData)];

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Sub Unit
      </Typography>

      {subUnitLoading && <MasterlistSkeleton onAdd={true} />}
      {subUnitError && <ErrorFetching refetch={refetch} error={errorData} />}
      {subUnitData && !subUnitError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            onSyncHandler={onSyncHandler}
            onSync={() => {}}
            // onAdd={() => {}}
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
                        active={orderBy === `subunit_name`}
                        direction={orderBy === `subunit_name` ? order : `asc`}
                        onClick={() => onSort(`subunit_name`)}
                      >
                        Sub Unit
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel
                        active={orderBy === `unit`}
                        direction={orderBy === `unit` ? order : `asc`}
                        onClick={() => onSort(`unit`)}
                      >
                        Unit
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell" align="center">
                      <TableSortLabel
                        active={orderBy === `location`}
                        direction={orderBy === `location` ? order : `asc`}
                        onClick={() => onSort(`location`)}
                      >
                        Location
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
                  {subUnitData?.data?.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {subUnitSuccess &&
                        [...subUnitData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
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

                            <TableCell className="tbl-cell text-weight">
                              ({data.subunit_code}) - {data.subunit_name}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              ({data?.unit?.unit_code}) - {data?.unit?.unit_name}
                            </TableCell>

                            <TableCell className="tbl-cell" align="center">
                              {/* {data.location?.location_code +
                                    " - " +
                                    data.location?.location_name} */}
                              <Button
                                sx={{
                                  textTransform: "capitalize",
                                  textDecoration: "underline",
                                  mr: 3,
                                }}
                                variant="text"
                                size="small"
                                color="link"
                                onClick={() => handleViewLocation(data)}
                              >
                                <Typography fontSize={13}>View</Typography>
                              </Button>
                            </TableCell>

                            <TableCell className="tbl-cell text-center">
                              <CustomChip status={status} />
                            </TableCell>

                            <TableCell className="tbl-cell tr-cen-pad45">
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell ">
                              <ActionMenu
                                status={status}
                                data={data}
                                // onUpdateHandler={onUpdateHandler}
                                // onArchiveRestoreHandler={onArchiveRestoreHandler}
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
            total={subUnitData?.total}
            success={subUnitSuccess}
            current_page={subUnitData?.current_page}
            per_page={subUnitData?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={limitHandler}
          />
        </Box>
      )}
      <Dialog
        open={dialog}
        TransitionComponent={Grow}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <ViewTagged data={viewLocation} mapData={mapLocationData} setViewLocation={setViewLocation} name="Location" />
      </Dialog>
    </Box>
  );
};

export default SubUnit;
