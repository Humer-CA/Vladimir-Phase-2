import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import AddMinorCategory from "../AddEdit/AddMinorCategory.jsx";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { closeConfirm, openConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import {
  useGetMinorCategoryApiQuery,
  usePutMinorCategoryStatusApiMutation,
} from "../../../Redux/Query/Masterlist/Category/MinorCategory";

// MUI
import {
  Box,
  Chip,
  Dialog,
  Grow,
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
import { Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

const MinorCategory = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateMinorCategory, setUpdateMinorCategory] = useState({
    status: false,
    id: null,
    // division_id: "",
    major_category_id: "",
    account_title_sync_id: null,
    minor_category_name: "",
  });

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

  const drawer = useSelector((state) => state.booleanState.drawer);

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: minorCategoryData,
    isLoading: minorCategoryLoading,
    isSuccess: minorCategorySuccess,
    isError: minorCategoryError,
    error: errorData,
    refetch,
  } = useGetMinorCategoryApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [putMinorCategoryStatusApi, { isLoading }] = usePutMinorCategoryStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = (id) => {
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
            const result = await putMinorCategoryStatusApi({
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
    const {
      id,
      division,
      major_category,
      account_title,
      minor_category_name,
      // urgency_level,
      // personally_assign,
      // evaluate_in_every_movement,
    } = props;
    setUpdateMinorCategory({
      status: true,
      id: id,
      // division_id: division?.id,
      // division_name: division?.division_name,
      major_category,
      account_title,
      minor_category_name: minor_category_name,
      // urgency_level: urgency_level,
      // personally_assign: personally_assign,
      // evaluate_in_every_movement: evaluate_in_every_movement,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateMinorCategory({
      status: false,
      id: null,
      // division_id: "",
      // major_category_id: "",
      major_category_id: null,
      account_title_sync_id: null,
      minor_category_name: "",
      // urgency_level: "",
      // personally_assign: null,
      // evaluate_in_every_movement: null,
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  // console.log(minorCategoryData);

  return (
    <Stack className="category_height">
      {minorCategoryLoading && <MasterlistSkeleton category onAdd={true} />}

      {minorCategoryError && <ErrorFetching refetch={refetch} category={minorCategoryData} error={errorData} />}

      {minorCategoryData && !minorCategoryError && (
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
                    <TableCell className="tbl-cell-category text-center">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        ID No.
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `minor_category_name`}
                        direction={orderBy === `minor_category_name` ? order : `asc`}
                        onClick={() => onSort(`minor_category_name`)}
                      >
                        Minor Category
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `major_category_name`}
                        direction={orderBy === `major_category_name` ? order : `asc`}
                        onClick={() => onSort(`major_category_name`)}
                      >
                        Major Category
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">Accounting Entries</TableCell>

                    {/* <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `division_name`}
                        direction={orderBy === `division_name` ? order : `asc`}
                        onClick={() => onSort(`division_name`)}
                      >
                        Division
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-category text-center">Status</TableCell>

                    <TableCell className="tbl-cell-category text-center">
                      <TableSortLabel
                        active={orderBy === `created_at`}
                        direction={orderBy === `created_at` ? order : `asc`}
                        onClick={() => onSort(`created_at`)}
                      >
                        Date Created
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="tbl-cell-category  text-center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {minorCategoryData.data.length === 0 ? (
                    <NoRecordsFound heightData="small" />
                  ) : (
                    <>
                      {minorCategorySuccess &&
                        [...minorCategoryData.data].sort(comparator(order, orderBy))?.map((data) => (
                          <TableRow
                            key={data.id}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell-category tr-cen-pad45">{data.id}</TableCell>

                            <TableCell className="tbl-cell-category text-weight capitalized">
                              {data.minor_category_name}
                            </TableCell>

                            <TableCell className="tbl-cell-category capitalized">
                              {data.major_category.major_category_name}
                            </TableCell>

                            <TableCell className="tbl-cell-category capitalized">
                              <Typography fontSize={11} color="secondary.light" noWrap>
                                Inital Debit : ({data.initial_debit?.account_title_code})-
                                {data.initial_debit?.account_title_name}
                              </Typography>
                              <Typography fontSize={11} color="secondary.light" noWrap>
                                Inital Credit : ({data.initial_credit?.account_title_code})-{" "}
                                {data.initial_credit?.account_title_name}
                              </Typography>
                              <Typography fontSize={11} color="secondary.light" noWrap>
                                Depreciation Debit : ({data.depreciation_debit?.account_title_code})-
                                {data.depreciation_debit?.account_title_name}
                              </Typography>
                              <Typography fontSize={11} color="secondary.light" noWrap>
                                Depreciation Credit : ({data.depreciation_credit?.account_title_code})-{" "}
                                {data.depreciation_credit?.account_title_name}
                              </Typography>
                            </TableCell>

                            {/* <TableCell className="tbl-cell-category capitalized">
                                {data.division.division_name}
                              </TableCell> */}

                            <TableCell className="tbl-cell-category text-center">
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

                            <TableCell className="tbl-cell-category tr-cen-pad45">
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell-category text-center">
                              <ActionMenu
                                status={status}
                                data={data}
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
            total={minorCategoryData?.total}
            success={minorCategorySuccess}
            current_page={minorCategoryData?.current_page}
            per_page={minorCategoryData?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
          />

          <Dialog open={drawer} TransitionComponent={Grow} PaperProps={{ sx: { borderRadius: "10px" } }}>
            <AddMinorCategory data={updateMinorCategory} onUpdateResetHandler={onUpdateResetHandler} />
          </Dialog>
        </Box>
      )}
    </Stack>
  );
};

export default MinorCategory;
