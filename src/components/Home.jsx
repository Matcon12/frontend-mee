import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./formInput.css";
import "../app.css";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import matlogo from "../images/matlogo.png";
import home from "../images/home-button.png";
import back from "../images/undo.png";

const Home = () => {
  const [out, setOut] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setOut(true);
  };

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
  });

  const handleLogout = (e) => {
    e.preventDefault();
    setOut(true);
  };

  return (
    <div className="homepage">
      <div className="container">
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
        <h1>Main Menu</h1>
        <Link to="/data-entry">
          <button className="button">Perform Data Entry</button>
        </Link>
        <Link to="/invoice-processing">
          <button className="button">Invoice Generation</button>
        </Link>
        <Link to="/rejected-processing">
          <button className="button">Delivery of Rejected Goods</button>
        </Link>
        <Link to="/reports-printing">
          <button className="button">Reports Printing</button>
        </Link>
        <Link to="/query-tab">
          <button className="button"> Queries </button>
        </Link>
      </form>
    </div>
  );
};

export default Home;
