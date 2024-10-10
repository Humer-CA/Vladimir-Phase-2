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
  usePostItemsApiMutation,
} from "../../Redux/Query/Masterlist/YmirCoa/SmallTools";

// MUI
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { AddBox, CreditCard, ExpandCircleDown, Help, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ViewTagged from "../../Components/Reusable/ViewTagged";
import { closeDialog, openDialog, openDrawer, openTableCollapse } from "../../Redux/StateManagement/booleanStateSlice";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import {
  useLazyGetYmirItemsAllApiQuery,
  useLazyGetYmirSmallToolsAllApiQuery,
} from "../../Redux/Query/Masterlist/YmirCoa/YmirApi";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import { openCollapse } from "../../Redux/StateManagement/collapseCapexSlice";

const SmallTools = () => {
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
    fetchYmirItems,
    {
      data: ymirItems,
      isLoading: ymirItemsLoading,
      isSuccess: ymirItemsSuccess,
      isFetching: ymirItemsFetching,
      isError: ymirItemsError,
      refetch: ymirItemsRefetch,
    },
  ] = useLazyGetYmirItemsAllApiQuery();

  const [
    fetchYmirSmallTools,
    {
      data: ymirSmallTools,
      isLoading: ymirSmallToolsLoading,
      isSuccess: ymirSmallToolsSuccess,
      isFetching: ymirSmallToolsFetching,
      isError: ymirSmallToolsError,
      refetch: ymirSmallToolsRefetch,
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
  const [
    postItems,
    {
      data: postItemData,
      isLoading: isPostItemLoading,
      isSuccess: isPostItemSuccess,
      isError: isPostItemError,
      error: postItemError,
    },
  ] = usePostItemsApiMutation();

  useEffect(() => {
    if (ymirSmallToolsSuccess) {
      postItems(ymirSmallTools);
    }
    if (ymirItemsSuccess) {
      postSmallTools(ymirItems);
    }
  }, [ymirItemsSuccess, ymirItemsFetching, ymirSmallToolsSuccess, ymirSmallToolsFetching]);

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
            await fetchYmirItems();
            await fetchYmirSmallTools();
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
                      <TableCell>
                        <ExpandCircleDown
                          sx={{
                            position: "absolute",
                            inset: 0,
                            margin: "auto",
                            color: "secondary.main",
                          }}
                        />
                      </TableCell>

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
                      <TableCell className="tbl-cell text-center">Items</TableCell>
                    </TableRow>
                  </TableHead>

                  {/* <TableBody
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
                  </TableBody> */}
                  <TableBody>
                    {smallToolsApiData?.data?.length === 0 ? (
                      <NoRecordsFound heightData="medium" />
                    ) : (
                      <>
                        {/* {console.log(
                          "flatData",
                          smallToolsApiData?.data?.flatMap((items) => items?.items?.map((data) => data))
                        )} */}
                        {smallToolsApiData &&
                          [...smallToolsApiData?.data]
                            .sort(comparator(order, orderBy))
                            ?.map((data, index) => <CollapsibleTable key={index} data={data} />)}
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
    </Box>
  );
};
export default SmallTools;

// * CollapsedTable -------------------------------------------------------------------
const CollapsibleTable = (props) => {
  const { data } = props;
  const tableCollapse = useSelector((state) => state.booleanState.tableCollapse);
  const dispatch = useDispatch();

  const collapseSwitch = tableCollapse === data?.id;

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

  return (
    <>
      <TableRow className={collapseSwitch ? "tbl-row-collapsed" : "tbl-row"}>
        <TableCell className="tbl-cell-col text-center">
          <IconButton
            size="small"
            sx={collapseSwitch ? { color: "primary.main" } : null}
            onClick={() => dispatch(openTableCollapse(data?.id))}
          >
            {collapseSwitch ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell className="tbl-cell-col tr-cen-pad45" sx={collapseSwitch ? { color: "white" } : null}>
          {data?.id}
        </TableCell>

        <TableCell className="tbl-cell-col" sx={collapseSwitch ? { color: "white" } : null}>
          {data?.small_tool_code}
        </TableCell>

        <TableCell className="tbl-cell-col" sx={collapseSwitch ? { color: "white" } : null}>
          {data.small_tool_name}
        </TableCell>

        <TableCell className="tbl-cell-col  text-center" sx={data.is_active ? { color: "white" } : null}>
          {data.is_active === 1 ? (
            <Chip
              size="small"
              variant="contained"
              sx={
                collapseSwitch
                  ? {
                      background: "#1fff7c65",
                      color: "whitesmoke",
                      fontSize: "0.7rem",
                      px: 1,
                    }
                  : {
                      background: "#27ff811f",
                      color: "active.dark",
                      fontSize: "0.7rem",
                      px: 1,
                    }
              }
              label="ACTIVE"
            />
          ) : (
            <Chip
              size="small"
              variant="contained"
              sx={
                data?.is_active
                  ? {
                      background: "#fc3e3ed4",
                      color: "whitesmoke",
                      fontSize: "0.7rem",
                      px: 1,
                    }
                  : {
                      background: "#fc3e3e34",
                      color: "error.light",
                      fontSize: "0.7rem",
                      px: 1,
                    }
              }
              label="INACTIVE"
            />
          )}
        </TableCell>

        <TableCell className="tbl-cell-col tr-cen-pad45" sx={collapseSwitch ? { color: "white" } : null}>
          {/* <Chip
            label={data.items === 0 ? "-" : data.items}
            sx={{
              backgroundColor: "background.light",
              color: "secondary.main",
            }}
          /> */}
          {data?.items?.length === 0 ? "-" : data?.items?.length}
        </TableCell>
      </TableRow>

      <TableRow
        sx={
          tableCollapse
            ? {
                "& > *": {
                  backgroundColor: "background.main",
                  borderColor: "secondary.light",
                  // borderBottom: "20px solid white!important",
                },
              }
            : null
        }
      >
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0, border: 0 }} colSpan={999}>
          <Collapse in={collapseSwitch} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    sx={{
                      "& > *": {
                        fontWeight: "bold!important",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }} className="tbl-cell-col text-center">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        ID No.
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-col">
                      <TableSortLabel
                        active={orderBy === `sub_capex`}
                        direction={orderBy === `sub_capex` ? order : `asc`}
                        onClick={() => onSort(`sub_capex`)}
                      >
                        Item Code
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-col">
                      <TableSortLabel
                        active={orderBy === `sub_project`}
                        direction={orderBy === `sub_project` ? order : `asc`}
                        onClick={() => onSort(`sub_project`)}
                      >
                        Item Name
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-col text-font">
                      <TableSortLabel
                        active={orderBy === `capex_id`}
                        direction={orderBy === `capex_id` ? order : `asc`}
                        onClick={() => onSort(`capex_id`)}
                      >
                        Capex ID
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-col text-center">Status</TableCell>

                    <TableCell className="tbl-cell-col text-center">
                      <TableSortLabel
                        active={orderBy === `capex_id`}
                        direction={orderBy === `capex_id` ? order : `asc`}
                        onClick={() => onSort(`capex_id`)}
                      >
                        Date Created
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-col">Date Created</TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={999}
                        sx={{
                          backgroundColor: "background.light",
                          // borderBottom: 0,
                          py: "10px",
                          position: "relative",
                        }}
                      >
                        <Stack flexDirection="row" alignItems="center" justifyContent="center" gap="5px">
                          <img src={NoDataFile} alt="" width="35px" />
                          <Typography
                            variant="p"
                            sx={{
                              fontFamily: "Anton, Roboto, Helvetica",
                              color: "secondary.main",
                              fontSize: "1.2rem",
                            }}
                          >
                            No Data Found
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {[...data?.items].sort(comparator(order, orderBy))?.map((items) => (
                        <TableRow
                          key={items.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell className="tbl-cell-col tr-cen-pad45">{items.id}</TableCell>
                          <TableCell className="tbl-cell-col tr-cen-pad45">{items.sync_id}</TableCell>

                          <TableCell className="tbl-cell-col">{items.item_code + "-" + items.item_name}</TableCell>

                          <TableCell className="tbl-cell-col text-center">
                            {items.is_active ? (
                              <Chip
                                size="small"
                                variant="contained"
                                sx={
                                  tableCollapse
                                    ? {
                                        background: "#27ff814f",
                                        color: "active.dark",
                                        fontSize: "0.7rem",
                                        px: 1,
                                      }
                                    : {
                                        background: "#27ff811f",
                                        color: "active.dark",
                                        fontSize: "0.7rem",
                                        px: 1,
                                      }
                                }
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

                          <TableCell className="tbl-cell-col tr-cen-pad45">
                            {Moment(items.created_at).format("MMM DD, YYYY")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
