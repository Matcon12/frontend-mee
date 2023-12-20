import React, { useState, useEffect } from "react";
import "../app.css";
import "./formInput.css";
import axios from "axios";
import matlogo from "../images/matlogo.png";
import home from "../images/home-button.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import back from "../images/undo.png";

function InvoiceProcessing() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);
  // const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [Mcc, setMcc] = useState("MEE");
  const [partDetails, setPartDetails] = useState([]);

  const handleQtyChange = (e) => {
    setQty(parseInt(e.target.value, 10));
  };

  const handleChangeGRN = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [formData, setFormData] = useState({
    items: Array(qty).fill({
      po_sl_no: "",
      qty_delivered: "",
      part_id: "",
      part_name: "",
      unit_price: "",
    }),
    rejected: 0,
    mcc: "MEE",
    grn_no: "",
  });

  const generateFormFields = () => {
    const formFields = [];

    for (let i = 0; i < qty; i++) {
      formFields.push(
        <div key={i} className="formInput">
          <label>PO Serial Number of {i + 1}</label>
          <input
            type="text"
            name={`Po_slno_${i}`}
            onChange={(e) => onChange(e, i)}
          />

          <label>Quantity needed for item {i + 1}</label>
          <input
            type="text"
            name={`items_${i}`}
            onChange={(e) => onChange(e, i)}
          />

          {partDetails[i] && (
            <div>
              <p>Part ID: {partDetails[i].part_id}</p>
              <p>Part Name: {partDetails[i].part_name}</p>
              <p>Unit Price: {partDetails[i].unit_price}</p>
            </div>
          )}
        </div>
      );
    }

    return formFields;
  };

  const handleSubmit = (event) => {
    const newFormData = {};

    event.preventDefault();

    newFormData["rejected"] = 0;
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

  // useEffect(() => {
  //   if (submitted) {
  //     axios
  //       .post("http://52.90.227.20:8080/invoice-processing/", formData)
  //       .then((response) => {
  //         console.log("POST request successful", response);
  //         if (response.data == "zero items") {
  //           alert("Nothing to be delivered");
  //         } else if (response.data == "grn_no") {
  //           alert("The inw_dc challan no does not exist");
  //         } else if (response.data.slice(0, 8) == "po_sl_no") {
  //           console.log(response.data.slice(0, 8));
  //           alert(
  //             "The item does not have a po_sl_no " + response.data.slice(8)
  //           );
  //         } else if (response.data == "open_po") {
  //           alert("The open po has expired, check the validity");
  //         } else {
  //           alert("Invoice processed successfully ");
  //           navigate("/home");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error making POST request", error);
  //       });
  //   }
  // }, [formData, submitted]);

  useEffect(() => {
    if (submitted) {
      axios
        .post("http://52.90.227.20:8080/invoice-processing/", formData)
        .then((response) => {
          console.log("POST request successful", response.data);

          if (response.data.message === "success" && response.data.gcn_no) {
            const gcn_no = response.data.gcn_no;
            alert(`Invoice / DC No: ${gcn_no} generated successfully`);
            navigate("/home");
          } else {
            if (response.data === "zero items") {
              alert("Nothing to be delivered");
            } else if (response.data === "grn_no") {
              alert("The inw_dc challan no does not exist");
            } else if (response.data.slice(0, 8) === "po_sl_no") {
              alert(
                "The item does not have a po_sl_no " + response.data.slice(8)
              );
            } else if (response.data === "open_po") {
              alert("The open po has expired, check the validity");
            }
          }
        })
        .catch((error) => {
          // Handle general error cases
          console.error("Error making POST request", error);
          if (error.response) {
            alert(`Error: ${error.response.data}`);
          } else if (error.request) {
            alert("Error: No response from the server");
          } else {
            alert("Error: Something went wrong");
          }
        });
    }
  }, [formData, submitted]);

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
  const handleSelect = () => {
    var code = document.getElementsByName("mcc")[0]?.value;
    setMcc(code);
  };

  const onChange = async (e, itemIndex) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedItems = prevData.items.map((item, i) => {
        if (i === itemIndex) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      });

      return {
        ...prevData,
        items: updatedItems,
      };
    });

    // Check if both GRN and PO_SL_NO are entered
    const grn_no = document.getElementsByName("inw")[0]?.value;
    const po_sl_no = document.getElementsByName(`Po_slno_${itemIndex}`)[0]
      ?.value;

    if (grn_no && po_sl_no) {
      try {
        const response = await axios.get(
          `http://52.90.227.20:8080/i-p-details/${grn_no}/${po_sl_no}/`
        );
        const partDetails = response.data;

        console.log(partDetails, "partDetails");

        // Update state with part details
        setPartDetails((prevDetails) => {
          const updatedDetails = [...prevDetails];
          updatedDetails[itemIndex] = partDetails;
          return updatedDetails;
        });

        setFormData((prevData) => {
          const updatedItems = prevData.items.map((item, index) => {
            if (index === itemIndex) {
              return {
                ...item,
                po_sl_no,
                part_id: partDetails.part_id,
                part_name: partDetails.part_name,
                unit_price: partDetails.unit_price,
              };
            }
            return item;
          });

          return {
            ...prevData,
            items: updatedItems,
          };
        });
      } catch (error) {
        console.error(`Error fetching details for ${name} ${value}`, error);
      }
    }
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
        <h1>Invoice/DC Processing</h1>
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
          <input type="text" name="inw" onChange={handleChangeGRN} />
          <label>Total number of po_sl_no items</label>
          <input type="number" name="no_of_items" onChange={handleQtyChange} />
          <div>{generateFormFields()}</div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}
export default InvoiceProcessing;
