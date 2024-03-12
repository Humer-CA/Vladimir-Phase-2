import React, { useState } from "react";
import "../../Style/Capex/CapexCollapsableTable.scss";

import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../ErrorFetching";
import AddCapex from "./AddEdit/AddCapex";
import CapexCollapsableTable from "../Masterlist/Capex/CapexCollapsableTable";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ImportCapex from "./Capex/ImportCapex";
import ExportCapex from "./Capex/ExportCapex";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";

import {
  useGetCapexAllApiQuery,
  useGetCapexApiQuery,
  useLazyGetCapexAllApiQuery,
  usePatchCapexStatusApiMutation,
} from "../../Redux/Query/Masterlist/Capex";

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

import { ExpandCircleDown, ExpandCircleDownOutlined, Help, IosShareRounded, ReportProblem } from "@mui/icons-material";
import useExcel from "../../Hooks/Xlsx";

import { openExport, closeImport } from "../../Redux/StateManagement/booleanStateSlice";

const Capex = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateCapex, setUpdateCapex] = useState({
    status: false,
    id: null,
    capex: "",
    project_name: "",
  });

  const { excelExport } = useExcel();

  const drawer = useSelector((state) => state.booleanState.drawer);
  const importFile = useSelector((state) => state.booleanState.importFile);
  // const exportFile = useSelector((state) => state.booleanState.exportFile);

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

  const {
    data: capexData,
    isLoading: capexLoading,
    isSuccess: capexSuccess,
    isError: capexError,
    error: errorData,
    refetch,
  } = useGetCapexApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [capexExportTrigger, { data: capexAllData, refetch: capexRefetchAll }] = useLazyGetCapexAllApiQuery();

  const [patchCapexStatusApi, { isLoading }] = usePatchCapexStatusApiMutation();

  const dispatch = useDispatch();

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
            const result = await patchCapexStatusApi({
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
    const { id, capex, project_name } = props;
    setUpdateCapex({
      status: true,
      id: id,
      capex: capex,
      project_name: project_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateCapex({
      status: false,
      id: null,
      capex: "",
      project_name: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const res = await capexExportTrigger().unwrap();

      if (!Array.isArray(res)) {
        console.error("Expected an array in the response");
        return;
      }

      const exportData = res?.flatMap((item) => {
        if (Array.isArray(item.sub_capex) && item.sub_capex.length > 0) {
          return item.sub_capex?.map((subItem) => ({
            ID: item.id,
            CAPEX: item.capex,
            "PROJECT NAME": item.project_name,
            "SUB CAPEX ID": subItem.capex_id || "-",
            "SUB CAPEX": item.capex + "-" + subItem.sub_capex || "-",
            "SUB PROJECT": subItem.sub_project || "-",
            Status: subItem.is_active === 1 ? "Active" : "Deactivated",
          }));
        } else {
          return {
            ID: item.id,
            CAPEX: item.capex,
            "PROJECT NAME": item.project_name,
            "SUB CAPEX ID": "-",
            "SUB CAPEX": "-",
            "SUB PROJECT": "-",
            Status: item.is_active === 1 ? "Active" : "Deactivated",
          };
        }
      });

      excelExport(exportData, `Vladimir-Capex.xlsx`);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCloseImport = () => {
    dispatch(closeImport());
  };

  // const handleExport = () => {
  //   dispatch(openExport());
  // };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton, Roboto, Helvetica", fontSize: "2rem" }}>
        Capex
      </Typography>

      {capexLoading && <MasterlistSkeleton onAdd={true} onImport={true} />}

      {capexError && <ErrorFetching refetch={refetch} error={errorData} />}

      {capexData && !capexError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              path="#"
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              onAdd={() => {}}
              onImport={() => {}}
            />

            <Box>
              <TableContainer className="mcontainer__th-body">
                <Table className="mcontainer__table" stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          color: "secondary.main",
                          position: "relative",
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

                      <TableCell className="tbl-cell-col text-center">
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
                          active={orderBy === `capex`}
                          direction={orderBy === `capex` ? order : `asc`}
                          onClick={() => onSort(`capex`)}
                        >
                          CAPEX
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell-col">
                        <TableSortLabel
                          active={orderBy === `project_name`}
                          direction={orderBy === `project_name` ? order : `asc`}
                          onClick={() => onSort(`project_name`)}
                        >
                          Project Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell-col text-center">
                        <TableSortLabel
                          active={orderBy === `capex`}
                          direction={orderBy === `capex` ? order : `asc`}
                          onClick={() => onSort(`capex`)}
                        >
                          Active Sub Capex
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell-col text-center">Status</TableCell>

                      <TableCell className="tbl-cell-col text-center">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Created
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className=" tbl-cell-col">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {capexData?.data?.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {capexData &&
                          [...capexData.data]
                            .sort(comparator(order, orderBy))
                            ?.map((data) => (
                              <CapexCollapsableTable
                                key={data.id}
                                data={data}
                                status={status}
                                onUpdateHandler={onUpdateHandler}
                                onArchiveRestoreHandler={onArchiveRestoreHandler}
                              />
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

              <TablePagination
                rowsPerPageOptions={[
                  5, 10, 15, 100,
                  // { label: "All", value: parseInt(capexData?.total) }
                ]}
                component="div"
                count={capexSuccess ? capexData?.total : 0}
                page={capexSuccess ? capexData?.current_page - 1 : 0}
                rowsPerPage={capexSuccess ? parseInt(capexData?.per_page) : 5}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}

      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddCapex data={updateCapex} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>

      <Dialog
        open={importFile}
        onClose={handleCloseImport}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            padding: "5px 20px",
            minWidth: "30%",
            width: "80%",
            overflow: "hidden",
          },
        }}
      >
        <ImportCapex />
      </Dialog>

      {/* <Dialog
        open={exportFile}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "0",
            maxWidth: "90%",
            padding: "20px",
            backgroundColor: "background.light",
          },
        }}
      >
        <ExportCapex />
      </Dialog> */}
    </Box>
  );
};

export default Capex;
