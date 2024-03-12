import React, { useEffect, useRef, useState } from "react";
import "../../Style/Request/request.scss";
import { LoadingData } from "../../Components/LottieFiles/LottieComponents";

import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";

// RTK
import { useDispatch, useSelector } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import { useGetApprovalIdApiQuery } from "../../Redux/Query/Approving/Approval";
import { closeDialog } from "../../Redux/StateManagement/booleanStateSlice";
import { useGetRequisitionPerItemApiQuery } from "../../Redux/Query/Request/Requisition";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";

const ViewItemRequest = (props) => {
  const { data: transactionData } = props;
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const isSmallWidth = useMediaQuery("(max-width: 700px)");

  // CONTAINER
  const {
    data: perItemData,
    isLoading,
    isSuccess,
    isError: isError,
    error: errorData,
    refetch: isApproveRefetch,
  } = useGetRequisitionPerItemApiQuery({
    page: page,
    per_page: perPage,
    reference_number: transactionData?.reference_number,
  });

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

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const attachmentSx = {
    textDecoration: "underline",
    cursor: "pointer",
    color: "primary.main",
    fontSize: "12px",
  };

  return (
    <>
      <Box className="request__table">
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
            REFERENCE: {transactionData?.reference_number}
          </Typography>

          <IconButton onClick={() => dispatch(closeDialog())}>
            <Close />
          </IconButton>
        </Stack>

        {/* <Stack>{servedData()}</Stack> */}

        <Stack>
          <TableContainer className="mcontainer__wrapper mcontainer__th-body" sx={{ p: 0 }}>
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
                  <TableCell className="tbl-cell">Index</TableCell>
                  <TableCell className="tbl-cell">Type of Request</TableCell>
                  <TableCell className="tbl-cell">Vladimir Tag #</TableCell>
                  <TableCell className="tbl-cell">Asset Information</TableCell>
                  <TableCell className="tbl-cell">Receiving Information</TableCell>
                  <TableCell className="tbl-cell">Status</TableCell>
                  <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                  <TableCell className="tbl-cell">Accountability</TableCell>
                  <TableCell className="tbl-cell text-center">Quantity</TableCell>
                  <TableCell className="tbl-cell">Cellphone #</TableCell>
                  <TableCell className="tbl-cell">Remarks</TableCell>
                  {/* <TableCell className="tbl-cell">Attachments</TableCell> */}
                </TableRow>
              </TableHead>

              <TableBody>
                {isLoading && <LoadingData />}
                {perItemData?.data?.length === 0 ? (
                  <NoRecordsFound />
                ) : (
                  <>
                    {perItemData?.data?.map((data, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            borderBottom: 0,
                          },
                          bgcolor: data?.status === "Cancelled" ? "#ff00002f" : null,
                          color: data?.status === "Cancelled" && "text.dark",
                        }}
                      >
                        <TableCell className="tbl-cell" align="center">
                          {index}
                        </TableCell>
                        <TableCell className="tbl-cell">{data.type_of_request}</TableCell>
                        <TableCell className="tbl-cell">{data.vladimir_tag_number}</TableCell>

                        <TableCell className="tbl-cell">
                          <Typography fontWeight={600} fontSize="14px" color="secondary.main">
                            {data.asset_description}
                          </Typography>
                          <Typography fontSize="12px" color="text.light">
                            {data.asset_specification}
                          </Typography>
                        </TableCell>

                        <TableCell className="tbl-cell">
                          <Typography fontSize="12px" color="secondary.main">
                            {`PR Number- ${data.pr_number}`}
                          </Typography>
                          <Typography fontSize="12px" color="secondary.main">
                            {`PO Number- ${data.po_number}`}
                          </Typography>
                          <Typography fontSize="12px" color="secondary.main">
                            {`RR Number- ${data.receipt}`}
                          </Typography>
                        </TableCell>

                        <TableCell className="tbl-cell">{data.status}</TableCell>

                        <TableCell className="tbl-cell">
                          <Typography fontSize={10} color="gray">
                            {data.company}
                          </Typography>
                          {/* <Typography fontSize={10} color="gray" noWrap>
                              {data.business_unit}
                            </Typography> */}
                          <Typography fontSize={10} color="gray" noWrap>
                            {data.department}
                          </Typography>
                          <Typography fontSize={10} color="gray" noWrap>
                            {data.sub_unit}
                          </Typography>
                          <Typography fontSize={10} color="gray" noWrap>
                            {data.location}
                          </Typography>
                          <Typography fontSize={10} color="gray" noWrap>
                            {data.account_title}
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

                        <TableCell className="tbl-cell text-center">{data.quantity}</TableCell>

                        <TableCell className="tbl-cell">
                          {data.cellphone_number === null ? "-" : data.cellphone_number}
                        </TableCell>

                        <TableCell className="tbl-cell">
                          {data.remarks === null ? "No Remarks" : data.remarks}
                        </TableCell>

                        {/* <TableCell className="tbl-cell">
                          {data?.attachments?.letter_of_request && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600} noWrap>
                                Letter of Request:
                              </Typography>
                              <Tooltip title="Download Letter of Request">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "letter_of_request", id: data?.id })}
                                >
                                  {data?.attachments?.letter_of_request?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.quotation && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Quotation:
                              </Typography>
                              <Tooltip title="Download Quotation">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "quotation", id: data?.id })}
                                >
                                  {data?.attachments?.quotation?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.specification_form && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Specification:
                              </Typography>
                              <Tooltip title="Download Specification">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() =>
                                    handleDownloadAttachment({ value: "specification_form", id: data?.id })
                                  }
                                >
                                  {data?.attachments?.specification_form?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.tool_of_trade && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Tool of Trade:
                              </Typography>
                              <Tooltip title="Download Tool of Trade">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "tool_of_trade", id: data?.id })}
                                >
                                  {data?.attachments?.tool_of_trade?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.other_attachments && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Other Attachment:
                              </Typography>
                              <Tooltip title="Download Other Attachments">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "other_attachments", id: data?.id })}
                                >
                                  {data?.attachments?.other_attachments?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomTablePagination
            total={perItemData?.total}
            success={isSuccess}
            current_page={perItemData?.current_page}
            per_page={perItemData?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
          />
        </Stack>
      </Box>
    </>
  );
};

export default ViewItemRequest;
