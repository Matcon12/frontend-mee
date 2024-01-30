import React from 'react'
import './common.css'
import { Link } from 'react-router-dom'

const ErrorScreen = ({ errorCode, errorTitle, errorMessage }) => {
    return (
        <div className='app-error_screen'>
            <div className="code">
                {errorCode}
            </div>
            <h1>{errorTitle}</h1>
            <p>
                {errorMessage}
            </p>
            <Link
                className='link-btn'
                to={'/home'}
            >
                Go to home
            </Link>
        </div>
    )
}

export default ErrorScreen