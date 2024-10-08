import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";

import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import {
  usePostSmallToolsApiMutation,
  useGetSmallToolsApiQuery,
} from "../../Redux/Query/Masterlist/YmirCoa/SmallTools";

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
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Help } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ViewTagged from "../../Components/Reusable/ViewTagged";
import { closeDialog, openDialog, openDrawer } from "../../Redux/StateManagement/booleanStateSlice";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import { useLazyGetYmirSmallToolsAllApiQuery } from "../../Redux/Query/Masterlist/YmirCoa/YmirApi";

const SmallTools = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [viewLocation, setViewLocation] = useState({
    id: null,
    sync_id: null,
    location_name: "",
  });

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

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const [
    trigger,
    {
      data: ymirSmallToolsApi,
      isLoading: ymirSmallToolsApiLoading,
      isSuccess: ymirSmallToolsApiSuccess,
      isFetching: ymirSmallToolsApiFetching,
      isError: ymirSmallToolsApiError,
      refetch: ymirSmallToolsApiRefetch,
    },
  ] = useLazyGetYmirSmallToolsAllApiQuery();

  const {
    data: smallToolsApiData,
    isLoading: smallToolsApiLoading,
    isSuccess: smallToolsApiSuccess,
    isFetching: smallToolsApiFetching,
    isError: smallToolsApiError,
    error: errorData,
    refetch: smallToolsApiRefetch,
  } = useGetSmallToolsApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    postSmallTools,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostSmallToolsApiMutation();

  useEffect(() => {
    if (ymirSmallToolsApiSuccess) {
      postSmallTools(ymirSmallToolsApi);
    }
  }, [ymirSmallToolsApiSuccess, ymirSmallToolsApiFetching]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isPostSuccess) {
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
      dispatch(closeConfirm());
    }
  }, [isPostSuccess]);

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
            smallToolsApiRefetch();
          } catch (err) {
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

  const onSetPage = () => {
    setPage(1);
  };

  const onViewLocationHandler = (props) => {
    const { id, locations, sync_id } = props;
    setViewLocation({
      id: id,
      sync_id: sync_id,
      locations: locations,
    });
  };

  const onViewResetLocationHandler = (props) => {
    setViewLocation({
      id: null,
      sync_id: null,
      locations: null,
    });
  };

  const handleViewLocation = (data) => {
    // console.log(data);
    onViewLocationHandler(data);
    dispatch(openDialog());
  };

  // const filteredData = smallToolsApiData?.data?.flatMap((item) =>
  //   item.locations.map(
  //     (mapItem) => `${mapItem?.location_code} - ${mapItem?.location_name}`
  //   )
  // );
  // const mapLocationData = [...new Set(filteredData)];
  // // console.log(mapLocationData);

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Small Tools
      </Typography>
      {smallToolsApiLoading && <MasterlistSkeleton onSync={true} />}
      {smallToolsApiError && <ErrorFetching refetch={smallToolsApiRefetch} error={errorData} />}
      {smallToolsApiData && !smallToolsApiError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              path="#"
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              onSyncHandler={onSyncHandler}
              onSync={() => {}}
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
                          active={orderBy === `smallTools_code`}
                          direction={orderBy === `smallTools_code` ? order : `asc`}
                          onClick={() => onSort(`smallTools_code`)}
                        >
                          Small Tools Code
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `smallTools_name`}
                          direction={orderBy === `smallTools_name` ? order : `asc`}
                          onClick={() => onSort(`smallTools_name`)}
                        >
                          Small Tools Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">Status</TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `updated_at`}
                          direction={orderBy === `updated_at` ? order : `asc`}
                          onClick={() => onSort(`updated_at`)}
                        >
                          Date Updated
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody
                    sx={{
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    {smallToolsApiData.data.length === 0 ? (
                      <NoRecordsFound heightData="medium" />
                    ) : (
                      <>
                        {smallToolsApiSuccess &&
                          [...smallToolsApiData.data].sort(comparator(order, orderBy)).map((data) => (
                            <TableRow
                              key={data.id}
                              hover={true}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell tr-cen-pad45 tbl-coa">{data.id}</TableCell>
                              <TableCell className="tbl-cell">{data.small_tool_code}</TableCell>
                              <TableCell className="tbl-cell">{data.small_tool_name}</TableCell>

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
                                {Moment(data.updated_at).format("MMM DD, YYYY")}
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
              total={smallToolsApiData?.total}
              success={smallToolsApiSuccess}
              current_page={smallToolsApiData?.current_page}
              per_page={smallToolsApiData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}
      {/* <Dialog open={dialog} onClose={() => dispatch(closeDialog())} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <ViewTagged data={viewLocation} mapData={mapLocationData} setViewLocation={setViewLocation} name="Location" />
      </Dialog> */}
    </Box>
  );
};

export default SmallTools;
