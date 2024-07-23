import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


function DCPrinting() {
  const [invoiceData, setInvoiceData] = useState(null);
  const location = useLocation();
  const gcn_no = new URLSearchParams(location.search).get("dc_no");

  useEffect(() => {
    const backendURL = 'http://3.90.115.255:8080/dc-printing/';

    const data = {
      'gcn_no': gcn_no
    }

    axios.get(backendURL, { params: { data: data } })
      .then(response => {
        if (response.data == 'Invalid otw_dc')
          alert('Invalid Outward DC Number')
        setInvoiceData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>{invoiceData && (
      <div
        dangerouslySetInnerHTML={{ __html: invoiceData }}
      />
    )}
    </div>

  );
}
export default DCPrinting