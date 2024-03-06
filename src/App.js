import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';
import Footer from './components/footer';
import Recherche from './pages/recherche';
import Home from './pages/home';
import OeuvresPage from './pages/oeuvresPage';
import RechercheAvancée from './pages/rechercheAvancée';
import NotFound from './pages/pageNotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
      <div>
        <Router>
          <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recherche" element={<Recherche/>} />
              <Route path="/oeuvres" element={<OeuvresPage />} />
              <Route path="/rechercheAvancée" element={<RechercheAvancée />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
  );
}

export default App;
