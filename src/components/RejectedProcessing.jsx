import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import matlogo from "../images/matlogo.png";
import { useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";
import back from "../images/undo.png";
import Header from "./common/Header";

function RejectedProcessing() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [Mcc, setMcc] = useState("MEE");

  const handleQtyChange = (e) => {
    setQty(parseInt(e.target.value, 10));
  };

  const generateFormFields = () => {
    const formFields = [];

    for (let i = 0; i < qty; i++) {
      formFields.push(
        <div key={i} className="formInput">
          <label>PO Sl No of {i + 1}</label>
          <input type="text" name={`Po_slno_${i}`} />
          <label>Rejected Quantity </label>
          <input type="text" name={`items_${i}`} />
        </div>
      );
    }

    return formFields;
  };

  const handleSubmit = (event) => {
    const newFormData = {};

    event.preventDefault();

    newFormData["rejected"] = 1;
    newFormData["mcc"] = document.getElementsByName("mcc")[0].value;
    newFormData["grn_no"] = document.getElementsByName("inw")[0].value;
    newFormData["items"] = document.getElementsByName("no_of_items")[0].value;

    var obj;

    for (let i = 0; i < qty; i++) {
      const key = `item${i}`;

      obj = {
        po_sl_no: document.getElementsByName(`Po_slno_${i}`)[0].value,
        qty_delivered: document.getElementsByName(`items_${i}`)[0].value,
      };

      newFormData[key] = obj;
    }
    setFormData(newFormData);
    console.log(formData);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://18.209.166.105:8080/invoice-processing/", formData)
        .then((response) => {
          console.log("POST request successful", response);
          if (response.data == "zero items") {
            alert("Nothing to be delivered");
          } else if (response.data == "grn_no") {
            alert("The inw_dc challan no does not exist");
          } else if (response.data.slice(0, 8) == "po_sl_no") {
            console.log(response.data.slice(0, 8));
            alert(
              "The item does not have a po_sl_no " + response.data.slice(8)
            );
          } else if (response.data == "open_po") {
            alert("The open po has expired, check the validity");
          } else {
            alert("Invoice processed successfully for rejected item");
            navigate("/home");
          }
        })
        .catch((error) => {
          console.error("Error making POST request", error);
        });
    }
  }, [formData, submitted]);

  const handleSelect = () => {
    var code = document.getElementsByName("mcc")[0]?.value;
    setMcc(code);
  };

  const [out, setOut] = useState(false);
  useEffect(() => {
    if (out) {
      axios
        .post("http://18.209.166.105:8080/logout/")
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
        <Link to="/home">
          <img src={home} alt="home" className="logo2" />
        </Link>
      </div>
      <form>
        <h1>
          Invoice/DC Processing <br />
          (Rejected Items)
        </h1>
        <div className="formInput">
          <label>Matcon Company Code</label>
          <select
            type="text"
            defaultValue="MEE"
            name="mcc"
            onChange={handleSelect}
          >
            <option value="MEE">MEE</option>
            <option value="MAH">MAH</option>
            <option value="MAC">MAC</option>
          </select>
          <label>Inward Delivery Challan Number</label>
          <input type="text" name="inw" />
          <label>Total PO Sl No items</label>
          <input type="number" name="no_of_items" onChange={handleQtyChange} />
          <div>{generateFormFields()}</div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
      {/* <div>
            <h2>Form Data:</h2>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div> */}
    </div>
  );
}

export default RejectedProcessing;
