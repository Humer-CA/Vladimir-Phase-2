import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";

import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import { useLazyGetFistoSupplierAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/FistoSupplier";
import { usePostSupplierApiMutation, useGetSupplierApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/Supplier";

// MUI
import {
  Box,
  Chip,
  Dialog,
  Divider,
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

const Supplier = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

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

  const [
    trigger,
    {
      data: fistoSupplierApi,
      isLoading: fistoSupplierApiLoading,
      isSuccess: fistoSupplierApiSuccess,
      isFetching: fistoSupplierApiFetching,
      isError: fistoSupplierApiError,

      refetch: fistoSupplierApiRefetch,
    },
  ] = useLazyGetFistoSupplierAllApiQuery();

  const {
    data: supplierApiData,
    isLoading: supplierApiLoading,
    isSuccess: supplierApiSuccess,
    isFetching: supplierApiFetching,
    isError: supplierApiError,
    error: errorData,
    refetch: supplierApiRefetch,
  } = useGetSupplierApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    postSupplier,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostSupplierApiMutation();

  useEffect(() => {
    if (fistoSupplierApiSuccess) {
      postSupplier(fistoSupplierApi);
    }
  }, [fistoSupplierApiSuccess, fistoSupplierApiFetching]);

  useEffect(() => {
    if (isPostError) {
      let message = "Something went wrong. Please try again.";
      let variant = "error";

      if (postError?.status === 404 || postError?.status === 422) {
        message = postError?.data?.message;
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
            supplierApiRefetch();
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

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Supplier
      </Typography>
      {supplierApiLoading && <MasterlistSkeleton onSync={true} />}

      {supplierApiError && <ErrorFetching refetch={supplierApiRefetch} error={errorData} />}

      {supplierApiData && !supplierApiError && (
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
                          active={orderBy === `supplier_code`}
                          direction={orderBy === `supplier_code` ? order : `asc`}
                          onClick={() => onSort(`supplier_code`)}
                        >
                          Supplier Code
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `supplier_name`}
                          direction={orderBy === `supplier_name` ? order : `asc`}
                          onClick={() => onSort(`supplier_name`)}
                        >
                          Supplier Name
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

                  <TableBody>
                    {supplierApiData.data.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {supplierApiSuccess &&
                          [...supplierApiData.data].sort(comparator(order, orderBy))?.map((data) => (
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

                              <TableCell className="tbl-cell">{data.supplier_code}</TableCell>

                              <TableCell className="tbl-cell">{data.supplier_name}</TableCell>

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
                  // { label: "All", value: parseInt(supplierApiData?.total) }
                ]}
                component="div"
                count={supplierApiSuccess ? supplierApiData.total : 0}
                page={supplierApiSuccess ? supplierApiData.current_page - 1 : 0}
                rowsPerPage={supplierApiSuccess ? parseInt(supplierApiData?.per_page) : 5}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Supplier;
