import React, { useState } from "react";
import "./formInput.css";
import axios from "axios";
import { useEffect } from "react";
import matlogo from "../images/matlogo.png";
import { useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";
import back from "../images/undo.png";
import Header from "./common/Header";

function PartMaster() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newFormData = {};

    newFormData["cust_id"] = document.getElementsByName("cust_id")[0].value;
    newFormData["part_id"] = document.getElementsByName("part_id")[0].value;
    newFormData["part_name"] = document.getElementsByName("part_name")[0].value;

    console.log(newFormData);
    setFormData(newFormData);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://3.90.115.255:8080/part-master-input/", formData)
        .then((response) => {
          console.log("POST request successful", response);
          alert("Data Saved Successfully");
          navigate("/home");
        })
        .catch((error) => {
          console.error(
            "Error making POST request",
            error.response.data["cust_id"]
          );

          if (error.response.data["cust_id"]) {
            alert("Please enter a valid CUSTOMER-ID");
          } else {   //if (error.response.data["part_id"]) {
            alert("Invalid PART-ID or PART NAME");
          }
        });
    }
  }, [formData, submitted]);

  const [out, setOut] = useState(false);
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
  }, [out]);

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  return (
    <div className="app">
      <Header />
      <form>
        <h1>Part Details</h1>
        <div className="formInput">
          <label>Customer ID</label>
          <input type="text" name="cust_id" />
          <label>Part Code</label>
          <input type="text" name="part_id" />
          <label>Part Name</label>
          <input type="text" name="part_name" />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default PartMaster;
