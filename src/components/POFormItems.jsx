import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import Header from "./common/Header";

function POFormItems() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no_of_items = parseInt(queryParams.get("qty"));
  const [values, setValues] = useState(location.state);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [counter, setCounter] = useState(1);
  const [total, setTotal] = useState(0);

  const inputs = [
    {
      id: 9,
      name: "po_sl_no",
      type: "number",
      label: "PO Sl No",
      min: 0,
      oninput: "validity.valid||(value='');",
      required: true,
    },
    {
      id: 10,
      name: "part_id",
      type: "text",
      label: "Part Code",
      required: true,
    },
    {
      id: 11,
      name: "qty",
      type: "number",
      label: "Quantity",
      oninput: "validity.valid||(value=0);",
      required: true,
    },
    {
      id: 12,
      name: "uom",
      type: "text",
      label: "Unit of Measurement",
      default: "No",
      required: true,
    },
    {
      id: 13,
      name: "unit_price",
      type: "number",
      label: "Unit Price",
      oninput: "validity.valid||(value=0);",
      required: true,
    },

    {
      id: 14,
      name: "part_name",
      type: "text",
      label: "Part Name",
      readOnly: true,
    },
  ];

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://3.90.115.255:8080/purchase-order-input/", values)
        .then((response) => {
          if (counter === no_of_items) {
            alert("All items saved successfully");
            navigate("/home");
          } else if (counter < no_of_items) {
            alert(`Data for Item-${counter} saved successfully`);
          }
          setCounter(counter + 1);
          setValues({
            ...location.state,
            po_sl_no: "",
            part_id: "",
            qty: "",
            uom: "",
            unit_price: "",
          });
          setTotal(0);
          console.log("POST request successful", response);
        })
        .catch((error) => {
          console.error("Error making POST request", error.response.data);

          if (error.response.data["non_field_errors"]) {
            alert("Item with this PO No. & PO Sl No. already exists");
          }
        });
    }
    setSubmitted(false);
  }, [submitted]);

  const onChange = async (e) => {
    const { name, value } = e.target;

    // Calculate new values
    const newValues = { ...values, [name]: value };
    const tot = newValues.qty * newValues.unit_price;
    // Set state with the new values and the calculated total
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
      total_price: tot,
    }));

    setTotal(tot);
    console.log("Qty:", newValues.qty);
    console.log("Unit Price:", newValues.unit_price);
    console.log("Total:",tot);

    if (name === "part_id" && value) {
      try {
        console.log("Before axios request. part_id:", value);
        const custId = newValues.cust_id;
        console.log(custId, "cust id");
        const response = await axios.get(
          `http://3.90.115.255:8080/get-part-name/${value}/${custId}/`
        );
        const partName = response.data.part_name;

        console.log(partName, "partname from backend");

        setValues((prevValues) => ({ ...prevValues, part_name: partName }));
        console.log("After axios request. part_name:", partName);
      } catch (error) {
        console.error("Error getting Part Name", error);
        setValues((prevValues) => ({ ...prevValues, part_name: "" }));
      }
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    var price = parseFloat(document.getElementsByName("unit_price")[0]?.value);
    var nos = parseInt(document.getElementsByName("qty")[0]?.value);
    if (nos === 0 && values.open_po === "false") {
      alert("Quantity cannot be Zero");
      return;
    }
    if (nos < 0) {
      alert("Enter a valid Quantity");
      return;
    }
    if (price <= 0) {
      alert("Invalid Unit Price");
      return;
    }
    setTotal(price * nos);
    values["total_price"] = Math.round((price * nos).toFixed(2));

    if (values.po_sl_no < 1) {
      alert("Enter a valid PO Sl No");
      return;
    }
    if (values.part_name) {
      setSubmitted(true);
    } else {
      alert("Invalid PART-ID for this CUSTOMER-ID");
    }
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
      <form onSubmit={handleSubmit}>
        <h1>Item {counter}</h1>
        {inputs.map((input) =>
          input.readOnly ? (
            <div key={input.id}>
              <label>{input.label}</label>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  overflowWrap: "break-word",
                  width: "34ch",
                }}
              >
                {values[input.name]}
              </div>
            </div>
          ) : (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          )
        )}
        <label>Total Price</label>
        <h3>{total}</h3>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default POFormItems;


{/*
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import home from "../images/home-button.png";
//import matlogo from "../images/matlogo.png";
//import { Link } from "react-router-dom";
//import back from "../images/undo.png";
import axios from "axios";
import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import Header from "./common/Header";

function POFormItems() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no_of_items = parseInt(queryParams.get("qty"));
  const [values, setValues] = useState(location.state);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [counter, setCounter] = useState(1);
  const [total, setTotal] = useState(0);

  const inputs = [
    {
      id: 9,
      name: "po_sl_no",
      type: "number",
      label: "PO Sl No",
      min: 0,
      oninput: "validity.valid||(value='');",
      required: true,
    },
    {
      id: 10,
      name: "part_id",
      type: "text",
      label: "Part Code",
      required: true,
    },
    {
      id: 11,
      name: "qty",
      type: "number",
      label: "Quantity",
      oninput: "validity.valid||(value=0);",
      required: true,
    },
    {
      id: 12,
      name: "uom",
      type: "text",
      label: "Unit of Measurement",
      default: "No",
      required: true,
    },
    {
      id: 13,
      name: "unit_price",
      type: "number",
      label: "Unit Price",
      oninput: "validity.valid||(value=0);",
      required: true,
    },

    {
      id: 14,
      name: "part_name",
      type: "text",
      label: "Part Name",
      readOnly: true,
    },
  ];

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://3.90.115.255:8080/purchase-order-input/", values)
        .then((response) => {
          if (counter === no_of_items) {
            alert("All items saved successfully");
            navigate("/home");
          } else if (counter < no_of_items) {
            alert(`Data for Item-${counter} saved successfully`);
          }
          setCounter(counter + 1);
          setValues({
            ...location.state,
            po_sl_no: "",
            part_id: "",
            qty: "",
            uom: "",
            unit_price: "",
          });
          setTotal(0);
          console.log("POST request successful", response);
        })
        .catch((error) => {
          console.error("Error making POST request", error.response.data);

          if (error.response.data["non_field_errors"]) {
            alert("Item with this PO No. & PO Sl No. already exists");
          }
        });
    }
    setSubmitted(false);
  }, [submitted]);

  const onChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === "part_id" && value) {
      try {
        console.log("Before axios request. part_id:", value);
        const custId = values.cust_id;
        console.log(custId, "cust id");
        const response = await axios.get(
          `http://3.90.115.255:8080/get-part-name/${value}/${custId}/`
        );
        const partName = response.data.part_name;

        console.log(partName, "partname from backend");

        setValues((prevValues) => ({ ...prevValues, part_name: partName }));
        console.log("After axios request. part_name:", partName);
      } catch (error) {
        console.error("Error getting Part Name", error);
        setValues((prevValues) => ({ ...prevValues, part_name: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var price = parseFloat(document.getElementsByName("unit_price")[0]?.value);
    var nos = parseInt(document.getElementsByName("qty")[0]?.value);
    if (nos === 0 && values.open_po === "false") {
      alert("Quantity cannot be Zero");
      return;
    }
    if (price === 0) {
      alert("Unit Price cannot be zero");
      return; 
    }    
    setTotal(price * nos);
    values["total_price"] = Math.round((price * nos).toFixed(2));

    if (values.po_sl_no < 1) {
      alert("Enter a valid PO Sl No");
      return;
    }
    if (values.part_name) {
      setSubmitted(true);
    } else {
      alert("Invalid PART-ID for this CUSTOMER-ID");
    }
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
      <form onSubmit={handleSubmit}>   
        <h1>Item {counter}</h1>
        {inputs.map((input) =>
          input.readOnly ? (
            <div key={input.id}>
              <label>{input.label}</label>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "5px",
                  overflowWrap: "break-word",
                  width: "34ch",
                }}
              >
                {values[input.name]}
              </div>
            </div>
          ) : (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          )
        )}
        <label>Total Price</label>
        <h3>{total}</h3>
        <button type="submit">Submit</button>        
      </form>
    </div>
  );
}

export default POFormItems;
*/}