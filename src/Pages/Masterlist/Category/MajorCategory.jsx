import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import AddMajorCategory from "../AddEdit/AddMajorCategory";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";
import NoRecordsFound from "../../../Layout/NoRecordsFound";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { closeConfirm, openConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import {
  useGetMajorCategoryApiQuery,
  usePutMajorCategoryStatusApiMutation,
} from "../../../Redux/Query/Masterlist/Category/MajorCategory";

// MUI
import {
  Box,
  Chip,
  Dialog,
  Stack,
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

const MajorCategory = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateMajorCategory, setUpdateMajorCategory] = useState({
    status: false,
    id: null,
    // division_id: "",
    major_category_name: "",
  });

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

  const drawer = useSelector((state) => state.booleanState.drawer);

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const onSetPage = () => {
    setPage(1);
  };

  // CRUD -------------------------------------------

  const {
    data: majorCategoryData,
    isLoading: majorCategoryLoading,
    isSuccess: majorCategorySuccess,
    isError: majorCategoryError,
    error: errorData,
    refetch,
  } = useGetMajorCategoryApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [putMajorCategoryStatusApi, { isLoading }] = usePutMajorCategoryStatusApiMutation();

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
            const result = await putMajorCategoryStatusApi({
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
    const { id, major_category_name, est_useful_life, division } = props;
    setUpdateMajorCategory({
      status: true,
      id: id,
      major_category_name: major_category_name,
      est_useful_life: est_useful_life,
      // division_id: division?.id,
      // division_name: division?.division_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateMajorCategory({
      status: false,
      id: null,
      major_category_name: "",
      est_useful_life: null,
      // division_id: null,
    });
  };

  return (
    <Stack sx={{ height: "calc(100vh - 255px)" }}>
      {majorCategoryLoading && <MasterlistSkeleton category={true} onAdd={true} />}

      {majorCategoryError && <ErrorFetching refetch={refetch} category={majorCategoryData} error={errorData} />}

      {majorCategoryData && !majorCategoryError && (
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
                        active={orderBy === `major_category_name`}
                        direction={orderBy === `major_category_name` ? order : `asc`}
                        onClick={() => onSort(`major_category_name`)}
                      >
                        Major Category
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `est_useful_life`}
                        direction={orderBy === `est_useful_life` ? order : `asc`}
                        onClick={() => onSort(`est_useful_life`)}
                      >
                        Estimated Useful Life
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `division_id`}
                        direction={orderBy === `division_id` ? order : `asc`}
                        onClick={() => onSort(`division_id`)}
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
                  {majorCategoryData.data.length === 0 ? (
                    <NoRecordsFound category />
                  ) : (
                    <>
                      {majorCategorySuccess &&
                        [...majorCategoryData.data].sort(comparator(order, orderBy))?.map((data) => (
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

                            <TableCell className="tbl-cell-category text-weight ">{data.major_category_name}</TableCell>

                            <TableCell className="tbl-cell-category ">{data.est_useful_life}</TableCell>

                            {/* <TableCell
                                className="tbl-cell-category"
                                sx={{ textTransform: "capitalize" }}
                              >
                                {data.division.division_name}
                              </TableCell> */}

                            <TableCell className="tbl-cell-category text-center capitalized">
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

          <Box className="mcontainer__pagination">
            <TablePagination
              rowsPerPageOptions={[
                5, 10, 15, 50,
                // {
                //   label: "All",
                //   value: parseInt(majorCategoryData?.total),
                // },
              ]}
              component="div"
              count={majorCategorySuccess ? majorCategoryData.total : 0}
              page={majorCategorySuccess ? majorCategoryData.current_page - 1 : 0}
              rowsPerPage={majorCategorySuccess ? parseInt(majorCategoryData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>

          <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
            <AddMajorCategory data={updateMajorCategory} onUpdateResetHandler={onUpdateResetHandler} />
          </Dialog>
        </Box>
      )}
    </Stack>
  );
};

export default MajorCategory;
