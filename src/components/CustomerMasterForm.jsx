import React from "react";
import { useState } from "react";
import FormInput from "./FormInput";
import axios from "axios";
import { useEffect } from "react";
import matlogo from "../images/matlogo.png";
import { Link, useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import back from "../images/undo.png";

function CustomerMasterForm() {
  const [values, setValues] = useState({
    cust_st_name: "Karnataka",
    cust_st_code: "29",
  });
  const [submitted, setSubmitted] = useState(false);
  const [statecode, setStatecode] = useState(29);
  const navigate = useNavigate();

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
  ];
  const gstStateCodes = {
    "Andhra Pradesh": "37",
    "Arunachal Pradesh": "12",
    Assam: "18",
    Bihar: "10",
    Chhattisgarh: "22",
    Goa: "30",
    Gujarat: "24",
    Haryana: "06",
    "Himachal Pradesh": "02",
    Jharkhand: "20",
    Karnataka: "29",
    Kerala: "32",
    "Madhya Pradesh": "23",
    Maharashtra: "27",
    Manipur: "14",
    Meghalaya: "17",
    Mizoram: "15",
    Nagaland: "13",
    Odisha: "21",
    Punjab: "03",
    Rajasthan: "08",
    Sikkim: "11",
    "Tamil Nadu": "33",
    Telangana: "36",
    Tripura: "16",
    "Uttar Pradesh": "09",
    Uttarakhand: "05",
    "West Bengal": "19",
    "Andaman and Nicobar Islands": "35",
    Chandigarh: "04",
    "Dadra and Nagar Haveli and Daman and Diu": "26",
    Lakshadweep: "31",
    Delhi: "07",
    Puducherry: "34",
  };

  const inputs = [
    {
      id: 1,
      name: "cust_id",
      type: "text",
      label: "Customer ID",
      required: true,
    },
    {
      id: 2,
      name: "cust_name",
      type: "text",
      label: "Customer Name",
      required: true,
    },
    {
      id: 3,
      name: "cust_addr1",
      type: "text",
      label: "Customer Address Line 1",
    },
    {
      id: 4,
      name: "cust_addr2",
      type: "text",
      label: "Customer Address Line 2",
    },
    {
      id: 5,
      name: "cust_city",
      type: "text",
      label: "City",
      required: true,
    },
    {
      id: 8,
      name: "cust_pin",
      type: "number",
      label: "PIN Code",
      required: true,
    },
    {
      id: 9,
      name: "cust_gst_id",
      type: "text",
      label: "GSTIN",
      required: true,
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (values.cust_id.length != 4) {
      alert("Enter customer id length equal to 4 digits");
    }
    if (values.cust_pin.length != 6) {
      alert("Enter pin length equal to 6 digits");
    }
    console.log(values);
    setSubmitted(true);
  };

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

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://52.90.227.20:8080/customer-master-input/", values)
        .then((response) => {
          console.log("POST request successful", response);
          alert("Data Saved Successfully");
          navigate("/home");
        })
        .catch((error) => {
          console.error("Error making POST request", error);

          if (error.response.data["cust_id"]) {
            alert("This customer id already exists");
          }
        });
    }
    setSubmitted(false);
  }, [values, submitted]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  const handleSelect = () => {
    var state_name = document.getElementsByName("cust_st_name")[0].value;

    values["cust_st_code"] = gstStateCodes[state_name];
    values["cust_st_name"] = state_name;
    setStatecode(gstStateCodes[state_name]);
  };
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
      <div class="container">
        <img src={matlogo} alt="MatconLogo" className="logo" />
        <Link to="/home">
          <img src={home} alt="home" className="logo2" />
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Customer Master</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}

        <label>Enter state name</label>
        <br></br>
        <br></br>
        <select
          onChange={handleSelect}
          name="cust_st_name"
          defaultValue="Karnataka"
        >
          {indianStates.map((state) => (
            <option value={state}>{state}</option>
          ))}
        </select>
        <br></br>
        <br></br>
        <label>GST state code</label>
        <h3>{statecode}</h3>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default CustomerMasterForm;
