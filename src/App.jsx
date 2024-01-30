import "./app.css";
import FormInput from "./components/FormInput";
import CustomerMasterForm from "./components/CustomerMasterForm";
import POForm from "./components/POForm";
import InvoiceProcessing from "./components/InvoiceProcessing";
import Inw_Del_Challan from "./components/Inw_Del_Challan";
import PartMaster from "./components/PartMaster";
import DataEntry from "./components/DataEntry";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ReportsPrinting from "./components/ReportsPrinting";
import InvoicePrinting from "./components/InvoicePrinting";
import DCPrinting from "./components/DCPrinting";
import InvoiceReports from "./components/InvoiceReports";
import InvoiceInput from "./components/InvoiceInput";
import DcInput from "./components/DcInput";
import RejectedProcessing from "./components/RejectedProcessing";
import POFormItems from "./components/POFormItems";
import Inw_Del_Items from "./components/Inw_Del_Items";
import QueryForm from "./components/QueryForm";
import PoReport from "./components/PoReport";
import InwardDCReport from "./components/InwardDCReport";
import PartReport from "./components/PartReport";
import CustomerReport from "./components/CustomerReport";
import ProtectedRoutes from "./herlpers/ProtectedRoutes";
import { useEffect } from "react";
import ProtectedLayout from "./layouts/ProtectedLayout";

function App() {
  const isAuth = localStorage.getItem("user") ? true : false;

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/home" element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route exact path="/data-entry" element={<ProtectedLayout><DataEntry /></ProtectedLayout>} />
        <Route
          exact
          path="/invoice-processing"
          element={<ProtectedLayout><InvoiceProcessing /></ProtectedLayout> }
        />
        <Route exact path="/po-form" element={<ProtectedLayout><POForm /></ProtectedLayout>} />
        {/* <Route exact path="/query-tab" element={<QueryForm />} /> */}
        <Route exact path="/cm-form" element={<ProtectedLayout><CustomerMasterForm /></ProtectedLayout>} />
        <Route exact path="/pm-form" element={<ProtectedLayout><PartMaster /></ProtectedLayout>} />
        <Route exact path="/inw-form" element={<ProtectedLayout><Inw_Del_Challan /></ProtectedLayout>} />
        <Route exact path="/reports-printing" element={<ProtectedLayout><ReportsPrinting /></ProtectedLayout>} />
        <Route exact path="/invoice-printing" element={<ProtectedLayout><InvoicePrinting /></ProtectedLayout>} />
        <Route exact path="/dc-printing" element={<ProtectedLayout><DCPrinting /></ProtectedLayout>} />
        <Route exact path="/invoice-reports" element={<ProtectedLayout><InvoiceReports /></ProtectedLayout>} />
        <Route exact path="/invoice-input" element={<ProtectedLayout><InvoiceInput /></ProtectedLayout>} />
        <Route exact path="/dc-input" element={<ProtectedLayout><DcInput /></ProtectedLayout>} />
        <Route
          exact
          path="/rejected-processing"
          element={<ProtectedLayout><RejectedProcessing /></ProtectedLayout>}
        />
        <Route exact path="/po-form-items" element={<ProtectedLayout><POFormItems /></ProtectedLayout>} />
        <Route exact path="/inw-items" element={<ProtectedLayout><Inw_Del_Items /></ProtectedLayout>} />
        <Route exact path="/po-report" element={<ProtectedLayout><PoReport /></ProtectedLayout>} />
        <Route exact path="/inward-dc-report" element={<ProtectedLayout><InwardDCReport /></ProtectedLayout>} />
        <Route exact path="/part-report" element={<ProtectedLayout><PartReport /></ProtectedLayout>} />
        <Route exact path="/customer-report" element={<ProtectedLayout><CustomerReport /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
