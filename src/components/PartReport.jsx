import React, { useState ,useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import matlogo from "../images/matlogo.png";
import "../app.css";
import back from "../images/undo.png";
import { useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";
import Header from "./common/Header";



const PartReport =() =>{

  const navigate = useNavigate();
  const [out, setOut] = useState(false);
  const [custId, setCustId] = useState("");
  const [partId, setPartId] = useState("");

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  useEffect(() => {
    if (out) {
      axios
        .post("http://3.90.115.255:8080/logout/")
        .then((response) => {
          console.log("POST request successful", response);
          alert("Logout Successful");
          navigate("/");
          setOut(false);
        })
        .catch((error) => {
          console.error("Error making POST request", error);
        });
    }
  }, [out, navigate]);


  const handleShowReport = async () => {
    try{

      let apiurl= `http://3.90.115.255:8080/partreport/`;
      if (custId) {
        apiurl += `?cust_id=${custId}`;
        if (partId) {
          apiurl += `&part_id=${partId}`;
         
        }
      }

      const response = await axios.get(apiurl);
      console.log(response.data.data);

      if (response.status===200){
        const responseData = JSON.parse(response.data.data);

        if (responseData) {
          console.log("Received data:", responseData);

          const ws = XLSX.utils.json_to_sheet(responseData);
          const htmlString = XLSX.write(
            { Sheets: { Sheet1: ws }, SheetNames: ["Sheet1"] },
            { bookType: "html", bookSST: true, type: "binary" }
          );

          // Include Bootstrap CDN link for table styling
          const bootstrapLink = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">';

          // Add buttons, Bootstrap link, and styles to the HTML content
          const htmlWithStyles = `
            <html>
              <head>
                ${bootstrapLink}
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                  }
                  h2 {
                    color: #333;
                    border-bottom: 2px solid #ccc;
                    padding-bottom: 10px;
                    font-size: 1.5em;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                  }
                  th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                    font-size: 0.9em;
                    white-space: nowrap; 
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                  button {
                    background-color: #4caf50;
                    color: white;
                    padding: 10px 15px;
                    margin: 10px;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                  }
                  button.close {
                    background-color: #d9534f; /* Custom color for close button */
                    margin-left: 10px; /* Add some margin to separate it from the download button */
                  }
                  button:hover {
                    background-color: #45a049;
                  }
                </style>
              </head>
              <body>
                <h2>Parts Report</h2>
                <div class="table-responsive">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        ${Object.keys(responseData[0]).map((header) => `<th>${header}</th>`).join("")}
                      </tr>
                    </thead>
                    <tbody>
                      ${responseData.map((row) => `<tr>${Object.values(row).map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}
                    </tbody>
                  </table>
                </div>
                <button onclick="closeWindow()">Close</button>
                <button onclick="downloadExcel()">Download Excel</button>
              </body>
            </html>
          `;

          // Create a Blob containing the HTML data
          const blob = new Blob([htmlWithStyles], { type: "text/html" });

          // Create a new object URL
          const url = URL.createObjectURL(blob);

          // Open the URL in a new window
          const newWindow = window.open(url, "_blank");

          // Define functions on the new window
          newWindow.closeWindow = function () {
            newWindow.close();
          };

          newWindow.downloadExcel = function () {
            // Convert HTML content to Excel file and trigger download
            const wb = XLSX.read(htmlString, { type: "binary" });
            XLSX.writeFile(wb, "PartsReport.xlsx");
          };
        } else {
          console.error("No data available");
        }
        
      }
      
    }
    catch (error) {
      console.error(error);
    }
    // Perform the API request to fetch the customer report data
   
  };

  return (
    <div className="app">
      <Header />
      <form>
        <h1>Parts Report</h1>
        <div className="formInput">
          <div>
            <label>Customer ID</label>
            <input
              type="text"
              value={custId}
              placeholder="default value (all)"
              onChange={(e) => setCustId(e.target.value)}
              maxLength={4}
            />
          </div>
          <div>
            <label>Part ID</label>
            <input
              type="text"
              value={partId}
              placeholder="default value (all)"
              onChange={(e) => setPartId(e.target.value)}
            />
          </div>
         
          <button type="button" onClick={handleShowReport}>
            Show Parts Report
          </button>
        </div>
      </form>
    </div>
  );

}

export default PartReport;