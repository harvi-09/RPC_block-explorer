
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropFileInput = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  // Handle drop event
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      
      if (file.type === "application/json") {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result);
            console.log("Parsed JSON data: ", json);
            setJsonData(json);
           
            setError(null);
            
             const existingData = localStorage.getItem("Data");

             if (existingData) {
                localStorage.removeItem("Data")
                localStorage.setItem("Data", JSON.stringify(json))
               console.log("Replacing existing data in localStorage.");
             } else {
                localStorage.setItem("Data", JSON.stringify(json))
               console.log("No existing data found. Setting new data.");
             }
 
             // Save the new data to localStorage
             localStorage.setItem("Data", JSON.stringify(json)); // Save the updated data to localStorage
 
          } catch (error) {
            console.error("Error parsing JSON: ", error);
            setError("Failed to parse JSON file.");
          }
        };

        reader.readAsText(file);
      } else {
        setError("Please drop a valid JSON file.");
        console.log("Invalid file type. Expected a JSON file.");
      }
    } else {
      setError("No file dropped.");
    }
  };

  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".json", // Only accept JSON files
    noClick: false, // Allow clicking to select a file
    noKeyboard: true, // Disable keyboard navigation
  });

  return (
    <>
      
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed rgb(255 255 255 / 61%)",
          padding: "20px",
          width: "900px",
          color:"white",
          margin: "0 auto",
          height: "200px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: "rgb(55 42 57 / 76%)",
        }}
      >
        <input {...getInputProps()} style={{ display: "none" }} />
        <p>Drag & drop a JSON file here, or click to select a file</p>
      </div>

     

      {/* Error Handling */}
      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <p>{error}</p>
        </div>
      )}

     
    </>
  );
};

export default DropFileInput;
