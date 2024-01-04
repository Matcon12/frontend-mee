
import React, { useState, useEffect } from "react";
import "../app.css";
import matlogo from "../images/matlogo.png";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";
import back from "../images/undo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

function InvoiceReports() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoiceReport, setInvoiceReport] = useState(null);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const downloadInvoiceReport = (htmlString) => {
    // Create a Blob containing the HTML data
    const blob = new Blob([htmlString], { type: "text/html" });

    // Create a new object URL
    const url = URL.createObjectURL(blob);

    // Open the URL in a new window
    const newWindow = window.open(url, "_blank");

    // Define functions on the new window
    newWindow.closeWindow = function () {
      newWindow.close();
    };

    newWindow.downloadExcel = function () {
      try {
        // Convert HTML content to Excel file and trigger download
        const wb = XLSX.read(htmlString, { type: "binary" });
        XLSX.writeFile(wb, "invoiceReports.xlsx");
      } catch (error) {
        console.error("Error downloading Excel file", error);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(
        "Sending request with start date:",
        startDate,
        "end date:",
        endDate
      );
      setLoading(true);
      const postReq = await axios.post(
        "http://52.90.227.20:8080/invoice-report/",
        {
          start_date: startDate,
          end_date: endDate,
        }
      );

      console.log(postReq.data);

      if (postReq.status === 200) {
        // Access data from the response
        // const responseData = postReq.data.data;
        const responseData = JSON.parse(postReq.data.data);

        if (responseData) {
          // Your logic to handle the data on the frontend
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
              <h2>Inward DC Report</h2>
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

          // Call the function to open the new window and provide download options
          downloadInvoiceReport(htmlWithStyles);
        } else {
          console.error("No data available");
        }
      }
    } catch (error) {
      console.error("Error making POST request", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://52.90.227.20:8080/logout/");
      console.log("POST request successful", response);
      alert("Logout Successful");
      navigate("/");
    } catch (error) {
      console.error("Error making POST request", error);
    }
  };

  if (loading) {
    return <div>Loading..... </div>;
  }

  return (
    <div className="app">
      <img
        src={back}
        onClick={() => navigate(-1)}
        alt="back button"
        className="back"
      />
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      <img src={matlogo} alt="MatconLogo" className="logo" />
      <Link to="/home">
        <img src={home} alt="home" className="logo2" />
      </Link>
      <form>
        <h1>Invoice Reports</h1>
        <div className="formInput">
          <label>From Date</label>
          <input
            type="date"
            name="start_date"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label>To Date</label>
          <input
            type="date"
            name="end_date"
            value={endDate}
            onChange={handleEndDateChange}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceReports;
