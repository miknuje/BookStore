import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <nav className="header">
      <ul className="header__menu">
        <li className="header__menu-item">
          <Link to="/" className="header__menu-link">Home</Link>
        </li>
        <li className="header__menu-item">
          <Link to="/about" className="header__menu-link">About</Link>
        </li>
        <li className="header__menu-item">
          <Link to="/book" className="header__menu-link">Books</Link>
        </li>
        <li className="header__menu-item">
          <Link to="/author" className="header__menu-link">Authors</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
