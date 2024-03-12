import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ImportFixedAsset from "./ImportFixedAsset";
import ExportFixedAsset from "./ExportFixedAsset";
import CustomDateRangePicker from "../../Components/Reusable/CustomDateRangePicker";
import PrintFixedAsset from "./PrintFixedAsset";
import AddFixedAsset from "./AddEdit/AddFixedAsset";
import { useLocation, useNavigate } from "react-router-dom";
import FaStatusChange from "../../Components/Reusable/FaStatusComponent";
import useExcel from "../../Hooks/Xlsx";
// import EditFixedAsset from "./AddEdit/FixedAssetComponents/EditFixedAsset_old";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import ActionMenu from "../../Components/Reusable/ActionMenu";

import {
  useArchiveFixedAssetStatusApiMutation,
  useGetFixedAssetApiQuery,
  useLazyGetExportApiQuery,
  useGetFixedAssetIdApiQuery,
} from "../../Redux/Query/FixedAsset/FixedAssets";

// RTK
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";

// import { openScan } from "../../Redux/StateManagement/scanFileSlice";
// import { openExport } from "../../Redux/StateManagement/exportFileSlice";
import {
  closeDrawer,
  closeDialog,
  closeImport,
  closeScan,
  openExport,
  closeExport,
  closeDatePicker,
  closeDrawer1,
} from "../../Redux/StateManagement/booleanStateSlice";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
  Drawer,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Help, IosShareRounded, ReportProblem } from "@mui/icons-material";
import ScanFixedAsset from "./ScanFixedAsset";
import AddCost from "./AddEdit/AddCost";
import { useGetAdditionalCostIdApiQuery } from "../../Redux/Query/FixedAsset/AdditionalCost";
import ImportCost from "./ImportCost";
import useScanDetection from "use-scan-detection-react18";

const FixedAsset = (props) => {
  const navigate = useNavigate();
  const { excelExport } = useExcel();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("active");
  // const [scanAsset, setScanAsset] = useState(false);
  const [faStatus, setFaStatus] = useState("");
  const [updateFixedAsset, setUpdateFixedAsset] = useState({
    status: false,
    id: "",
    type_of_request_id: "",
    capex_id: "",
    project_name: "",
    is_old_asset: null,
    tag_number: "",
    tag_number_old: "",

    division_id: null,
    major_category_id: null,
    minor_category_id: null,
    company_id: null,
    department_id: null,
    location_id: null,
    account_title_id: null,

    asset_description: "",
    asset_specification: "",
    accountability: null,
    accountable: "",
    cellphone_number: "",
    brand: "",
    care_of: "",
    voucher: "",
    receipt: "",
    quantity: "",
    // faStatus: "Good",

    depreciation_method: null,
    est_useful_life: "",
    acquisition_date: null,
    acquisition_cost: "",
    age: "",
    scrap_value: "",
    original_cost: "",
    accumulated_cost: "",
    start_depreciation: "",
    end_depreciation: null,
    depreciation_per_year: "",
    depreciation_per_month: "",
    remaining_book_value: "",
  });

  const drawer = useSelector((state) => state.booleanState.drawer);
  const drawer2 = useSelector((state) => state.booleanState.drawerMultiple.drawer2);
  const drawer1 = useSelector((state) => state.booleanState.drawerMultiple.drawer1);
  const add = useSelector((state) => state.booleanState.add);
  const importFile = useSelector((state) => state.booleanState.importFile);
  const datePicker = useSelector((state) => state.booleanState.datePicker);
  const exportFile = useSelector((state) => state.booleanState.exportFile);
  const scanFile = useSelector((state) => state.booleanState.scanFile);

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

  const {
    data: fixedAssetData,
    isLoading: fixedAssetLoading,
    isSuccess: fixedAssetSuccess,
    isError: fixedAssetError,
    error: errorData,
    refetch: fixedAssetRefetch,
  } = useGetFixedAssetApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  // console.log(fixedAssetData);

  const dispatch = useDispatch();
  const onUpdateResetHandler = () => {
    setUpdateFixedAsset({
      status: false,
      id: "",
      type_of_request_id: "",
      capex: null,
      project_name: "",
      is_old_asset: null,
      tag_number: "",
      tag_number_old: "",

      division_id: null,
      major_category_id: null,
      minor_category_id: null,
      company_id: null,
      department_id: null,
      location_id: null,
      account_title_id: null,

      asset_description: "",
      asset_specification: "",
      accountability: null,
      accountable: "",
      cellphone_number: "",
      brand: "",
      care_of: "",
      voucher: "",
      receipt: "",
      quantity: "",
      // faStatus: "Good",

      depreciation_method: null,
      est_useful_life: "",
      acquisition_date: null,
      acquisition_cost: "",
      age: "",
      scrap_value: "",
      original_cost: "",
      accumulated_cost: "",
      start_depreciation: "",
      end_depreciation: null,
      depreciation_per_year: "",
      depreciation_per_month: "",
      remaining_book_value: "",
    });
  };

  const handleTableData = (data) => {
    navigate(`/fixed-assets/${data.vladimir_tag_number}`, {
      state: { ...data, status },
    });
  };

  useScanDetection({
    onComplete: (code) => {
      handleTableData({
        vladimir_tag_number: code,
      });
      console.log(code);
    },
    averageWaitTime: 16,
    minLength: 11,
  });

  const handleOpenExport = () => {
    dispatch(openExport());
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Fixed Assets
      </Typography>

      {fixedAssetLoading && <MasterlistSkeleton onAdd={true} onImport={true} onPrint={true} />}

      {fixedAssetError && <ErrorFetching refetch={fixedAssetRefetch} error={errorData} />}

      {fixedAssetData && !fixedAssetError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            // onFaStatusChange={setFaStatus}
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            onAdd={() => {}}
            onImport={() => {}}
            onPrint={() => {}}
            faStatus
            scanAsset
            openScan
            hideArchive
          />

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
                    {/* <TableCell className="tbl-cell-fa text-center">
                      <TableSortLabel
                        active={orderBy === `id`}
                        direction={orderBy === `id` ? order : `asc`}
                        onClick={() => onSort(`id`)}
                      >
                        ID No.
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `vladimir_tag_number`}
                        direction={orderBy === `vladimir_tag_number` ? order : `asc`}
                        onClick={() => onSort(`vladimir_tag_number`)}
                      >
                        Vladimir Tag #
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `capex`}
                        direction={orderBy === `capex` ? order : `asc`}
                        onClick={() => onSort(`capex`)}
                      >
                        CAPEX
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `acquisition_date`}
                        direction={
                          orderBy === `acquisition_date` ? order : `asc`
                        }
                        onClick={() => onSort(`acquisition_date`)}
                      >
                        Acquisition Date
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `accountability`}
                        direction={orderBy === `accountability` ? order : `asc`}
                        onClick={() => onSort(`accountability`)}
                      >
                        Accountability
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `accountable`}
                        direction={orderBy === `accountable` ? order : `asc`}
                        onClick={() => onSort(`accountable`)}
                      >
                        Accountable
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `cellphone_number`}
                        direction={
                          orderBy === `cellphone_number` ? order : `asc`
                        }
                        onClick={() => onSort(`cellphone_number`)}
                      >
                        Cellphone Number
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `brand`}
                        direction={orderBy === `brand` ? order : `asc`}
                        onClick={() => onSort(`brand`)}
                      >
                        Brand
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `company_code`}
                        direction={orderBy === `company_code` ? order : `asc`}
                        onClick={() => onSort(`company_code`)}
                      >
                        Additional Cost Count
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `division`}
                        direction={orderBy === `division` ? order : `asc`}
                        onClick={() => onSort(`division`)}
                      >
                        Division
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `major_category`}
                        direction={orderBy === `major_category` ? order : `asc`}
                        onClick={() => onSort(`major_category`)}
                      >
                        Major Category
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `minor_category`}
                        direction={orderBy === `minor_category` ? order : `asc`}
                        onClick={() => onSort(`minor_category`)}
                      >
                        Minor Category
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `voucher`}
                        direction={orderBy === `voucher` ? order : `asc`}
                        onClick={() => onSort(`voucher`)}
                      >
                        Voucher #
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `receipt`}
                        direction={orderBy === `receipt` ? order : `asc`}
                        onClick={() => onSort(`receipt`)}
                      >
                        Reciept
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `quantity`}
                        direction={orderBy === `quantity` ? order : `asc`}
                        onClick={() => onSort(`quantity`)}
                      >
                        Quantity
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `depreciation_method`}
                        direction={
                          orderBy === `depreciation_method` ? order : `asc`
                        }
                        onClick={() => onSort(`depreciation_method`)}
                      >
                        Depreciation Method
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `est_useful_life`}
                        direction={
                          orderBy === `est_useful_life` ? order : `asc`
                        }
                        onClick={() => onSort(`est_useful_life`)}
                      >
                        EST. Useful Life
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `release_date`}
                        direction={orderBy === `release_date` ? order : `asc`}
                        onClick={() => onSort(`release_date`)}
                      >
                        Release Date
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `acquisition_cost`}
                        direction={
                          orderBy === `acquisition_cost` ? order : `asc`
                        }
                        onClick={() => onSort(`acquisition_cost`)}
                      >
                        Acquisition Cost
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `scrap_value`}
                        direction={orderBy === `scrap_value` ? order : `asc`}
                        onClick={() => onSort(`scrap_value`)}
                      >
                        Scrap Value
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `original_cost`}
                        direction={orderBy === `original_cost` ? order : `asc`}
                        onClick={() => onSort(`original_cost`)}
                      >
                        Original Cost
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `accumulated_cost`}
                        direction={
                          orderBy === `accumulated_cost` ? order : `asc`
                        }
                        onClick={() => onSort(`accumulated_cost`)}
                      >
                        Accumulated Cost
                      </TableSortLabel>
                    </TableCell>

                   

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `care_of`}
                        direction={orderBy === `care_of` ? order : `asc`}
                        onClick={() => onSort(`care_of`)}
                      >
                        Care-Of
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `age`}
                        direction={orderBy === `age` ? order : `asc`}
                        onClick={() => onSort(`age`)}
                      >
                        Age
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `end_depreciation`}
                        direction={
                          orderBy === `end_depreciation` ? order : `asc`
                        }
                        onClick={() => onSort(`end_depreciation`)}
                      >
                        End of Depreciation
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `depreciation_per_year`}
                        direction={
                          orderBy === `depreciation_per_year` ? order : `asc`
                        }
                        onClick={() => onSort(`depreciation_per_year`)}
                      >
                        Depreciation Per Year
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `depreciation_per_month`}
                        direction={
                          orderBy === `depreciation_per_month` ? order : `asc`
                        }
                        onClick={() => onSort(`depreciation_per_month`)}
                      >
                        Depreciation Per Month
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `remaining_book_value`}
                        direction={
                          orderBy === `remaining_book_value` ? order : `asc`
                        }
                        onClick={() => onSort(`remaining_book_value`)}
                      >
                        Remaining Book Value
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `start_depreciation`}
                        direction={
                          orderBy === `start_depreciation` ? order : `asc`
                        }
                        onClick={() => onSort(`start_depreciation`)}
                      >
                        Start Depreciation
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `company_code`}
                        direction={orderBy === `company_code` ? order : `asc`}
                        onClick={() => onSort(`company_code`)}
                      >
                        Chart Of Accounts
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell-fa text-center">
                      <TableSortLabel
                        active={orderBy === `asset_status_name`}
                        direction={orderBy === `asset_status_name` ? order : `asc`}
                        onClick={() => onSort(`asset_status_name`)}
                      >
                        Asset Status
                      </TableSortLabel>
                    </TableCell>

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `company_name`}
                        direction={orderBy === `company_name` ? order : `asc`}
                        onClick={() => onSort(`company_name`)}
                      >
                        Company
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `department_code`}
                        direction={
                          orderBy === `department_code` ? order : `asc`
                        }
                        onClick={() => onSort(`department_code`)}
                      >
                        Department Code
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `department_name`}
                        direction={
                          orderBy === `department_name` ? order : `asc`
                        }
                        onClick={() => onSort(`department_name`)}
                      >
                        Department
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `location_code`}
                        direction={orderBy === `location_code` ? order : `asc`}
                        onClick={() => onSort(`location_code`)}
                      >
                        Location Code
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `location_name`}
                        direction={orderBy === `location_name` ? order : `asc`}
                        onClick={() => onSort(`location_name`)}
                      >
                        Location
                      </TableSortLabel>
                    </TableCell> */}

                    {/* <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `account_title_code`}
                        direction={
                          orderBy === `account_title_code` ? order : `asc`
                        }
                        onClick={() => onSort(`account_title_code`)}
                      >
                        Account Title Code
                      </TableSortLabel>
                    </TableCell> */}
                    {/* 
                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `account_title_name`}
                        direction={
                          orderBy === `account_title_name` ? order : `asc`
                        }
                        onClick={() => onSort(`account_title_name`)}
                      >
                        Account Title
                      </TableSortLabel>
                    </TableCell> */}

                    <TableCell className="tbl-cell-fa text-center">
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
                  {fixedAssetData.data.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {fixedAssetSuccess &&
                        [...fixedAssetData.data].sort(comparator(order, orderBy))?.map((data, index) => {
                          return (
                            <TableRow
                              key={index}
                              hover={true}
                              onClick={() => handleTableData(data)}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                                cursor: "pointer",
                              }}
                            >
                              {/* <TableCell sx={{ display: "none" }}>
                                  {data.id}
                                </TableCell> */}

                              <TableCell className="tbl-cell-fa">
                                <Typography variant="h6" fontSize="16px" color="secondary" fontWeight="bold">
                                  {data.vladimir_tag_number}
                                </Typography>
                                <Typography fontSize="13px" color="gray">
                                  {data.asset_description}
                                </Typography>
                                <Typography
                                  fontSize="12px"
                                  fontWeight="bold"
                                  color={data.is_additional_cost === 0 ? "black.main" : "success.light"}
                                >
                                  {data.is_additional_cost === 0
                                    ? `Additional Cost Count - ${data.additional_cost_count}`
                                    : `(Additional Cost)`}
                                </Typography>
                                <Typography fontSize="12px" color="primary" fontWeight="bold">
                                  {data.type_of_request.type_of_request_name.toUpperCase()}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell-fa">
                                <Typography variant="p" fontSize="14px" color="secondary" fontWeight="bold">
                                  {data.capex.capex}
                                </Typography>
                                <Typography fontSize="12px" color="gray">
                                  {data.capex.project_name}
                                </Typography>

                                <Typography variant="p" fontSize="12px" color="secondary.light" fontWeight="bold">
                                  {data.sub_capex.sub_capex} ({data.sub_capex.sub_project})
                                </Typography>
                              </TableCell>

                              {/* <TableCell className="tbl-cell-fa">
                                  {data.acquisition_date}
                                </TableCell> */}

                              {/* <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.accountable}
                                </TableCell> */}

                              {/* <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.cellphone_number}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.brand}
                                </TableCell> */}

                              {/* <TableCell className="tbl-cell-fa">
                                  <Typography fontSize="14px" color="secondary">
                                    {data.additional_cost_count}
                                  </Typography>
                                </TableCell> */}

                              <TableCell className="tbl-cell-fa">
                                <Typography fontSize="14px" color="secondary">
                                  {data.division.division_name}
                                </Typography>
                              </TableCell>

                              {/* <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.major_category.major_category_name}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.minor_category.minor_category_name}
                                </TableCell> */}

                              {/* <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.voucher}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.receipt}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.quantity}
                                </TableCell> */}

                              {/* <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.depreciation_method}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.est_useful_life}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.release_date}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.acquisition_cost}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.scrap_value}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.original_cost}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.accumulated_cost}
                                </TableCell>

                              

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.care_of}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.age}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.end_depreciation}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.depreciation_per_year}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.depreciation_per_month}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.remaining_book_value}
                                </TableCell>

                                <TableCell
                                   
                                  className="tbl-cell-fa"
                                >
                                  {data.start_depreciation}
                                </TableCell> */}

                              <TableCell className="tbl-cell-fa">
                                <Typography fontSize="12px" color="gray">
                                  {data.company.company_code}
                                  {" - "} {data.company.company_name}
                                </Typography>
                                <Typography fontSize="12px" color="gray">
                                  {data.department.department_code}
                                  {" - "}
                                  {data.department.department_name}
                                </Typography>
                                <Typography fontSize="12px" color="gray">
                                  {data.location.location_code} {" - "}
                                  {data.location.location_name}
                                </Typography>
                                <Typography fontSize="12px" color="gray">
                                  {data.account_title.account_title_code}
                                  {" - "}
                                  {data.account_title.account_title_name}
                                </Typography>
                              </TableCell>

                              <TableCell className="tbl-cell-fa tr-cen-pad45">
                                <FaStatusChange
                                  faStatus={data.asset_status.asset_status_name}
                                  data={data.asset_status.asset_status_name}
                                />
                              </TableCell>

                              <TableCell className="tbl-cell-fa tr-cen-pad45">
                                {Moment(data.created_at).format("MMM DD, YYYY")}
                              </TableCell>
                            </TableRow>

                            // <TableRow
                            //   key={data.id}
                            //   hover={true}
                            //   onClick={() => handleTableData(data)}
                            //   sx={{
                            //     "& > *": {
                            //       borderBottom: 0,
                            //     },
                            //     display: "flex",
                            //     justifyContent: "flex-start",
                            //     alignItems: "center",
                            //     gap: 5,
                            //     px: 5,
                            //     cursor: "pointer",
                            //     borderRadius: "10px",
                            //     border: "1px solid #c7c7c750",
                            //     borderCollapse: "separate",
                            //     borderSpacing: "10px",
                            //   }}
                            // >
                            //   <TableCell>{data.id}</TableCell>

                            //   <TableCell>
                            //     <Typography
                            //       variant="h6"
                            //       fontSize="16px"
                            //       color="secondary"
                            //       fontWeight="bold"
                            //     >
                            //       {data.vladimir_tag_number}
                            //     </Typography>
                            //     <Typography fontSize="12px" color="gray">
                            //       {data.asset_description}
                            //     </Typography>
                            //   </TableCell>

                            //   <TableCell>
                            //     <Typography fontSize="12px" color="gray">
                            //       Capex
                            //     </Typography>
                            //     <Typography fontSize="12px" color="gray">
                            //       {data.capex.capex}
                            //     </Typography>
                            //   </TableCell>
                            // </TableRow>
                          );
                        })}
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
              // onClick={handleExport}
              onClick={handleOpenExport}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 20px",
              }}
            >
              EXPORT
            </Button>

            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 50]}
              component="div"
              count={fixedAssetSuccess ? fixedAssetData.total : 0}
              page={fixedAssetSuccess ? fixedAssetData.current_page - 1 : 0}
              rowsPerPage={fixedAssetSuccess ? parseInt(fixedAssetData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </Box>
      )}

      {/* Add FA */}
      <Drawer
        open={drawer}
        // onClose={() => dispatch(closeDrawer())}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: "10px",
            padding: "10px 20px",
            maxWidth: "450px",
          },
        }}
      >
        <AddFixedAsset status={status} data={updateFixedAsset} onUpdateResetHandler={onUpdateResetHandler} />
      </Drawer>

      {/* Add Cost */}
      <Drawer
        open={add}
        // onClose={() => dispatch(closeDrawer())}
        anchor="right"
        PaperProps={{
          sx: {
            borderRadius: "10px",
            padding: "10px 20px",
            maxWidth: "450px",
          },
        }}
      >
        <AddCost status={status} data={updateFixedAsset} onUpdateResetHandler={onUpdateResetHandler} />
      </Drawer>

      {/* <Drawer
        open={drawer}
        anchor="right"
        PaperProps={{
          sx: { borderRadius: "10px", padding: "20px" },
        }}>
        <EditFixedAsset
          data={updateFixedAsset}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Drawer> */}

      <Dialog
        open={importFile}
        onClose={() => dispatch(closeImport())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            padding: "5px 20px",
            minWidth: "30%",
            width: "80%",
            overflow: "hidden",
          },
        }}
      >
        <ImportFixedAsset />
      </Dialog>

      <Dialog
        open={drawer1}
        onClose={() => dispatch(closeDrawer1())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            padding: "5px 20px",
            minWidth: "30%",
            width: "80%",
            overflow: "hidden",
          },
        }}
      >
        <ImportCost />
      </Dialog>

      <Dialog
        open={datePicker}
        onClose={() => dispatch(closeDatePicker())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "0",
            maxWidth: "90%",
            padding: "20px",
            backgroundColor: "white",
          },
        }}
      >
        <PrintFixedAsset />
      </Dialog>

      <Dialog
        open={exportFile}
        onClose={() => dispatch(closeExport())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "0",
            maxWidth: "90%",
            padding: "20px",
            backgroundColor: "background.light",
          },
        }}
      >
        <ExportFixedAsset />
      </Dialog>

      <Dialog
        open={scanFile}
        onClose={() => dispatch(closeScan())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "10px 20px",
            padding: "10px",
            backgroundColor: "background.light",
          },
        }}
      >
        <ScanFixedAsset />
      </Dialog>
    </Box>
  );
};

export default FixedAsset;
