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
import {
  useGetByTransactionApiQuery,
  useGetRequisitionApiQuery,
  usePatchRequisitionStatusApiMutation,
  useVoidRequisitionApiMutation,
} from "../../../Redux/Query/Request/Requisition";

// MUI
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  Grow,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Close, Help, IosShareRounded, Report, SyncOutlined, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { closeDialog, closeExport, openDialog, openExport } from "../../../Redux/StateManagement/booleanStateSlice";

import {
  useGetPrWithExportApiQuery,
  useLazyGetPrWithExportApiQuery,
} from "../../../Redux/Query/Request/PurchaseRequest";
import moment from "moment";
import ExportPr from "./ExportPr";

const PurchaseRequestReport = (props) => {
  const { received } = props;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [prItems, setPrItems] = useState([]);

  const userData = JSON.parse(localStorage.getItem("user"));

  const dialog = useSelector((state) => state.booleanState.dialog);
  const showExport = useSelector((state) => state.booleanState.exportFile);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

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
    data: prData,
    isLoading: prLoading,
    isSuccess: prSuccess,
    isError: prError,
    error: errorData,
    refetch,
  } = useGetPrWithExportApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const handleViewData = (data) => {
    dispatch(openDialog());
    setPrItems(data);
  };

  const openExportDialog = (data) => {
    dispatch(openExport());
    setPrItems(data);
  };

  const handleExport = async () => {
    try {
      const res = await exportTrigger().unwrap();
      // console.log(res);
      const newObj = res?.flatMap((item) => {
        return {
          ymir_pr_number: item?.ymir_pr_number,
          pr_number: item?.pr_number,
          item_status: item?.item_status,
          status: item?.status,
          asset_description: item?.asset_description,
          asset_specification: item?.asset_specification,
          brand: item?.brand,
          transaction_number: item?.transaction_number,
          acquisition_details: item?.acquisition_details,
          company_code: item?.company_code,
          company: item?.company,
          business_unit_code: item?.business_unit_code,
          business_unit: item?.business_unit,
          department_code: item?.department_code,
          department: item?.department,
          unit_code: item?.unit_code,
          unit: item?.unit,
          subunit_code: item?.subunit_code,
          subunit: item?.subunit,
          location_code: item?.location_code,
          location: item?.location,
          account_title_code: item?.account_title_code,
          account_title: item?.account_title,
          date_needed: moment(item?.date_needed).format("MMM DD, YYYY"),
          created_at: moment(item?.created_at).format("MMM DD, YYYY"),
        };
      });

      await excelExport(newObj, "Vladimir-PR-Reports.xlsx");
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

  const transactionStatus = (data) => {
    let statusColor, hoverColor, textColor, variant;

    switch (data.status) {
      case "Approved":
        statusColor = "success.light";
        hoverColor = "success.main";
        textColor = "white";
        variant = "filled";
        break;

      case "Claimed":
        statusColor = "success.dark";
        hoverColor = "success.dark";
        variant = "filled";
        break;

      case "Sent to Ymir":
        statusColor = "ymir.light";
        hoverColor = "ymir.main";
        variant = "filled";
        break;

      case "Returned":
      case "Cancelled":
      case "Returned From Ymir":
        statusColor = "error.light";
        hoverColor = "error.main";
        variant = "filled";
        break;

      default:
        statusColor = "success.main";
        hoverColor = "none";
        textColor = "success.main";
        variant = "outlined";
    }

    return (
      <Chip
        placement="top"
        size="small"
        variant={variant}
        sx={{
          ...(variant === "filled" && {
            backgroundColor: statusColor,
            color: "white",
          }),
          ...(variant === "outlined" && {
            borderColor: statusColor,
            color: textColor,
          }),
          fontSize: "11px",
          px: 1,
          ":hover": {
            ...(variant === "filled" && { backgroundColor: hoverColor }),
            ...(variant === "outlined" && { borderColor: hoverColor, color: textColor }),
          },
        }}
        label={data.status}
      />
    );
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}>
        PR Report
      </Typography>
      <Stack height="100%">
        {prLoading && <MasterlistSkeleton onAdd={true} />}
        {prError && <ErrorFetching refetch={refetch} error={errorData} />}
        {prData && !prError && (
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar onStatusChange={setStatus} onSearchChange={setSearch} onSetPage={setPage} hideArchive />

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
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `ymir_pr_number`}
                          direction={orderBy === `ymir_pr_number` ? order : `asc`}
                          onClick={() => onSort(`ymir_pr_number`)}
                        >
                          PR No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `pr_description`}
                          direction={orderBy === `pr_description` ? order : `asc`}
                          onClick={() => onSort(`pr_description`)}
                        >
                          PR Description
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">Chart Of Accounts</TableCell>

                      <TableCell className="tbl-cell" align="center">
                        Status
                      </TableCell>

                      <TableCell className="tbl-cell" align="center">
                        Item Count
                      </TableCell>

                      <TableCell className="tbl-cell" align="center">
                        View Items
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `date_needed`}
                          direction={orderBy === `date_needed` ? order : `asc`}
                          onClick={() => onSort(`date_needed`)}
                        >
                          Date Needed
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {prData?.data?.length === 0 ? (
                      <NoRecordsFound heightData="small" />
                    ) : (
                      <>
                        {prSuccess &&
                          [...prData?.data]?.sort(comparator(order, orderBy))?.map((data, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell">
                                <Typography fontWeight={600} fontSize="14px">
                                  {data.ymir_pr_number}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell">{data?.pr_description}</TableCell>

                              <TableCell className="tbl-cell">
                                <Typography fontSize="10px" color="gray">
                                  {data.company_code} - {data.company}
                                </Typography>
                                <Typography fontSize="10px" color="gray">
                                  {data.business_unit_code} - {data.business_unit}
                                </Typography>
                                <Typography fontSize="10px" color="gray">
                                  {data.department_code} - {data.department}
                                </Typography>
                                <Typography fontSize="10px" color="gray">
                                  {data.unit_code} - {data.unit}
                                </Typography>
                                <Typography fontSize="10px" color="gray">
                                  {data.subunit_code} - {data.subunit}
                                </Typography>
                                <Typography fontSize="10px" color="gray">
                                  {data.location_code} - {data.location}
                                </Typography>
                                <Typography fontSize="10px" color="gray">
                                  {data.account_title_code} - {data.account_title}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell" align="center">
                                {transactionStatus(data)}
                              </TableCell>

                              <TableCell className="tbl-cell" align="center">
                                {data?.items.length}
                              </TableCell>

                              <TableCell className="tbl-cell" align="center">
                                <Typography fontSize={14} fontWeight={600} color="secondary.main">
                                  <IconButton size="small" onClick={() => handleViewData(data)}>
                                    <Visibility />
                                  </IconButton>
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell tr-cen-pad45">
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

            <Box className="mcontainer__pagination-export">
              <Button
                className="mcontainer__export"
                variant="outlined"
                size="small"
                color="text"
                startIcon={<IosShareRounded color="primary" />}
                onClick={openExportDialog}
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
                total={prData?.total}
                success={prSuccess}
                current_page={prData?.current_page}
                per_page={prData?.per_page}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        )}
      </Stack>

      <Dialog
        open={dialog}
        TransitionComponent={Grow}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{ sx: { maxWidth: "1320px", borderRadius: "10px", p: 3 } }}
      >
        <Stack gap={2}>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography fontSize={24} fontFamily="Anton" color="secondary">
              {prItems?.ymir_pr_number}
            </Typography>

            {!isSmallScreen && (
              <IconButton sx={{ marginTop: "-10px" }} onClick={() => dispatch(closeDialog())}>
                <Tooltip title="Close" placement="top" arrow>
                  <Close />
                </Tooltip>
              </IconButton>
            )}
          </Stack>

          <Stack
            flexDirection="row"
            flexWrap="wrap"
            alignItems={isSmallScreen ? "flex-start" : "center"}
            justifyContent="center"
            gap={2}
            maxHeight={isSmallScreen ? "400px" : "550px"}
            p={1}
            overflow="auto"
          >
            {prItems?.items?.map((items, index) => (
              <Card key={index} sx={{ flex: "1 1 auto" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    // justifyContent: "center",
                    gap: 2,
                    width: "400px",
                    px: 4,
                  }}
                >
                  <Chip label={index + 1} sx={{ backgroundColor: "quaternary.main", color: "white", maxWidth: 40 }} />

                  <Stack sx={{ "&>div": { flexDirection: "row", gap: 1 } }}>
                    <Stack>
                      <Typography color="secondary" fontWeight="bold" fontSize={14}>
                        Description:
                      </Typography>
                      <Typography color="secondary.light" fontSize={14}>
                        {items.asset_description}
                      </Typography>
                    </Stack>

                    <Stack>
                      <Typography color="secondary" fontWeight="bold" fontSize={14}>
                        Specification:
                      </Typography>
                      <Typography color="secondary.light" fontSize={14}>
                        {items.asset_specification}
                      </Typography>
                    </Stack>

                    <Stack>
                      <Typography color="secondary" fontWeight="bold" fontSize={14}>
                        Brand:
                      </Typography>
                      <Typography color="secondary.light" fontSize={14}>
                        {items?.brand ? items?.brand : "No Data"}
                      </Typography>
                    </Stack>

                    <Stack>
                      <Typography color="secondary" fontWeight="bold" fontSize={14}>
                        Quantity:
                      </Typography>
                      <Typography color="secondary.light" fontSize={14}>
                        {items.quantity}
                      </Typography>
                    </Stack>

                    <Stack>
                      <Typography color="secondary" fontWeight="bold" fontSize={14}>
                        Date Needed:
                      </Typography>
                      <Typography color="secondary.light" fontSize={14}>
                        {items.date_needed}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
          {isSmallScreen && (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              width="400px"
              onClick={() => dispatch(closeDialog())}
            >
              Close
            </Button>
          )}
        </Stack>
      </Dialog>

      <Dialog
        open={showExport}
        TransitionComponent={Grow}
        onClose={() => dispatch(closeExport())}
        PaperProps={{ sx: { maxWidth: "1320px", borderRadius: "10px", p: 3 } }}
      >
        <ExportPr />
      </Dialog>
    </Box>
  );
};

export default PurchaseRequestReport;
