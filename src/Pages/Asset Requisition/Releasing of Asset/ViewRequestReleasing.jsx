import React, { useEffect, useState } from "react";
import "../../../Style/Fixed Asset/assetViewing.scss";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import {
  useArchiveFixedAssetStatusApiMutation,
  useGetFixedAssetIdApiQuery,
  usePostCalcDepreApiMutation,
} from "../../../Redux/Query/FixedAsset/FixedAssets";
import FaStatusChange from "../../../Components/Reusable/FaStatusComponent";
import NoDataFile from "../../../Img/PNG/no-data.png";
import moment from "moment";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBackIosRounded,
  Circle,
  CircleTwoTone,
  DescriptionRounded,
  ExpandMore,
  Help,
  Output,
  PriceChange,
  Print,
  ReportProblem,
  Sell,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import { usePostPrintApiMutation } from "../../../Redux/Query/FixedAsset/FixedAssets";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import { usePostPrintOfflineApiMutation } from "../../../Redux/Query/FixedAsset/OfflinePrintingFA";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import ErrorFetchFA from "../../ErrorFetching";
import FixedAssetViewSkeleton from "../../FixedAssets/FixedAssetViewSkeleton";
import { useForm } from "react-hook-form";
import { useArchiveAdditionalCostApiMutation } from "../../../Redux/Query/FixedAsset/AdditionalCost";
import useScanDetection from "use-scan-detection-react18";
import { useGetIpApiQuery } from "../../../Redux/Query/IpAddressSetup";
import { useGetByWarehouseNumberApiQuery } from "../../../Redux/Query/Request/AssetReleasing";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import AddReleasingInfo from "./AddReleasingInfo";

const ViewRequestReleasing = (props) => {
  const { state: data } = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 350px)");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dialog = useSelector((state) => state.booleanState.dialog);

  const {
    data: releasingData,
    isLoading: releasingLoading,
    isSuccess: releasingSuccess,
    isFetching: releasingDataFetching,
    isError: isPostError,
    error: postError,

    refetch: releasingDataRefetch,
  } = useGetByWarehouseNumberApiQuery(
    { warehouse_number: data?.warehouse_number?.warehouse_number },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // console.log(releasingData);

  const handleReleasing = () => {
    dispatch(openDialog());
  };

  return (
    <>
      {releasingLoading && <FixedAssetViewSkeleton onAdd={true} onImport={true} onPrint={true} />}

      {isPostError && <ErrorFetchFA refetch={releasingDataRefetch} error={postError} />}

      {releasingData && !isPostError && (
        <Box className="tableCard">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <IconButton sx={{ mt: "5px" }} size="small" onClick={() => navigate(-1)}>
                <ArrowBackIosRounded size="small" />
              </IconButton>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "Anton",
                    fontSize: "1.4rem",
                    pl: "10px",
                    pb: "5px",
                    lineHeight: "1",
                  }}
                  color="primary.main"
                >
                  VLADIMIR TAG NUMBER
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mt: "-5px",
                    pb: "5px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Anton",
                      fontSize: "1.2rem",
                      p: "0 10px",
                      pr: "15px",
                    }}
                    color="secondary.main"
                  >
                    #{releasingData?.vladimir_tag_number}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                pl: "10px",
                pb: "10px",
                display: "flex",
                justifyContent: "center",
                alignSelf: "flex-end",
              }}
            >
              {releasingData?.is_released === 0 && (
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={() => handleReleasing()}
                  startIcon={isSmallScreen ? null : <Output color="primary" />}
                >
                  {isSmallScreen ? <Output color={"primary"} /> : "Release"}
                </Button>
              )}

              {/* {permissions?.split(", ").includes("print-fa") &&
                  releasingData?.is_additional_cost === 0 &&
                  releasingData?.type_of_request?.type_of_request_name !== "Capex" && (
                    <LoadingButton
                      variant="contained"
                      size="small"
                      // loading={isPrintLoading}
                      startIcon={isSmallScreen ? null : <Print />}
                      onClick={onPrintHandler}
                      sx={{ mx: "10px" }}
                    >
                      {isSmallScreen ? <Print /> : releasingData?.print_count >= 1 ? "Re-print" : "Print"}
                    </LoadingButton>
                  )} */}

              {/* <ActionMenu
                  // faStatus={dataApi?.data?.asset_status?.asset_status_name}
                  data={releasingData}
                  // status={status}
                  // onArchiveRestoreHandler={onArchiveRestoreHandler}
                  setStatusChange={setStatusChange}
                  onUpdateHandler={onUpdateHandler}
                /> */}
            </Box>
          </Box>

          {releasingData.is_additional_cost === 1 && (
            <Chip
              variant="contained"
              size="small"
              sx={{
                fontFamily: "Anton",
                fontSize: "1rem",
                color: "secondary.main",
                mb: "5px",
                backgroundColor: "primary.light",
                width: "98%",
                alignSelf: "center",
              }}
              label="ADDITIONAL COST"
            />
          )}

          <Box className="tableCard__container">
            <Box>
              <Card className="tableCard__cardCapex" sx={{ bgcolor: "secondary.main" }}>
                <Typography
                  color="secondary.main"
                  sx={{
                    fontFamily: "Anton",
                    fontSize: "1rem",
                    color: "primary.main",
                  }}
                >
                  Type of Request
                </Typography>

                <Box sx={{ py: "5px" }}>
                  <Box className="tableCard__propertiesCapex">
                    Type of Request:
                    <Typography className="tableCard__infoCapex" fontSize="14px">
                      {releasingData?.type_of_request?.type_of_request_name}
                    </Typography>
                  </Box>

                  {releasingData?.sub_capex?.sub_capex !== "-" && (
                    <>
                      <Box className="tableCard__propertiesCapex">
                        Capex:
                        <Typography className="tableCard__infoCapex" fontSize="14px">
                          {releasingData?.sub_capex?.sub_capex}
                        </Typography>
                      </Box>

                      <Box className="tableCard__propertiesCapex">
                        Project Name:
                        <Typography className="tableCard__infoCapex" fontSize="14px">
                          {releasingData?.sub_capex?.sub_project}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Card>

              {/* <Card className="tableCard__cardCapex" sx={{ bgcolor: "white", py: "10.5px" }}>
                <Box>
                  <Typography
                    color="secondary.main"
                    sx={{
                      fontFamily: "Anton",
                      fontSize: "1rem",
                    }}
                  >
                    TAG NUMBER
                  </Typography>

                  <Box className="tableCard__properties">
                    Tag Number:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?. tag_number}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Old Tag Number:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?. tag_number_old}
                    </Typography>
                  </Box>
                </Box>
              </Card> */}

              <Card className="tableCard__cardCapex" sx={{ bgcolor: "white", py: "10.5px" }}>
                <Box color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
                  CATEGORY
                </Box>
                <Box>
                  <Box className="tableCard__properties">
                    Division:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.division.division_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Major Category:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.major_category.major_category_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Minor Category:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.minor_category.minor_category_name}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>

            <Box className="tableCard__wrapper" sx={{ pb: "2px" }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
                    CHART OF ACCOUNT
                  </Typography>
                </AccordionSummary>

                <Divider />

                <AccordionDetails>
                  <Box className="tableCard__properties">
                    Company:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.company.company_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Department:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.department.department_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Location:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.location.location_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Account Title:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.account_title.account_title_name}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: "secondary.main" }} />}
                  sx={{ bgcolor: "white" }}
                >
                  <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
                    ASSET INFORMATION
                  </Typography>
                </AccordionSummary>

                <Divider />

                <AccordionDetails className="tableCard__border">
                  <Box className="tableCard__properties">
                    Asset Description:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.asset_description}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Asset Specification:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.asset_specification}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Accountability:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.accountability}
                    </Typography>
                  </Box>

                  {releasingData?.accountability === "Common" ? null : (
                    <>
                      <Box className="tableCard__properties">
                        Accountable:
                        <Typography className="tableCard__info" fontSize="14px">
                          {releasingData?.accountable}
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Box className="tableCard__properties">
                    Acquisition Date:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.acquisition_date}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Cellphone Number:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.cellphone_number}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Brand:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.brand}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Care of:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.care_of}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Voucher:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.voucher}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Voucher Date:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.voucher_date}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Receipt:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.receipt}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Quantity:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.quantity}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Asset Status:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.asset_status?.asset_status_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Asset Movement Status:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.movement_status?.movement_status_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Cycle Count Status:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.cycle_count_status?.cycle_count_status_name}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
                    DEPRECIATION
                  </Typography>
                </AccordionSummary>

                <Divider />

                <AccordionDetails>
                  <Box className="tableCard__properties">
                    Depreciation Status:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.depreciation_status?.depreciation_status_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Acquisition Cost:
                    <Typography className="tableCard__info" fontSize="14px">
                      ₱{releasingData?.acquisition_cost.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Release Date:
                    <Typography className="tableCard__info" fontSize="14px">
                      {releasingData?.release_date}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Scrap Value:
                    <Typography className="tableCard__info" fontSize="14px">
                      ₱{releasingData?.scrap_value.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Depreciable Basis:
                    <Typography className="tableCard__info" fontSize="14px">
                      ₱{releasingData?.depreciable_basis.toLocaleString()}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {releasingData.is_additional_cost === 0 ? (
                <Accordion
                // expanded={expanded}
                // onChange={() => setExpanded(!expanded)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: "secondary.main" }} />}
                    sx={{ bgcolor: "white" }}
                  >
                    <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
                      ADDITIONAL COST
                    </Typography>
                  </AccordionSummary>

                  <Divider />

                  {releasingData?.additional_cost?.length === 0 ? (
                    <AccordionDetails>
                      <Stack flexDirection="row" alignItems="center" justifyContent="center" gap="5px">
                        <img src={NoDataFile} alt="" width="35px" />
                        <Typography
                          variant="p"
                          sx={{
                            fontFamily: "Anton, Roboto, Helvetica",
                            color: "secondary.main",
                            fontSize: "1.2rem",
                          }}
                        >
                          No Data Found
                        </Typography>
                      </Stack>
                    </AccordionDetails>
                  ) : (
                    <>
                      <TableContainer>
                        <Table>
                          <TableBody>
                            {releasingData.data.additional_cost?.map((mapData, index) => {
                              return (
                                <TableRow
                                  key={index}
                                  sx={{
                                    ":hover": {
                                      backgroundColor: "background.light",
                                      cursor: "pointer",
                                    },
                                  }}
                                  colSpan={9}
                                  onClick={() => handleTableData(mapData)}
                                >
                                  <TableCell width={80} align="center">
                                    <DescriptionRounded color="primary" />
                                  </TableCell>

                                  <TableCell align="left">
                                    <Typography fontSize="14px" fontWeight="bold" noWrap align="left">
                                      {mapData.asset_description}
                                    </Typography>

                                    <Typography fontSize="10px" color="text.light" noWrap>
                                      {mapData.asset_specification}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography fontSize="12px" fontWeight="bold" noWrap>
                                      {`₱${mapData?.acquisition_cost.toLocaleString()}`}
                                    </Typography>
                                    <Typography fontSize="10px" color="gray" noWrap>
                                      Acquisition Cost
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography fontSize="12px" fontWeight="bold" noWrap>
                                      {mapData.type_of_request?.type_of_request_name}
                                    </Typography>
                                    <Typography fontSize="10px" color="gray" noWrap>
                                      Asset Classification
                                    </Typography>
                                  </TableCell>

                                  <TableCell align="center">
                                    <FaStatusChange
                                      faStatus={mapData.asset_status.asset_status_name}
                                      data={mapData.asset_status.asset_status_name}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>

                        <Stack
                          flexDirection="column"
                          alignItems="center"
                          sx={{
                            px: 2,
                            py: 0.5,
                          }}
                        >
                          <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
                            <Typography fontSize="14px" fontWeight="bold" color="secondary.light">
                              Main Cost :
                            </Typography>
                            <Typography color="secondary.light">
                              ₱{releasingData?.acquisition_cost.toLocaleString()}
                            </Typography>
                          </Stack>
                          {`+`}
                          <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
                            <Typography fontSize="14px" fontWeight="bold" color="secondary.light">
                              Total Additional Cost :
                            </Typography>
                            <Typography color="secondary.light">
                              ₱{releasingData?.total_adcost.toLocaleString()}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Stack
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center"
                          gap={1}
                          width="100%"
                          sx={{
                            px: 2,
                            py: 1,
                            pb: 2,
                            borderTop: "1px solid lightgray",
                          }}
                        >
                          <Typography fontSize="16px" fontFamily="Anton, Poppins, Sans Serif" color="secondary.main">
                            TOTAL COST :
                          </Typography>
                          <Typography fontWeight="bold" color="secondary.main">
                            ₱{releasingData?.total_cost.toLocaleString()}
                          </Typography>
                        </Stack>
                      </TableContainer>
                    </>
                  )}
                </Accordion>
              ) : (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: "secondary.main" }} />}
                    sx={{ bgcolor: "white" }}
                  >
                    <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1rem" }}>
                      MAIN ASSET
                    </Typography>
                  </AccordionSummary>

                  <Divider />

                  <TableContainer>
                    <Table>
                      <TableBody
                        sx={{
                          overflow: "auto",
                        }}
                        colSpan={9}
                      >
                        <TableRow
                          sx={{
                            ":hover": {
                              backgroundColor: "background.light",
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => {
                            handleTableData(releasingData?.main);
                            // console.log(releasingData?. main);
                          }}
                        >
                          <TableCell width={80} align="center">
                            <DescriptionRounded color="secondary" />
                          </TableCell>

                          <TableCell width="550px" sx={{ minWidth: "200px" }} align="left">
                            <Typography fontSize="14px" fontWeight="bold" noWrap align="left">
                              {releasingData?.main?.asset_description}
                            </Typography>

                            <Typography fontSize="10px" color="text.light">
                              {releasingData?.main?.asset_specification}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="12px" fontWeight="bold">
                              {releasingData?.acquisition_cost}
                            </Typography>
                            <Typography fontSize="10px" color="gray" noWrap>
                              Acquisition Cost
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize="12px" fontWeight="bold">
                              {releasingData?.type_of_request?.type_of_request_name}
                            </Typography>
                            <Typography fontSize="10px" color="gray" noWrap>
                              Asset Classification
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <FaStatusChange
                              faStatus={releasingData?.asset_status.asset_status_name}
                              data={releasingData?.asset_status.asset_status_name}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Accordion>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Dialog
        open={dialog}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            margin: "0",
            maxWidth: "90%",
            padding: "20px",
            overflow: "hidden",
            width: "400px",
          },
        }}
      >
        <AddReleasingInfo data={releasingData} refetch={releasingDataRefetch} />
      </Dialog>
    </>
  );
};

export default ViewRequestReleasing;
