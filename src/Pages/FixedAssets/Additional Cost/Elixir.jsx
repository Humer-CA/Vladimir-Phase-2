import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import useExcel from "../../../Hooks/Xlsx";
import * as XLSX from "xlsx";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import {
  usePostUserStatusApiMutation,
  useResetUserApiMutation,
  useGetUserAccountsApiQuery,
  useLazyGetUserAccountAllApiQuery,
} from "../../../Redux/Query/UserManagement/UserAccountsApi";
import { useSelector } from "react-redux";

// MUI
import {
  Box,
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
import moment from "moment";
import { useGetElixirApiQuery } from "../../../Redux/Query/Systems/Elixir";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

const Elixir = () => {
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

  const {
    data: elixirData,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetElixirApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const data = elixirData?.assetTag;

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
    <Stack sx={{ height: "calc(100vh - 255px)" }}>
      {isLoading && <MasterlistSkeleton category={true} onAdd={true} />}

      {isError && <ErrorFetching refetch={refetch} category={data} error={error} />}

      {data && !isError && (
        <Box className="mcontainer__wrapper">
          {/* <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            onAdd={() => {}}
          /> */}
          <Box py={1} />

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
                        Asset Tag
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `est_useful_life`}
                        direction={orderBy === `est_useful_life` ? order : `asc`}
                        onClick={() => onSort(`est_useful_life`)}
                      >
                        Customer
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `division_id`}
                        direction={orderBy === `division_id` ? order : `asc`}
                        onClick={() => onSort(`division_id`)}
                      >
                        Item Description
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-category">Warehouse</TableCell>
                    <TableCell className="tbl-cell-category">PR/PO</TableCell>
                    <TableCell className="tbl-cell-category text-center">Served</TableCell>
                    <TableCell className="tbl-cell-category text-center">UOM</TableCell>

                    <TableCell className="tbl-cell-category">
                      <TableSortLabel
                        active={orderBy === `created_at`}
                        direction={orderBy === `created_at` ? order : `asc`}
                        onClick={() => onSort(`created_at`)}
                      >
                        Date Created
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-category  text-center">Action</TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.length === 0 ? (
                    <NoRecordsFound heightData="small" />
                  ) : (
                    <>
                      {isSuccess &&
                        [...data].sort(comparator(order, orderBy))?.map((data, index) => (
                          <TableRow
                            key={index}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell-category tr-cen-pad45">{data.mirId}</TableCell>

                            <TableCell className="tbl-cell-category text-weight ">{data.assetTag}</TableCell>

                            <TableCell className="tbl-cell-category">
                              <Typography fontWeight={600} fontSize="14px">
                                {data.customerCode}
                              </Typography>
                              <Typography fontSize="12px" noWrap>
                                {data.customerName}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell-category ">
                              <Typography fontWeight={600} fontSize="14px">
                                {data.itemCode}
                              </Typography>
                              <Typography fontSize="12px" noWrap>
                                {data.itemDescription}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell-category">{data.wareHouseId}</TableCell>

                            <TableCell className="tbl-cell-category">
                              <Typography fontSize="12px" noWrap>
                                PR - {data.prNumber}
                              </Typography>
                              <Typography fontSize="12px" noWrap>
                                PO - {data.poNumber}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell-category" align="center">
                              {data.servedQuantity}
                            </TableCell>
                            <TableCell className="tbl-cell-category" align="center">
                              {data.uom}
                            </TableCell>

                            <TableCell className="tbl-cell-category">
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            {/* <TableCell className="tbl-cell-category text-center">
                              <ActionMenu
                                status={status}
                                data={data}
                                onUpdateHandler={onUpdateHandler}
                                onArchiveRestoreHandler={onArchiveRestoreHandler}
                              />
                            </TableCell> */}
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <CustomTablePagination
            total={elixirData?.totalPages}
            success={isSuccess}
            current_page={elixirData?.currentPage}
            per_page={elixirData?.perPage}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
          />

          <Dialog open={drawer} TransitionComponent={Grow} PaperProps={{ sx: { borderRadius: "10px" } }}>
            {/* <AddMajorCategory data={updateMajorCategory} onUpdateResetHandler={onUpdateResetHandler} /> */}
          </Dialog>
        </Box>
      )}
    </Stack>
  );
};

export default Elixir;
