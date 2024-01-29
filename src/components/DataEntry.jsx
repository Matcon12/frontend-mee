import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./formInput.css";
import "../app.css";
import "./homepage.css";
import matlogo from "../images/matlogo.png";
import home from "../images/home-button.png";
import back from "../images/undo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Header from "./common/Header";

const DataEntry = () => {
  const navigate = useNavigate();
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (out) {
      axios
        .post("http://52.90.227.20:8080/logout/")
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
  }, [out]);

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };
  return (
    <div className="homepage">
      <Header />

      <form>
        <h1>Data Entry</h1>
        <Link to="/cm-form">
          <button className="button">Customer Details </button>
        </Link>
        <Link to="/pm-form">
          <button className="button">Part Details</button>
        </Link>
        <Link to="/po-form">
          <button className="button">Purchase Order</button>
        </Link>
        <Link to="/inw-form">
          <button className="button">Inward Delivary Challan</button>
        </Link>
      </form>
    </div>
  );
};

export default DataEntry;
