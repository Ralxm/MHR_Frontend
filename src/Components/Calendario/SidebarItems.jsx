import { useNavigate } from "react-router-dom";
import React from "react";

export default function SidebarItems() {
    const navigate = useNavigate();

    const handleNavigation = (path) => (e) => {
        e.preventDefault();
        navigate(path);
    };

    return (
        <div className='sidebar-items'>
            <a href="/calendario"
                className="sidebar-item"
                onClick={handleNavigation('/calendario')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Calendário
            </a>
            <a href="/calendario/marcar_falta"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/marcar_falta')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Marcar faltas
            </a>
            <a href="/calendario/marcar_falta"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/marcar_ferias')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Marcar férias
            </a>
            <a href="/calendario/faltas_pessoais"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/faltas_pessoais')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Ver faltas pessoais
            </a>
            <a href="/calendario/faltas_utilizadores"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/faltas_utilizadores')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Ver faltas de utilizadores
            </a>
            <a href="/calendario/pedidos_ferias"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/pedidos_ferias')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Ver pedidos de férias
            </a>
            <a href="/calendario/ferias_aprovadas"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/ferias_aprovadas')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Ver férias aprovadas
            </a>
        </div>
    )
}