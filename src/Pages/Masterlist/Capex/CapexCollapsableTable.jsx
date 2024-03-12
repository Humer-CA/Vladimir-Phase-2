import React, { useEffect, useState } from "react";
import "../../../Style/Capex/CapexCollapsableTable.scss";
import { useSelector, useDispatch } from "react-redux";
import { openCollapse } from "../../../Redux/StateManagement/collapseCapexSlice";
import NoDataFile from "../../../Img/PNG/no-data.png";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import Moment from "moment";

import {
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import {
  AddBox,
  CreditCard,
  Help,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ReportProblem,
  TitleRounded,
} from "@mui/icons-material";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { usePatchSubCapexStatusApiMutation } from "../../../Redux/Query/Masterlist/Capex";
import { useGetSubCapexApiQuery } from "../../../Redux/Query/Masterlist/SubCapex";
import AddSubCapex from "../AddEdit/AddSubCapex";
import { openDialog } from "../../../Redux/StateManagement/dialogSlice";

const CustomTableCollapse = (props) => {
  const { data, status, onUpdateHandler, onArchiveRestoreHandler } = props;
  const [subCapexDialog, setSubCapexDialog] = useState(false);

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateSubCapex, setUpdateSubCapex] = useState({
    status: false,
    id: null,
    capex_id: null,
    sub_capex: "",
    sub_project: "",
  });

  const dispatch = useDispatch();

  const openCollapsable = useSelector((state) => state.collapseCapex);

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

  // Table Data --------------------------------
  const {
    data: subCapexData,
    isLoading: subCapexLoading,
    isSuccess: subCapexSuccess,
    isError: subCapexError,
    refetch,
  } = useGetSubCapexApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [patchSubCapexStatusApi, { isLoading }] = usePatchSubCapexStatusApiMutation();

  // Functions ----------------------------------------------------------------
  const dataId = openCollapsable === data?.id;

  // console.log(data);

  const onSubCapexArchiveRestoreHandler = async (id, subCapexStatus) => {
    // console.log(id);
    // console.log(subCapexStatus);
    dispatch(
      openConfirm({
        icon: subCapexStatus === "active" ? ReportProblem : Help,
        iconColor: subCapexStatus === "active" ? "alert" : "info",
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
              {subCapexStatus === "active" ? "ARCHIVE" : "ACTIVATE"}
            </Typography>{" "}
            this data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await patchSubCapexStatusApi({
              id: id,
              status: subCapexStatus === "active" ? false : true,
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
            } else if (err?.is_active !== 422) {
              dispatch(
                openToast({
                  message: "Something went wrong. Please try again.",
                  duration: 5000,
                  variant: "error",
                })
              );
            }
            console.log(err);
          }
        },
      })
    );
  };

  const onUpdateSubCapexHandler = (props) => {
    const { id, capex_id, sub_capex, sub_project } = props;
    setUpdateSubCapex({
      status: true,
      id: id,
      capex_id: capex_id,
      sub_capex: sub_capex,
      sub_project: sub_project,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateSubCapex({
      status: false,
      id: null,
      capex_id: null,
      sub_capex: "",
      sub_project: "",
    });
  };

  const handleOpenAddSubCapex = () => {
    setSubCapexDialog(true);
  };

  return (
    <>
      <TableRow className={dataId ? "tbl-row-collapsed" : "tbl-row"}>
        <TableCell className="tbl-cell-col text-center">
          <IconButton
            size="small"
            sx={dataId ? { color: "primary.main" } : null}
            onClick={() => dispatch(openCollapse(data?.id))}
          >
            {dataId ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell className="tbl-cell-col tr-cen-pad45" sx={dataId ? { color: "white" } : null}>
          {data.id}
        </TableCell>

        <TableCell className="tbl-cell-col" sx={dataId ? { color: "white" } : null}>
          {data.capex}
        </TableCell>

        <TableCell className="tbl-cell-col" sx={dataId ? { color: "white" } : null}>
          {data.project_name}
        </TableCell>

        <TableCell className="tbl-cell-col tr-cen-pad45" sx={dataId ? { color: "white" } : null}>
          {/* <Chip
            label={data.sub_capex_count === 0 ? "-" : data.sub_capex_count}
            sx={{
              backgroundColor: "background.light",
              color: "secondary.main",
            }}
          /> */}
          {data.sub_capex_count === 0 ? "-" : data.sub_capex_count}
        </TableCell>

        <TableCell className="tbl-cell-col  text-center" sx={dataId ? { color: "white" } : null}>
          {data.is_active ? (
            <Chip
              size="small"
              variant="contained"
              sx={
                dataId
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
                dataId
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

        <TableCell className="tbl-cell-col tr-cen-pad45" sx={dataId ? { color: "white" } : null}>
          {Moment(data.created_at).format("MMM DD, YYYY")}
        </TableCell>

        <TableCell className="tbl-cell-col">
          <ActionMenu
            status={status}
            data={data}
            openCollapse={dataId}
            onUpdateHandler={onUpdateHandler}
            onArchiveRestoreHandler={onArchiveRestoreHandler}
          />
        </TableCell>
      </TableRow>

      {/* Sub-Capex ----------------------------------------------*/}
      <TableRow
        sx={
          dataId
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
          <Collapse in={dataId} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Chip
                icon={<CreditCard />}
                label={data.capex + " - " + data.project_name}
                sx={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "secondary.main",
                  backgroundColor: "primary.light",
                  fontStyle: "italic",
                  mb: "5px",
                  px: "10px",
                }}
              />
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
                        Sub Capex
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-col">
                      <TableSortLabel
                        active={orderBy === `sub_project`}
                        direction={orderBy === `sub_project` ? order : `asc`}
                        onClick={() => onSort(`sub_project`)}
                      >
                        Sub Project Name
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

                    <TableCell className="tbl-cell-col text-center">Action</TableCell>

                    {/* <TableCell className="tbl-cell-col">Date Created</TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.sub_capex?.length === 0 ? (
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
                      {[...data.sub_capex].sort(comparator(order, orderBy))?.map((subCapex) => (
                        <TableRow
                          key={subCapex.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell className="tbl-cell-col tr-cen-pad45">{subCapex.id}</TableCell>

                          <TableCell className="tbl-cell-col">{data.capex + "-" + subCapex.sub_capex}</TableCell>

                          <TableCell className="tbl-cell-col">{subCapex.sub_project}</TableCell>

                          <TableCell className="tbl-cell-col text-center">
                            {subCapex.is_active ? (
                              <Chip
                                size="small"
                                variant="contained"
                                sx={
                                  dataId
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
                            {Moment(subCapex.created_at).format("MMM DD, YYYY")}
                          </TableCell>

                          <TableCell className="tbl-cell-col text-center">
                            <ActionMenu
                              status={subCapex.is_active ? "active" : "deactivated"}
                              data={subCapex}
                              setSubCapexDialog={setSubCapexDialog}
                              onUpdateHandler={onUpdateSubCapexHandler}
                              onArchiveRestoreHandler={onSubCapexArchiveRestoreHandler}
                              hideEdit
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}

                  {status === "active" ? (
                    <TableRow>
                      <TableCell
                        colSpan={999}
                        sx={{ borderBottom: 0, position: "relative" }}
                        onClick={handleOpenAddSubCapex}
                      >
                        <Stack
                          flexDirection="row"
                          // justifyContent="center"
                          alignItems="center"
                          sx={{
                            position: "sticky",
                            right: 0,
                            cursor: "pointer",
                            ":hover": {
                              backgroundColor: "lightgray",
                              borderRadius: "10px",
                            },
                          }}
                        >
                          <IconButton>
                            <AddBox color="primary" />
                          </IconButton>
                          <Typography variant="p" sx={{ mt: "2px" }}>
                            Add Sub Capex
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog open={subCapexDialog} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddSubCapex
          data={updateSubCapex}
          capexId={data?.id}
          capex={data?.capex}
          setSubCapexDialog={setSubCapexDialog}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>
    </>
  );
};

export default CustomTableCollapse;
