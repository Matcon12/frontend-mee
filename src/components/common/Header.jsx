import React, { useEffect, useState } from 'react'
import '../../app.css'
import matlogo from "../../images/matlogo.png";
import home from "../../images/home-button.png";
import back from "../../images/undo.png";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const [out, setOut] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        setOut(true);
    };

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

    return (
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
    )
}

export default Header