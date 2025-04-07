import React, { useEffect, useState } from "react";
import FileUploader from "./components/FileUploader";
import SecretSantaService from "./services/SecretSantaService";
import { parseExcelFile, exportToCSV } from "./utils/fileUtils";
import './App.css'
import { Loader } from "./utils/Loader";

function App() {
  const [currentData, setCurrentData] = useState([]);
  const [previousData, setPreviousData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleFileUpload = async (file, isPrevious = false) => {
    try {
      const data = await parseExcelFile(file);
  
      // Check required fields
      const hasRequiredFields = data.every(
        (row) => row.Employee_Name && row.Employee_EmailID
      );
  
      if (!hasRequiredFields) {
        alert("Missing required fields: Employee_Name or Employee_EmailID.");
        return;
      }
  
      const formatted = data.map((d) => ({
        name: d.Employee_Name,
        email: d.Employee_EmailID,
      }));
  
      // Compare current and previous data to prevent same file usage
      const stringified = JSON.stringify(formatted);
  
      if (!isPrevious) {
        if (JSON.stringify(previousData) === stringified) {
          alert("Current employee list cannot be the same as previous assignments.");
          return;
        }
        setCurrentData(formatted);
      } else {
        if (JSON.stringify(currentData) === stringified) {
          alert("Previous assignment file cannot be the same as current employee list.");
          return;
        }
        setPreviousData(data); // Keep raw format for compatibility
      }
    } catch (err) {
      alert("Invalid file or format.");
      console.error(err);
    }
  };
  

  const handleGenerate = () => {
    try {
      const service = new SecretSantaService(currentData, previousData);
      const assignments = service.generateAssignments();
      exportToCSV(assignments);
    } catch (error) {
      alert("Error generating assignments: " + error.message);
    }
  };

  return (
    <>
    {isLoading ? (
      <Loader />
    ) : (
      <>
      <div className="santa_back">
        <div className="container flex-center">
          <div className="card">
            <h1 className="text-center card-header text-white secondary-color card_header_text">Secret Santa App</h1>
          <div className="card-body p-5">
            <FileUploader
              label="Upload Current Year Employee List"
              onFileUpload={(file) => handleFileUpload(file, false)}
            />

            <FileUploader
              label="Upload Previous Year Assignments (Optional)"
              onFileUpload={(file) => handleFileUpload(file, true)}
            />

            <div className='pt-3 button_align'>
              <button
                className="btn btn_warning_submit"
                onClick={handleGenerate}
                disabled={currentData.length === 0}
              >
                Generate Secret Santa List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    )}
    </>
  );
}

export default App;
