import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";

import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import { useLazyGetFistoLocationAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/FistoLocation";
import { usePostLocationApiMutation, useGetLocationApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/Location";

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
import { closeDialog, openDialog } from "../../Redux/StateManagement/booleanStateSlice";

const Location = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [viewDepartment, setViewDepartment] = useState({
    id: null,
    sync_id: null,
    department_name: "",
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
      data: fistoLocationApi,
      isLoading: fistoLocationApiLoading,
      isSuccess: fistoLocationApiSuccess,
      isFetching: fistoLocationApiFetching,
      isError: fistoLocationApiError,
      refetch: fistoLocationApiRefetch,
    },
  ] = useLazyGetFistoLocationAllApiQuery();

  const {
    data: locationApiData,
    isLoading: locationApiLoading,
    isSuccess: locationApiSuccess,
    isFetching: locationApiFetching,
    isError: locationApiError,
    error: errorData,
    refetch: locationApiRefetch,
  } = useGetLocationApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    postLocation,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostLocationApiMutation();

  useEffect(() => {
    if (fistoLocationApiSuccess) {
      postLocation(fistoLocationApi);
    }
  }, [fistoLocationApiSuccess, fistoLocationApiFetching]);

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
            locationApiRefetch();
          } catch (err) {
            dispatch(
              openToast({
                message: postError?.data?.message,
                duration: 5000,
                variant: "error",
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

  // View Departments --------------------------------------------------------
  const onViewDepartmentHandler = (props) => {
    const { id, department, sync_id } = props;
    setViewDepartment({
      id: id,
      sync_id: sync_id,
      department: department,
    });
  };

  const handleViewDepartment = (data) => {
    onViewDepartmentHandler(data);
    dispatch(openDialog());
  };

  const filteredData = locationApiData?.data
    ?.find((item) => item.id === viewDepartment.id)
    ?.departments?.map((mapItem) => {
      // console.log(mapItem?.department_status);
      if (mapItem?.department_status === true) {
        return `${mapItem?.department_code} - ${mapItem?.department_name}`;
      } else {
        return "";
      }
    });
  const mapDepartmentData = [...new Set(filteredData)];

  // console.log(mapDepartmentData);
  // console.log(locationApiData);

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Location
      </Typography>
      {locationApiLoading && <MasterlistSkeleton onSync={true} />}

      {locationApiError && <ErrorFetching refetch={locationApiRefetch} error={errorData} />}

      {locationApiData && !locationApiError && (
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
                          active={orderBy === `location_code`}
                          direction={orderBy === `location_code` ? order : `asc`}
                          onClick={() => onSort(`location_code`)}
                        >
                          Location Code
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `location_name`}
                          direction={orderBy === `location_name` ? order : `asc`}
                          onClick={() => onSort(`location_name`)}
                        >
                          Location Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell" align="center">
                        <TableSortLabel
                          sx={{ ml: "30px" }}
                          active={orderBy === `location_name`}
                          direction={orderBy === `location_name` ? order : `asc`}
                          onClick={() => onSort(`location_name`)}
                        >
                          Department
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">Status</TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          sx={{ whiteSpace: "nowrap" }}
                          active={orderBy === `updated_at`}
                          direction={orderBy === `updated_at` ? order : `asc`}
                          onClick={() => onSort(`updated_at`)}
                        >
                          Date Updated
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {locationApiData.data.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {locationApiSuccess &&
                          [...locationApiData.data].sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              hover={true}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell tr-cen-pad45  tbl-coa">{data.id}</TableCell>

                              <TableCell className="tbl-cell">{data.location_code}</TableCell>

                              <TableCell className="tbl-cell">{data.location_name}</TableCell>

                              <TableCell className="tbl-cell" align="center">
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
                  // { label: "All", value: parseInt(locationApiData?.total) },
                ]}
                component="div"
                count={locationApiSuccess ? locationApiData.total : 0}
                page={locationApiSuccess ? locationApiData.current_page - 1 : 0}
                rowsPerPage={locationApiSuccess ? parseInt(locationApiData?.per_page) : 5}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}
      <Dialog open={dialog} onClose={() => dispatch(closeDialog())} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <ViewTagged
          data={viewDepartment}
          mapData={mapDepartmentData}
          setViewDepartment={setViewDepartment}
          name="Departments"
        />
      </Dialog>
    </Box>
  );
};

export default Location;
