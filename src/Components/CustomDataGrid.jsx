import React, { useState } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TextField } from "@mui/material";

const CustomDataGrid = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]); // Corrected from file to files
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  const xlData = { res: data };
  // console.log(xlData?.res?.map((id) => id.syncId));

  const rowsId = xlData?.res?.map((data) => data);

  const createHeader = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      field: key, // This will use the key as the field name
      headerName: key, // This will use the key as the column header
      width: 150, // You can adjust the width
    }));
  };
  const columns = createHeader();
  const rows = data.map((row, index) => ({ id: index, ...row }));
  console.log("header", columns);
  return (
    <div className="import-container">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {data.length > 0 && (
        <>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            getRowId={(rowsId) => rowsId.syncId}
            disableRowSelectionOnClick
          />
        </>
      )}
    </div>
  );
};

export default CustomDataGrid;
