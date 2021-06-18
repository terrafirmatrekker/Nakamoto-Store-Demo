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
