import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../app.css'
import matlogo from '../images/matlogo.png';
import home from '../images/home-button.png'
import back from '../images/undo.png';
import axios from 'axios';
import { useState, useEffect } from 'react';

function DcInput() {

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    var gcn = document.getElementsByName('gcn_no')[0]?.value;
    navigate(`/dc-printing?dc_no=${gcn}`)

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
      <img src={back} onClick={() => navigate(-1)} alt="back button" className='back' />
      <button className='logout' onClick={handleLogout}>Logout</button>
      <img src={matlogo} alt="MatconLogo" className="logo" />
      <Link to='/home'>
        <img src={home} alt="home" className='logo2' />
      </Link>
      <form>
        <h1>DC Printing</h1>
        <label>Outward DC No</label><input type='text' name='gcn_no' />
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default DcInput