import React from 'react'
import '../app.css'
import { useNavigate } from 'react-router-dom';
import matlogo from '../images/matlogo.png';
import home from '../images/home-button.png'
import { Link } from 'react-router-dom';
import back from '../images/undo.png';
import axios from 'axios';
import { useEffect, useState } from 'react';

function InvoiceInput() {

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    var gcn = document.getElementsByName('gcn_no')[0]?.value;
    navigate(`/invoice-printing?gcn_no=${gcn}`)

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
      <img src={matlogo} alt="MatconLogo" className="logo" />
      <img src={back} onClick={() => navigate(-1)} alt="back button" className='back' />
      <button className='logout' onClick={handleLogout}>Logout</button>
      <Link to='/home'>
        <img src={home} alt="home" className='logo2' />
      </Link>
      <form>
        <h1>Invoice Printing</h1>
        <label>Outward Dc No</label><input type='text' name='gcn_no' />
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default InvoiceInput