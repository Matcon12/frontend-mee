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
  const [invoiceReport, setInvoiceReport] = useState(null);
  const [out, setOut] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  // }


  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://52.90.227.20:8080/invoice-report/', {
        start_date: startDate,
        end_date: endDate,
      });

      console.log(response.data);
      if (response.status === 200) {
        // Redirect to the specified URL
        alert("Invoice Report is generated")
      }
      // Handle the response here if needed
    } catch (error) {
      console.error('Error making POST request', error);
      // Handle other errors
    }
  };
  useEffect(() => {
    const backendURL = 'http://52.90.227.20:8080/invoice-report/';

    const data = {
      start_date: startDate,
      end_date: endDate
    }

    axios.get(backendURL, { params: { data: data } })
      .then(response => {
        setInvoiceReport(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [startDate, endDate]);

  //
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
  if (!invoiceReport) {
    return <div>Loading..... </div>;
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
          <label>Enter the start date</label><input type="date" name="start_date" value={startDate} onChange={handleStartDateChange} />
          <label>Enter the end date</label><input type="date" name="end_date" value={endDate} onChange={handleEndDateChange} />
          <button onClick={handleSubmit}>Submit</button>

        </div>
      </form>
    </div>
  )
};

export default InvoiceReports