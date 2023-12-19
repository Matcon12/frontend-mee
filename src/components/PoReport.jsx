import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import matlogo from "../images/matlogo.png";
import "../app.css";
import back from "../images/undo.png";
import { useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";

const PoReport = () => {
  const [out, setOut] = useState(false);
  const navigate = useNavigate();
  const getPoReport = async () => {
    try {
      const response = await axios.get(
        `http://52.90.227.20:8080/get-po-report/`
      );

      console.log(response.data.data);

      if (response.status === 200) {
        const responseData = JSON.parse(response.data.data);

        if (responseData) {
          console.log("Received data:", responseData);

          const ws = XLSX.utils.json_to_sheet(responseData);

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

          XLSX.writeFile(wb, "POReport.xlsx");
        } else {
          console.error("No data available");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

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
  });
  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };
  return (
    <div className="app">
      <div className="formInput">
        <h1>PO Report</h1>
        <img src={matlogo} alt="MatconLogo" className="logo" />
        <img
          src={back}
          onClick={() => navigate(-1)}
          alt="back button"
          className="back"
        />
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
        <Link to="/home">
          <img src={home} alt="home" className="logo2" />
        </Link>
        <button onClick={getPoReport}>Get Po Report</button>
      </div>
    </div>
  );
};

export default PoReport;
