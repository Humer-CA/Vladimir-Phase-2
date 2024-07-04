import { TablePagination } from "@mui/material";
import React from "react";

const CustomTablePagination = (props) => {
  const { total, current_page, per_page, perPage, onPageChange, onRowsPerPageChange, removeShadow } = props;

  return (
    <TablePagination
      className={removeShadow ? "" : "mcontainer__pagination"}
      component="div"
      rowsPerPageOptions={[5, 10, 15, 100]}
      count={total || 0}
      page={current_page - 1 || 0}
      rowsPerPage={parseInt(per_page || perPage) || 5}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default CustomTablePagination;
