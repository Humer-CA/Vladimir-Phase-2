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
  closePrint,
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
  const [faFilter, setFaFilter] = useState([]);
  const [isRequest, setIsRequest] = useState(0);
  // const [scanAsset, setScanAsset] = useState(false);
  // const [faStatus, setFaStatus] = useState("");
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
  const drawer1 = useSelector((state) => state.booleanState.drawerMultiple.drawer1);

  const add = useSelector((state) => state.booleanState.add);
  const importFile = useSelector((state) => state.booleanState.importFile);
  const print = useSelector((state) => state.booleanState.print);
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
      faFilter: faFilter,
    },
    { refetchOnMountOrArgChange: true }
  );

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
            onPrint
            faStatus
            faFilter
            setFaFilter
            scanAsset
            openScan
            hideArchive
            isRequest
            setIsRequest={setIsRequest}
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

                    <TableCell className="tbl-cell-fa">
                      <TableSortLabel
                        active={orderBy === `division`}
                        direction={orderBy === `division` ? order : `asc`}
                        onClick={() => onSort(`division`)}
                      >
                        Division
                      </TableSortLabel>
                    </TableCell>

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
                              hover
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
                                  {data.is_additional_cost === 1 ? `-${data.add_cost_sequence}` : null}
                                </Typography>
                                <Typography fontSize="12px" color="gray">
                                  {data.asset_description}
                                </Typography>
                                <Typography
                                  fontSize="12px"
                                  fontWeight="bold"
                                  color={data.is_additional_cost === 0 ? "secondary.main" : "success.light"}
                                >
                                  {data.is_additional_cost === 0
                                    ? `Additional Cost Count - ${data.additional_cost_count}`
                                    : `(Additional Cost)`}
                                </Typography>
                                <Typography fontSize="12px" color="primary.main" fontWeight="bold">
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

                              <TableCell className="tbl-cell-fa">
                                <Typography fontSize="14px" color="secondary">
                                  {data.division.division_name}
                                </Typography>
                              </TableCell>

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
                                  {data.subunit?.subunit_code}
                                  {" - "}
                                  {data.subunit?.subunit_name}
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
              count={fixedAssetSuccess ? fixedAssetData?.total : 0}
              page={fixedAssetSuccess ? fixedAssetData?.current_page - 1 : 0}
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
        open={print}
        onClose={() => dispatch(closePrint())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "0",
            width: "80%",
            maxWidth: "1200px",
            maxHeight: "95%",
            padding: "20px",
            backgroundColor: "white",
          },
        }}
      >
        <PrintFixedAsset isRequest={isRequest} />
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
