import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
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
  useMediaQuery,
} from "@mui/material";
import RdfLogo from "../../Img/SVG/RDF Logo.svg";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

const AssignmentMemo = (props) => {
  const { data, memoData, selectedMemo, setPrintAssignmentMemo, dataId, series } = props;
  const [newData, setNewData] = useState(null);
  const [singleData, setSingleData] = useState([dataId]);
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const contentToPrint = useRef(null);

  const arrayData = newData?.map((data) => data);

  useEffect(() => {
    const filteredData = data?.filter((item) => selectedMemo.includes(item.vladimir_tag_number));
    setNewData(filteredData);
    console.log("filteredData", filteredData);
  }, [data]);

  const handlePrintAssignmentMemo = useReactToPrint({
    documentTitle: "Assignment Memo" + " " + memoData?.data?.memo_series,
    removeAfterPrint: true,
    onBeforePrint: () => setPrintAssignmentMemo(true),
    onAfterPrint: () => setPrintAssignmentMemo(false),
  });

  return (
    <>
      <Box ref={contentToPrint} sx={{ backgroundColor: "white" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            // minHeight: "5.5in",
            // width: "8.5in",
            p: "50px",
            fontFamily: "Times New Roman",
          }}
        >
          <Stack gap={2}>
            <Stack flexDirection="row" justifyContent="space-between">
              <Stack>
                <Typography variant="h6" fontFamily="Times New Roman" fontWeight={600}>
                  RDF FEED, LIVESTOCK & FOODS, INC.
                </Typography>
                <Typography fontFamily="Times New Roman" fontWeight={600}>
                  ASSIGNMENT MEMO
                </Typography>
              </Stack>

              <Stack flexDirection="row" alignItems="center" gap={2}>
                <img src={RdfLogo} alt="RDF Logo" width="80px" />
                <Typography fontFamily="Times New Roman" fontWeight={600} mt="5px">
                  {memoData?.data?.memo_series || series}
                </Typography>
              </Stack>
            </Stack>

            <Stack flexDirection="row" justifyContent="space-between" gap={2}>
              <Stack>
                <Stack flexDirection="row" gap={2}>
                  <Typography fontFamily="Times New Roman" fontSize="12px" fontWeight={600} width="80px">
                    Organization
                  </Typography>
                  <Typography fontFamily="Times New Roman" fontSize="12px">
                    {(arrayData || singleData)[0]?.business_unit?.business_unit_name}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" gap={2}>
                  <Typography fontFamily="Times New Roman" fontSize="12px" fontWeight={600} width="80px">
                    Department
                  </Typography>
                  <Typography fontFamily="Times New Roman" fontSize="12px">
                    {(arrayData || singleData)[0]?.department?.department_name}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" gap={2}>
                  <Typography fontFamily="Times New Roman" fontSize="12px" fontWeight={600} width="80px">
                    Location
                  </Typography>
                  <Typography fontFamily="Times New Roman" fontSize="12px">
                    {(arrayData || singleData)[0]?.location?.location_name}
                  </Typography>
                </Stack>
              </Stack>

              <Stack>
                <Stack flexDirection="row" gap={2}>
                  <Typography fontFamily="Times New Roman" fontSize="12px" fontWeight={600} width="80px">
                    Date Prepared
                  </Typography>
                  <Typography fontFamily="Times New Roman" fontSize="12px">
                    {moment(new Date()).format("LL")}
                  </Typography>
                </Stack>
                {/* <Stack flexDirection="row" gap={2}>
                  <Typography fontFamily="Times New Roman" fontSize="12px" fontWeight={600} width="80px">
                    Item Requested
                  </Typography>
                  <Typography fontFamily="Times New Roman" fontSize="12px">
                    {null}
                  </Typography>
                </Stack> */}
              </Stack>
            </Stack>
          </Stack>

          <Stack justifyContent="space-between" width="100%" flex="1">
            <Stack mt={1} alignItems="center">
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>Line Nos.</TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1, textWrap: "nowrap" }}>
                        Vladimir Tag #
                      </TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>Supplier</TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1, textWrap: "nowrap" }}>
                        Reference #
                      </TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>Item Description</TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>Qty.</TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>UOM</TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>Additional Description</TableCell>
                      <TableCell sx={{ fontSize: "10px", lineHeight: "12px", py: 1 }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(arrayData || singleData)?.map((data, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.id}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.vladimir_tag_number}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.supplier?.supplier_name}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.receipt}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.asset_description}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.quantity}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.uom?.uom_name}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1 }}>{data?.asset_specification}</TableCell>
                          <TableCell sx={{ fontSize: "10px", py: 1, textWrap: "nowrap" }}>
                            ₱ {data?.acquisition_cost?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography
                sx={{
                  fontSize: "12px",
                  width: "100%",
                  alignSelf: "flex-start",
                  fontFamily: "Times New Roman",
                  mt: "10px",
                }}
              >
                Remarks : {newData?.map((item) => item?.remarks)}
              </Typography>
            </Stack>

            <Stack
              mt={1}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-start"
              // border="2px solid gray"
              height="50px"
              px="20px"
            >
              <Stack flexDirection="row" gap={2}>
                <Typography fontFamily="Times New Roman" fontSize="12px" width="80px">
                  Checked by:
                </Typography>
              </Stack>

              <Stack flexDirection="row" gap={2}>
                <Typography fontFamily="Times New Roman" fontSize="12px" width="80px">
                  Received By:
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Stack flexDirection="row" justifyContent="flex-end" gap={1} mt={2}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handlePrintAssignmentMemo(null, () => contentToPrint.current)}
        >
          Print
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={() => setPrintAssignmentMemo(false)}>
          Close
        </Button>
      </Stack>
    </>
  );
};

export default AssignmentMemo;
