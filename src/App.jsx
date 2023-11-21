import "./app.css";
import FormInput from "./components/FormInput";
import CustomerMasterForm from "./components/CustomerMasterForm";
import POForm from "./components/POForm";
import InvoiceProcessing from "./components/InvoiceProcessing";
import Inw_Del_Challan from "./components/Inw_Del_Challan";
import PartMaster from "./components/PartMaster";
import DataEntry from "./components/DataEntry";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import ReportsPrinting from "./components/ReportsPrinting";
import InvoicePrinting from "./components/InvoicePrinting";
import DCPrinting from "./components/DCPrinting";
import InvoiceReports from './components/InvoiceReports';
import InvoiceInput from "./components/InvoiceInput";
import DcInput from "./components/DcInput";
import RejectedProcessing from "./components/RejectedProcessing";
import POFormItems from "./components/POFormItems";
import Inw_Del_Items from "./components/Inw_Del_Items";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/"  element={<Login/>} />
        <Route exact path="/data-entry"  element={<DataEntry/>} />
        <Route exact path="/invoice-processing" element={<InvoiceProcessing/>} />
        <Route exact path="/po-form" element={<POForm/>} />
        <Route exact path="/cm-form" element={<CustomerMasterForm/>} />
        <Route exact path="/pm-form" element={<PartMaster/>} />
        <Route exact path="/inw-form" element={<Inw_Del_Challan/>} />
        <Route exact path ="/home" element={<Home/>}/>
        <Route exact path ="/register" element={<Register/>} />
        <Route exact path ="/reports-printing" element={<ReportsPrinting/>} />
        <Route exact path ="/invoice-printing" element={<InvoicePrinting/>} />
        <Route exact path ="/dc-printing" element={<DCPrinting/>} />
        <Route exact path ="/invoice-reports" element={<InvoiceReports/>} />
        <Route exact path ="/invoice-input" element={<InvoiceInput/>} />
        <Route exact path ="/dc-input" element={<DcInput/>} />
        <Route exact path ='/rejected-processing' element={<RejectedProcessing/>}/>
        <Route exact path ="/po-form-items" element={<POFormItems/>}/>
        <Route exact path ="/inw-items" element={<Inw_Del_Items/>}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;

