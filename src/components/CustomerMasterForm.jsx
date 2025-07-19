// Re-written by TJ
// incorporated the dropdown list of gst_state_names to do state_name selection

import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

const inputs = [
  {
    id: 1,
    name: "cust_id",
    type: "text",
    label: "Customer ID",
    required: true,
    minLength: 4,
    maxLength: 4,
  },
  {
    id: 2,
    name: "cust_name",
    type: "text",
    label: "Customer Name",
    required: true,
    maxLength: 50,
  },
  {
    id: 3,
    name: "cust_addr1",
    type: "text",
    label: "Customer Address Line 1",
    required: true,
    maxLength: 50,
  },
  {
    id: 4,
    name: "cust_addr2",
    type: "text",
    label: "Customer Address Line 2",
    maxLength: 50,
  },
  {
    id: 5,
    name: "cust_city",
    type: "text",
    label: "City",
    required: true,
    maxLength: 15,
  },
  {
    id: 6,
    name: "cust_pin",
    type: "number",
    label: "PIN Code",
    required: true,
    maxLength: 6,
  },
  {
    id: 7,
    name: "cust_gst_id",
    type: "text",
    label: "GSTIN",
    required: true,
    maxLength: 15,
  },
  {
    id: 8,
    name: "cust_st_name",
    type: "text",
    label: "State Name",
    required: true,
    maxLength: 20,
  },
  {
    id: 9,
    name: "cust_st_code",
    type: "number",
    label: "State Code",
    required: true,
  },
];

function StateDropdown({ onSelect }) {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          "http://18.209.166.105:8080/gststates"
        );
        setStates(response.data);
        //console.log(states);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    onSelect(selectedState, states); // Pass the states array as an argument
    console.log("Selected State ", selectedState);
  };

  return (
    <select value={selectedState} onChange={handleStateChange}>
      <option value="">Select State</option>
      {states.map((state) => (
        <option key={state.state_code} value={state.state_name}>
          {state.state_name}
        </option>
      ))}
    </select>
  );
}

function CustomerMasterForm() {
  const [states, setStates] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cust_id: "",
    cust_name: "",
    cust_addr1: "",
    cust_addr2: "",
    cust_city: "",
    cust_pin: "",
    cust_gst_id: "",
    cust_st_name: "",
    cust_st_code: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log("formData", formData);
  };

  const handleStateSelect = (selectedState, states) => {
    const selectedStateData = states.find(
      (state) => state.state_name === selectedState
    );
    if (selectedStateData) {
      setFormData((prevData) => ({
        ...prevData,
        cust_st_name: selectedStateData.state_name, // Update property name
        cust_st_code: selectedStateData.state_code, // Update property name
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.cust_id.length !== 4) {
      alert("Enter 4 character Customer-ID");
      return; // Return to exit the function early
    }
    if (formData.cust_pin.length !== 6) {
      alert("Enter 6 digit PIN");
      return; // Return to exit the function early
    }
    if (formData.cust_gst_id.length !== 15) {
      alert("Enter a valid GSTIN");
      return; // Return to exit the function early
    }
    if (formData.cust_st_name === "") {
      alert("Select a Valid State");
      return; // Return to exit the function early
    }
    setSubmitted(true);
  };

  const [out, setOut] = useState(false);
  useEffect(() => {
    if (out) {
      axios
        .post("http://18.209.166.105:8080/logout/")
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
        .post("http://18.209.166.105:8080/customer-master-input/", formData)
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
  }, [formData, submitted]);

  return (
    <div className="app">
      <Header />
      <form onSubmit={handleSubmit}>
        <h1>Customer Details</h1>
        {inputs.map((input) => (
          <div key={input.id}>
            <label htmlFor={input.name}>{input.label}</label>
            {input.name === "cust_st_code" ? (
              <input
                type={input.type}
                id={input.name}
                name={input.name}
                value={formData[input.name]}
                onChange={handleInputChange}
                required={input.required}
                maxLength={input.maxLength}
                disabled // No user input allowed
              />
            ) : input.name === "cust_st_name" ? (
              <StateDropdown onSelect={handleStateSelect} />
            ) : (
              <input
                type={input.type}
                id={input.name}
                name={input.name}
                value={formData[input.name]}
                onChange={handleInputChange}
                required={input.required}
                maxLength={input.maxLength}
              />
            )}
          </div>
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default CustomerMasterForm;

{
  /*
import React from "react";
import { useState } from "react";
import FormInput from "./FormInput";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

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
        .post("http://18.209.166.105:8080/logout/")
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
        .post("http://18.209.166.105:8080/customer-master-input/", values)
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

  const handleSelect = () => {
    var state_name = document.getElementsByName("cust_st_name")[0].value;

    values["cust_st_code"] = gstStateCodes[state_name];
    values["cust_st_name"] = state_name;
    setStatecode(gstStateCodes[state_name]);
  };
  return (
    <div className="app">
      <Header />
      <form onSubmit={handleSubmit}>
        <h1>Customer Details</h1>
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
*/
}
