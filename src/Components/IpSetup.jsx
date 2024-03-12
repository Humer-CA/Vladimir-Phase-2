import React, { useEffect, useState } from "react";
import "../Style/changePassword.scss";
import ipAddressIcon from "../Img/PNG/ipAddress.png";
import CustomTextField from "./Reusable/CustomTextField";
import CustomNumberField from "./Reusable/CustomNumberField";
import moment from "moment";

import {
  useDeleteIpAddressApiMutation,
  useGetIpAddressAllApiQuery,
  useGetIpAddressApiQuery,
  useGetIpAddressPretestApi,
  usePatchIpAddressStatusApiMutation,
  usePostIpAddressApiMutation,
} from "../Redux/Query/IpAddressSetup";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useDispatch } from "react-redux";
import { openToast } from "../Redux/StateManagement/toastSlice";
import { openIpSetupDialog, closeIpSetupDialog } from "../Redux/StateManagement/ipSetupSlice";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  Divider,
  FormGroup,
  IconButton,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  AddCircle,
  AddCircleOutline,
  ArrowBackIosNewRounded,
  CheckCircleOutline,
  CheckRounded,
  Close,
  Delete,
  EditRounded,
  Help,
  Lens,
  PrintDisabledRounded,
  RemoveCircleOutline,
  Report,
  ReportProblem,
  Warning,
} from "@mui/icons-material";
import axios from "axios";
import { closeConfirm, onLoading, openConfirm } from "../Redux/StateManagement/confirmSlice";
import CustomTablePagination from "./Reusable/CustomTablePagination";

const schema = yup.object().shape({
  id: yup.string(),
  ip: yup.string().required().label("IP Address"),
  name: yup.string().required().label("User"),
});

const IpSetup = (props) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [ipAddress, setIpAddress] = useState("");
  const [ipName, setIpName] = useState({
    status: true,
    ip: null,
    name: "",
  });

  const isSmallScreen = useMediaQuery("(max-width: 1375px)");
  const isSmallerScreen = useMediaQuery("(max-width: 500px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  // Table Sorting --------------------------------

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("is_active");

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

  const isLocalIp = process.env.VLADIMIR_BASE_URL === `https://pretestalpha.rdfmis.ph/server/api`;
  const {
    data: ipData,
    isLoading: isIpLoading,
    isSuccess: isIpSuccess,
    isError: isIpError,
    refetch,
  } = useGetIpAddressApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  // const {
  //   data: ipPretestData,
  //   isLoading: isIpPretestLoading,
  //   isSuccess: isIpPretestSuccess,
  //   isError: isIpPretestError,
  //   refetch: isIpPretestRefetch,
  // } = useGetIpAddressPretestApi(
  //   {
  //     page: page,
  //     perPage: perPage,
  //     status: status,
  //     search: search,
  //   },
  //   { refetchOnMountOrArgChange: true }
  // );

  const [
    postIpAddress,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostIpAddressApiMutation();

  const [patchIpStatusApi, { patchData }] = usePatchIpAddressStatusApiMutation();

  const [deleteIpStatusApi, { deleteData }] = useDeleteIpAddressApiMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ip: "",
      name: "",
    },
  });

  const onUpdateResetHandler = () => {
    setIpName({
      ip: "",
      name: "",
    });
  };

  useEffect(() => {
    if (isPostSuccess) {
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("ip", {
        type: "validate",
        message: postError?.data?.message,
      });
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);
  //   console.log(isPostError);
  //   console.log(postError);
  //   console.log(ipData);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(isLocalIp ? "https://pretestalpha.rdfmis.ph/server/api" : "https://vladimir.rdfmis.ph/server/api", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setIpAddress(data?.data);
        // console.log("Response:", data?.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setValue("ip", ipAddress);
  }, [ipAddress]);

  const searchHandler = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
      setPage(1);
    }
  };

  // const onSetStatusHandler = async (id, action = "update") => {
  //   dispatch(
  //     openConfirm({
  //       icon: action === "update" ? Help : Warning,
  //       iconColor: action === "update" ? "info" : "warning",
  //       message: (
  //         <Box>
  //           <Typography> Are you sure you want to</Typography>
  //           <Typography
  //             sx={{
  //               display: "inline-block",
  //               color: "secondary.main",
  //               fontWeight: "bold",
  //             }}
  //           >
  //             {action === "delete" ? "DELETE" : "ACTIVATE"}
  //           </Typography>{" "}
  //           this IP Address?
  //         </Box>
  //       ),

  //       onConfirm: async () => {
  //         try {
  //           dispatch(onLoading());
  //           let result;
  //           if (action === "delete") {
  //             result = await deleteIpStatusApi(id).unwrap();
  //           } else {
  //             result = await patchIpStatusApi(id).unwrap();
  //           }
  //           setPage(1);
  //           dispatch(
  //             openToast({
  //               message: result.message,
  //               duration: 5000,
  //             })
  //           );
  //           dispatch(closeConfirm());
  //         } catch (err) {
  //           if (err?.status === 422) {
  //             dispatch(
  //               openToast({
  //                 message: err.data.message,
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

  const onSetStatusHandler = async (id, action = "update") => {
    dispatch(
      openConfirm({
        icon: action === "update" ? Help : Warning,
        iconColor: action === "update" ? "info" : "alert",
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
              {action === "disable" ? "DISABLE" : "ACTIVATE"}
            </Typography>{" "}
            this IP Address?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result;

            result = await patchIpStatusApi(id).unwrap();

            setPage(1);
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
                  message: err.data.message,
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

  const onDeleteHandler = async (id, action = "delete") => {
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
              DELETE
            </Typography>{" "}
            this IP Address?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await deleteIpStatusApi(id).unwrap();

            setPage(1);
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
                  message: err.data.message,
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

  const onSubmitHandler = (formData) => {
    postIpAddress(formData);
    onUpdateResetHandler();
  };

  const handleCloseDialog = () => {
    handleGoBack();
  };

  return (
    <>
      {/* Back Button */}
      {isSmallScreen ? null : (
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            mt: "10px",
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackIosNewRounded sx={{ fontSize: "20px" }} />}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignSelf: "flex-start",
              left: 0,
              ml: "20px",
            }}
            color="secondary"
            onClick={handleCloseDialog}
          >
            Back
          </Button>
        </Stack>
      )}

      {/* Form */}
      <Stack
        gap="10px"
        height="100%"
        sx={
          isSmallScreen
            ? {
                alignItems: null,
                justifyContent: null,
                flexDirection: "column",
                padding: "0 20px",
              }
            : {
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                padding: "10px",
              }
        }
      >
        <Stack
          component="form"
          // alignSelf={isSmallScreen ? "flex-start" : "center"}
          // margin={isSmallScreen ? "auto" : null}
          width={isSmallScreen ? "100%" : null}
          gap={3}
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "10px 10px 20px #bebebe,-10px -15px 40px #ffffff",
            // maxWidth: "350px",
            // minWidth: isSmallScreen ? null : "300px",
            // flex: 1,
          }}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <Stack alignItems="center" gap={isSmallerScreen ? 1 : 2} flexDirection={isSmallScreen ? "row" : "column"}>
            {isSmallScreen ? (
              <IconButton onClick={handleCloseDialog}>
                <ArrowBackIosNewRounded />
              </IconButton>
            ) : null}
            {isSmallerScreen ? null : (
              <img
                src={ipAddressIcon}
                alt="icon"
                width={isSmallScreen ? "40px" : "100px"}
                height={isSmallScreen ? "40px" : "100px"}
              />
            )}
            <Typography
              color="secondary.main"
              sx={{
                fontFamily: "Anton",
                fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
                textAlign: isSmallScreen ? "left" : "center",
              }}
            >
              Printer IP Configuration
            </Typography>
          </Stack>

          <Stack
            flexDirection={isSmallerScreen ? "column" : isSmallScreen ? "row" : "column"}
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <CustomTextField
              autoComplete="off"
              control={control}
              label="IP Address"
              name="ip"
              color="secondary"
              size={isSmallScreen ? "small" : null}
              validateText={false}
              error={!!errors?.ip}
              helperText={errors?.ip?.message}
              fullWidth
              onInput={null}
              sx={{
                ".MuiInputBase-root": {
                  background: "white",
                },
              }}
            />

            <CustomTextField
              control={control}
              name="name"
              label="User"
              color="secondary"
              size={isSmallScreen ? "small" : null}
              error={!!errors?.name}
              helperText={errors?.name?.message}
              fullWidth
            />

            <LoadingButton
              type="submit"
              variant="contained"
              startIcon={<AddCircle />}
              sx={{
                width: isSmallerScreen ? "100%" : isSmallScreen ? "200px" : "100%",
                borderRadius: "10px",
              }}
              loading={isPostLoading}
            >
              ADD
            </LoadingButton>
          </Stack>
        </Stack>

        {/* Table */}
        <Stack
          direction="column"
          gap="10px"
          sx={{
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "10px 10px 20px #bebebe,-10px -15px 40px #ffffff",
            padding: "10px",
            // flex: 1,
          }}
        >
          <TextField
            autoComplete="off"
            variant="outlined"
            name="search"
            label="🔍︎ Search"
            type="text"
            size="small"
            color="secondary"
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "10px",
                border: ".5px",
                background: "white",
              },
              width: "98%",
              alignSelf: "center",
            }}
            onKeyUp={searchHandler}
          />

          <Box className="mcontainer__wrapper">
            <TableContainer
              // className="mcontainer__th-body"
              sx={{
                // height: "45vh",
                height: "300px",
                overflow: "auto",
                px: "10px",
              }}
            >
              <Table className="mcontainer__table" stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      "& > *": {
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        padding: "5px 10px",
                      },
                    }}
                  >
                    <TableCell className="tbl-cell text-center">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        ID No.
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === `ip`}
                        direction={orderBy === `ip` ? order : `asc`}
                        onClick={() => onSort(`ip`)}
                      >
                        IP Address
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        active={orderBy === `name`}
                        direction={orderBy === `name` ? order : `asc`}
                        onClick={() => onSort(`name`)}
                      >
                        User
                      </TableSortLabel>
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>Status</TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <TableSortLabel
                        active={orderBy === `updated_at`}
                        direction={orderBy === `updated_at` ? order : `asc`}
                        onClick={() => onSort(`updated_at`)}
                      >
                        Date Updated
                      </TableSortLabel>
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody sx={{ overflow: "overlay" }}>
                  {ipData?.data.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {isIpSuccess &&
                        [...ipData.data].sort(comparator(order, orderBy))?.map((data) => (
                          <TableRow
                            key={data.id}
                            hover={true}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                              "& > *": {
                                padding: "10px",
                              },
                            }}
                          >
                            <TableCell sx={{ textAlign: "center", pr: "45px" }}>{data.id}</TableCell>

                            <TableCell className="tbl-cell">{data.ip}</TableCell>

                            <TableCell className="tbl-cell">{data.name}</TableCell>

                            <TableCell sx={{ textAlign: "center" }}>
                              {data.is_active ? (
                                <Chip
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    background: "#27ff811f",
                                    color: "active.dark",
                                    fontSize: "0.7rem",
                                    px: 1,
                                  }}
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

                            <TableCell sx={{ textAlign: "center", pr: "45px" }}>
                              {moment(data.updated_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell
                              sx={{
                                whiteSpace: "nowrap",
                                textAlign: "center",
                              }}
                            >
                              {data.is_active ? (
                                <>
                                  {/* <Tooltip
                                      title="Active"
                                      placement="top"
                                      arrow
                                    >
                                      <IconButton
                                        size="small"
                                        sx={{
                                          padding: "1px",
                                          border: "2px solid #2cb263",
                                          cursor: "default",
                                        }}
                                      >
                                        <Lens
                                          sx={{
                                            color: "#2cb263",
                                            fontSize: "15px",
                                          }}
                                        />
                                      </IconButton>
                                    </Tooltip> */}

                                  <Tooltip title="Disable Print" placement="top" arrow>
                                    <IconButton size="small" onClick={() => onSetStatusHandler(data.id, "disable")}>
                                      <PrintDisabledRounded
                                      // sx={{ color: "primary.main" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : (
                                <>
                                  <Tooltip title="Activate" placement="top" arrow>
                                    <IconButton size="small" onClick={() => onSetStatusHandler(data.id)}>
                                      <CheckCircleOutline
                                      // sx={{ color: "primary.main" }}
                                      />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Delete" placement="top" arrow>
                                    <IconButton size="small" onClick={() => onDeleteHandler(data.id, "delete")}>
                                      <Delete
                                      // sx={{ color: "black.main" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box className="mcontainer__pagination">
              <CustomTablePagination
                total={ipData?.total}
                success={isIpSuccess}
                current_page={ipData?.current_page}
                per_page={ipData?.per_page}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
              {/* <TablePagination
                sx={{ padding: "0" }}
                rowsPerPageOptions={[
                  5,
                  10,
                  15,
                  {
                    label: "All",
                    value: parseInt(ipData?.data?.total),
                  },
                ]}
                component="div"
                count={isIpSuccess ? ipData?.data?.total : 0}
                page={isIpSuccess ? ipData?.data?.current_page - 1 : 0}
                rowsPerPage={isIpSuccess ? parseInt(ipData?.data?.per_page) : 5}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              /> */}
            </Box>
          </Box>
        </Stack>
      </Stack>

      {/* <Divider sx={{ border: "0.25px solid #c7c7c742" }} /> */}
      {/* </Box> */}
    </>
  );
};

export default IpSetup;
