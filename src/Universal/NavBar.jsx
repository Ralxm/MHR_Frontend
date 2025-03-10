import React, { useEffect, useState } from 'react';
import './NavBar.css';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Fazer como no PINT e guardar no localstorage o item user.
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) { //Tirar o || 1 quando o login estiver a funcionar
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-content">
        <a className="logo" onClick={() => (window.location = '/')}>
          <img src="/Logo.png" alt="Logo" />
        </a>

        {isLoggedIn && (
          <div className="navbar-items">
            <span>Vagas</span>
            <span>Calendário</span>
            <span>Projetos</span>
            <span>Despesas</span>
            <span>Blog</span>
          </div>
        )}
      </div>
    </div>
  );
}