import React, { useEffect, useState } from "react";
import moment from "moment";
import CustomAutoComplete from "../../Components/Reusable/CustomAutoComplete";
import FaStatusChange from "../../Components/Reusable/FaStatusComponent";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  Fade,
  FormControlLabel,
  FormGroup,
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
import {
  Close,
  DataArrayTwoTone,
  Filter,
  FilterAlt,
  FilterList,
  Help,
  Print,
  ResetTv,
  Search,
  Visibility,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch } from "react-redux";

import { closeDatePicker, closeDialog, closePrint } from "../../Redux/StateManagement/booleanStateSlice";
import {
  useGetPrintViewingApiQuery,
  usePostPrintApiMutation,
  usePostLocalPrintApiMutation,
  usePutMemoPrintApiMutation,
  useGetReprintMemoApiQuery,
  useGetFixedAssetAllApiQuery,
} from "../../Redux/Query/FixedAsset/FixedAssets";

import CustomDatePicker from "../../Components/Reusable/CustomDatePicker";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import NoRecordsFound from "../../Layout/NoRecordsFound";
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

const AssignmentMemoReprint = (props) => {
  const { isRequest } = props;

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [printMemo, setPrintMemo] = useState(false);
  const [printAssignmentMemo, setPrintAssignmentMemo] = useState(false);
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

  const [printAsset, { data: printData, isLoading, isError: isPostError, isSuccess: isPostSuccess, error: postError }] =
    usePostPrintApiMutation();

  const {
    data: fixedAssetData,
    isLoading: fixedAssetLoading,
    isSuccess: fixedAssetSuccess,
    isError: fixedAssetError,
    error: errorData,
    refetch: fixedAssetRefetch,
  } = useGetFixedAssetAllApiQuery({}, { refetchOnMountOrArgChange: true });

  const {
    data: assignedData,
    isLoading: assignedLoading,
    isSuccess: assignedSuccess,
    isError: assignedError,
    refetch: assignedRefetch,
  } = useGetReprintMemoApiQuery(
    {
      page: page,
      per_page: perPage,
      search: search,
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

  const onPrintMemoHandler = async (data) => {
    // console.log(formData);

    setFaData(fixedAssetData);
    setSelectedMemo(data?.vladimir_tag_number);
    setPrintAssignmentMemo(true);
  };

  // console.log("fixedAssetData - Memo", fixedAssetData);
  // console.log("assignedData", assignedData?.data);
  // console.log("selectedMemo", selectedMemo);

  const handleClose = () => {
    dispatch(closeDialog());
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

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Stack flexDirection="row" justifyContent="space-between" width="100%">
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
            <Stack flexDirection="row" pl="10px" gap={1.5}>
              <Print color="primary" fontSize="large" />
              <Typography
                noWrap
                variant="h5"
                color="secondary"
                sx={{
                  fontFamily: "Anton",
                }}
              >
                Assigned Memo
              </Typography>
            </Stack>

            <IconButton variant="outlined" size="small" color="secondary" onClick={handleClose}>
              <Close />
            </IconButton>
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
                views={["year", "month", "day"]}
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
                <TableRow>
                  <TableCell sx={{ bgcolor: "secondary.main", color: "white" }} align="center">
                    Id
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main", color: "white" }}>Series</TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main", color: "white" }} align="center">
                    View
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main", color: "white" }} align="center">
                    Asset Status
                  </TableCell>
                  <TableCell sx={{ bgcolor: "secondary.main", color: "white" }} align="center">
                    Date Created
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {assignedSuccess && assignedData?.data?.length === 0 ? (
                  <NoRecordsFound heightData="xs" />
                ) : (
                  <>
                    {assignedSuccess &&
                      [...assignedData?.data].sort(comparator(order, orderBy))?.map((data) => {
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
                              <Typography fontSize="16px">{data.id}</Typography>
                            </TableCell>

                            <TableCell>
                              <Typography noWrap variant="h6" fontSize="16px" color="secondary" fontWeight="bold">
                                {data.memo_series}
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <IconButton onClick={() => onPrintMemoHandler(data)}>
                                <Visibility color="secondary" />
                              </IconButton>
                            </TableCell>

                            <TableCell align="center">
                              <Chip
                                size="small"
                                variant="contained"
                                sx={{
                                  background: "#27ff811f",
                                  color: "active.dark",
                                  fontSize: "0.7rem",
                                  px: 1,
                                }}
                                label="PRINTED"
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Typography noWrap>{moment(data.created_at).format("MMM-DD-YYYY")}</Typography>
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
            total={assignedData?.data?.total}
            success={assignedSuccess}
            current_page={assignedData?.data?.current_page}
            per_page={assignedData?.data?.per_page}
            onPageChange={pageHandler}
            onRowsPerPageChange={perPageHandler}
            removeShadow
          />
        </Box>
        <Dialog
          open={printAssignmentMemo}
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
              selectedMemo={selectedMemo}
              series={assignedData?.data[0]?.memo_series}
            />
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default AssignmentMemoReprint;
