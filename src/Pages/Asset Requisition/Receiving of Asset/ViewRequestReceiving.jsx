import React, { useEffect, useState } from "react";
import "../../../index.scss";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import ErrorFetching from "../../ErrorFetching";
import { LoadingData } from "../../../Components/LottieFiles/LottieComponents";
import AddReceivingInfo from "../../../Pages/Asset Requisition/Receiving of Asset/AddReceivingInfo";

import {
  Box,
  Button,
  Dialog,
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
} from "@mui/material";
import { ArrowBackIosRounded, RemoveCircle, Report } from "@mui/icons-material";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import {
  useGetItemPerTransactionApiQuery,
  useCancelAssetReceivingApiMutation,
} from "../../../Redux/Query/Request/AssetReceiving";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

const ViewRequestReceiving = () => {
  const { state: transactionData } = useLocation();
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [viewData, setViewData] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dialog = useSelector((state) => state.booleanState.dialog);

  const {
    data: receivingData,
    isLoading: isReceivingLoading,
    isSuccess: isReceivingSuccess,
    isError: isReceivingError,
    error: errorData,
    refetch,
  } = useGetItemPerTransactionApiQuery(
    {
      page: page,
      per_page: perPage,
      transaction_number: transactionData?.transaction_number,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [cancelPo] = useCancelAssetReceivingApiMutation();

  // console.log("receivingData:", receivingData);
  // console.log("transactionData:", transactionData);

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
  const handleTableData = (data) => {
    transactionData?.received || data?.remaining === 0 ? null : dispatch(openDialog());
    setViewData(data);
  };

  const onCancelHandler = async (data) => {
    // console.log("data", data);
    dispatch(
      openConfirm({
        icon: Report,
        iconColor: "warning",
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
              Cancel
            </Typography>{" "}
            this Data?
          </Box>
        ),
        remarks: true,

        onConfirm: async (remarks) => {
          try {
            dispatch(onLoading());
            let result = await cancelPo({ id: data?.id, remarks: remarks }).unwrap();
            dispatch(
              openToast({
                message: result?.message,
                duration: 5000,
              })
            );

            dispatch(closeConfirm());
            console.log(result);
            result?.data?.total_remaining === 0 && navigate(-1);
          } catch (err) {
            console.error(err);
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

  useEffect(() => {
    if (receivingData?.total_remaining === 0) {
      navigate(-1);
    }
  }, [receivingData]);

  return (
    <>
      {isReceivingError && <ErrorFetching refetch={refetch} error={errorData} />}
      {!isReceivingError && (
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

          <Box className="mcontainer__wrapper" p={2} pb={0}>
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
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `type_of_request`}
                          direction={orderBy === `type_of_request` ? order : `asc`}
                          onClick={() => onSort(`type_of_request`)}
                        >
                          Type of Request
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `pr_number`}
                          direction={orderBy === `pr_number` ? order : `asc`}
                          onClick={() => onSort(`pr_number`)}
                        >
                          PR Number
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `reference_number`}
                          direction={orderBy === `reference_number` ? order : `asc`}
                          onClick={() => onSort(`reference_number`)}
                        >
                          Ref Number
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `reference_number`}
                          direction={orderBy === `reference_number` ? order : `asc`}
                          onClick={() => onSort(`reference_number`)}
                        >
                          Acquisition Details
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">Asset Information</TableCell>
                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>

                      {transactionData?.received && (
                        <TableCell className="tbl-cell text-center">
                          <TableSortLabel
                            active={orderBy === `delivered`}
                            direction={orderBy === `delivered` ? order : `asc`}
                            onClick={() => onSort(`delivered`)}
                          >
                            Received
                          </TableSortLabel>
                        </TableCell>
                      )}

                      {!transactionData?.received && (
                        <TableCell className="tbl-cell text-center">
                          <TableSortLabel
                            active={orderBy === `ordered`}
                            direction={orderBy === `ordered` ? order : `asc`}
                            onClick={() => onSort(`ordered`)}
                          >
                            Ordered
                          </TableSortLabel>
                        </TableCell>
                      )}

                      {!transactionData?.received && (
                        <TableCell className="tbl-cell text-center">
                          <TableSortLabel
                            active={orderBy === `delivered`}
                            direction={orderBy === `delivered` ? order : `asc`}
                            onClick={() => onSort(`delivered`)}
                          >
                            Delivered
                          </TableSortLabel>
                        </TableCell>
                      )}

                      {!transactionData?.received && (
                        <TableCell className="tbl-cell text-center">
                          <TableSortLabel
                            active={orderBy === `remaining`}
                            direction={orderBy === `remaining` ? order : `asc`}
                            onClick={() => onSort(`remaining`)}
                          >
                            Remaining
                          </TableSortLabel>
                        </TableCell>
                      )}

                      <TableCell className="tbl-cell text-center">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isReceivingLoading ? (
                      <LoadingData />
                    ) : receivingData?.data.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {isReceivingSuccess &&
                          [...receivingData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              hover
                              sx={{
                                cursor: transactionData?.received ? null : "pointer",
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                              }}
                            >
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell text-weight">
                                <Typography fontWeight={600}>{data.type_of_request?.type_of_request_name}</Typography>
                                <Typography fontSize="12px" fontWeight="bold" color="primary">
                                  {data.attachment_type}
                                </Typography>
                              </TableCell>
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell">
                                PR - {data.pr_number}
                              </TableCell>
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell">
                                {data.reference_number}
                              </TableCell>
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell">
                                {data.acquisition_details}
                              </TableCell>
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell">
                                <Typography fontSize="14px" fontWeight="bold">
                                  {data.asset_description}
                                </Typography>
                                <Typography fontSize="12px">{data.asset_specification}</Typography>
                              </TableCell>
                              <TableCell onClick={() => handleTableData(data)} className="tbl-cell">
                                <Typography
                                  fontSize={12}
                                  noWrap
                                >{`(${data.company?.company_code}) - ${data.company?.company_name}`}</Typography>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                >{`(${data.department?.department_code}) - ${data.department?.department_name}`}</Typography>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                >{`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}</Typography>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                >{`(${data.location?.location_code}) - ${data.location?.location_name}`}</Typography>
                                <Typography
                                  fontSize={12}
                                  noWrap
                                >{`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}</Typography>
                              </TableCell>

                              {transactionData?.received && (
                                <TableCell onClick={() => handleTableData(data)} className="tbl-cell tr-cen-pad45">
                                  {data?.delivered}
                                </TableCell>
                              )}

                              {!transactionData?.received && (
                                <TableCell onClick={() => handleTableData(data)} className="tbl-cell tr-cen-pad45">
                                  {data?.ordered}
                                </TableCell>
                              )}

                              {!transactionData?.received && (
                                <TableCell onClick={() => handleTableData(data)} className="tbl-cell tr-cen-pad45">
                                  {data?.delivered}
                                </TableCell>
                              )}

                              {!transactionData?.received && (
                                <TableCell onClick={() => handleTableData(data)} className="tbl-cell tr-cen-pad45">
                                  {data?.remaining}
                                </TableCell>
                              )}

                              {!transactionData?.received && (
                                <TableCell className="tbl-cell text-center">
                                  <IconButton
                                    disabled={data?.remaining === 0}
                                    onClick={() => onCancelHandler(data)}
                                    sx={{ color: "error.main", ":hover": { color: "red" } }}
                                  >
                                    <Tooltip title="Cancel Request" placement="top" arrow>
                                      <RemoveCircle />
                                    </Tooltip>
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Buttons */}
              <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
                <Typography fontFamily="Anton, Impact, Roboto" fontSize="18px" color="secondary.main">
                  Transactions : {receivingData?.data?.length} request
                </Typography>

                <CustomTablePagination
                  total={receivingData?.total}
                  success={isReceivingSuccess}
                  current_page={receivingData?.current_page}
                  per_page={receivingData?.per_page}
                  onPageChange={pageHandler}
                  onRowsPerPageChange={perPageHandler}
                />
              </Stack>
            </Box>
          </Box>

          <Dialog
            open={dialog}
            // onClose={() => dispatch(closeDialog())}
            sx={{
              ".MuiPaper-root": {
                padding: "20px",
                margin: 0,
                gap: "5px",
                minWidth: "250px",
                maxWidth: "750px",
                borderRadius: "10px",
                width: "90%",
              },
            }}
          >
            <AddReceivingInfo data={viewData} />
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default ViewRequestReceiving;
