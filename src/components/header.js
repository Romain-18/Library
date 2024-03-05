import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './header.css';

function Header({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [term, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/recherche?term=${term}`);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`${darkMode ? "dark-mode" : ""} ${menuOpen ? "menu-ouvert" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          <h1>Library</h1>
        </div>
        <div className="header-right">
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Search" value={term} onChange={handleInputChange} />
            <button type="submit">Search</button>
          </form>
        </div>
        <nav>
          <button id="menu-bouton" className="menu-bouton" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <ul>
            <li><Link to="/" className='bouton'>Home</Link></li>
            <li><Link to="/RechercheAvancée" className='bouton'>Advanced search</Link></li>
            <li>
              <div className="switch-container bouton">
                <input className="switch__input" type="checkbox" role="switch" name="dark" checked={darkMode} onChange={handleDarkModeToggle}/>
                <label className={`switch ${darkMode ? 'dark-mode' : ''}`} onClick={handleDarkModeToggle}>
                  <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                    <use href="#light" />
                  </svg>
                  <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                    <use href="#dark" />
                  </svg>
                  <span className="switch__inner"></span>
                  <span className="switch__inner-icons">
                    <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                      <use href="#light" />
                    </svg>
                    <svg className="switch__icon" width="24px" height="24px" aria-hidden="true">
                      <use href="#dark" />
                    </svg>
                  </span>
                </label>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
