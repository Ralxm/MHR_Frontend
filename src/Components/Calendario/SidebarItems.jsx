import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import handleServices from './handle-services';

export default function SidebarItems({ tipo_user }) {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [id_perfil, setPerfil] = useState()
    const [faltas, setFaltas] = useState([])

    const [faltas_por_justificar, setFaltas_Por_Justificar] = useState(0)

    useEffect(() => {
        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
        }
    }, []);

    useEffect(() => {
        if (id_user) {
            handleServices.find_perfil(id_user)
                .then(res => {
                    setPerfil(res.id_perfil);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
                })
        }
    }, [id_user])

    useEffect(() => {
        if (id_perfil) {
            handleServices.carregarFaltasPessoais(id_perfil)
                .then(res => {
                    setFaltas(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas: " + err)
                })
        }
    }, [id_perfil])

    useEffect(() => {
        faltas.map((falta) => {
            if (falta.estado == "Em análise" || falta.estado == "Pendente") {
                setFaltas_Por_Justificar(faltas => faltas + 1);
            }
        })
    }, [faltas])

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
            <a href="/calendario/marcar_ferias"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/marcar_ferias')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Marcar férias
            </a>
            <a href="/calendario/faltas_pessoais"
                className="sidebar-item d-flex justify-content-between align-items-center"
                onClick={handleNavigation('/calendario/faltas_pessoais')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                <span>Ver faltas</span>
                <span>
                    {faltas_por_justificar > 0 && (
                        <span className="notification-badge">
                            {faltas_por_justificar}
                        </span>
                    )}
                </span>
            </a>
            <a href="/calendario/ferias_pessoais"
                className="sidebar-item"
                onClick={handleNavigation('/calendario/ferias_pessoais')}
                style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                Ver férias 
            </a>


            {(tipo_user == 1 || tipo_user == 2) &&
                <>
                    <div className="mt-4">
                        <span><strong>Gestão</strong></span>
                    </div>

                    <a href="/calendario/mapa_ferias"
                        className="sidebar-item"
                        onClick={handleNavigation('/calendario/mapa_ferias')}
                        style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                        Mapa de férias
                    </a>  

                    <a href="/calendario/marcar_falta"
                        className="sidebar-item"
                        onClick={handleNavigation('/calendario/marcar_falta')}
                        style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                        Marcar faltas
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

                    <div className="mt-4">
                        <span><strong>Definições</strong></span>
                    </div>

                    <a href="/calendario/pedidos_ferias"
                        className="sidebar-item"
                        onClick={handleNavigation('/calendario/tipos_faltas')}
                        style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                        Tipos de faltas
                    </a>   

                    <a href="/calendario/pedidos_ferias"
                        className="sidebar-item"
                        onClick={handleNavigation('/calendario/feriados')}
                        style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>
                        Definir feriados
                    </a>   
                </>
            }
        </div>
    )
}