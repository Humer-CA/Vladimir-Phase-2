import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import ErrorFetching from "../../ErrorFetching";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";

// MUI
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Help, LibraryAdd, Output, Report, ReportProblem, Visibility } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";

import { useGetAssetReleasingQuery } from "../../../Redux/Query/Request/AssetReleasing";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AddReleasingInfo from "./AddReleasingInfo";

const schema = yup.object().shape({
  warehouse_number_id: yup.array(),
});

const ReleasingTable = (props) => {
  const { released } = props;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [wNumber, setWNumber] = useState([]);

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const dialog = useSelector((state) => state.booleanState.dialog);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setError,
    register,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      warehouse_number_id: [],
    },
  });

  //* Table Sorting -------------------------------------------------------
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

  //* Table Properties ---------------------------------------------------
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: releasingData,
    isLoading: releasingLoading,
    isSuccess: releasingSuccess,
    isError: releasingError,
    error: errorData,
    refetch,
  } = useGetAssetReleasingQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
      released: released ? 1 : 0,
    },
    { refetchOnMountOrArgChange: true }
  );

  const dispatch = useDispatch();

  const handleReleasing = () => {
    setWNumber({
      warehouse_number_id: watch("warehouse_number_id"),
    });
    dispatch(openDialog());
  };
  const handleViewData = (data) => {
    navigate(`/asset-requisition/requisition-releasing/${data.warehouse_number?.warehouse_number}`, {
      state: { ...data },
    });
  };

  const warehouseNumberAllHandler = (checked) => {
    if (checked) {
      setValue(
        "warehouse_number_id",
        releasingData.data?.map((item) => item.warehouse_number?.warehouse_number)
      );
    } else {
      reset({ warehouse_number_id: [] });
    }
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Stack sx={{ height: "calc(100vh - 250px)" }}>
      {releasingLoading && <MasterlistSkeleton onAdd={true} category />}
      {releasingError && <ErrorFetching refetch={refetch} error={errorData} />}
      {releasingData && !releasingError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar onStatusChange={setStatus} onSearchChange={setSearch} onSetPage={setPage} hideArchive />
            {!released && (
              <Button
                variant="contained"
                onClick={() => handleReleasing()}
                size="small"
                startIcon={<Output />}
                sx={{ position: "absolute", right: 0, top: -40 }}
              >
                Release
              </Button>
            )}
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
                      {!released && (
                        <TableCell align="center">
                          <FormControlLabel
                            sx={{ margin: "auto", align: "center" }}
                            control={
                              <Checkbox
                                value=""
                                size="small"
                                checked={
                                  !!releasingData?.data
                                    ?.map((mapItem) => mapItem?.warehouse_number?.warehouse_number)
                                    ?.every((item) => watch("warehouse_number_id").includes(item))
                                }
                                onChange={(e) => {
                                  warehouseNumberAllHandler(e.target.checked);
                                  // console.log(e.target.checked);
                                }}
                              />
                            }
                          />
                        </TableCell>
                      )}
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `warehouse_number`}
                          direction={orderBy === `warehouse_number` ? order : `asc`}
                          onClick={() => onSort(`warehouse_number`)}
                        >
                          Warehouse No.
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `warehouse_number`}
                          direction={orderBy === `warehouse_number` ? order : `asc`}
                          onClick={() => onSort(`warehouse_number`)}
                        >
                          Type of Request
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `vladimir_tag_number`}
                          direction={orderBy === `vladimir_tag_number` ? order : `asc`}
                          onClick={() => onSort(`vladimir_tag_number`)}
                        >
                          Vladimir Tag Number
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">Oracle No.</TableCell>

                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `requestor`}
                          direction={orderBy === `requestor` ? order : `asc`}
                          onClick={() => onSort(`requestor`)}
                        >
                          Requestor
                        </TableSortLabel>
                      </TableCell>

                      {released && (
                        <TableCell className="tbl-cell">
                          <TableSortLabel
                            active={orderBy === `received_by`}
                            direction={orderBy === `received_by` ? order : `asc`}
                            onClick={() => onSort(`received_by`)}
                          >
                            Received By
                          </TableSortLabel>
                        </TableCell>
                      )}

                      <TableCell className="tbl-cell">Accountability</TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Created
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {releasingData?.data?.length === 0 ? (
                      <NoRecordsFound category />
                    ) : (
                      <>
                        {releasingSuccess &&
                          [...releasingData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              hover
                              // onClick={() => handleViewData(data)}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                                cursor: "pointer",
                              }}
                            >
                              {!released && (
                                <TableCell align="center">
                                  <FormControlLabel
                                    value={data.warehouse_number?.warehouse_number}
                                    sx={{ margin: "auto" }}
                                    disabled={data.action === "view"}
                                    control={
                                      <Checkbox
                                        size="small"
                                        {...register("warehouse_number_id")}
                                        checked={watch("warehouse_number_id").includes(
                                          data.warehouse_number?.warehouse_number
                                        )}
                                      />
                                    }
                                  />
                                </TableCell>
                              )}
                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell">
                                {data.warehouse_number?.warehouse_number}
                              </TableCell>
                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell">
                                <Typography fontSize={12} fontWeight={600} color="primary.main">
                                  {data.type_of_request?.type_of_request_name}
                                </Typography>
                                <Typography fontSize={14} fontWeight={600}>
                                  {data.asset_description}
                                </Typography>
                                <Typography fontSize={14}>{data.asset_specification}</Typography>
                              </TableCell>

                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell text-weight">
                                <Typography fontSize={14}>{data.vladimir_tag_number}</Typography>
                              </TableCell>
                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell">
                                <Typography fontSize={12} color="text.light">
                                  PR - {data.pr_number}
                                </Typography>
                                <Typography fontSize={12} color="text.light">
                                  PO - {data.po_number}
                                </Typography>
                                <Typography fontSize={12} color="text.light">
                                  RR - {data.rr_number}
                                </Typography>
                              </TableCell>

                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell">
                                <Typography fontSize={10} color="gray">
                                  ({data.company?.company_code}) - {data.company?.company_name}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  ({data.department?.department_code}) - {data.department?.department_name}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  ({data.location?.location_code}) - {data.location?.location_name}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  ({data.account_title?.account_title_code}) - {data.account_title?.account_title_name}
                                </Typography>
                              </TableCell>

                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell ">
                                {`(${data.requestor?.employee_id}) - ${data.requestor?.firstname} ${data.requestor?.lastname}`}
                              </TableCell>

                              {released && (
                                <TableCell onClick={() => handleViewData(data)} className="tbl-cell ">
                                  {data.received_by}
                                </TableCell>
                              )}

                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell">
                                <Typography fontSize={14} fontWeight={600}>
                                  {data.accountability}
                                </Typography>
                                <Typography fontSize={12}>{data.accountable}</Typography>
                              </TableCell>
                              <TableCell onClick={() => handleViewData(data)} className="tbl-cell tr-cen-pad45">
                                {Moment(data.created_at).format("MMM DD, YYYY")}
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
              total={releasingData?.total}
              success={releasingSuccess}
              current_page={releasingData?.current_page}
              per_page={releasingData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}

      <Dialog
        open={dialog}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "0",
            maxWidth: "90%",
            padding: "20px",
            overflow: "hidden",
            width: "400px",
          },
        }}
      >
        <AddReleasingInfo data={releasingData} warehouseNumber={wNumber} />
      </Dialog>
    </Stack>
  );
};

export default ReleasingTable;
