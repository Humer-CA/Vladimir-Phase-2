import React, { useEffect, useState } from "react";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetDepreciationHistoryApiQuery,
  useLazyGetDepreciationHistoryApiQuery,
  usePostCalcDepreApiMutation,
} from "../../Redux/Query/FixedAsset/FixedAssets";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Card,
  Chip,
  Grow,
  IconButton,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ArrowLeft, Close, CurrencyExchangeRounded, History, KeyboardArrowLeftSharp, Watch } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";
import CustomDatePicker from "../../Components/Reusable/CustomDatePicker";
import { usePostCalcDepreAddCostApiMutation } from "../../Redux/Query/FixedAsset/AdditionalCost";

const schema = yup.object().shape({
  id: yup.string(),
  endDate: yup.string().typeError("Please enter a validate date").label("End Date"),
});

const formatCost = (value) => {
  const unitCost = Number(value);
  return unitCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Depreciation = (props) => {
  const { setViewDepre, calcDepreApi, vladimirTag } = props;
  const isSmallScreen = useMediaQuery("(max-width: 1000px)");

  const [openHistory, setOpenHistory] = useState(false);

  // const {
  //   data: historyData,
  //   isLoading: isHistoryLoading,
  //   isSuccess: isHistorySuccess,
  // } = useGetDepreciationHistoryApiQuery({ vladimir_tag_number: vladimirTag }, { refetchOnMountOrArgChange: true });
  const [getDepreciationHistory, { data: historyData, isLoading: isHistoryLoading, isSuccess: isHistorySuccess }] =
    useLazyGetDepreciationHistoryApiQuery();

  const dispatch = useDispatch();

  const handleClose = () => {
    setViewDepre(false);
  };

  const data = calcDepreApi?.data;

  const handleViewHistory = () => {
    setOpenHistory(!openHistory);
    !isHistorySuccess && getDepreciationHistory({ vladimir_tag_number: vladimirTag });
  };

  // const joinDepreciationByYear = (items = []) => {
  //   return items.reduce((acc, history) => {
  //     const year = Object.keys(history)[0];
  //     const yearData = history[year];

  //     if (year && yearData) {
  //       acc[year] = acc[year] ? [...acc[year], ...yearData] : yearData;
  //     }

  //     return acc;
  //   }, {});
  // };

  // const combinedHistoryData = joinDepreciationByYear(historyData?.depreciation_history);

  const HistoryTable = () => {
    return (
      <Stack
        sx={{
          display: openHistory ? "flex" : "none",
          ml: isSmallScreen ? 0 : "20px",
          pr: isSmallScreen ? 0 : "10px",
          transition: "ease-in-out",
          height: isSmallScreen ? "100%" : "500px",
          minWidth: isSmallScreen ? "100%" : "400px",
          mt: isSmallScreen && "20px",
          width: "100%",
        }}
      >
        <Stack flexDirection="row" alignItems="center" gap={1}>
          {!isSmallScreen && (
            <Tooltip placement="top" title="Close History" arrow>
              <IconButton size="small" onClick={handleViewHistory}>
                <KeyboardArrowLeftSharp />
              </IconButton>
            </Tooltip>
          )}
          <Typography fontFamily="Anton" color="secondary.main" fontSize={20} pl={isSmallScreen ? "10px" : 0}>
            HISTORY
          </Typography>
        </Stack>

        <Stack sx={{ height: isSmallScreen ? "100%" : "500px", overflow: "auto", pr: isSmallScreen ? 0 : 1 }}>
          <Slide direction="right" in={openHistory} timeout={500}>
            <Stack sx={{ my: 1 }} gap={2}>
              {historyData?.depreciation_history?.map((data, index) => (
                <TableContainer
                  key={`${data?.year}-${index}`}
                  className="mcontainer__wrapper"
                  sx={{ py: 2, overflow: "auto" }}
                >
                  <Typography
                    variant="span"
                    color="primary"
                    fontWeight={600}
                    fontFamily="Anton"
                    fontSize="20px"
                    sx={{ mx: 2 }}
                  >
                    {data?.year}
                  </Typography>
                  <Table className="mcontainer__table " stickyHeader>
                    <TableHead>
                      <TableRow
                        sx={{
                          "& > *": {
                            fontWeight: "bold!important",
                            whiteSpace: "nowrap",
                            color: "secondary.main",
                          },
                          "& > nth:last-child": {
                            borderBottom: "none",
                          },
                        }}
                      >
                        <TableCell className="tbl-cell">Month</TableCell>
                        <TableCell className="tbl-cell">Remaining Book Value</TableCell>
                        <TableCell className="tbl-cell">Depreciated Amount Per Month</TableCell>
                        <TableCell className="tbl-cell">Accumulated Depreciation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.months?.map((row, index) => (
                        <TableRow key={`${row?.month}-${index}`}>
                          <TableCell>{row?.month}</TableCell>
                          <TableCell>₱{formatCost(row?.remaining_value)}</TableCell>
                          <TableCell>₱{formatCost(row?.monthly_depreciation)}</TableCell>
                          <TableCell>₱{formatCost(row?.accumulated_depreciation)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ))}
            </Stack>
          </Slide>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack>
      {/* Header */}
      <Stack>
        <Box
          sx={{
            display: " flex",
            alignItems: "center",
            gap: 1.5,
            pl: "5px",
            mb: "15px",
          }}
        >
          <CurrencyExchangeRounded size="small" color="secondary" />

          <Typography
            color="secondary.main"
            sx={{
              fontFamily: "Anton",
              fontSize: "1.5rem",
              justifyContent: "flex-start",
              alignSelf: "center",
            }}
          >
            Depreciation
          </Typography>
        </Box>

        <IconButton
          color="secondary"
          variant="outlined"
          onClick={handleClose}
          sx={{ top: 10, right: 10, position: "absolute" }}
        >
          <Close size="small" />
        </IconButton>
      </Stack>

      {/* Body */}
      <Stack flexDirection="row">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "auto",
            minWidth: openHistory ? "350px" : "auto",
          }}
        >
          <Stack sx={{ maxHeight: "500px" }}>
            <Box
              sx={{
                display: "flex",
                position: "relative",
                gap: "10px",
                px: "5px",
                flexWrap: "wrap",
              }}
            >
              <Card
                sx={{
                  backgroundColor: "secondary.main",
                  minWidth: "300px",
                  // flexGrow: "1",
                  flex: "1",
                  alignSelf: "stretched",
                  p: "10px 20px",
                  borderRadius: "5px",
                }}
              >
                <Box>
                  <Typography
                    color="secondary.main"
                    sx={{
                      fontFamily: "Anton",
                      fontSize: "1rem",
                      color: "primary.main",
                    }}
                  >
                    Information
                  </Typography>

                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      // gap: isSmallScreen ? 0 : "15px",
                    }}
                  >
                    <Box className="tableCard__propertiesCapex">
                      Depreciation Method:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        {data?.depreciation_method}
                      </Typography>
                    </Box>

                    <Box className="tableCard__propertiesCapex">
                      Estimated Useful Life:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        {data?.est_useful_life}
                      </Typography>
                    </Box>

                    <Box className="tableCard__propertiesCapex">
                      Acquisition Date:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        {data?.acquisition_date}
                      </Typography>
                    </Box>

                    <Box className="tableCard__propertiesCapex">
                      Acquisition Cost:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        ₱{formatCost(data?.acquisition_cost)}
                      </Typography>
                    </Box>

                    <Box className="tableCard__propertiesCapex">
                      Months Depreciated:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        {data?.months_depreciated}
                      </Typography>
                    </Box>

                    <Box className="tableCard__propertiesCapex">
                      Scrap Value:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        ₱{formatCost(data?.scrap_value)}
                      </Typography>
                    </Box>

                    <Box className="tableCard__propertiesCapex">
                      Depreciable Basis:
                      <Typography className="tableCard__infoCapex" fontSize="14px">
                        ₱{formatCost(data?.depreciable_basis)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>

              <Box sx={{ flexDirection: "column", flex: "1", minWidth: "300px" }}>
                <Card
                  className="tableCard__card"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1",
                    mb: "10px",
                    height: "100%",
                  }}
                >
                  <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "rem" }}>
                    Formula
                  </Typography>

                  <Box>
                    <Box className="tableCard__properties">
                      Accumulated Cost:
                      <Typography className="tableCard__info" fontSize="14px">
                        ₱{formatCost(data?.accumulated_cost)}
                      </Typography>
                    </Box>

                    <Box className="tableCard__properties">
                      Depreciation per Year:
                      <Typography className="tableCard__info" fontSize="14px">
                        ₱{formatCost(data?.depreciation_per_year)}
                      </Typography>
                    </Box>

                    <Box className="tableCard__properties">
                      Depreciation per Month:
                      <Typography className="tableCard__info" fontSize="14px">
                        ₱{formatCost(data?.depreciation_per_month)}
                      </Typography>
                    </Box>

                    <Box className="tableCard__properties">
                      Remaining Book Value:
                      <Typography className="tableCard__info" fontSize="14px">
                        ₱{formatCost(data?.remaining_book_value)}
                      </Typography>
                    </Box>

                    <Box className="tableCard__properties">
                      Start Depreciation:
                      <Typography className="tableCard__info" fontSize="14px">
                        {data?.start_depreciation}
                      </Typography>
                    </Box>

                    <Box className="tableCard__properties">
                      End Depreciation:
                      <Typography className="tableCard__info" fontSize="14px">
                        {data?.end_depreciation}
                      </Typography>
                    </Box>
                  </Box>

                  {data?.has_history && (
                    <Chip
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewHistory()}
                      sx={{ mt: 2, ":hover": { bgcolor: "lightgray", cursor: "pointer" } }}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 0.5,
                            p: 0.5,
                          }}
                        >
                          <History sx={{ color: "quaternary.light", py: 0.2, ml: -0.5 }} />
                          <Typography fontSize={"14px"} fontWeight={500}>
                            View History
                          </Typography>
                        </Box>
                      }
                    />
                  )}
                </Card>

                {/* <Card className="tableCard__card">
              <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "rem" }}>
                Date Setup
              </Typography>

              <Box className="tableCard__properties">
                Start Date:
                <Typography className="tableCard__info" fontSize="14px">
                  {data.start_depreciation}
                </Typography>
              </Box>

              <Box className="tableCard__properties">
                End Depreciation:
                <Typography className="tableCard__info" fontSize="14px">
                  {data.end_depreciation}
                </Typography>
              </Box>

              <Box className="tableCard__properties" sx={{ flexDirection: "column" }}>
                <Typography fontSize="14px" sx={{ mb: "10px" }}>
                  End Date Value:
                </Typography>

                <CustomDatePicker
                  control={control}
                  name="endDate"
                  label="End Date"
                  size="small"
                  views={["month", "year"]}
                  error={!!errors?.endDate?.message}
                  helperText={errors?.endDate?.message}
                />
              </Box>
            </Card> */}
              </Box>
            </Box>

            <Stack sx={{ flexDirection: "column", flex: "1", minWidth: "300px", px: "5px" }}>
              <Card
                className="tableCard__card"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  mt: "10px",
                  mx: "5px",
                }}
              >
                <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "rem" }}>
                  Initial
                </Typography>

                <Box>
                  <Box className="tableCard__properties">
                    Debit:
                    <Typography className="tableCard__info" fontSize="14px">
                      {data?.initial_debit?.account_title_code} - {data?.initial_debit?.account_title_name}
                    </Typography>
                  </Box>

                  <Box className="tableCard__properties">
                    Credit:
                    <Typography className="tableCard__info" fontSize="14px">
                      {data?.initial_credit?.account_title_code} - {data?.initial_credit?.account_title_name}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              <Card
                className="tableCard__card"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  mt: "10px",
                  mx: "5px",
                }}
              >
                <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "rem" }}>
                  Depreciation
                </Typography>

                <Box>
                  <Box className="tableCard__properties">
                    Debit:
                    <Typography className="tableCard__info" fontSize="14px">
                      {data?.depreciation_debit?.account_title_code} - {data?.depreciation_debit?.account_title_name}
                    </Typography>
                  </Box>
                  <Box className="tableCard__properties">
                    Credit:
                    <Typography className="tableCard__info" fontSize="14px">
                      {data?.depreciation_credit?.account_title_code} - {data?.depreciation_credit?.account_title_name}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Stack>
            {isSmallScreen && <HistoryTable />}
          </Stack>
        </Box>

        {openHistory && !isSmallScreen && <HistoryTable />}
      </Stack>
    </Stack>
  );
};

export default Depreciation;
