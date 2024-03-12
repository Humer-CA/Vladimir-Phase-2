import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";

import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import { useLazyGetFistoAccountTitleAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/FistoAccountTitle";
import {
  usePostAccountTitleApiMutation,
  useGetAccountTitleApiQuery,
  usePatchAccountTitleStatusApiMutation,
} from "../../Redux/Query/Masterlist/FistoCoa/AccountTitle";

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
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ActionMenu from "../../Components/Reusable/ActionMenu";

const AccountTitle = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

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
      data: fistoAccountTitleApi,
      isLoading: fistoAccountTitleApiLoading,
      isSuccess: fistoAccountTitleApiSuccess,
      isFetching: fistoAccountTitleApiFetching,
      isError: fistoAccountTitleApiError,
      refetch: fistoAccountTitleApiRefetch,
    },
  ] = useLazyGetFistoAccountTitleAllApiQuery();

  const {
    data: accountTitleApiData,
    isLoading: accountTitleApiLoading,
    isSuccess: accountTitleApiSuccess,
    isFetching: accountTitleApiFetching,
    isError: accountTitleApiError,
    error: errorData,
    refetch: accountTitleApiRefetch,
  } = useGetAccountTitleApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [
    postAccountTitle,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostAccountTitleApiMutation();

  const [patchAccountTitleStatus, { isLoading }] = usePatchAccountTitleStatusApiMutation();

  useEffect(() => {
    if (fistoAccountTitleApiSuccess) {
      postAccountTitle(fistoAccountTitleApi);
    }
  }, [fistoAccountTitleApiSuccess, fistoAccountTitleApiFetching]);

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
            const result = await patchAccountTitleStatus({
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
            accountTitleApiRefetch();
          } catch (err) {
            console.log(err.message);
          }
        },
      })
    );
  };

  useEffect(() => {
    if (isPostError && postError?.status === 404) {
      dispatch(
        openToast({
          message: "Data Not Found.",
          duration: 5000,
          variant: "error",
        })
      );
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

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Account Title
      </Typography>
      {accountTitleApiLoading && <MasterlistSkeleton onSync={true} />}
      {accountTitleApiError && <ErrorFetching refetch={accountTitleApiRefetch} error={errorData} />}
      {accountTitleApiData && !accountTitleApiError && (
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
                          active={orderBy === `account_title_code`}
                          direction={orderBy === `account_title_code` ? order : `asc`}
                          onClick={() => onSort(`account_title_code`)}
                        >
                          Account Title Code
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `account_title_name`}
                          direction={orderBy === `account_title_name` ? order : `asc`}
                          onClick={() => onSort(`account_title_name`)}
                        >
                          Account Title Name
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

                      <TableCell className="tbl-cell text-center">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {accountTitleApiData.data.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {accountTitleApiSuccess &&
                          [...accountTitleApiData.data].sort(comparator(order, orderBy))?.map((data) => (
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

                              <TableCell className="tbl-cell">{data.account_title_code}</TableCell>

                              <TableCell className="tbl-cell">{data.account_title_name}</TableCell>

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

                              <TableCell className="tbl-cell text-center">
                                <ActionMenu
                                  hideEdit={true}
                                  data={data}
                                  status={status}
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
                rowsPerPageOptions={[
                  5, 10, 15, 100,
                  // { label: "All", value: parseInt(accountTitleApiData?.total) },
                ]}
                component="div"
                count={accountTitleApiSuccess ? accountTitleApiData.total : 0}
                page={accountTitleApiSuccess ? accountTitleApiData.current_page - 1 : 0}
                rowsPerPage={accountTitleApiSuccess ? parseInt(accountTitleApiData?.per_page) : 5}
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

export default AccountTitle;
