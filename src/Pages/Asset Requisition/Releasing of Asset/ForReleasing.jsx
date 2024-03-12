// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
// import FaStatusChange from "../../../Components/Reusable/FaStatusComponent";

// import {
//   Box,
//   Button,
//   Checkbox,
//   Divider,
//   FormControlLabel,
//   IconButton,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TableSortLabel,
//   TextField,
//   Typography,
//   useMediaQuery,
// } from "@mui/material";
// import { DataArrayTwoTone, Help, Print, ResetTv, Search } from "@mui/icons-material";
// import { DatePicker } from "@mui/x-date-pickers";
// import { LoadingButton } from "@mui/lab";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import { useDispatch, useSelector } from "react-redux";

// import { closeDatePicker } from "../../../Redux/StateManagement/booleanStateSlice";
// import {
//   useGetFixedAssetApiQuery,
//   useGetPrintViewingApiQuery,
//   usePostPrintApiMutation,
//   usePostLocalPrintApiMutation,
// } from "../../../Redux/Query/FixedAsset/FixedAssets";
// import { usePostPrintOfflineApiMutation } from "../../../Redux/Query/FixedAsset/OfflinePrintingFA";
// import { usePostPrintStalwartDateApiMutation } from "../../../Redux/Query/FixedAsset/StalwartPrintingFA";
// import { useGetTypeOfRequestAllApiQuery } from "../../../Redux/Query/Masterlist/TypeOfRequest";
// import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
// import CustomTextField from "../../../Components/Reusable/CustomTextField";
// import { openToast } from "../../../Redux/StateManagement/toastSlice";
// import NoRecordsFound from "../../../Layout/NoRecordsFound";
// import { useGetIpApiQuery } from "../../../Redux/Query/IpAddressSetup";
// import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";
// import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

// const schema = yup.object().shape({
//   id: yup.string(),
//   tagNumber: yup.array().required(),
//   search: yup.string().nullable(),
//   startDate: yup.date().nullable(),
//   endDate: yup.date().nullable(),
// });

// const ForReleasing = () => {
//   const [search, setSearch] = useState("");
//   const [perPage, setPerPage] = useState(5);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [page, setPage] = useState(1);
//   const [status, setStatus] = useState("active");

//   const dispatch = useDispatch();

//   const isSmallScreen = useMediaQuery("(max-width: 850px)");

//   // Table Sorting --------------------------------

//   const [order, setOrder] = useState("desc");
//   const [orderBy, setOrderBy] = useState("id");

//   const descendingComparator = (a, b, orderBy) => {
//     // console.log(orderBy.split(".").toString());
//     const multiple = orderBy.split(".").length > 1;
//     if (multiple) {
//       const [orderBy1, orderBy2] = orderBy.split(".");
//       if (b[orderBy1][orderBy2] < a[orderBy1][orderBy2]) {
//         return -1;
//       }
//       if (b[orderBy1][orderBy2] > a[orderBy1][orderBy2]) {
//         return 1;
//       }
//       return 0;
//     }

//     if (b[orderBy] < a[orderBy]) {
//       return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//       return 1;
//     }
//     return 0;
//   };

//   const comparator = (order, orderBy) => {
//     return order === "desc"
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy);
//   };

//   const onSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const perPageHandler = (e) => {
//     setPage(1);
//     setPerPage(parseInt(e.target.value));
//   };

//   const pageHandler = (_, page) => {
//     // console.log(page + 1);
//     setPage(page + 1);
//   };

//   const isLocalIp = `210.5.110.212`;

//   const { data: ip } = useGetIpApiQuery();

//   const [printAsset, { data: printData, isLoading, isError: isPostError, isSuccess: isPostSuccess, error: postError }] =
//     usePostPrintApiMutation();

//   const {
//     data: fixedAssetData,
//     isLoading: fixedAssetLoading,
//     isSuccess: fixedAssetSuccess,
//     isError: fixedAssetError,
//     error: errorData,
//     refetch: fixedAssetRefetch,
//   } = useGetPrintViewingApiQuery(
//     {
//       page: page,
//       per_page: perPage,
//       status: status,
//       search: search,
//       startDate: startDate,
//       endDate: endDate,
//     },
//     { refetchOnMountOrArgChange: true }
//   );

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

//   useEffect(() => {
//     if (isPostSuccess) {
//       dispatch(
//         openToast({
//           message: printData?.message,
//           duration: 5000,
//         })
//       );
//     }
//   }, [isPostSuccess]);

//   useEffect(() => {
//     if (isPostError && postError?.status === 422) {
//       setError("search", {
//         type: "validate",
//         message: postError?.data?.message,
//       });
//     } else if (isPostError && postError?.status === 403) {
//       dispatch(
//         openToast({
//           message: postError?.data?.message,
//           duration: 5000,
//           variant: "error",
//         })
//       );
//     } else if (isPostError && postError?.status === 404) {
//       dispatch(
//         openToast({
//           message: postError?.data?.message,
//           duration: 5000,
//           variant: "error",
//         })
//       );
//     } else if (isPostError && postError?.status !== 422) {
//       dispatch(
//         openToast({
//           message: "Something went wrong. Please try again.",
//           duration: 5000,
//           variant: "error",
//         })
//       );
//       // console.log(postError);
//     }
//   }, [isPostError]);

//   const handleClose = () => {
//     dispatch(closeDatePicker());
//   };

//   const searchHandler = (e) => {
//     if (e.key === "Enter") {
//       setSearch(e.target.value);
//       e.preventDefault();
//     }
//   };

//   const handleSearchClick = () => {
//     setSearch(watch("search"));

//     if (!watch("startDate")) {
//       setStartDate(null);
//     } else {
//       setStartDate(moment(watch("startDate")).format("YYYY-MM-DD"));
//     }

//     if (!watch("endDate")) {
//       setEndDate(null);
//     } else {
//       setEndDate(moment(watch("endDate")).format("YYYY-MM-DD"));
//     }
//   };

//   return (
//     <>
//       <Box
//         component="form"
//         onSubmit={handleSubmit()}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-start",
//           justifyContent: "center",
//           gap: "10px",
//         }}
//       >
//         <Stack flexDirection="row" alignItems="center" pl="10px" gap={1.5}>
//           <Print color="primary" fontSize="large" />
//           <Typography
//             noWrap
//             variant="h5"
//             color="secondary"
//             sx={{
//               fontFamily: "Anton",
//             }}
//           >
//             Print Assets
//           </Typography>
//         </Stack>
//         <Divider width="100%" sx={{ boxShadow: "1px solid black" }} />

//         <Stack
//           py={0.5}
//           px={1}
//           flexDirection={isSmallScreen ? "column" : "row"}
//           // flexDirection="row"
//           justifyContent="space-between"
//           alignItems="center"
//           width="100%"
//           gap={1}
//         >
//           <Stack sx={{ width: isSmallScreen ? "100%" : "350px" }}>
//             <CustomTextField
//               control={control}
//               name="search"
//               label="Search"
//               type="text"
//               color="secondary"
//               size="small"
//               onKeyDown={searchHandler}
//               fullWidth={isSmallScreen ? true : false}
//             />
//           </Stack>

//           <Stack flexDirection="row" gap={isSmallScreen ? 1 : 2} flexWrap={isSmallScreen ? "wrap" : null}>
//             <Stack flexDirection="row" gap={1} width={isSmallScreen ? "100%" : null}>
//               <CustomDatePicker
//                 control={control}
//                 name="startDate"
//                 label="Start Date"
//                 size="small"
//                 views={["year", "month", "day"]}
//                 // openTo="year"
//                 fullWidth
//                 disableFuture
//                 reduceAnimations
//                 onChange={(_, value) => {
//                   setValue("endDate", null);
//                   return value;
//                 }}
//               />

//               <CustomDatePicker
//                 control={control}
//                 name="endDate"
//                 label="End Date"
//                 size="small"
//                 views={["year", "month", "day"]}
//                 fullWidth
//                 disableFuture
//                 reduceAnimations
//                 disabled={watch("startDate") === null || watch("startDate") === ""}
//               />
//             </Stack>

//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleSearchClick}
//               sx={{
//                 backgroundColor: "primary",
//                 width: isSmallScreen && "100%",
//               }}
//             >
//               {isSmallScreen ? (
//                 <>
//                   <Search /> {"  "}Search
//                 </>
//               ) : (
//                 <Search />
//               )}
//             </Button>
//           </Stack>
//         </Stack>
//         <Box
//           sx={{
//             border: "1px solid lightgray",
//             borderRadius: "10px",
//             width: "100%",
//             // maxWidth: "850px",
//           }}
//         >
//           <Box>
//             <TableContainer className="mcontainer__th-body-category">
//               <Table className="mcontainer__table" stickyHeader>
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       "& > *": {
//                         fontWeight: "bold!important",
//                         whiteSpace: "nowrap",
//                       },
//                     }}
//                   >
//                     <TableCell className="tbl-cell">
//                       <TableSortLabel
//                         active={orderBy === `warehouse_number`}
//                         direction={orderBy === `warehouse_number` ? order : `asc`}
//                         onClick={() => onSort(`warehouse_number`)}
//                       >
//                         Warehouse No.
//                       </TableSortLabel>
//                     </TableCell>
//                     <TableCell className="tbl-cell">
//                       <TableSortLabel
//                         active={orderBy === `warehouse_number`}
//                         direction={orderBy === `warehouse_number` ? order : `asc`}
//                         onClick={() => onSort(`warehouse_number`)}
//                       >
//                         Type of Request
//                       </TableSortLabel>
//                     </TableCell>
//                     <TableCell className="tbl-cell">
//                       <TableSortLabel
//                         active={orderBy === `vladimir_tag_number`}
//                         direction={orderBy === `vladimir_tag_number` ? order : `asc`}
//                         onClick={() => onSort(`vladimir_tag_number`)}
//                       >
//                         Vladimir Tag Number
//                       </TableSortLabel>
//                     </TableCell>
//                     <TableCell className="tbl-cell">Oracle No.</TableCell>

//                     <TableCell className="tbl-cell">Chart of Accounts</TableCell>

//                     <TableCell className="tbl-cell">
//                       <TableSortLabel
//                         active={orderBy === `requestor`}
//                         direction={orderBy === `requestor` ? order : `asc`}
//                         onClick={() => onSort(`requestor`)}
//                       >
//                         Requestor
//                       </TableSortLabel>
//                     </TableCell>

//                     <TableCell className="tbl-cell">Accountability</TableCell>
//                     <TableCell className="tbl-cell">
//                       <TableSortLabel
//                         active={orderBy === `created_at`}
//                         direction={orderBy === `created_at` ? order : `asc`}
//                         onClick={() => onSort(`created_at`)}
//                       >
//                         Date Created
//                       </TableSortLabel>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {releasingData?.data?.length === 0 ? (
//                     <NoRecordsFound category />
//                   ) : (
//                     <>
//                       {releasingSuccess &&
//                         [...releasingData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
//                           <TableRow
//                             key={data.id}
//                             hover
//                             onClick={() => handleViewData(data)}
//                             sx={{
//                               "&:last-child td, &:last-child th": {
//                                 borderBottom: 0,
//                               },
//                               cursor: "pointer",
//                             }}
//                           >
//                             <TableCell className="tbl-cell">{data.warehouse_number?.warehouse_number}</TableCell>
//                             <TableCell className="tbl-cell">
//                               <Typography fontSize={12} fontWeight={600} color="primary.main">
//                                 {data.type_of_request?.type_of_request_name}
//                               </Typography>
//                               <Typography fontSize={14} fontWeight={600}>
//                                 {data.asset_description}
//                               </Typography>
//                               <Typography fontSize={14}>{data.asset_specification}</Typography>
//                             </TableCell>
//                             <TableCell className="tbl-cell text-weight">{data.vladimir_tag_number}</TableCell>
//                             <TableCell className="tbl-cell">
//                               <Typography fontSize={12} color="text.light">
//                                 PR - {data.pr_number}
//                               </Typography>
//                               <Typography fontSize={12} color="text.light">
//                                 PO - {data.po_number}
//                               </Typography>
//                               <Typography fontSize={12} color="text.light">
//                                 RR - {data.rr_number}
//                               </Typography>
//                             </TableCell>

//                             <TableCell className="tbl-cell">
//                               <Typography fontSize={10} color="gray">
//                                 ({data.company?.company_code}) - {data.company?.company_name}
//                               </Typography>
//                               <Typography fontSize={10} color="gray">
//                                 ({data.department?.department_code}) - {data.department?.department_name}
//                               </Typography>
//                               <Typography fontSize={10} color="gray">
//                                 ({data.location?.location_code}) - {data.location?.location_name}
//                               </Typography>
//                               <Typography fontSize={10} color="gray">
//                                 ({data.account_title?.account_title_code}) - {data.account_title?.account_title_name}
//                               </Typography>
//                             </TableCell>

//                             <TableCell className="tbl-cell ">
//                               {`(${data.requestor?.employee_id}) - ${data.requestor?.firstname} ${data.requestor?.lastname}`}
//                             </TableCell>

//                             {released && <TableCell className="tbl-cell ">{data.received_by}</TableCell>}

//                             <TableCell className="tbl-cell">
//                               <Typography fontSize={14} fontWeight={600}>
//                                 {data.accountability}
//                               </Typography>
//                               <Typography fontSize={12}>{data.accountable}</Typography>
//                             </TableCell>
//                             <TableCell className="tbl-cell tr-cen-pad45">
//                               {Moment(data.created_at).format("MMM DD, YYYY")}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                     </>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//           <CustomTablePagination
//             total={releasingData?.total}
//             success={releasingSuccess}
//             current_page={releasingData?.current_page}
//             per_page={releasingData?.per_page}
//             onPageChange={pageHandler}
//             onRowsPerPageChange={perPageHandler}
//           />
//         </Box>

//         <Stack flexDirection="row" width="100%" justifyContent="space-between" flexWrap="wrap" alignItems="center">
//           <Box sx={{ pl: "5px" }}>
//             <Typography fontFamily="Anton, Impact, Roboto" fontSize="18px" color="secondary.main">
//               Selected : {watch("tagNumber").length}
//             </Typography>
//           </Box>

//           <Stack gap={1.2} flexDirection="row" alignSelf="flex-end">
//             <LoadingButton
//               variant="contained"
//               loading={isLoading}
//               startIcon={
//                 isLoading ? null : (
//                   // <Print color={disabledItems() ? "lightgray" : "primary"} />
//                   <Print color={watch("tagNumber").length === 0 ? "gray" : "primary"} />
//                 )
//               }
//               disabled={watch("tagNumber").length === 0}
//               type="submit"
//               color="secondary"
//               // disabled={disabledItems()}
//             >
//               Print
//             </LoadingButton>

//             <Button variant="outlined" size="small" color="secondary" onClick={handleClose}>
//               Close
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>
//     </>
//   );
// };

// export default ForReleasing;
