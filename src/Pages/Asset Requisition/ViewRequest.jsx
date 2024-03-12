import React, { useEffect, useRef, useState } from "react";
import "../../Style/Request/request.scss";
import AddPr from "./Purchase Request/AddPr";
import { LoadingData } from "../../Components/LottieFiles/LottieComponents";

import {
  Box,
  Button,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBackIosRounded,
  Cancel,
  Check,
  Help,
  InsertDriveFile,
  RemoveShoppingCart,
  Report,
  Undo,
} from "@mui/icons-material";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { useGetByTransactionApiQuery } from "../../Redux/Query/Request/Requisition";

import { useLocation, useNavigate } from "react-router-dom";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import { useGetRequestContainerAllApiQuery } from "../../Redux/Query/Request/RequestContainer";
import { closeConfirm, onLoading, openConfirm } from "../../Redux/StateManagement/confirmSlice";
import {
  useGetNextRequestQuery,
  useLazyGetNextRequestQuery,
  usePatchApprovalStatusApiMutation,
} from "../../Redux/Query/Approving/Approval";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import { closeDialog, openDialog, closeDialog1, openDialog1 } from "../../Redux/StateManagement/booleanStateSlice";
import { useRemovePurchaseRequestApiMutation } from "../../Redux/Query/Request/PurchaseRequest";
import ErrorFetching from "../ErrorFetching";

const ViewRequest = (props) => {
  const { approving } = props;
  const { state: transactionData } = useLocation();
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dialog = useSelector((state) => state.booleanState.dialog);
  // const dialog1 = useSelector((state) => state.booleanState.dialogMultiple.dialog1);

  // const [patchApprovalStatus, { isLoading }] = usePatchApprovalStatusApiMutation();
  // const [getNextRequest, { data: nextData, isLoading: isNextRequestLoading }] = useLazyGetNextRequestQuery();
  // const [removePrNumber] = useRemovePurchaseRequestApiMutation();

  // CONTAINER
  const {
    data: addRequestAllApi = [],
    isLoading: isRequestLoading,
    isSuccess: isRequestSuccess,
    isError: isRequestError,
    error: errorData,
    refetch: isRequestRefetch,
  } = useGetRequestContainerAllApiQuery(
    { page: page, per_page: perPage, transaction_number: transactionData?.transaction_number },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: transactionDataApi = [],
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    refetch: isTransactionRefetch,
  } = useGetByTransactionApiQuery(
    { page: page, per_page: perPage, transaction_number: transactionData?.transaction_number },
    { refetchOnMountOrArgChange: true }
  );

  // const {
  //   data: nextDataApi,
  //   isLoading: isNextDataLoading,
  //   refetch: isNextDataRefetch,
  // } = useGetNextRequestQuery({ refetchOnMountOrArgChange: true });

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

  // const onApprovalApproveHandler = (id) => {
  //   dispatch(
  //     openConfirm({
  //       icon: Help,
  //       iconColor: "info",
  //       message: (
  //         <Box>
  //           <Typography> Are you sure you want to</Typography>
  //           <Typography
  //             sx={{
  //               display: "inline-block",
  //               color: "secondary.main",
  //               fontWeight: "bold",
  //               fontFamily: "Raleway",
  //             }}
  //           >
  //             APPROVE
  //           </Typography>{" "}
  //           this request?
  //         </Box>
  //       ),

  //       onConfirm: async () => {
  //         try {
  //           dispatch(onLoading());
  //           const result = await patchApprovalStatus({
  //             action: "Approve",
  //             asset_approval_id: id,
  //           }).unwrap();
  //           dispatch(
  //             openToast({
  //               message: result.message,
  //               duration: 5000,
  //             })
  //           );
  //           // console.log(result);
  //           const next = await getNextRequest().unwrap();
  //           navigate(`/approving/${next?.[0].transaction_number}`, { state: next?.[0], replace: true });
  //         } catch (err) {
  //           if (err?.status === 404) {
  //             navigate(`/approving`);
  //           } else if (err?.status === 422) {
  //             dispatch(
  //               openToast({
  //                 // message: err.data.message,
  //                 message: err.data.errors?.detail,
  //                 duration: 5000,
  //                 variant: "error",
  //               })
  //             );
  //           } else if (err?.status !== 422) {
  //             dispatch(
  //               openToast({
  //                 message: "Something went wrong. Please try again.",
  //                 duration: 5000,
  //                 variant: "error",
  //               })
  //             );
  //           }
  //         }
  //       },
  //     })
  //   );
  // };

  // const onApprovalReturnHandler = (id) => {
  //   dispatch(
  //     openConfirm({
  //       icon: Report,
  //       iconColor: "warning",
  //       message: (
  //         <Stack gap={2}>
  //           <Box>
  //             <Typography> Are you sure you want to</Typography>
  //             <Typography
  //               sx={{
  //                 display: "inline-block",
  //                 color: "secondary.main",
  //                 fontWeight: "bold",
  //                 fontFamily: "Raleway",
  //               }}
  //             >
  //               RETURN
  //             </Typography>{" "}
  //             this request?
  //           </Box>
  //         </Stack>
  //       ),
  //       remarks: true,

  //       onConfirm: async (data) => {
  //         try {
  //           dispatch(onLoading());
  //           const result = await patchApprovalStatus({
  //             action: "Return",
  //             asset_approval_id: id,
  //             remarks: data,
  //           }).unwrap();

  //           dispatch(
  //             openToast({
  //               message: result.message,
  //               duration: 5000,
  //             })
  //           );
  //           const next = await getNextRequest().unwrap();
  //           navigate(`/approving/${next?.[0].transaction_number}`, { state: next?.[0], replace: true });
  //         } catch (err) {
  //           if (err?.status === 404) {
  //             navigate(`/approving`);
  //           } else if (err?.status === 422) {
  //             dispatch(
  //               openToast({
  //                 // message: err.data.message,
  //                 message: err?.data?.errors?.detail,
  //                 duration: 5000,
  //                 variant: "error",
  //               })
  //             );
  //           } else if (err?.status !== 422) {
  //             dispatch(
  //               openToast({
  //                 message: "Something went wrong. Please try again.",
  //                 duration: 5000,
  //                 variant: "error",
  //               })
  //             );
  //           }
  //         }
  //       },
  //     })
  //   );
  // };

  // const onRemovePrHandler = (id) => {
  //   dispatch(
  //     openConfirm({
  //       icon: Report,
  //       iconColor: "warning",
  //       message: (
  //         <Stack gap={2}>
  //           <Box>
  //             <Typography> Are you sure you want to</Typography>
  //             <Typography
  //               sx={{
  //                 display: "inline-block",
  //                 color: "secondary.main",
  //                 fontWeight: "bold",
  //                 fontFamily: "Raleway",
  //               }}
  //             >
  //               REMOVE
  //             </Typography>{" "}
  //             the PR Number?
  //           </Box>
  //         </Stack>
  //       ),

  //       onConfirm: async () => {
  //         try {
  //           dispatch(onLoading());
  //           const result = await removePrNumber(id).unwrap();

  //           dispatch(
  //             openToast({
  //               message: result.message,
  //               duration: 5000,
  //             })
  //           );
  //           navigate(-1);
  //         } catch (err) {
  //           if (err?.status === 422) {
  //             dispatch(
  //               openToast({
  //                 // message: err.data.message,
  //                 message: err?.data?.errors?.detail,
  //                 duration: 5000,
  //                 variant: "error",
  //               })
  //             );
  //           } else if (err?.status !== 422) {
  //             dispatch(
  //               openToast({
  //                 message: "Something went wrong. Please try again.",
  //                 duration: 5000,
  //                 variant: "error",
  //               })
  //             );
  //           }
  //         }
  //       },
  //     })
  //   );
  // };

  const handleCloseDialog = () => {
    dispatch(closeDialog()) || dispatch(closeDialog1());
  };

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  return (
    <>
      {isRequestError && <ErrorFetching refetch={isRequestRefetch} error={errorData} />}
      {!isRequestError && (
        <Box className="mcontainer" sx={{ height: "calc(100vh - 380px)" }}>
          <Button
            variant="text"
            color="secondary"
            size="small"
            startIcon={<ArrowBackIosRounded color="secondary" />}
            onClick={() => {
              navigate(-1);
              // setApprovingValue("2");
            }}
            disableRipple
            sx={{ width: "90px", marginLeft: "-15px", "&:hover": { backgroundColor: "transparent" } }}
          >
            <Typography color="secondary.main">Back</Typography>
          </Button>

          <Box className="request mcontainer__wrapper" p={2} pb={0}>
            {/* TABLE */}
            <Box className="request__table">
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
                {`${transactionData ? "TRANSACTION NO." : "CURRENT ASSET"}`}{" "}
                {transactionData && transactionData?.transaction_number}
              </Typography>

              <TableContainer
                className="mcontainer__th-body  mcontainer__wrapper"
                sx={{ height: "calc(100vh - 290px)", pt: 0 }}
              >
                <Table className="mcontainer__table " stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold!important",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      <TableCell className="tbl-cell">Ref. No.</TableCell>
                      <TableCell className="tbl-cell">Type of Request</TableCell>
                      <TableCell className="tbl-cell">Acquisition Details</TableCell>
                      <TableCell className="tbl-cell">Attachment Type</TableCell>
                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                      <TableCell className="tbl-cell">Accountability</TableCell>
                      <TableCell className="tbl-cell">Asset Information</TableCell>
                      <TableCell className="tbl-cell text-center">Quantity</TableCell>
                      <TableCell className="tbl-cell">Cellphone #</TableCell>
                      <TableCell className="tbl-cell">Remarks</TableCell>
                      <TableCell className="tbl-cell">Attachments</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isRequestLoading || isTransactionLoading ? (
                      <LoadingData />
                    ) : (transactionData ? transactionDataApi?.length === 0 : addRequestAllApi?.length === 0) ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {(transactionData ? transactionDataApi : addRequestAllApi)?.map((data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell tr-cen-pad45 text-weight">{data.reference_number}</TableCell>
                            <TableCell className="tbl-cell">{data.type_of_request?.type_of_request_name}</TableCell>
                            <TableCell className="tbl-cell">{data.acquisition_details}</TableCell>
                            <TableCell className="tbl-cell">{data.attachment_type}</TableCell>
                            <TableCell className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.accountability === "Personal Issued" ? (
                                <>
                                  <Box>{data?.accountable?.general_info?.full_id_number}</Box>
                                  <Box>{data?.accountable?.general_info?.full_name}</Box>
                                </>
                              ) : (
                                "Common"
                              )}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              <Typography fontWeight={600} fontSize="14px" color="secondary.main">
                                {data.asset_description}
                              </Typography>
                              <Typography fontSize="12px" color="text.light">
                                {data.asset_specification}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell text-center">{data.quantity}</TableCell>

                            <TableCell className="tbl-cell">
                              {data.cellphone_number === null ? "-" : data.cellphone_number}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.remarks === null ? "No Remarks" : data.remarks}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data?.attachments?.letter_of_request && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Letter of Request:
                                  </Typography>
                                  {data?.attachments?.letter_of_request?.file_name}
                                </Stack>
                              )}
                              {data?.attachments?.quotation && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Quotation:
                                  </Typography>
                                  {data?.attachments?.quotation?.file_name}
                                </Stack>
                              )}
                              {data?.attachments?.specification_form && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Specification:
                                  </Typography>
                                  {data?.attachments?.specification_form?.file_name}
                                </Stack>
                              )}
                              {data?.attachments?.tool_of_trade && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Tool of Trade:
                                  </Typography>
                                  {data?.attachments?.tool_of_trade?.file_name}
                                </Stack>
                              )}
                              {data?.attachments?.other_attachments && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize={12} fontWeight={600}>
                                    Other Attachment:
                                  </Typography>
                                  {data?.attachments?.other_attachments?.file_name}
                                </Stack>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Buttons */}
              <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
                <Typography
                  fontFamily="Anton, Impact, Roboto"
                  fontSize="18px"
                  color="secondary.main"
                  sx={{ pt: "10px" }}
                >
                  Transactions : {transactionData ? transactionDataApi.length : addRequestAllApi.length} request
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Dialog
            open={dialog}
            onClose={handleCloseDialog}
            sx={{
              ".MuiPaper-root": {
                alignItems: "center",
                padding: "20px",
                margin: 0,
                gap: "5px",
                minWidth: "250px",
                maxWidth: "350px",
                width: "50%",
                textAlign: "center",
                borderRadius: "10px",
              },
            }}
          >
            <AddPr transactionData={transactionData} />
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default ViewRequest;
