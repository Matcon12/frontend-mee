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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(
        "Sending request with start date:",
        startDate,
        "end date:",
        endDate
      );
      const postReq = await axios.post(
        "http://52.90.227.20:8080/invoice-report/",
        {
          start_date: startDate,
          end_date: endDate,
        }
      );

      console.log(postReq.data);

      if (postReq.status === 200) {
        const responseData = JSON.parse(postReq.data.data);

        if (responseData) {
          console.log("Received data:", responseData);
          const ws = XLSX.utils.json_to_sheet(responseData);

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

          XLSX.writeFile(wb, "invoiceReports.xlsx");
        } else {
          console.error("No data available");
        }
      }
    } catch (error) {
      console.error("Error making POST request", error);
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
