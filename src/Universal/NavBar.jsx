import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import '../Components/Login/auth-service'
import authService from '../Components/Login/auth-service';

export default function NavBar() {
  const [nome, setNome] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setNome(JSON.parse(localStorage.getItem('nome')))
    }
  }, []);

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

        {isLoggedIn && (
          <div className="navbar-items p-3">
            <a style={{textDecoration: "none", color: "black"}} href='/vagas'>Vagas</a>
            <a style={{textDecoration: "none", color: "black"}} href='/calendario'>Calendário</a>
            <a style={{textDecoration: "none", color: "black"}} href='/projetos'>Projetos</a>
            <a style={{textDecoration: "none", color: "black"}} href='/despesas'>Despesas</a>
            <a style={{textDecoration: "none", color: "black"}} href='/blog'>Blog</a>
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
        )}
      </div>
    </div>
  );
}