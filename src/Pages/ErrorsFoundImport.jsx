import React, { useState } from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

const ErrorsFoundImport = (props) => {
  const { postImport, importError, isPostError } = props;

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("row");

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

  const fileTypes = ["CSV", "XLSX"];

  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // console.log(file.name);
    // console.log(formData);

    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    // axios.post("http://127.0.0.1:8000/api/import-masterlist", formData);

    postImport(formData);
  };

  return (
    <Box sx={{ mt: -2, pb: 2 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          fontFamily: "Anton",
          color: "#EA3434",
          mb: "10px",
        }}
      >
        ERRORS FOUND
      </Typography>
      <TableContainer
        className="mcontainer__th-body"
        sx={{
          border: "0.5px solid rgb(139, 139, 139)",
          borderRadius: "10px",
          overflow: "overlay",
        }}
      >
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === `row`}
                  direction={orderBy === `row` ? order : `asc`}
                  onClick={() => onSort(`row`)}
                >
                  Row
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === `column`}
                  direction={orderBy === `column` ? order : `asc`}
                  onClick={() => onSort(`column`)}
                >
                  Column
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === `message`}
                  direction={orderBy === `message` ? order : `asc`}
                  onClick={() => onSort(`message`)}
                >
                  Message
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isPostError &&
              [...importError].sort(comparator(order, orderBy))?.map((item, index) => {
                return (
                  <TableRow key={item.id || index} hover={true}>
                    <TableCell sx={{ textAlign: "left", pl: "35px" }}>{parseInt(item.row) + 2}</TableCell>
                    <TableCell className="columnErrorName">{item.column.replace(/_/g, " ")}</TableCell>
                    <TableCell>{item.message}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ErrorsFoundImport;
