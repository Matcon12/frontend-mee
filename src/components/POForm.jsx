import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

const inputs = [
  {
    id: 5,
    name: "cust_id",
    type: "text",
    label: "Customer ID",
    required: true,
    maxLength: 4,
  },
  {
    id: 1,
    name: "po_no",
    type: "string",
    label: "PO Number",
    required: true,
  },
  {
    id: 2,
    name: "po_date",
    type: "date",
    label: "PO Date",
    required: true,
  },

  {
    id: 6,
    name: "quote_ref_no",
    type: "text",
    label: "Quote Ref Number",
  },
  {
    id: 7,
    name: "receiver_id",
    type: "text",
    label: "Receiver ID",
    required: true,
  },

  {
    id: 8,
    name: "consignee_id",
    type: "text",
    label: "Consignee ID",
    required: true,
  },
  {
    id: 9,
    name: "total_items",
    type: "number",
    label: "Total PO Sl No Items",
    required: true,
  },
];

function POForm() {
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);

  const handleSubmit = async(event) => {
    event.preventDefault();
    var nos = document.getElementsByName("total_items")[0]?.value;
    setQty(nos);
    console.log("Nos : ", nos, "QTY : ", qty);

    values["open_po"] = document.getElementsByName("open_po")[0]?.value;
    values["open_po_validity"] =
      document.getElementsByName("open_po_validity")[0]?.value;

    if (nos < 1) {
      alert("Minimum 1 item required");
      return;
    }
    //if (values.cust_id.length != 4) {
    //  alert("Enter 4 character Customer-ID");
    //  return;
    //}
  
    try {
      const response = await axios.get(
        `http://3.90.115.255:8080/get-CN/${values.cust_id}`);
      console.log(response.data);
    } catch (error) {
      alert("Invalid Customer-ID");
      return;
    }
    navigate(`/po-form-items?qty=${nos}`, { state: { ...values } });

    setSubmitted(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    console.log("values", values);

    // Set receiver_id and consignee_id to cust_id when cust_id is changed
    if (name === "cust_id") {
      setValues((prevValues) => ({
        ...prevValues,
        receiver_id: value,
        consignee_id: value,
        [name]: value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  var [val, setVal] = useState(false);

  const handleSelect = (e) => {
    setVal(!val);
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
      <div className="container">
        {/*        <img src={matlogo} alt="MatconLogo" className="logo" />*/}
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Purchase Order</h1>
        <label>Open PO</label>
        <select
          type="boolean"
          defaultValue="false"
          name="open_po"
          onChange={handleSelect}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
        <br></br>
        {val && (
          <FormInput
            key="12"
            label="Open PO Validity"
            type="date"
            name="open_po_validity"
            required
          />
        )}
        <br></br>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default POForm;

{/*

import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";
import Header from "./common/Header";

const inputs = [
  {
    id: 5,
    name: "cust_id",
    type: "text",
    label: "Customer ID",
    required: true,
    maxLength: 4,
  },
  {
    id: 1,
    name: "po_no",
    type: "string",
    label: "PO Number",
    required: true,
  },
  {
    id: 2,
    name: "po_date",
    type: "date",
    label: "PO Date",
    required: true,
  },

  {
    id: 6,
    name: "quote_ref_no",
    type: "text",
    label: "Quote Ref Number",
  },
  {
    id: 7,
    name: "receiver_id",
    type: "text",
    label: "Receiver ID",
    required: true,
  },

  {
    id: 8,
    name: "consignee_id",
    type: "text",
    label: "Consignee ID",
    required: true,
  },
  {
    id: 9,
    name: "total_items",
    type: "number",
    label: "Total PO Sl No Items",
    required: true,
  },
];

function POForm() {
  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    var nos = document.getElementsByName("total_items")[0]?.value;
    setQty(nos);
    console.log("Nos : ",nos,"QTY : ",qty);

    values["open_po"] = document.getElementsByName("open_po")[0]?.value;
    values["open_po_validity"] =
      document.getElementsByName("open_po_validity")[0]?.value;

    if (nos < 1) {
      alert("Minimum 1 item required");
      return;
    } 
    if (values.cust_id.length != 4) {
      alert("Enter 4 character Customer-ID");
      return;
    } 
    navigate(`/po-form-items?qty=${nos}`, { state: { ...values } });

    setSubmitted(true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    console.log("values",values);
    
    // Set receiver_id and consignee_id to cust_id when cust_id is changed
    if (name === "cust_id") {
      setValues((prevValues) => ({
        ...prevValues,
        receiver_id: value,
        consignee_id: value,
        [name]: value,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  var [val, setVal] = useState(false);

  const handleSelect = (e) => {
    setVal(!val);
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
      <div className="container">
{/*        <img src={matlogo} alt="MatconLogo" className="logo" />*/}{/*
      </div>
      <form onSubmit={handleSubmit}>
        <h1>Purchase Order</h1>
        <label>Open PO</label>
        <select
          type="boolean"
          defaultValue="false"
          name="open_po"
          onChange={handleSelect}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
        <br></br>
        {val && (
          <FormInput
            key="12"
            label="Open PO Validity"
            type="date"
            name="open_po_validity"
            required
          />
        )}
        <br></br>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default POForm;
*/}