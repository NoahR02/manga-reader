import React from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav id="nav">
      <h2 id="navHeading"><Link to="/">Manga Reader</Link></h2>
      <div id="navLinks">
        <Link to="/">Home</Link>
        <Link to="/mymanga">My Manga</Link>
      </div>
    </nav>
  )
}
export default Navbar;