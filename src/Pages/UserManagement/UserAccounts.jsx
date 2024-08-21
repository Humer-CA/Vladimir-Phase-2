import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddUserAccounts from "../Masterlist/AddEdit/AddUserAccount";
import useExcel from "../../Hooks/Xlsx";
import * as XLSX from "xlsx";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";
import {
  usePostUserStatusApiMutation,
  useResetUserApiMutation,
  useGetUserAccountsApiQuery,
  useLazyGetUserAccountAllApiQuery,
} from "../../Redux/Query/UserManagement/UserAccountsApi";
import { useSelector } from "react-redux";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
  Drawer,
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
import { Help, IosShareRounded, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import moment from "moment";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";

const UserAccounts = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateUser, setUpdateUser] = useState({
    status: false,
    id: null,
    employee_id: "",
    firstname: "",
    lastname: "",
    company_id: null,
    business_unit_id: null,
    department_id: null,
    unit_id: null,
    subunit_id: null,
    location_id: null,
    username: "",
    role_id: null,
  });

  const { excelExport } = useExcel();

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
    data: users,
    isLoading: usersLoading,
    isSuccess: usersSuccess,
    isError: usersError,
    error: errorData,
    refetch,
  } = useGetUserAccountsApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [userDataTrigger, { data: usersAllData, isLoading: usersAllLoading, refetch: usersRefetch }] =
    useLazyGetUserAccountAllApiQuery();

  const [postUserStatusApi, { isLoading: isPostUserLoading }] = usePostUserStatusApiMutation();
  const [resetUserApi] = useResetUserApiMutation();

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
            const result = await postUserStatusApi({
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
            console.log(err);
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
      employee_id,
      firstname,
      lastname,
      company,
      business_unit,
      department,
      unit,
      subunit,
      location,
      username,
      role,
      role_id,
    } = props;
    setUpdateUser({
      status: true,
      id: id,
      employee_id,
      firstname,
      lastname,
      company,
      business_unit,
      department,
      unit,
      subunit,
      location,
      username,
      role,
      role_id,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateUser({
      status: false,
      id: null,
      employee_id: null,
      firstname: "",
      lastname: "",
      company: null,
      business_unit: null,
      department: null,
      unit: null,
      subunit: null,
      location: null,
      username: "",
      role_id: null,
    });
  };

  const onResetHandler = async (id) => {
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
              }}
            >
              RESET
            </Typography>{" "}
            this user password?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await resetUserApi({
              id: id,
            }).unwrap();
            // console.log(result);

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
            console.log(err.message);
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

  const handleExport = async () => {
    try {
      const res = await userDataTrigger().unwrap();
      // console.log(res);
      const newObj = res?.map((item) => {
        return {
          ID: item?.id,
          "Employee ID": item?.employee_id,
          Firstname: item?.firstname,
          Lastname: item?.lastname,
          Company: `(${item?.company?.company_code}) -  ${item?.company?.company_name}`,
          "Business Unit": `(${item?.business_unit?.business_unit_code}) -  ${item?.business_unit?.business_unit_name}`,
          Department: `(${item?.department?.department_code}) -  ${item?.department?.department_name}`,
          Unit: `(${item?.unit?.unit_code}) -  ${item?.unit?.unit_name}`,
          "Sub Unit": `(${item?.subunit?.subunit_code}) -  ${item?.subunit?.subunit_name}`,
          Location: `(${item?.location?.location_code}) -  ${item?.location?.location_name}`,
          Username: item?.username,
          Role: item?.role?.role_name,
          Status: item?.is_active === true ? "Active" : "Inactive",
          "Created At": moment(item?.created_at).format("MMM DD, YYYY"),
          "Updated At": moment(item?.updated_at).format("MMM DD, YYYY"),
        };
      });

      await excelExport(newObj, "Vladimir-UserAccounts.xlsx");
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
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography sx={{ fontFamily: "Anton", fontSize: "2rem" }} className="mcontainer__title">
        User Accounts
      </Typography>

      {usersLoading && <MasterlistSkeleton onAdd={true} onImport={false} />}

      {usersError && <ErrorFetching refetch={refetch} error={errorData} />}

      {users && !usersError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            // onImport={() => {}}
            onAdd={() => {}}
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
                        active={orderBy === `firstname`}
                        direction={orderBy === `firstname` ? order : `asc`}
                        onClick={() => onSort(`firstname`)}
                      >
                        Employee
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel
                        active={orderBy === `username`}
                        direction={orderBy === `username` ? order : `asc`}
                        onClick={() => onSort(`username`)}
                      >
                        Username
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell">
                      <TableSortLabel
                        active={orderBy === `lastname`}
                        direction={orderBy === `lastname` ? order : `asc`}
                        onClick={() => onSort(`lastname`)}
                      >
                        Lastname
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell">
                      <TableSortLabel
                        active={orderBy === `subunit`}
                        direction={orderBy === `subunit` ? order : `asc`}
                        onClick={() => onSort(`subunit`)}
                      >
                        Sub Unit
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell">Role</TableCell>
                    <TableCell className="tbl-cell">Chart of Account</TableCell>
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

                    <TableCell className="tbl-cell text-center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.data.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {usersSuccess &&
                        [...users.data].sort(comparator(order, orderBy))?.map((users) => (
                          <TableRow
                            key={users.id}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell tr-cen-pad45">{users.id}</TableCell>
                            <TableCell className="tbl-cell" sx={{ textTransform: "capitalize" }}>
                              <Typography fontSize={14} fontWeight={600} color="secondary.main">
                                {users.firstname}
                              </Typography>
                              <Typography fontSize={12}>{users.lastname}</Typography>
                              <Typography fontSize={12} fontWeight={500} color="quaternary.main">
                                {users.employee_id}
                              </Typography>
                            </TableCell>
                            <TableCell className="tbl-cell">{users.username}</TableCell>

                            {/* <TableCell className="tbl-cell">
                              {users.subunit?.subunit_code} - {users.subunit?.subunit_name}
                            </TableCell> */}

                            <TableCell className="tbl-cell capitalized" sx={{ whiteSpace: "nowrap" }}>
                              {users.role.role_name}
                            </TableCell>
                            <TableCell className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${users.company?.company_code}) - ${users.company?.company_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${users.business_unit?.business_unit_code}) - ${users.business_unit?.business_unit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${users.department?.department_code}) - ${users.department?.department_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${users.unit?.unit_code}) - ${users.unit?.unit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${users.subunit?.subunit_code}) - ${users.subunit?.subunit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${users.location?.location_code}) - ${users.location?.location_name}`}
                              </Typography>
                            </TableCell>
                            <TableCell className="tbl-cell text-center">
                              {users.is_active ? (
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
                              {Moment(users.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell text-center">
                              <ActionMenu
                                status={status}
                                data={users}
                                onArchiveRestoreHandler={onArchiveRestoreHandler}
                                onUpdateHandler={onUpdateHandler}
                                onResetHandler={onResetHandler}
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

          <Box className="mcontainer__pagination-export">
            <Button
              className="mcontainer__export"
              variant="outlined"
              size="small"
              color="text"
              startIcon={<IosShareRounded color="primary" />}
              onClick={handleExport}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 20px",
              }}
            >
              EXPORT
            </Button>

            <CustomTablePagination
              total={users?.total}
              success={usersSuccess}
              current_page={users?.current_page}
              per_page={users?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
              removeShadow
            />
          </Box>
        </Box>
      )}

      {/* <Drawer anchor="right" open={drawer} onClose={() => {}}>
        <AddUserAccounts data={updateUser} onUpdateResetHandler={onUpdateResetHandler} />
      </Drawer> */}
      <Dialog
        open={drawer}
        TransitionComponent={Grow}
        onClose={() => {}}
        sx={{ ".MuiPaper-root": { borderRadius: "12px" } }}
      >
        <AddUserAccounts data={updateUser} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </Box>
  );
};

export default UserAccounts;
