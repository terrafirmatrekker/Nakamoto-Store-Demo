import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={headerStyle}>
      <h1>Nakamoto List: The Web3 Marketplace</h1>
      <Link to="/" style={linkStyle}>
        Home
      </Link>{" "}
      |{" "}
      <Link to="/shop" style={linkStyle}>
        Market
      </Link>{" "}
      |{" "}
      <Link to="/bridge" style={linkStyle}>
        Bridge
      </Link>
    </header>
  );
}


const headerStyle = {
  textAlign: "center",
  padding: "10px",
  fontFamily: "Courier New, Courier, monospace",
  width: "700px",
  margin: "auto",
  marginTop: "5%",
  /* overflow: hidden */
  color: "#000000",
};

const linkStyle = {
  color: "#000000",
  textDecoration: "none",
};
// class Navbar extends Component {
//     render() {
//         return (
//             <nav className="nav flex-column justify-content-center navbar-dark fixed-top bg-dark flex-wrap p-0 shadow">
//               <a
//                 className="navbar-brand col-sm-3 col-md-2 mr-0"
//                 href="Nakamoto List"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Nakamoto List: The Web3 Marketplace
//               </a>
//                 <ul className="navbar-nav px-3">
//                     <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
//                         <small className="text-white"><span id="account">Account: {this.props.account}</span></small>
//                     </li>
//                 </ul>
//             </nav>
//         );
//     }
// }

// export default Navbar; 