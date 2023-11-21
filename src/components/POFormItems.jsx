import React from 'react'
import { useLocation } from 'react-router-dom';
import home from '../images/home-button.png';
import matlogo from '../images/matlogo.png';
import { Link } from 'react-router-dom';
import back from '../images/undo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FormInput from './FormInput';

function POFormItems() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no_of_items = queryParams.get('qty');
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
      //placeholder: "Confirm Password",
      //errorMessage: "Passwords don't match!",
      label: "PO Serial Number",
      //pattern: values.password,
      min: "0",
      oninput: "validity.valid||(value='');",
      required: true,
    },
    {
      id: 10,
      name: "part_id",
      type: "text",
      // placeholder: "Customer Name",
      // errorMessage: "It should be a valid email address!",
      label: "Part Code",
      required: true,

    },
    {
      id: 11,
      name: "qty",
      type: "number",
      // placeholder: "Customer Name",
      // errorMessage: "It should be a valid email address!",
      label: "Quantity",
      min: "0",
      oninput: "validity.valid||(value='');",
      required: true,

    },
    {
      id: 12,
      name: "uom",
      type: "text",
      // placeholder: "Customer Name",
      // errorMessage: "It should be a valid email address!",
      label: "Unit of Measurement",
      required: true,

    },
    {
      id: 13,
      name: "unit_price",
      type: "number",
      // placeholder: "Customer Name",
      // errorMessage: "It should be a valid email address!",
      label: "Unit Price",
      min: "0",
      oninput: "validity.valid||(value='');",
      required: true,
    },

  ];

  useEffect(() => {
    if (submitted) {
      axios.post('http://52.90.227.20:8080/purchase-order-input/', values)
        .then((response) => {
          if (counter == no_of_items) {
            alert('All items saved successfully')
            navigate('/home')
          } else if (counter < no_of_items) {
            alert('Data saved successfully')
          }
          setCounter(counter + 1)
          setValues({
            ...location.state,
            "po_sl_no": "",
            "part_id": "",
            "qty": "",
            "uom": "",
            "unit_price": ""
          })
          setTotal(0);
          console.log('POST request successful', response);

        })
        .catch((error) => {
          console.error('Error making POST request', error.response.data);

          if (error.response.data['non_field_errors']) {
            alert('An item with the same po no and po sl no exists')
          }
        });
    }
    setSubmitted(false)
  }, [submitted]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    var price = document.getElementsByName("unit_price")[0]?.value;
    var nos = document.getElementsByName("qty")[0]?.value;
    setTotal(price * nos);
    values["total_price"] = Math.round((price * nos).toFixed(2));
    console.log(values)
    console.log(values.total_price)
    setSubmitted(true);
  }

  const [out, setOut] = useState(false);
  useEffect(() => {
    if (out) {
      axios.post('http://52.90.227.20:8080/logout/')
        .then((response) => {
          console.log('POST request successful', response);
          alert(response.data.message)
          navigate('/')
          setOut(false)

        })
        .catch((error) => {
          console.error('Error making POST request', error);
        });
    }
  }, [out])

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true)
  }



  return (
    <div className='app'>
      <img src={matlogo} alt="matlogo" className='logo' />
      <button className='logout' onClick={handleLogout}>Logout</button>
      <img src={back} onClick={() => navigate(-1)} alt="back button" className='back' />
      <Link to='/home'>
        <img src={home} alt="home" className='logo2' />
      </Link>
      <form>
        <h1>Item {counter}</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <label>Total Price</label>
        <h3>{total}</h3>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default POFormItems

// PO_Sl_No
// Part_ID
// Quantity
// UOM
// Unit_Price


// {
//     id: 9,
//     name: "po_sl_no",
//     type: "number",
//     //placeholder: "Confirm Password",
//     //errorMessage: "Passwords don't match!",
//     label: "PO Serial Number",
//     //pattern: values.password,
//     required: true,
//   },
//   {
//     id: 10,
//     name: "part_id",
//     type: "text",
//    // placeholder: "Customer Name",
//    // errorMessage: "It should be a valid email address!",
//     label: "Part Code",
//     required: true,

//   },
//   {
//     id: 11,
//     name: "qty",
//     type: "number",
//    // placeholder: "Customer Name",
//    // errorMessage: "It should be a valid email address!",
//     label: "Quantity",
//     required: true,

//   },
//   {
//     id: 12,
//     name: "uom",
//     type: "text",
//    // placeholder: "Customer Name",
//    // errorMessage: "It should be a valid email address!",
//     label: "Unit of Measurement",
//     required: true,

//   },
//   {
//     id: 13,
//     name: "unit_price",
//     type: "number",
//    // placeholder: "Customer Name",
//    // errorMessage: "It should be a valid email address!",
//     label: "Unit Price",
//     required: true,
//   },