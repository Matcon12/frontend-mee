import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import axios from "axios";
import matlogo from "../images/matlogo.png";
import { Link, useNavigate } from "react-router-dom";
import home from "../images/home-button.png";
import back from "../images/undo.png";
import { useLocation } from "react-router-dom";

function Inw_Del_Items() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no_of_items = queryParams.get("qty");
  const [values, setValues] = useState({
    ...location.state,
    purpose: "Painting",
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [counter, setCounter] = useState(1);
  const [total, setTotal] = useState(0);

  const inputs = [
    {
      id: 8,
      name: "po_sl_no",
      type: "number",
      label: "PO Serial Number",
      min: "0",
      required: true,
    },
    {
      id: 10,
      name: "part_id",
      type: "text",
      label: "Part Code",
      required: true,
      readOnly: true,
    },
    {
      id: 11,
      name: "part_name",
      type: "text",
      label: "Part Description",
      required: true,
      readOnly: true,
    },
    {
      id: 12,
      name: "qty_received",
      type: "number",
      label: "Quantity Received",
      min: "0",
      required: true,
    },
    {
      id: 15,
      name: "unit_price",
      type: "number",
      label: "Unit Price",
      min: "0",
      required: true,
      readOnly: true,
    },
    {
      id: 13,
      name: "purpose",
      type: "text",
      label: "Purpose",
      required: true,
    },
    {
      id: 14,
      name: "uom",
      type: "text",
      label: "Unit of Measurement",
      required: true,
      readOnly: true,
    },
  ];

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://52.90.227.20:8080/inward-dc-input/", values)
        .then((response) => {
          if (counter == no_of_items) {
            alert("All items saved successfully");
            navigate("/home");
          } else if (counter < no_of_items) {
            alert("Data saved successfully");
          }
          setCounter(counter + 1);
          setValues({
            ...location.state,
            qty_received: "",
            purpose: "Painting",
            po_sl_no: "",
            part_id: "",
            part_name: "",
            uom: "",
            unit_price: "",
          });
          setTotal(0);
          console.log("POST request successful", response);
        })
        .catch((error) => {
          console.error("Error making POST request", error.response.data);
        });
    }
    setSubmitted(false);
  }, [submitted]);

  const onChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === "po_sl_no" && value) {
      try {
        console.log("Before axios request. po_sl_no:", value);
        const poNo = values.po_no;
        const cust_id = values.cust_id;
        console.log("po no ", poNo);
        const response = await axios.get(
          `http://52.90.227.20:8080/getAdditionalInfo/${poNo}/${value}/`
        );
        const poDetails = response.data;

        setValues((prevValues) => ({
          ...prevValues,
          part_id: poDetails.part_id,
          unit_price: poDetails.unit_price,
          uom: poDetails.uom,
        }));

        const pn = await axios.get(
          `http://52.90.227.20:8080/get-part-name/${poDetails.part_id}/${cust_id}/`
        );
        const partMasterData = pn.data;

        console.log(partMasterData, "partname from backend");
        setValues((prevValues) => ({
          ...prevValues,
          part_name: partMasterData.part_name,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    var price = values.unit_price;
    var nos = values.qty_received;
    setTotal(price * nos);
    values["total_price"] = Math.round((price * nos).toFixed(2));
    console.log(values);
    console.log(values.total_price);
    setSubmitted(true);
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
        <h1>Item {counter}</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name] || ""}
            onChange={onChange}
          />
        ))}
        <label>Total Price</label>
        <h3>{total}</h3>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default Inw_Del_Items;
