import moment from "moment";
import * as XLSX from "xlsx";

const useExcel = () => {
  const excelExport = async (obj, title) => {
    const workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(obj);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title} ${moment().format("MMM-DD-YYYY")}.xlsx`);
  };

  const filterHeader = async (jsonData) => {
    await jsonData.map((row) => {
      Object.keys(row).map((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });

    return jsonData;
  };

  const excelImport = async (file) => {
    const excelFile = await file.arrayBuffer();
    const workbook = XLSX.readFile(excelFile);
    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet, { raw: true });
    // ADDED FILTER TO REMOVE BLANK ROWS
    jsonData.filter((row) => {
      Object.values(row).some((value) => value !== "");
    });
    return await filterHeader(jsonData);
  };

  return { excelExport, excelImport };
};

export default useExcel;
