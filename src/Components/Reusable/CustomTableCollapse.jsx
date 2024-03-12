import React, { useState } from "react";
import ActionMenu from "./ActionMenu";
import Moment from "moment";

import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const CustomTableCollapse = (props) => {
  const { data, status, onUpdateHandler, onArchiveRestoreHandler, onAddMinorCategoryHandler } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell className="tbl-cell">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell className="tbl-cell">{data.service_provider.service_provider_name}</TableCell>

        <TableCell className="tbl-cell">{data.major_category.major_category_name}</TableCell>

        <TableCell className="tbl-cell">
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

        <TableCell className="tbl-cell">{Moment(data.created_at).format("MMM DD, YYYY")}</TableCell>

        <TableCell className="tbl-cell">
          <ActionMenu
            status={status}
            data={data}
            onUpdateHandler={onUpdateHandler}
            onArchiveRestoreHandler={onArchiveRestoreHandler}
            onAddMinorCategoryHandler={onAddMinorCategoryHandler}
          />
        </TableCell>
      </TableRow>

      <TableRow sx={{ background: "whitesmoke" }}>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0, border: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="p" gutterBottom sx={{ fontWeight: "bold" }}>
                Minor Category
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell className="tbl-cell">Id</TableCell>

                    <TableCell className="tbl-cell">Minor Category</TableCell>

                    <TableCell className="tbl-cell">Urgency Level</TableCell>

                    <TableCell className="tbl-cell text-font">Personally Assigned</TableCell>

                    <TableCell className="tbl-cell text-font">Evaluated in Every Movement</TableCell>

                    <TableCell className="tbl-cell">Status</TableCell>

                    {/* <TableCell
                      className="tbl-cell"
                       
                    >
                      Date Created
                    </TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.category_list_tag?.map((data) => (
                    <TableRow
                      key={data.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell className="tbl-cell">{data.id}</TableCell>

                      <TableCell className="tbl-cell">{data.minor_category.minor_category_name}</TableCell>

                      <TableCell
                        className="tbl-cell
                    "
                      >
                        {data.minor_category.urgency_level}
                      </TableCell>

                      <TableCell className="tbl-cell">
                        {data.minor_category.personally_assign ? " Yes" : " No"}
                      </TableCell>

                      <TableCell className="tbl-cell">
                        {data.minor_category.evaluate_in_every_movement ? " Yes" : " No"}
                      </TableCell>

                      <TableCell className="tbl-cell">
                        {data.minor_category.is_active ? (
                          <Typography
                            color="success.main"
                            sx={{
                              px: 1,
                              maxWidth: "10ch",
                              margin: "0 auto",
                              fontSize: "13px",
                              background: "#26f57c2a",
                              borderRadius: "8px",
                            }}
                          >
                            ACTIVE
                          </Typography>
                        ) : (
                          <Typography
                            align="center"
                            color="errorColor.main"
                            sx={{
                              px: 1,
                              maxWidth: "10ch",
                              margin: "0 auto",
                              fontSize: "13px",
                              background: "#fc3e3e34",
                              borderRadius: "8px",
                            }}
                          >
                            INACTIVE
                          </Typography>
                        )}
                      </TableCell>

                      {/* <TableCell className="tbl-cell">
                        {Moment(data.minor_category.created_at).format(
                          "MMM DD, YYYY"
                        )}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CustomTableCollapse;
