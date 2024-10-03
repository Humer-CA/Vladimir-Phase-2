import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { closeDialog1 } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import moment from "moment/moment";
import NoDataFile from "../../../Img/PNG/no-data.png";
import NoRecordsFound from "../../../Layout/NoRecordsFound";

const ViewReceivedReceipt = (props) => {
  const { data } = props;
  const dispatch = useDispatch();

  const formatCost = (value) => {
    const unitCost = Number(value);
    return unitCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Stack alignItems="center" justifyContent="center">
      <Stack flexDirection="row" position="relative" width="100%">
        <Typography
          color="secondary.main"
          sx={{ fontFamily: "Anton", fontSize: "1.5rem", pb: 1, alignSelf: "flex-start" }}
        >
          Received Receipt
        </Typography>

        <Tooltip>
          <IconButton
            size="small"
            onClick={() => dispatch(closeDialog1())}
            sx={{ position: "absolute", right: 0, top: -10 }}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Stack>

      <Divider flexItem sx={{ mb: 3 }} />

      <Stack
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap={2}
        maxHeight="450px"
        width={data.length === 0 ? "300px" : "100%"}
        maxWidth="1000px"
        overflow="auto"
        pb={1}
      >
        {data.length === 0 ? (
          <Stack justifyContent="center" alignItems="center">
            <img src={NoDataFile} alt="" width="100px" />
            <Typography variant="h5" fontWeight={600} color="secondary" fontFamily="Raleway">
              No Data Found
            </Typography>
          </Stack>
        ) : (
          data?.map((mappedItems, index) => (
            <Stack
              key={index}
              sx={{
                width: "350px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Card
                sx={{
                  bgcolor: mappedItems?.is_cancelled === false ? "#fafafa" : "#eaeaea",
                  padding: "10px !important",
                }}
              >
                <Stack flexDirection="row" alignItems="center" justifyContent="space-between" padding={1}>
                  <Chip
                    label={
                      <Typography fontSize={14} fontWeight={500}>
                        RR - {mappedItems?.rr_number}
                      </Typography>
                    }
                    color={mappedItems?.is_cancelled === false ? "secondary" : "error"}
                    size="small"
                  />
                  <Typography
                    fontSize={12}
                    fontWeight={600}
                    color={mappedItems?.is_cancelled === false ? "primary.dark" : "gray"}
                  >
                    {moment(mappedItems.date_delivered, "DD-MM-YYYY").format("MMM DD YYYY")}
                  </Typography>
                </Stack>

                <Stack flexDirection="row" alignItems="center" justifyContent="center">
                  <CardHeader
                    sx={{ p: 1.5 }}
                    title={
                      <Typography
                        fontSize="20px"
                        fontWeight={600}
                        fontStyle="inherit"
                        color={mappedItems?.is_cancelled === false ? "secondary.dark" : "error"}
                      >
                        {mappedItems.vladimir_tag}
                      </Typography>
                    }
                    subheader={
                      <Typography fontSize="12px" color={"secondary.light"}>
                        Vladimir Tag Number
                      </Typography>
                    }
                  />

                  <Divider flexItem orientation="vertical" sx={{ mx: 2, border: "1px dashed lightgray" }} />

                  <Stack alignItems="center" justifyContent="center" padding={1}>
                    <Typography fontSize="12px" color={"secondary.light"}>
                      Unit Cost
                    </Typography>
                    <Typography
                      fontWeight={600}
                      color={mappedItems?.is_cancelled === false ? "quaternary.light" : "gray"}
                    >
                      ₱{formatCost(mappedItems.unit_cost)}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default ViewReceivedReceipt;
