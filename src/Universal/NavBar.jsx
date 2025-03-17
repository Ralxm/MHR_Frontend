import React, { useEffect, useState } from 'react';
import './NavBar.css';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Fazer como no PINT e guardar no localstorage o item user.
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user || 1) { //Tirar o || 1 quando o login estiver a funcionar
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
            <a style={{textDecoration: "none", color: "black"}} href='/vagas'>Vagas</a>
            <a style={{textDecoration: "none", color: "black"}} href='/calendario'>Calendário</a>
            <a style={{textDecoration: "none", color: "black"}} href='/projetos'>Projetos</a>
            <a style={{textDecoration: "none", color: "black"}} href='/despesas'>Despesas</a>
            <a style={{textDecoration: "none", color: "black"}} href='/blog'>Blog</a>
          </div>
        )}
      </div>
    </div>
  );
}