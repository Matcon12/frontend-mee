import React, { useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom';
import '../app.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import matlogo from '../images/matlogo.png';


function Login() {

  const [values, setValues] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    values['uname'] = document.getElementsByName('username')[0]?.value;
    values['password'] = document.getElementsByName('pw')[0]?.value;
    setSubmitted(true);
  }

  useEffect(() => {
    if (submitted) {
      axios.post('http://52.90.227.20:8080/login/', values)
        .then((response) => {
          console.log('POST request successful', response);
          if (response.data == 'successful') {
            navigate('/home');
          } else if (response.data == 'incorrect') {
            alert('Username or password is incorrect')
          }
        })
        .catch((error) => {
          console.error('Error making POST request', error);
        });
    }
    setSubmitted(false);
  }, [values, submitted]);


  return (
    <div className='app'>
      <div className="container">
        <img src={matlogo} alt="MatconLogo" className="logo" />
      </div>
      <form>
        <h1>Login Page</h1>
        <div className='formInput'>
          <label>Username</label><input type="text" name="username" />
          <label>Password</label><input type="password" name="pw" />
          <button onClick={handleSubmit}>Submit</button>
          <h3>New User?</h3>
          <Link to='/register'>
            <button>Sign Up</button>
          </Link>
        </div>
      </form>
    </div>
  );

}

export default Login