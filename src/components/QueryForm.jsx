// // QueryForm.jsx
import React, { useState, useEffect } from "react";
import "../app.css";
import matlogo from "../images/matlogo.png";
import home from "../images/home-button.png";
import { Link } from "react-router-dom";
import back from "../images/undo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormInput from "./FormInput";

const QueryForm = () => {
  const navigate = useNavigate();
  const [out, setOut] = useState(false);
  const [values, setValues] = useState({
    cust_id: "",
    cust_name: "",
    part_id: "",
    part_name: "",
    po_no: "",
    po_date: "",
    grn_no: "",
    grn_date: "",
  });

  const inputs = [
    {
      id: 1,
      name: "cust_id",
      type: "text",
      label: "Customer ID",
    },
    {
      id: 2,
      name: "cust_name",
      type: "text",
      label: "Customer Name",
      readOnly: true,
    },
    {
      id: 3,
      name: "part_id",
      type: "text",
      label: "Part Code",
    },
    {
      id: 4,
      name: "part_name",
      type: "text",
      label: "Part Name",
      readOnly: true,
    },
    {
      id: 5,
      name: "po_no",
      type: "text",
      label: "PO Number",
    },
    {
      id: 6,
      name: "po_date",
      type: "date",
      label: "PO Date",
      readOnly: true,
    },
    {
      id: 7,
      name: "grn_no",
      type: "text",
      label: "Inward DC Number",
    },
    {
      id: 8,
      name: "grn_date",
      type: "date",
      label: "Inward DC Date",
      readOnly: true,
    },
  ];

  const onChange = async (e) => {
    const { name, value } = e.target;
    console.log("onChange triggered:", name, value);

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (name === "cust_id" && value) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-CN/${value}/`
        );
        const CN = response.data.cust_name;
        console.log(CN, "cust name");

        setValues((prevValues) => ({
          ...prevValues,
          cust_name: CN,
        }));
      } catch (error) {
        console.error("Error fetching cust_name:", error);
      }
    }

    if (name === "part_id" && value && values.cust_id) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-part-name/${value}/${values.cust_id}/`
        );
        const partName = response.data.part_name;

        console.log(partName, "partname from backend");

        setValues((prevValues) => ({ ...prevValues, part_name: partName }));
        console.log("After axios request. part_name:", partName);
      } catch (error) {
        console.error("Error getting part name", error);
      }
    }

    if (name === "po_no" && value) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-details/${value}/`
        );
        console.log("after try");
        const poDetails = response.data;
        console.log("after axios request. PO details:", poDetails);
        setValues((prevValues) => ({
          ...prevValues,
          po_date: poDetails.po_date,
          cust_id: poDetails.cust_id,
        }));

        try {
          const custId = poDetails.cust_id;
          const responseCust = await axios.get(
            `http://52.90.227.20:8080/get-CN/${custId}`
          );
          const custName = responseCust.data.cust_name;

          setValues((prevValues) => ({
            ...prevValues,
            cust_name: custName,
          }));
        } catch (error) {
          console.error("Error fetching cust_name:", error);
        }

        console.log("After axios request. PO details:", poDetails);
      } catch (error) {
        console.error("Error getting PO details", error);
      }
    }

    if (name === "grn_no" && value) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-inw-details/${value}/`
        );
        const inwDetails = response.data;

        setValues((prevValues) => ({
          ...prevValues,
          grn_date: inwDetails.grn_date,
          po_no: inwDetails.po_no,
          po_date: inwDetails.po_date,
          cust_id: inwDetails.cust_id,
        }));

        try {
          const custId = inwDetails.cust_id;
          const responseCust = await axios.get(
            `http://52.90.227.20:8080/get-CN/${custId}/`
          );
          const custName = responseCust.data.cust_name;

          setValues((prevValues) => ({
            ...prevValues,
            cust_name: custName,
          }));
        } catch (error) {
          console.error("Error fetching cust_name:", error);
        }

        console.log("After axios request. Inw DC details:", inwDetails);
      } catch (error) {
        console.error("Error getting PO details", error);
      }
    }
  };

  useEffect(() => {
    if (out) {
      axios
        .post("http://52.90.227.20:8080/logout/")
        .then((response) => {
          console.log("POST request successful", response);
          alert(response.data.message);
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
      <form>
        <h1>Query Tab</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
            readOnly={[
              "cust_name",
              "part_name",
              "po_date",
              "grn_date",
            ].includes(input.name)}
          />
        ))}
      </form>
    </div>
  );
};

export default QueryForm;
