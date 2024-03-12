import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";

import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import { useLazyGetFistoDepartmentAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/FistoDepartment";
import {
  usePostDepartmentApiMutation,
  useGetDepartmentApiQuery,
} from "../../Redux/Query/Masterlist/FistoCoa/Department";

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
import { Help } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ViewTagged from "../../Components/Reusable/ViewTagged";
import { closeDialog, openDialog, openDrawer } from "../../Redux/StateManagement/booleanStateSlice";

const Department = () => {
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
      data: fistoDepartmentApi,
      isLoading: fistoDepartmentApiLoading,
      isSuccess: fistoDepartmentApiSuccess,
      isFetching: fistoDepartmentApiFetching,
      isError: fistoDepartmentApiError,
      refetch: fistoDepartmentApiRefetch,
    },
  ] = useLazyGetFistoDepartmentAllApiQuery();

  const {
    data: departmentApiData,
    isLoading: departmentApiLoading,
    isSuccess: departmentApiSuccess,
    isFetching: departmentApiFetching,
    isError: departmentApiError,
    error: errorData,
    refetch: departmentApiRefetch,
  } = useGetDepartmentApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    postDepartment,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostDepartmentApiMutation();

  useEffect(() => {
    if (fistoDepartmentApiSuccess) {
      postDepartment(fistoDepartmentApi);
    }
  }, [fistoDepartmentApiSuccess, fistoDepartmentApiFetching]);

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
            departmentApiRefetch();
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

  useEffect(() => {
    if (isPostError && postError?.status === 404) {
      dispatch(
        openToast({
          message: postError?.data?.message,
          duration: 5000,
          variant: "error",
        })
      );
    } else if (isPostError && postError?.status === 422) {
      dispatch(
        openToast({
          message: postError?.data?.message,
          duration: 5000,
          variant: "error",
        })
      );
      console.log(postError);
      dispatch(closeConfirm());
    } else if (isPostError) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);

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

  // const filteredData = departmentApiData?.data?.flatMap((item) =>
  //   item.locations.map(
  //     (mapItem) => `${mapItem?.location_code} - ${mapItem?.location_name}`
  //   )
  // );
  // const mapLocationData = [...new Set(filteredData)];
  // // console.log(mapLocationData);

  const filteredData = departmentApiData?.data
    ?.find((item) => item.id === viewLocation.id)
    ?.locations?.map((mapItem) => {
      console.log(mapItem?.location_status);
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
        Department
      </Typography>
      {departmentApiLoading && <MasterlistSkeleton onSync={true} />}
      {departmentApiError && <ErrorFetching refetch={departmentApiRefetch} error={errorData} />}
      {departmentApiData && !departmentApiError && (
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
                          active={orderBy === `department_code`}
                          direction={orderBy === `department_code` ? order : `asc`}
                          onClick={() => onSort(`department_code`)}
                        >
                          Department Code
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `department_name`}
                          direction={orderBy === `department_name` ? order : `asc`}
                          onClick={() => onSort(`department_name`)}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `company_code`}
                          direction={orderBy === `company_code` ? order : `asc`}
                          onClick={() => onSort(`company_code`)}
                        >
                          Company
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell" align="center">
                        <TableSortLabel
                          active={orderBy === `location_code`}
                          direction={orderBy === `location_code` ? order : `asc`}
                          onClick={() => onSort(`location_code`)}
                        >
                          Location
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `division_id`}
                          direction={orderBy === `division_id` ? order : `asc`}
                          onClick={() => onSort(`division_id`)}
                        >
                          Division
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
                    {departmentApiData.data.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {departmentApiSuccess &&
                          [...departmentApiData.data].sort(comparator(order, orderBy)).map((data) => (
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

                              <TableCell className="tbl-cell">{data.department_code}</TableCell>

                              <TableCell className="tbl-cell">{data.department_name}</TableCell>

                              <TableCell className="tbl-cell">
                                {data.company?.company_code + " - " + data.company?.company_name}
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

                              <TableCell className="tbl-cell">
                                {data.division?.division_id === "-"
                                  ? "-"
                                  : data.division?.division_id + " - " + data.division?.division_name}
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

            <Box className="mcontainer__pagination">
              <TablePagination
                rowsPerPageOptions={[
                  5, 10, 15, 100,
                  // { label: "All", value: parseInt(departmentApiData?.total) }
                ]}
                component="div"
                count={departmentApiSuccess ? departmentApiData.total : 0}
                page={departmentApiSuccess ? departmentApiData.current_page - 1 : 0}
                rowsPerPage={departmentApiSuccess ? parseInt(departmentApiData?.per_page) : 5}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}
      <Dialog open={dialog} onClose={() => dispatch(closeDialog())} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <ViewTagged data={viewLocation} mapData={mapLocationData} setViewLocation={setViewLocation} name="Location" />
      </Dialog>
    </Box>
  );
};

export default Department;
