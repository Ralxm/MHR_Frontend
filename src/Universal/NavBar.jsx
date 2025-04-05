import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import '../Components/Login/auth-service'
import authService from '../Components/Login/auth-service';

export default function NavBar() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [link, setLink] = useState(window.location.pathname)
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setNome(JSON.parse(localStorage.getItem('nome')))
      setTipo(JSON.parse(localStorage.getItem('tipo')))
    }
  }, []);

  useEffect(() => {
    setLink(link.split('/').pop())
  }, [link]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    authService.logout();
    navigate('/login')
  };

  console.log(link)
  return (
    <div className="navbar">
      <div className="navbar-content">
        <a className="logo m-3" onClick={() => (window.location = '/')}>
          <img src="/Logo.png" alt="Logo" />
        </a>

        {isLoggedIn && tipo != 5 ? (
          <div className="navbar-items p-3">
            {/* Vagas Link */}
            <div className="nav-item">
              <a
                className={`nav-link ${link.includes("vagas") ? "active" : ""}`}
                href='/vagas'
              >
                Vagas
              </a>
              <div className={`underline ${link.includes("vagas") ? "active" : ""}`} />
            </div>

            {/* Calendário Link */}
            <div className="nav-item">
              <a
                className={`nav-link ${link === "calendario" ? "active" : ""}`}
                href='/calendario'
              >
                Calendário
              </a>
              <div className={`underline ${link === "calendario" ? "active" : ""}`} />
            </div>

            {/* Projetos Link */}
            <div className="nav-item">
              <a
                className={`nav-link ${link === "projetos" ? "active" : ""}`}
                href='/projetos'
              >
                Projetos
              </a>
              <div className={`underline ${link === "projetos" ? "active" : ""}`} />
            </div>

            {/* Despesas Link */}
            <div className="nav-item">
              <a
                className={`nav-link ${link === "despesas" ? "active" : ""}`}
                href='/despesas'
              >
                Despesas
              </a>
              <div className={`underline ${link === "despesas" ? "active" : ""}`} />
            </div>

            {/* Blog Link */}
            <div className="nav-item">
              <a
                className={`nav-link ${link === "blog" ? "active" : ""}`}
                href='/blog'
              >
                Blog
              </a>
              <div className={`underline ${link === "blog" ? "active" : ""}`} />
            </div>
          </div>
        ) : (
          <div className="navbar-items p-3">
            <a style={{ textDecoration: "none", color: "black" }} href='/vagas'>Vagas</a>
          </div>
        )}
        <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Icon icon="material-symbols:account-circle" sx={{ fontSize: 24 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>{nome}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
      </div>
    </div>
  );
}