import { useNavigate } from "react-router-dom"

export default function SidebarItems() {
    const navigate = useNavigate();
    return (
        <div className='sidebar-items'>
            <a className="sidebar-item" onClick={() => navigate('/calendario')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Calendário</a>
            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Marcar faltas</a>
            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Marcar faltas</a>
            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver faltas pessoais</a>
            <a className="sidebar-item" onClick={() => navigate('/calendario/faltas_utilizadores')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver faltas de utilizadores</a>
            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver pedidos de férias</a>
            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver férias aprovadas</a>
        </div>
    )
}