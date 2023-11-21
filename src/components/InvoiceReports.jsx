import React from 'react'
import '../app.css'
import matlogo from '../images/matlogo.png';
import home from '../images/home-button.png'
import { Link } from 'react-router-dom';
import back from '../images/undo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

function InvoiceReports() {

  const navigate = useNavigate();

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
      <img src={back} onClick={() => navigate(-1)} alt="back button" className='back' />
      <button className='logout' onClick={handleLogout}>Logout</button>
      <img src={matlogo} alt="MatconLogo" className="logo" />
      <Link to='/home'>
        <img src={home} alt='home' className='logo2' />
      </Link>
      <form>
        <h1>Invoice Reports</h1>
        <div className='formInput'>
          <label>Enter the start date</label><input type="date" name="start_date" />
          <label>Enter the end date</label><input type="date" name="end_date" />
        </div>
      </form>
    </div>
  )
}

export default InvoiceReports