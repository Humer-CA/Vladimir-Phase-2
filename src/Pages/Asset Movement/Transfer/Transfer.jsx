import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ErrorFetching from "../../ErrorFetching";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
  Grow,
  IconButton,
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
import {
  Attachment,
  Help,
  IosShareRounded,
  Report,
  ReportProblem,
  TransferWithinAStation,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import useExcel from "../../../Hooks/Xlsx";
import moment from "moment";
import {
  useArchiveTransferApiMutation,
  useDownloadAttachmentApiMutation,
  useGetTransferApiQuery,
} from "../../../Redux/Query/Movement/Transfer";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { useDownloadAttachment, useDownloadTransferAttachment } from "../../../Hooks/useDownloadAttachment";
import TransferTimeline from "../TransferTimeline";

const Transfer = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [onTransfer, setOnTransfer] = useState(true);
  const [transactionIdData, setTransactionIdData] = useState("");

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  const dialog = useSelector((state) => state.booleanState.dialog);

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
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  // const [transferDataTrigger] = useLazyGetTransferAllApiQuery();

  const {
    data: transferData,
    isLoading: transferLoading,
    isSuccess: transferSuccess,
    isError: transferError,
    error: errorData,
    refetch,
  } = useGetTransferApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
      filter: filter,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [downloadAttachment, { isLoading: isLoading }] = useDownloadAttachmentApiMutation();
  const [archiveTransfer, { data: archiveTransferData }] = useArchiveTransferApiMutation();

  const dispatch = useDispatch();

  const onSetPage = () => {
    setPage(1);
  };

  const onArchiveRestoreHandler = async (data) => {
    dispatch(
      openConfirm({
        icon: status !== "Cancelled" ? ReportProblem : Help,
        iconColor: status !== "Cancelled" ? "alert" : "info",
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
              {status !== "Cancelled" ? "ARCHIVE" : "ACTIVATE"}
            </Typography>{" "}
            this data?
          </Box>
        ),
        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await archiveTransfer(data?.transfer_number).unwrap();
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

  const handleViewTimeline = (data) => {
    // console.log(data);
    dispatch(openDialog());
    setTransactionIdData(data);
  };

  const handleExport = async () => {
    try {
      const apiParams = {
        page: page,
        per_page: perPage,
        status: status,
        search: search,
        filter: filter,
      };

      const res = await transferDataTrigger(apiParams).unwrap();
      // console.log(res);
      const newObj = res?.data?.map((item) => {
        return {
          // ID: item?.id,
          "Transaction No.": item?.transaction_number,
          "Acuisition Details": item?.acquisition_details,
          Quantity: item?.item_count,
          Status: item?.status,
          "Current Approver": `${item?.current_approver?.firstname} ${item?.current_approver?.lastname}`,
          "Date Transfered": moment(item?.created_at).format("MMM DD, YYYY"),
        };
      });

      const exportTitle = `Vladimir-Transfer`;

      await excelExport(newObj, exportTitle);
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
        console.log(err);
      }
    }
  };

  const DlAttachment = (transfer_number) => (
    <Tooltip title="Download Attachment" placement="top" arrow>
      <Box
        sx={{
          textDecoration: "underline",
          cursor: "pointer",
          color: "primary.main",
          fontSize: "12px",
        }}
        onClick={() => handleDownloadAttachment({ value: "attachments", transfer_number: transfer_number })}
      >
        <Attachment />
      </Box>
    </Tooltip>
  );

  const handleDownloadAttachment = (value) =>
    useDownloadTransferAttachment({
      attachments: "attachments",
      transfer_number: value?.transfer_number?.transfer_number,
    });

  const handleTransfer = () => {
    navigate(`add-transfer`);
  };

  const handleViewTransfer = (data) => {
    const view = true;
    navigate(`add-transfer/${data.transfer_number}`, {
      state: { ...data, view },
    });
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Transfer
      </Typography>
      {transferLoading && <MasterlistSkeleton onAdd={true} />}
      {transferError && <ErrorFetching refetch={refetch} error={errorData} />}
      {transferData && !transferError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              onTransfer={onTransfer}
              setFilter={setFilter}
              filter={filter}
            />
            {/* Asset Movement */}
            <Box className="masterlist-toolbar__addBtn" sx={{ mt: 0.8 }}>
              <Button
                onClick={handleTransfer}
                variant="contained"
                startIcon={isSmallScreen ? null : <TransferWithinAStation />}
                size="small"
                sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
              >
                {isSmallScreen ? <TransferWithinAStation color="black" sx={{ fontSize: "20px" }} /> : "Transfer"}
              </Button>
            </Box>

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
                          active={orderBy === `transfer_number`}
                          direction={orderBy === `transfer_number` ? order : `asc`}
                          onClick={() => onSort(`transfer_number`)}
                        >
                          Transfer No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `description`}
                          direction={orderBy === `description` ? order : `asc`}
                          onClick={() => onSort(`description`)}
                        >
                          Description
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `requester`}
                          direction={orderBy === `requester` ? order : `asc`}
                          onClick={() => onSort(`requester`)}
                        >
                          Requester
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell" align="center">
                        <TableSortLabel
                          active={orderBy === `quantity`}
                          direction={orderBy === `quantity` ? order : `asc`}
                          onClick={() => onSort(`quantity`)}
                        >
                          Quantity
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">View Information</TableCell>

                      <TableCell className="tbl-cell" align="center">
                        <TableSortLabel
                          active={orderBy === `status`}
                          direction={orderBy === `status` ? order : `asc`}
                          onClick={() => onSort(`status`)}
                        >
                          View Status
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">Attachments</TableCell>

                      <TableCell className="tbl-cell" align="center">
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
                    {transferData?.data?.length === 0 ? (
                      <NoRecordsFound heightData="medium" />
                    ) : (
                      <>
                        {transferSuccess &&
                          [...transferData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.transfer_number}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell className="tbl-cell text-weight">{data.transfer_number}</TableCell>
                              <TableCell className="tbl-cell">{data.description}</TableCell>
                              <TableCell className="tbl-cell">{`(${data.requester?.employee_id}) - ${data.requester?.first_name} ${data.requester?.last_name}`}</TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">{data.quantity}</TableCell>
                              <TableCell className="tbl-cell text-weight text-center">
                                <Tooltip placement="top" title="View Transfer Information" arrow>
                                  <IconButton onClick={() => handleViewTransfer(data)}>
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">
                                {data.status === "Returned" || data.status === "Cancelled" ? (
                                  <Chip
                                    placement="top"
                                    onClick={() => handleViewTimeline(data)}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                      backgroundColor: "error.light",
                                      color: "white",
                                      fontSize: "0.7rem",
                                      px: 1,
                                      ":hover": { backgroundColor: "error.dark" },
                                    }}
                                    label={`${data.status}`}
                                  />
                                ) : data.status === "Claimed" ? (
                                  <Tooltip
                                    placement="top"
                                    title={`${data?.current_approver?.firstname} 
                                      ${data?.current_approver?.lastname}`}
                                    arrow
                                  >
                                    <Chip
                                      onClick={() => handleViewTimeline(data)}
                                      size="small"
                                      variant="filled"
                                      sx={{
                                        borderColor: "primary.main",
                                        color: "white",
                                        fontSize: "0.7rem",
                                        px: 1,
                                        cursor: "pointer",
                                        backgroundColor: "success.dark",
                                        ":hover": {
                                          backgroundColor: "success.dark",
                                        },
                                      }}
                                      label={`${data.status}`}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip
                                    placement="top"
                                    title={`${data?.current_approver?.firstname} 
                                        ${data?.current_approver?.lastname}`}
                                    arrow
                                  >
                                    <Chip
                                      onClick={() => handleViewTimeline(data)}
                                      size="small"
                                      variant={data.status === "Approved" ? "filled" : "outlined"}
                                      sx={{
                                        borderColor: "active.dark",
                                        color: data?.status === "Approved" ? "white" : "active.dark",
                                        fontSize: "0.7rem",
                                        px: 1,
                                        cursor: "pointer",
                                        backgroundColor: data?.status === "Approved" && "success.main",
                                        ":hover": {
                                          backgroundColor: data?.status === "Approved" ? "success.dark" : "red",
                                        },
                                      }}
                                      label={`${data.status}`}
                                    />
                                  </Tooltip>
                                )}
                              </TableCell>
                              <TableCell className="tbl-cell" align="center">
                                <DlAttachment transfer_number={data?.transfer_number} />
                              </TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">
                                {Moment(data.created_at).format("MMM DD, YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                <ActionMenu
                                  data={data}
                                  status={data?.status}
                                  hideArchive
                                  editTransferData={() => handleEditRequestData()}
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
                total={transferData?.total}
                success={transferSuccess}
                current_page={transferData?.current_page}
                per_page={transferData?.per_page}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}

      <Dialog
        open={dialog}
        TransitionComponent={Grow}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{ sx: { borderRadius: "10px", maxWidth: "700px" } }}
      >
        <TransferTimeline data={transactionIdData} />
      </Dialog>
    </Box>
  );
};

export default Transfer;
