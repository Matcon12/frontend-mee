import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import axios from "axios";
//import matlogo from "../images/matlogo.png";
import { Link, useNavigate } from "react-router-dom";
//import home from "../images/home-button.png";
//import back from "../images/undo.png";
import Header from "./common/Header";

function Inw_Del_Challan() {
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [qty, setQty] = useState(0);

  const inputs = [
    {
      id: 4,
      name: "po_no",
      type: "text",
      label: "PO Number",
      required: true,
    },
    {
      id: 5,
      name: "po_date",
      type: "date",
      label: "PO Date",
      required: true,
      readOnly: true,
    },
    {
      id: 6,
      name: "cust_id",
      type: "text",
      label: "Customer ID",
      required: true,
      readOnly: true,
    },
    {
      id: 7,
      name: "receiver_id",
      type: "text",
      label: "Receiver ID",
      required: true,
      readOnly: true,
    },
    {
      id: 8,
      name: "consignee_id",
      type: "text",
      label: "Consignee ID",
    },
    {
      id: 1,
      name: "grn_no",
      type: "text",
      label: "Inward DC Number",
      required: true,
    },
    {
      id: 2,
      name: "grn_date",
      type: "date",
      label: "Inward DC Date",
      min: values.po_date,
      required: true,
    },

    {
      id: 10,
      name: "total_items",
      type: "number",
      label: "Total PO Sl No Items",
      required: true,
    },
  ];

  const handleSubmit = async(event) => {
    event.preventDefault();

    const inwDcDate = new Date(values.inw_dc_date);
    const poDate = new Date(values.po_date);
    console.log("Inward DC Date:", inwDcDate);
    console.log("PO Date:", poDate);
    if (inwDcDate < poDate) {
      alert("Inward DC Date should be later than PO Date");
      return;
    }
    var nos = parseInt(document.getElementsByName("total_items")[0]?.value);
    setQty(nos);
    console.log("Values:", values);
    console.log("Nos:", nos);
    if (nos < 1) {
      alert("Minimum 1 Item required");
      return;
    }

    try {
      const response = await axios.get(
        `http://52.90.227.20:8080/get-po-details/${values.po_no}`);
      console.log(response.data);
    } catch (error) {
      alert("Invalid PO Number");
      return;
    }
    navigate(`/inw-items?qty=${nos}`, { state: { ...values } });
    setSubmitted(true);
  };

  const onChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));

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

    if (name === "po_no" && value) {
      try {
        console.log("Before axios request. po_no:", value);
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-details/${value}/`
        );
        const poDetails = response.data;
        setValues((prevValues) => ({
          ...prevValues,
          po_date: poDetails.po_date,
          cust_id: poDetails.cust_id,
          receiver_id: poDetails.cust_id,
          consignee_id: poDetails.cust_id,
        }));
        console.log("After axios request. PO details:", poDetails);
      } catch (error) {
        console.error("Error getting PO details", error);
      }
    }
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

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="app">
      <Header />
      <form onSubmit={handleSubmit}>
        <h1>Inward Delivery Challan</h1>
        <label>Rework DC</label>
        <br></br>
        <select type="boolean" defaultValue="false" name="rework_dc">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
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

export default Inw_Del_Challan;


{/*
import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import axios from "axios";
//import matlogo from "../images/matlogo.png";
import { Link, useNavigate } from "react-router-dom";
//import home from "../images/home-button.png";
//import back from "../images/undo.png";
import Header from "./common/Header";

function Inw_Del_Challan() {
  const [values, setValues] = useState({});
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [qty, setQty] = useState(0);

  const inputs = [
    {
      id: 4,
      name: "po_no",
      type: "text",
      label: "PO Number",
      required: true,
    },
    {
      id: 5,
      name: "po_date",
      type: "date",
      label: "PO Date",
      required: true,
      readOnly: true,
    },
    {
      id: 6,
      name: "cust_id",
      type: "text",
      label: "Customer ID",
      required: true,
      readOnly: true,
    },
    {
      id: 7,
      name: "receiver_id",
      type: "text",
      label: "Receiver ID",
      required: true,
      readOnly: true,
    },
    {
      id: 8,
      name: "consignee_id",
      type: "text",
      label: "Consignee ID",
    },
    {
      id: 1,
      name: "grn_no",
      type: "text",
      label: "Inward DC Number",
      required: true,
    },
    {
      id: 2,
      name: "grn_date",
      type: "date",
      label: "Inward DC Date",
      min: values.po_date,
      required: true,
    },

    {
      id: 10,
      name: "total_items",
      type: "number",
      label: "Total PO Sl No Items",
      required: true,
    },
  ];

  const handleSubmit = async(event) => {
    event.preventDefault();

    const inwDcDate = new Date(values.inw_dc_date);
    const poDate = new Date(values.po_date);
    console.log("Inward DC Date:", inwDcDate);
    console.log("PO Date:", poDate);
    if (inwDcDate < poDate) {
      alert("Inward DC Date should not be less than PO Date");
      return;
    }
    var nos = parseInt(document.getElementsByName("total_items")[0]?.value);
    setQty(nos);
    console.log("Values:", values);
    console.log("Nos:", nos);
    if (nos < 1) {
      alert("Minimum 1 Item required");
      return;
    }
    navigate(`/inw-items?qty=${nos}`, { state: { ...values } });
    setSubmitted(true);
  };

  const onChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));

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

    if (name === "po_no" && value) {
      try {
        console.log("Before axios request. po_no:", value);
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-details/${value}/`
        );
        const poDetails = response.data;
        setValues((prevValues) => ({
          ...prevValues,
          po_date: poDetails.po_date,
          cust_id: poDetails.cust_id,
          receiver_id: poDetails.cust_id,
          consignee_id: poDetails.cust_id,
        }));
        console.log("After axios request. PO details:", poDetails);
      } catch (error) {
        console.error("Error getting PO details", error);
      }
    }
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

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="app">
      <Header />
      <form onSubmit={handleSubmit}>
        <h1>Inward Delivery Challan</h1>
        <label>Rework DC</label>
        <br></br>
        <select type="boolean" defaultValue="false" name="rework_dc">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
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

export default Inw_Del_Challan;
*/}