import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const parseExcelFile = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(firstSheet);
  return json;
};

export const exportToCSV = (data, filename = "secret-santa-output.csv") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments");
  
    const csvOutput = XLSX.write(workbook, {
      bookType: "csv",
      type: "string",
    });
  
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };