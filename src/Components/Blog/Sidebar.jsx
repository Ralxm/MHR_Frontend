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
            <a href="/calendario"
                className="sidebar-item"
                onClick={handleNavigation('/blog/todas')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Todos as publicações
            </a>
            <a href="/calendario/marcar_ferias"
                className="sidebar-item"
                onClick={handleNavigation('/blog/por_utilizador')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Publicações criadas por um utilizador
            </a>
            <a href="/calendario/marcar_ferias"
                className="sidebar-item"
                onClick={handleNavigation('/blog/por_aprovar')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Publicações por aprovar
            </a>
        </div>
    )
}