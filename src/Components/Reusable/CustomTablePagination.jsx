import { TablePagination } from "@mui/material";
import React from "react";

const CustomTablePagination = (props) => {
  const { data, success, total, current_page, per_page, perPage, onPageChange, onRowsPerPageChange } = props;

  return (
    <TablePagination
      className="mcontainer__pagination"
      component="div"
      rowsPerPageOptions={[
        5, 10, 15, 100,
        // {
        //   label: "All",
        //   value: parseInt(total),
        // },
      ]}
      count={total || 0}
      page={current_page - 1 || 0}
      rowsPerPage={parseInt(per_page || perPage) || 5}
      // count={success ? total : 0}
      // page={success ? current_page - 1 : 0}
      // rowsPerPage={success ? parseInt(per_page || perPage) : 5}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default CustomTablePagination;
