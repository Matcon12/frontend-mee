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
    po_sl_no: "",
    qty: "",
    unit_price: "",
    grn_no: "",
    grn_date: "",
  });

  const inputs = [
    {
      id: 1,
      name: "cust_id",
      type: "text",
      label: "Customer ID",
      maxLength: 4,
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
      name: "po_sl_no",
      type: "number",
      label: "PO Sl No",
      readOnly: true,
    },
    {
      id: 8,
      name: "qty",
      type: "number",
      label: "Quantity",
      readOnly: true,
    },
    {
      id: 9,
      name: "unit_price",
      type: "number",
      label: "Unit Price",
      readOnly: true,
    },
    {
      id: 10,
      name: "grn_no",
      type: "text",
      label: "Inward DC Number",
    },
    {
      id: 11,
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

    if (name === "cust_id" && value.length <= 4) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-CN/${value}/`
        );
        const CN = response.data.cust_name;
        console.log(CN, "cust name");

        setValues((prevValues) => ({
          ...prevValues,
          cust_name: CN,
          po_no: "",
          po_date: "",
          grn_no: "",
          grn_date: "",
        }));
      } catch (error) {
        // If there's an error (invalid cust_id), clear cust_name
        console.error("Error fetching cust_name:", error);
        setValues((prevValues) => ({
          ...prevValues,
          cust_name: "",
          po_no: "",
          po_date: "",
          grn_no: "",
          grn_date: "",
        }));
      }
    }

    if (name === "part_id" && value && values.cust_id) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-part-name/${value}/${values.cust_id}/`
        );
        const partName = response.data.part_name;

        console.log(partName, "partname from backend");

        setValues((prevValues) => ({
          ...prevValues,
          part_name: partName,
          part_id: value,
        }));
        console.log("After axios request. part_id:", value);
      } catch (error) {
        console.error("Error getting part name", error);
        setValues((prevValues) => ({
          ...prevValues,
          part_name: "",
          part_id: value,
        }));
      }
    }

    if (name === "po_no" && value) {
      setValues((prevValues) => ({
        ...prevValues,
        part_id: "",
        part_name: "",
        grn_no: "",
        grn_date: "",
      }));
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-details/${value}/`
        );
        const poDetails = response.data;

        setValues((prevValues) => ({
          ...prevValues,
          po_date: poDetails.po_date,
          cust_id: poDetails.cust_id,
        }));

        try {
          const custId = poDetails.cust_id;
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

        console.log("After axios request. PO details:", poDetails);
      } catch (error) {
        console.error("Error getting PO details", error);
        setValues((prevValues) => ({
          ...prevValues,
          po_date: "",
          cust_id: "",
          cust_name: "",
        }));
      }
    }

    if (name === "po_no" && value && values.part_id) {
      console.log("Inside if condition for PO details with part_id");
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-sl-no-details/${value}/${values.part_id}/`
        );
        const data = response.data;
        console.log(data, "from backend");

        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: data.po_sl_no,
          qty: data.qty,
          unit_price: data.unit_price,
        }));
      } catch (error) {
        console.error("Error getting PO details with part_id", error);
        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: "",
          qty: "",
          unit_price: "",
        }));
      }
    }

    if (name === "grn_no" && value) {
      setValues((prevValues) => ({
        ...prevValues,
        part_id: "",
        part_name: "",
      }));
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
        setValues((prevValues) => ({
          ...prevValues,
          grn_date: "",
          po_no: "",
          po_date: "",
          cust_id: "",
          cust_name: "",
        }));
        console.error("Error getting PO details", error);
        console.log("URL causing the 404 error:", error.config.url);
      }
    }

    console.log("Before Axios request for grn_no");
    if (name === "grn_no" && value && values.part_id) {
      console.log("Before Axios request");
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-sl-no-details-inw/${value}/${values.part_id}/`
        );
        const data = response.data;
        console.log(data, "from backend");

        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: data.po_sl_no,
          qty: data.qty_received,
          unit_price: data.unit_price,
        }));
      } catch (error) {
        console.error("Error getting PO details", error);
        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: "",
          qty: "",
          unit_price: "",
        }));
      }
    }

    if (name === "part_id" && value && values.po_no) {
      console.log("Before Axios request for reverse case");
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-sl-no-details/${values.po_no}/${value}/`
        );
        const data = response.data;
        console.log(data, "from backend");

        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: data.po_sl_no,
          qty: data.qty,
          unit_price: data.unit_price,
        }));
      } catch (error) {
        console.error("Error getting PO details", error);
        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: "",
          qty: "",
          unit_price: "",
        }));
      }
    }

    if (name === "part_id" && value && values.grn_no) {
      console.log("Before Axios request for reverse case");
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/get-po-sl-no-details-inw/${values.grn_no}/${value}/`
        );
        const data = response.data;
        console.log(data, "from backend");

        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: data.po_sl_no,
          qty: data.qty_received,
          unit_price: data.unit_price,
        }));
      } catch (error) {
        console.error("Error getting PO details", error);
        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: "",
          qty: "",
          unit_price: "",
        }));
      }
    }

    if (name === "po_sl_no" && value && values.po_no) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/po-sl-no/${values.po_no}/${value}/`
        );

        if (response.data && response.data.part_id) {
          const poDetails = response.data;

          setValues((prevValues) => ({
            ...prevValues,
            po_sl_no: value,
            part_id: poDetails.part_id,
            qty: poDetails.qty,
            unit_price: poDetails.unit_price,
          }));

          // Fetch part_name based on part_id and cust_id
          try {
            const partId = poDetails.part_id;
            const custId = values.cust_id; // Assuming cust_id is already set

            const responsePart = await axios.get(
              `http://52.90.227.20:8080/get-part-name/${partId}/${custId}/`
            );
            const partDetails = responsePart.data;

            if (partDetails && partDetails.part_name) {
              setValues((prevValues) => ({
                ...prevValues,
                part_name: partDetails.part_name,
              }));
            } else {
              // Clear part_name if the details are not available
              setValues((prevValues) => ({
                ...prevValues,
                part_name: "",
              }));
            }

            console.log("After axios request. Part details:", partDetails);
          } catch (error) {
            console.error("Error getting part details", error);
            // Clear related fields if the details are not available
            setValues((prevValues) => ({
              ...prevValues,
              part_name: "",
            }));
          }
        } else {
          // Clear related fields if the details are not available
          setValues((prevValues) => ({
            ...prevValues,
            po_sl_no: value,
            part_id: "",
            qty: "",
            unit_price: "",
            part_name: "",
          }));
        }
      } catch (error) {
        console.error("Error getting PO details", error);
        // Clear related fields if there's an error
        setValues((prevValues) => ({
          ...prevValues,
          po_sl_no: value,
          part_id: "",
          qty: "",
          unit_price: "",
          part_name: "",
        }));
      }
    } else if (name === "po_sl_no" && !value) {
      // Clear related fields if po_sl_no is empty
      setValues((prevValues) => ({
        ...prevValues,
        po_sl_no: "",
        part_id: "",
        part_name: "",
        qty: "",
        unit_price: "",
      }));
    }

    if (name === "po_sl_no" && value && values.grn_no) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/po-sl-no-inw/${values.grn_no}/${value}/`
        );

        if (response.data && response.data.part_id) {
          const inwDetails = response.data;

          setValues((prevValues) => ({
            ...prevValues,
            part_id: inwDetails.part_id,
            qty: inwDetails.qty_received,
            unit_price: inwDetails.unit_price,
          }));

          // Fetch part_name based on part_id and cust_id
          try {
            const partId = inwDetails.part_id;
            const custId = values.cust_id; // Assuming cust_id is already set

            const responsePart = await axios.get(
              `http://52.90.227.20:8080/get-part-name/${partId}/${custId}/`
            );
            const partDetails = responsePart.data;

            if (partDetails && partDetails.part_name) {
              setValues((prevValues) => ({
                ...prevValues,
                part_name: partDetails.part_name,
              }));
            } else {
              // Clear part_name if the details are not available
              setValues((prevValues) => ({
                ...prevValues,
                part_name: "",
              }));
            }

            console.log("After axios request. Part details:", partDetails);
          } catch (error) {
            console.error("Error getting part details", error);
            // Clear related fields if the details are not available
            setValues((prevValues) => ({
              ...prevValues,
              part_name: "",
            }));
          }
        } else {
          // Clear related fields if the details are not available
          setValues((prevValues) => ({
            ...prevValues,
            part_id: "",
            part_name: "",
            qty: "",
            unit_price: "",
          }));
        }
      } catch (error) {
        console.error("Error getting PO details", error);
        // Clear related fields if there's an error
        setValues((prevValues) => ({
          ...prevValues,
          part_id: "",
          part_name: "",
          qty: "",
          unit_price: "",
        }));
      }
    } else if (name === "po_sl_no" && !value) {
      // Clear related fields if po_sl_no is empty
      setValues((prevValues) => ({
        ...prevValues,
        part_id: "",
        part_name: "",
        qty: "",
        unit_price: "",
      }));
    }
  };

  useEffect(() => {
    console.log(values.part_id, "value of part_id after it is set");
  }, [values.part_id]);

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
