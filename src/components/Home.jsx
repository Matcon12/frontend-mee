import { Link } from "react-router-dom";
import "./formInput.css";
import "../app.css";
import "./homepage.css";
import Header from "./common/Header";

const Home = () => {

  return (
    <div className="homepage">
      <Header />
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
