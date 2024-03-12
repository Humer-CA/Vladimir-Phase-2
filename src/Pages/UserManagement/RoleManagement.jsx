import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddRole from "../Masterlist/AddEdit/AddRole";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { openDrawer } from "../../Redux/StateManagement/booleanStateSlice";

import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import { usePostRoleStatusApiMutation, useGetRoleApiQuery } from "../../Redux/Query/UserManagement/RoleManagementApi";

import { useSelector } from "react-redux";

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
import { Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import NoRecordsFound from "../../Layout/NoRecordsFound";

const Role = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateRole, setUpdateRole] = useState({
    status: false,
    action: "",
    id: null,
    role_name: "",
    access_permission: [],
  });

  const drawer = useSelector((state) => state.booleanState.drawer);
  const dispatch = useDispatch();

  // Table Sorting
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

  const {
    data: roleData,
    isLoading: roleLoading,
    isSuccess: roleSuccess,
    isError: roleError,
    error: errorData,
    refetch,
  } = useGetRoleApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postRoleStatusApi, { isLoading }] = usePostRoleStatusApiMutation();

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
            const result = await postRoleStatusApi({
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
            // console.log(err.message);
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
    const { id, role_name, access_permission } = props;
    setUpdateRole({
      status: true,
      action: "updateRole",
      id: id,
      role_name: role_name,
      access_permission: access_permission,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRole({
      status: false,
      id: null,
      role_name: "",
      access_permission: null,
    });
  };

  const onViewRoleHandler = (props) => {
    const { id, role_name, access_permission } = props;
    setUpdateRole({
      status: true,
      action: "view",
      id: id,
      role_name: role_name,
      access_permission: access_permission,
    });
  };

  const handleViewRole = (data) => {
    onViewRoleHandler(data);
    dispatch(openDrawer());
    dispatch(closeConfirm());
  };

  const onSetPage = () => {
    setPage(1);
  };

  // console.log(roleError);

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Role Management
      </Typography>

      {roleLoading && <MasterlistSkeleton onAdd={true} />}

      {roleError && <ErrorFetching refetch={refetch} error={errorData} />}

      {roleData && !roleError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
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
                        active={orderBy === `role_name`}
                        direction={orderBy === `role_name` ? order : `asc`}
                        onClick={() => onSort(`role_name`)}
                      >
                        Role
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell text-center">Access Permission</TableCell>

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
                  {roleData.data.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {roleSuccess &&
                        [...roleData.data].sort(comparator(order, orderBy))?.map((data) => (
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

                            <TableCell className="tbl-cell text-weight capitalized">{data.role_name}</TableCell>

                            <TableCell className="tbl-cell text-center">
                              <Button
                                sx={{
                                  textTransform: "capitalize",
                                  textDecoration: "underline",
                                }}
                                variant="text"
                                size="small"
                                color="link"
                                onClick={() => handleViewRole(data)}
                              >
                                View
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
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell text-center">
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
                5, 10, 15, 100,
                //  { label: "All", value: parseInt(roleData?.total) }
              ]}
              component="div"
              count={roleSuccess ? roleData.total : 0}
              page={roleSuccess ? roleData.current_page - 1 : 0}
              rowsPerPage={roleSuccess ? parseInt(roleData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </Box>
      )}
      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddRole data={updateRole} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </Box>
  );
};

export default Role;
