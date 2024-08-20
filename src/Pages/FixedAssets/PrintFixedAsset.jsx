import React, { useEffect, useState } from "react";
import moment from "moment";
import CustomAutoComplete from "../../Components/Reusable/CustomAutoComplete";
import FaStatusChange from "../../Components/Reusable/FaStatusComponent";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
  Grow,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DataArrayTwoTone, Filter, FilterAlt, FilterList, Help, Print, ResetTv, Search } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch } from "react-redux";

import { closeDatePicker, closePrint } from "../../Redux/StateManagement/booleanStateSlice";
import {
  useGetFixedAssetApiQuery,
  useGetPrintViewingApiQuery,
  usePostPrintApiMutation,
  usePostLocalPrintApiMutation,
  usePutMemoPrintApiMutation,
} from "../../Redux/Query/FixedAsset/FixedAssets";
import { usePostPrintOfflineApiMutation } from "../../Redux/Query/FixedAsset/OfflinePrintingFA";
import { usePostPrintStalwartDateApiMutation } from "../../Redux/Query/FixedAsset/StalwartPrintingFA";
import { useGetTypeOfRequestAllApiQuery } from "../../Redux/Query/Masterlist/TypeOfRequest";
import CustomDatePicker from "../../Components/Reusable/CustomDatePicker";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import { useGetIpApiQuery } from "../../Redux/Query/IpAddressSetup";
import { closeConfirm, onLoading, openConfirm } from "../../Redux/StateManagement/confirmSlice";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import AssignmentMemo from "./AssignmentMemo";

const schema = yup.object().shape({
  id: yup.string(),
  // tagNumber: yup
  //   .string()
  //   .transform((value) => {
  //     return value?.id.toString();
  //   })
  //   .required()
  //   .label("Type of Request"),
  // search: yup.string().nullable(),
  // startDate: yup.string().nullable(),
  // endDate: yup.string().nullable(),

  tagNumber: yup.array().required(),
  search: yup.string().nullable(),
  startDate: yup.date().nullable(),
  endDate: yup.date().nullable(),
});

const PrintFixedAsset = (props) => {
  const { isRequest } = props;

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active");
  const [filter, setFilter] = useState([]);
  const [printMemo, setPrintMemo] = useState(false);
  const [printAssignmentMemo, setPrintAssignmentMemo] = useState(false);
  const [faFilter, setFaFilter] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [faData, setFaData] = useState(null);

  const dispatch = useDispatch();

  const isSmallerScreen = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery("(max-width: 850px)");

  // Table Sorting --------------------------------

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  const descendingComparator = (a, b, orderBy) => {
    // console.log(orderBy.split(".").toString());
    const multiple = orderBy.split(".").length > 1;
    if (multiple) {
      const [orderBy1, orderBy2] = orderBy.split(".");
      if (b[orderBy1][orderBy2] < a[orderBy1][orderBy2]) {
        return -1;
      }
      if (b[orderBy1][orderBy2] > a[orderBy1][orderBy2]) {
        return 1;
      }
      return 0;
    }

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

  const { data: ip } = useGetIpApiQuery();

  const [printAsset, { data: printData, isLoading, isError: isPostError, isSuccess: isPostSuccess, error: postError }] =
    usePostPrintApiMutation();

  const [
    putMemo,
    { data: memoData, isLoading: isMemoLoading, isError: isMemoError, isSuccess: isMemoSuccess, error: memoError },
  ] = usePutMemoPrintApiMutation();

  const {
    data: fixedAssetData,
    isLoading: fixedAssetLoading,
    isSuccess: fixedAssetSuccess,
    isError: fixedAssetError,
    error: errorData,
    refetch: fixedAssetRefetch,
  } = useGetPrintViewingApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
      startDate: startDate,
      endDate: endDate,
      isRequest: isRequest ? 1 : 0,
      printMemo: isRequest ? (printMemo ? 1 : 0) : null,
    },
    { refetchOnMountOrArgChange: true }
  );

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
      id: "",
      tagNumber: [],
      search: "",
      startDate: startDate,
      endDate: endDate,
      // endDate: new Date(),
    },
  });

  useEffect(() => {
    if (isPostSuccess) {
      dispatch(
        openToast({
          message: printData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("search", {
        type: "validate",
        message: postError?.data?.message,
      });
    } else if (isPostError && postError?.status === 403) {
      dispatch(
        openToast({
          message: postError?.data?.message,
          duration: 5000,
          variant: "error",
        })
      );
    } else if (isPostError && postError?.status === 404) {
      dispatch(
        openToast({
          message: postError?.data?.message,
          duration: 5000,
          variant: "error",
        })
      );
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
      // console.log(postError);
    }
  }, [isPostError]);

  const onPrintHandler = (formData) => {
    // console.log(formData);
    dispatch(
      openConfirm({
        icon: Help,
        iconColor: "info",
        message: (
          <Box>
            <Typography>Are you sure you want to print</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Raleway",
              }}
            >
              {watch("tagNumber").length === 0 ? "ALL" : "SELECTED"}
            </Typography>{" "}
            Barcode?
          </Box>
        ),
        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await printAsset({
              ip: ip.data,
              tagNumber: formData?.tagNumber,
            }).unwrap();
            // console.log(formData.tagNumber);

            // console.log(result);

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
            console.log(err.data.message);
            if (err?.status === 403 || err?.status === 404 || err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data?.message,
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

  const onPrintMemoHandler = async (formData) => {
    // console.log(formData);
    setFaData(fixedAssetData?.data);
    setSelectedMemo(formData?.tagNumber);
    dispatch(
      openConfirm({
        icon: Help,
        iconColor: "info",
        message: (
          <Box>
            <Typography>Are you sure you want to print</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Raleway",
              }}
            >
              ASSIGNMENT MEMO?
            </Typography>
          </Box>
        ),
        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const res = await putMemo({
              fixed_asset_id: formData?.tagNumber,
            }).unwrap();
            setPrintAssignmentMemo(true);
            reset();
          } catch (err) {
            console.log(err.data.message);
            if (err?.status === 403 || err?.status === 404 || err?.status === 422) {
              dispatch(
                openToast({
                  message: err?.data?.errors?.detail || err.data?.message,
                  duration: 5000,
                  variant: "error",
                })
              );
              console.log(err);
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

  const handleClose = () => {
    dispatch(closePrint());
  };

  const handleCloseMenu = () => {
    setAnchorElFaFilter(null);
  };

  const searchHandler = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      e.preventDefault();
    }
  };

  const handleSearchClick = () => {
    setSearch(watch("search"));

    if (!watch("startDate")) {
      setStartDate(null);
    } else {
      setStartDate(moment(watch("startDate")).format("YYYY-MM-DD"));
    }

    if (!watch("endDate")) {
      setEndDate(null);
    } else {
      setEndDate(moment(watch("endDate")).format("YYYY-MM-DD"));
    }
  };

  const tagNumberAllHandler = (checked) => {
    if (checked) {
      setValue(
        "tagNumber",
        fixedAssetData.data?.map((item) => item.vladimir_tag_number)
      );
    } else {
      reset({ tagNumber: [] });
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={printMemo ? handleSubmit(onPrintMemoHandler) : handleSubmit(onPrintHandler)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Stack flexDirection="row" justifyContent="space-between" width="100%">
          <Stack flexDirection="row" alignItems="center" pl="10px" gap={1.5}>
            <Print color="primary" fontSize="large" />
            <Typography
              noWrap
              variant="h5"
              color="secondary"
              sx={{
                fontFamily: "Anton",
              }}
            >
              {isRequest ? "Print Request" : "Print Asset"}
            </Typography>
          </Stack>

          {!!isRequest && (
            <FormControlLabel
              label="Assignment Memo"
              control={
                <Checkbox size="small" color="primary" checked={printMemo} onChange={() => setPrintMemo(!printMemo)} />
              }
              sx={{
                pr: 2,
                pl: 0.5,
                borderRadius: 3,
                outline: "2px solid",
                outlineColor: printMemo ? "primary.main" : "secondary.main",
              }}
            />
          )}
        </Stack>
        <Divider width="100%" sx={{ boxShadow: "1px solid black" }} />

        <Stack
          py={0.5}
          px={1}
          flexDirection={isSmallScreen ? "column" : "row"}
          // flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          gap={1}
        >
          <Stack flexDirection="row" width="100%">
            <CustomTextField
              control={control}
              name="search"
              label="Search"
              type="text"
              color="secondary"
              onKeyDown={searchHandler}
              fullWidth={isSmallScreen ? true : false}
            />
          </Stack>

          <Stack
            flexDirection="row"
            gap={isSmallScreen ? 1 : 2}
            justifyContent="center"
            flexWrap={isSmallScreen ? "wrap" : null}
          >
            <Stack
              flexDirection="row"
              gap={1}
              width={isSmallScreen ? "100%" : null}
              flexWrap={isSmallerScreen ? "wrap" : "noWrap"}
            >
              <CustomDatePicker
                control={control}
                name="startDate"
                label="Start Date"
                size="small"
                views={["year", "month", "day"]}
                // openTo="year"
                fullWidth
                disableFuture
                reduceAnimations
                onChange={(_, value) => {
                  setValue("endDate", null);
                  return value;
                }}
              />

              <CustomDatePicker
                control={control}
                name="endDate"
                label="End Date"
                size="small"
                // views={["year", "month", "day"]}
                fullWidth
                disableFuture
                reduceAnimations
                disabled={watch("startDate") === null || watch("startDate") === ""}
              />
            </Stack>

            <Button
              variant="contained"
              size="small"
              onClick={handleSearchClick}
              sx={{
                backgroundColor: "primary",
                width: isSmallScreen && "100%",
                maxWidth: "100%",
              }}
            >
              {isSmallScreen ? (
                <>
                  <Search /> {"  "}Search
                </>
              ) : (
                <Search />
              )}
            </Button>
          </Stack>
        </Stack>
        <Box
          sx={{
            border: "1px solid lightgray",
            borderRadius: "10px",
            width: "100%",
            // maxWidth: "850px",
          }}
        >
          <TableContainer
            sx={{
              height: isSmallScreen ? "35vh" : "45vh",
              borderRadius: "10px",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    "& > *": {
                      whiteSpace: "nowrap",
                      backgroundColor: "secondary.main",
                      ".MuiButtonBase-root": { color: "white" },
                      ".MuiTableSortLabel-icon": { color: "white!important" },
                    },
                  }}
                >
                  <TableCell align="center" sx={{ backgroundColor: "secondary.main", p: 0 }}>
                    <FormControlLabel
                      sx={{ margin: "auto", align: "center" }}
                      control={
                        <Checkbox
                          value=""
                          size="small"
                          sx={{ color: "primary" }}
                          checked={
                            !!fixedAssetData?.data
                              ?.map((mapItem) => mapItem.vladimir_tag_number)
                              .every((item) => watch("tagNumber").includes(item))
                          }
                          onChange={(e) => {
                            tagNumberAllHandler(e.target.checked);
                            // console.log(e.target.checked);
                          }}
                        />
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === `vladimir_tag_number`}
                      direction={orderBy === `vladimir_tag_number` ? order : `asc`}
                      onClick={() => onSort(`vladimir_tag_number`)}
                    >
                      Vladimir Tag #
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel disabled>Chart Of Accounts</TableSortLabel>
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      backgroundColor: "secondary.main",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === `asset_status.asset_status_name`}
                      direction={orderBy === `asset_status.asset_status_name` ? order : `asc`}
                      onClick={() => onSort(`asset_status.asset_status_name`)}
                    >
                      Asset Status
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: "secondary.main",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === `acquisition_date`}
                      direction={orderBy === `acquisition_date` ? order : `asc`}
                      onClick={() => onSort(`acquisition_date`)}
                    >
                      Date Created
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fixedAssetSuccess && fixedAssetData.data.length === 0 ? (
                  <NoRecordsFound heightData="xs" />
                ) : (
                  <>
                    {fixedAssetSuccess &&
                      [...fixedAssetData.data].sort(comparator(order, orderBy))?.map((data) => {
                        return (
                          <TableRow
                            key={data.id}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                              overflow: "auto",
                            }}
                          >
                            <TableCell align="center">
                              <FormControlLabel
                                value={data.vladimir_tag_number}
                                sx={{ margin: "auto" }}
                                disabled={data.action === "view"}
                                control={
                                  <Checkbox
                                    size="small"
                                    {...register("tagNumber")}
                                    checked={watch("tagNumber").includes(data.vladimir_tag_number)}
                                  />
                                }
                              />
                            </TableCell>

                            <TableCell>
                              <Typography noWrap variant="h6" fontSize="16px" color="secondary" fontWeight="bold">
                                {data.vladimir_tag_number}
                              </Typography>
                              <Typography noWrap fontSize="13px" color="gray">
                                {data.asset_description}
                              </Typography>

                              <Typography noWrap fontSize="12px" color="primary" fontWeight="bold">
                                {data.type_of_request.type_of_request_name.toUpperCase()}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.company.company_code}
                                {" - "} {data.company.company_name}
                              </Typography>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.business_unit.business_unit_code}
                                {" - "} {data.business_unit.business_unit_name}
                              </Typography>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.department.department_code}
                                {" - "}
                                {data.department.department_name}
                              </Typography>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.unit.unit_code}
                                {" - "} {data.unit.unit_name}
                              </Typography>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.subunit.subunit_code}
                                {" - "} {data.subunit.subunit_name}
                              </Typography>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.location.location_code} {" - "}
                                {data.location.location_name}
                              </Typography>
                              <Typography noWrap fontSize="10px" color="gray">
                                {data.account_title.account_title_code}
                                {" - "}
                                {data.account_title.account_title_name}
                              </Typography>
                            </TableCell>

                            <TableCell
                              sx={{
                                textAlign: "center",
                                pr: "35px",
                              }}
                            >
                              <FaStatusChange
                                faStatus={data.asset_status.asset_status_name}
                                data={data.asset_status.asset_status_name}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Typography noWrap fontSize="13px" paddingRight="15px">
                                {moment(data.created_at).format("MMM-DD-YYYY")}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomTablePagination
            total={fixedAssetData?.total}
            success={fixedAssetSuccess}
            current_page={fixedAssetData?.current_page}
            per_page={fixedAssetData?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
            removeShadow
          />
        </Box>

        <Stack flexDirection="row" width="100%" justifyContent="space-between" flexWrap="wrap" alignItems="center">
          <Box sx={{ pl: "5px" }}>
            <Typography fontFamily="Anton, Impact, Roboto" fontSize="18px" color="secondary.main">
              Selected : {watch("tagNumber").length}
            </Typography>
          </Box>

          <Stack gap={1.2} flexDirection="row" alignSelf="flex-end">
            <LoadingButton
              variant="contained"
              loading={isLoading}
              startIcon={isLoading ? null : <Print color={watch("tagNumber").length === 0 ? "gray" : "primary"} />}
              disabled={watch("tagNumber").length === 0}
              type="submit"
              color={printMemo ? "tertiary" : "secondary"}
              sx={{ color: "white" }}
            >
              {printMemo ? "Print Assignment Memo" : "Print"}
            </LoadingButton>

            <Button variant="outlined" size="small" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </Stack>

        <Dialog
          open={printAssignmentMemo}
          TransitionComponent={Grow}
          PaperProps={{
            sx: {
              borderRadius: "10px",
              margin: "0",
              maxWidth: "90%",
              padding: "20px",
              // overflow: "hidden",
              bgcolor: "background.light",
            },
          }}
        >
          <Box>
            <AssignmentMemo
              data={faData}
              setPrintAssignmentMemo={setPrintAssignmentMemo}
              memoData={memoData}
              selectedMemo={selectedMemo}
              fixedAssetRefetch={fixedAssetRefetch}
            />
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default PrintFixedAsset;
