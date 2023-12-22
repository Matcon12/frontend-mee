import React, { useState } from "react";
import "./formInput.css";
import axios from "axios";
import { useEffect } from "react";
import matlogo from "../images/matlogo.png";
import { useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";
import back from "../images/undo.png";

function PartMaster() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newFormData = {};

    newFormData["part_id"] = document.getElementsByName("part_id")[0].value;
    newFormData["part_name"] = document.getElementsByName("part_name")[0].value;
    newFormData["cust_id"] = document.getElementsByName("cust_id")[0].value;

    console.log(newFormData);
    setFormData(newFormData);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://52.90.227.20:8080/part-master-input/", formData)
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
            alert("Please enter a valid customer id");
          } else if (error.response.data["part_id"]) {
            alert("This part id already exists");
          }
        });
    }
  }, [formData, submitted]);

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
    <div className="app">
      <div class="container">
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
      </div>
      <form>
        <h1>Part Details</h1>
        <div className="formInput">
          <label>Part Code</label>
          <input type="text" name="part_id" />
          <label>Part Name</label>
          <input type="text" name="part_name" />
          <label>Customer ID</label>
          <input type="text" name="cust_id" />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default PartMaster;
