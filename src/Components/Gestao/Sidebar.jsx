import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import handleServices from '../Blog/handle-services';

export default function SidebarItems() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();

    useEffect(() => {
        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
        }
    }, []);

    const handleNavigation = (path) => (e) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <div className='sidebar-items'>
            <a
                className="sidebar-item"
                onClick={handleNavigation('/empresa')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Empresa
            </a>
            <a
                className="sidebar-item"
                onClick={handleNavigation('/utilizadores')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Utilizadores
            </a>
            <a 
                className="sidebar-item"
                onClick={handleNavigation('/departamentos')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Departamentos
            </a>
            <a
                className="sidebar-item"
                onClick={handleNavigation('/auditlog')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Registos
            </a>
        </div>
    )
}