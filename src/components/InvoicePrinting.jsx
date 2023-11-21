import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function InvoicePrinting() {
  const [invoiceData, setInvoiceData] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gcn = queryParams.get('gcn_no');


  useEffect(() => {
    const backendURL = 'http://52.90.227.20:8080/invoice-printing/';

    const data = {
      'gcn_no': gcn
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
  }, [gcn]);

  if (!invoiceData) {
    return <div>Loading..... </div>;
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
export default InvoicePrinting







