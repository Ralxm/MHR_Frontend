import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

  const location = useLocation();
  const path = location.pathname;

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

  return (
    <div className="navbar">
      <div className="navbar-content">
        <a className="logo m-3" onClick={() => (window.location = '/')}>
          <img src="/Logo.png" alt="Logo" />
        </a>

        {isLoggedIn && tipo != 5 ? (
          <div className="navbar-items p-3">
            <div className="nav-item">
              <a
                className={`nav-link ${path.startsWith("/vaga") ? "active" : ""}`}
                href='/vagas'
              >
                Vagas
              </a>
              <div className={`underline ${path.startsWith("/vaga") ? "active" : ""}`} />
            </div>

            <div className="nav-item">
              <a
                className={`nav-link ${path.startsWith("/calendario") ? "active" : ""}`}
                href='/calendario'
              >
                Calendário
              </a>
              <div className={`underline ${path.startsWith("/calendario") ? "active" : ""}`} />
            </div>

            <div className="nav-item">
              <a
                className={`nav-link ${path.startsWith("/projeto") ? "active" : ""}`}
                href='/projetos'
              >
                Projetos
              </a>
              <div className={`underline ${path.startsWith("/projeto") ? "active" : ""}`} />
            </div>

            <div className="nav-item">
              <a
                className={`nav-link ${path.startsWith("/despesas") ? "active" : ""}`}
                href='/despesas'
              >
                Despesas
              </a>
              <div className={`underline ${path.startsWith("/despesas") ? "active" : ""}`} />
            </div>

            <div className="nav-item">
              <a
                className={`nav-link ${path.startsWith("/blog") ? "active" : ""}`}
                href='/blog'
              >
                Blog
              </a>
              <div className={`underline ${path.startsWith("/blog") ? "active" : ""}`} />
            </div>

            {(tipo == 1 || tipo == 2) &&
              <div className="nav-item">
                <a
                  className={`nav-link ${(path.startsWith("/utilizadores") || 
                    path.startsWith("/empresa") ||
                    path.startsWith("/departamentos") ||
                    path.startsWith("/auditlog")
                    )  ? "active" : ""}`}
                  href='/empresa'
                >
                  Empresa
                </a>
                <div className={`underline ${(path.startsWith("/utilizadores") || 
                    path.startsWith("/empresa") ||
                    path.startsWith("/departamentos") ||
                    path.startsWith("/auditlog")
                    ) ? "active" : ""}`} />
              </div>
            }
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
          <MenuItem onClick={() => navigate('/perfil')}>Ver Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
}