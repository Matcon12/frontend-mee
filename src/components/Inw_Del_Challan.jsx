import React, { useEffect, useState } from 'react'
import FormInput from './FormInput';
import axios from 'axios';
import matlogo from '../images/matlogo.png';
import { Link, useNavigate } from 'react-router-dom';
import home from '../images/home-button.png';
import back from '../images/undo.png';


function Inw_Del_Challan() {

    const [values,setValues] = useState({});
    const navigate = useNavigate();
    const [submitted,setSubmitted] = useState(false);
    const [qty,setQty] = useState(0);

    const inputs = [
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
          },
          {
            id: 4,
            name: "po_no",
            type: "text",
            label: "PO Number",
          },
          {
            id: 5,
            name: "po_date",
            type: "date",
            label: "PO Date",
            required: true,
          },
          {
            id: 6,
            name: "receiver_id",
            type: "text",
            label: "Receiver ID",
            required: true,
          },
          {
            id: 7,
            name: "consignee_id",
            type: "text",
            label: "Consignee ID",
            required: true,
          },
            {
              id: 9,
              name: "cust_id",
              type: "text",
              label: "Customer ID",
              required: true,
    
            },
            {
              id : 10,
              name: "total_items",
              type: "number",
              label:"Total Items",
              required : true,
            }
           
    ]
    
    const handleSubmit = (event) => {
      event.preventDefault();
      var nos = document.getElementsByName("total_items")[0]?.value;
      setQty(nos)
      console.log(values)
      console.log(nos)
      navigate(`/inw-items?qty=${nos}`,{state:{...values}});

      setSubmitted(true);
    }

      
    
      const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };


      const [out,setOut] = useState(false);
      useEffect(()=>{
        if(out)
        {
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
        },[out])

        const handleLogout = (e) =>{
          e.preventDefault();
          setOut(true)
      } 


    
      return (
        <div className="app">
          <div class="container">
          <img src={back} onClick={()=>navigate(-1)} alt = "back button" className='back' />
          <button className='logout' onClick={handleLogout}>Logout</button>
            <img src={matlogo} alt="MatconLogo"  className="logo"/>
            <Link to ='/home'>
            <img src ={home} alt='home' className='logo2'/>
            </Link>
            </div>
          <form onSubmit={handleSubmit}>
            <h1>Inward Delivery Challan</h1>
            <label>Rework DC</label>
            <br></br>
            <select type='boolean' defaultValue="false" name='rework_dc'>
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

export default Inw_Del_Challan









// const convertDate =(date)=>{
      
//   var parts = date.split("-");
//   var year = parts[0];
//   var month = parts[1];
//   var day = parts[2];
//   return(day + "-" + month + "-" + year);

// }