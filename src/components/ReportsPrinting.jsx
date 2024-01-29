import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import "../app.css";
import { Link } from "react-router-dom";
import axios from "axios";
import matlogo from "../images/matlogo.png";
import home from "../images/home-button.png";
import back from "../images/undo.png";
import Header from "./common/Header";

function ReportsPrinting() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [out, setOut] = useState(false);
  useEffect(() => {
    if (out) {
      axios
        .post("http://52.90.227.20:8080/logout/")
        .then((response) => {
          console.log("POST request successful", response);
          alert("Logout Successfull");
          navigate("/");
          setOut(false);
        })
        .catch((error) => {
          console.error("Error making POST request", error);
        });
    }
  }, [out]);

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  return (
    <div className="app">
      <div class="container">
        <Header />
      </div>
      <form>
        <h1>Reports Printing</h1>
        <div className="formInput">
          <Link to="/invoice-input">
            <button>View/Print Invoice</button>
          </Link>
          <Link to="/dc-input">
            <button>View/Print Delivery Challan</button>
          </Link>
          <Link to="/invoice-reports">
            <button>Invoice Report</button>
          </Link>
          <Link to="/customer-report">
            <button>Customer Details</button>
          </Link>
          <Link to="/part-report">
            <button>Parts Details</button>
          </Link>
          <Link to="/po-report">
            <button>Purchase Order Report</button>
          </Link>
          <Link to="/inward-dc-report">
            <button>Inward DC Report</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ReportsPrinting;
