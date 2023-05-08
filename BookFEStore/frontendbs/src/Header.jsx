import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <nav className="header">
      <ul className="header__menu">
        <li className={`header__menu-item ${location.pathname === "/" ? "active" : ""}`}>
          <Link to="/" className="header__menu-link">Home</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/about" ? "active" : ""}`}>
          <Link to="/about" className="header__menu-link">About</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/book" ? "active" : ""}`}>
          <Link to="/book" className="header__menu-link">Books</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/author" ? "active" : ""}`}>
          <Link to="/author" className="header__menu-link">Authors</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/getISBN" ? "active" : ""}`}>
          <Link to="/getISBN" className="header__menu-link">Search book</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/getbyId" ? "active" : ""}`}>
          <Link to="/getbyId" className="header__menu-link">Search author</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/putauthor" ? "active" : ""}`}>
          <Link to="/putauthor" className="header__menu-link">Update author</Link>
        </li>
        <li className={`header__menu-item ${location.pathname === "/putbook" ? "active" : ""}`}>
          <Link to="/putbook" className="header__menu-link">Update book</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
