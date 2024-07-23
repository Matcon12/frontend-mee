import React from "react";
import { useNavigate } from "react-router-dom";
import "../app.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "./common/Header";

function DcInput() {
  const navigate = useNavigate();

  function getCurrentFinancialYear() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed

    // Check if the current date is before April 1st
    const cur = today.getFullYear();
    if (currentMonth < 4) {
      return "/" + (cur - 1) + "-" + (cur % 100);
    } else {
      return "/" + cur + "-" + ((cur + 1) % 100);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    var gcn_no = document.getElementsByName("gcn_no")[0]?.value;
    var len = gcn_no.length;
    if (gcn_no[len - 1] === "R") {
      if (len === 3) gcn_no = "0" + gcn_no;
      else if (len === 2) gcn_no = "00" + gcn_no;
    } else {
      if (len === 2) gcn_no = "0" + gcn_no;
      else if (len === 1) gcn_no = "00" + gcn_no;
    }
    var gcn = gcn_no + document.getElementsByName("fin_year")[0]?.value;
    navigate(`/dc-printing?dc_no=${gcn}`);
  };

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
        <h1>DC Printing</h1>
        <label>Outward DC No</label>
        <input type="text" name="gcn_no" />
        <input name="fin_year" defaultValue={getCurrentFinancialYear()}></input>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default DcInput;
