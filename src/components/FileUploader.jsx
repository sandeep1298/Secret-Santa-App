import React, { useRef, useState } from "react";

const FileUploader = ({ onFileUpload, label }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No File Selected");

  const inputId = label?.toLowerCase().replace(/\s/g, "_");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
      <div className="form-group mb-4 w-full">
      {label && (<label className="form-label mb-2 block" htmlFor={inputId}>{label}</label>)}
      <div className="input-group inline mb-3">
        <input
          type="text"
          className="form-control rounded-l px-3 py-2 border border-gray-300"
          value={fileName}
          readOnly
        />
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          ref={fileInputRef}
          id={inputId}
          className="form-control dis_non hidden"
        />
        <label className="btn btn_upload cursor-pointer" htmlFor={inputId}>
          Upload
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
