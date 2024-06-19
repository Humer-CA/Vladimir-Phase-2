import React from "react";

import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

import ActionMenu from "../../../components/ActionMenu";
import Preloader from "../../../components/Preloader";

const CategoriesTable = (props) => {
  const { fetching, data, onStatusChange, onUpdateChange } = props;

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("updated_at");

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

  return (
    <Table className="FistoTableMasterlist-root" size="small">
      <TableHead className="FistoTableHeadMasterlist-root">
        <TableRow className="FistoTableRowMasterlist-root">
          <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-head" align="center">
            <TableSortLabel
              active={orderBy === `id`}
              direction={orderBy === `id` ? order : `asc`}
              onClick={() => onSort(`id`)}
            >
              {" "}
              ID NO.
            </TableSortLabel>
          </TableCell>

          <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `name`}
              direction={orderBy === `name` ? order : `asc`}
              onClick={() => onSort(`name`)}
            >
              {" "}
              CATEGORY
            </TableSortLabel>
          </TableCell>

          <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-head">STATUS</TableCell>

          <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-head">
            <TableSortLabel
              active={orderBy === `updated_at`}
              direction={orderBy === `updated_at` ? order : `asc`}
              onClick={() => onSort(`updated_at`)}
            >
              {" "}
              LAST MODIFIED
            </TableSortLabel>
          </TableCell>

          <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-head" align="center">
            ACTIONS
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody className="FistoTableHeadMasterlist-root">
        {fetching ? (
          <Preloader row={5} col={5} />
        ) : data ? (
          data.sort(comparator(order, orderBy)).map((data, index) => (
            <TableRow className="FistoTableRowMasterlist-root" key={index} hover>
              <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-body" align="center">
                {data.id}
              </TableCell>

              <TableCell
                className="FistoTableCellMasterlist-root FistoTableCellMasterlist-body"
                sx={{ textTransform: "capitalize" }}
              >
                {data.name}
              </TableCell>

              <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-body">
                {Boolean(data.deleted_at) ? "Inactive" : "Active"}
              </TableCell>

              <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-body">
                {new Date(data.updated_at).toLocaleString("default", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell className="FistoTableCellMasterlist-root FistoTableCellMasterlist-body" align="center">
                <ActionMenu data={data} onStatusChange={onStatusChange} onUpdateChange={onUpdateChange} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell align="center" colSpan={5}>
              NO RECORDS FOUND
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CategoriesTable;
