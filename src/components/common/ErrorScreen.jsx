import React from 'react'
import './common.css'

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
        </div>
    )
}

export default ErrorScreen