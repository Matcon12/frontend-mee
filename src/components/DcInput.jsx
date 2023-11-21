import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../app.css'
import matlogo from '../images/matlogo.png';
import home from '../images/home-button.png'
import back from '../images/undo.png';
import axios from 'axios';
import { useState,useEffect } from 'react';

function DcInput() {

    const navigate = useNavigate();

    function getCurrentFinancialYear() {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    
      // Check if the current date is before April 1st
      const cur = today.getFullYear();
      if (currentMonth < 4) {
        return "/" + today.getFullYear() - 1 + "-" + cur%100;
      } else {
        return "/" +today.getFullYear() + "-" + (cur + 1)%100;
      }
    }

    const handleSubmit =(e)=> {
        e.preventDefault();

        var gcn_no = document.getElementsByName('gcn_no')[0]?.value;
        var len = gcn_no.length;
        if(gcn_no[len-1] == 'R')
        {
          if(len == 3)
            gcn_no = "0" + gcn_no;
          else if(len == 2)
            gcn_no = "00" + gcn_no;  
        } else {
          if(len == 2)
          gcn_no = "0" + gcn_no;
        else if(len == 1)
          gcn_no = "00" + gcn_no;
        }
        var gcn = gcn_no + document.getElementsByName('fin_year')[0]?.value;
        navigate(`/dc-printing?dc_no=${gcn}`)

    }

    const [out,setOut] = useState(false);
    useEffect(()=>{
      if(out)
      {
        axios.post('http://localhost:5000/logout/')
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
        <div className='app'>
        <img src={back} onClick={()=>navigate(-1)} alt = "back button" className='back' />
        <button className='logout' onClick={handleLogout}>Logout</button>
            <img src={matlogo} alt="MatconLogo"  className="logo"/>
            <Link to ='/home'>
            <img src = {home} alt ="home" className='logo2'/>
            </Link>
            <form>
            <h1>DC Printing</h1>
                <label>Outward DC No</label><input type='text' name = 'gcn_no'/>
                <input value={getCurrentFinancialYear()} name='fin_year'></input>
                <button onClick={handleSubmit}>Submit</button>
            </form>
        </div>
      )
}

export default DcInput