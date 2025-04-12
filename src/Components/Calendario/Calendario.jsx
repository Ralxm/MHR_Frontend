import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Calendario() {
    const navigate = useNavigate();

    const [isLoadingPerfis, setLoadingPerfis] = useState(false)

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [perfis, setPerfis] = useState([])
    const [faltas, setFaltas] = useState([])
    const [ferias, setFerias] = useState([])

    const [tipos_falta, setTipos_Falta] = useState([])


    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo == 5) {
            navigate('/vagas')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        document.title = "Calendário";
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
            handleServices.listFerias(id_perfil)
                .then(res => {
                    setFerias(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as férias do utilizador: " + err)
                })
            handleServices.listFaltas(id_perfil)
                .then(res => {
                    setFaltas(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
                })
            handleServices.listTipoFaltas()
                .then(res => {
                    setTipos_Falta(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
                })
        }
    }, [id_perfil])

    return (
        <div id="root">
            <div
                className="content"
                style={{
                    background: `url('${process.env.PUBLIC_URL}/Logosvg.svg')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden",
                    opacity: 0.4
                }}
            />
            <div className="app-container" style={{ position: 'relative', zIndex: 1000 }}>
                <NavBar />
                <div style={{ display: 'flex', height: 'calc(100vh - [navbar-height])' }}>
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto' }}>
                        <div className='sidebar-items'>
                            <a className="sidebar-item" onClick={() => navigate('/calendario')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Calendário</a>
                            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Marcar faltas</a>
                            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Marcar faltas</a>
                            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver faltas pessoais</a>
                            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver faltas de utilizadores</a>
                            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver pedidos de férias</a>
                            <a className="sidebar-item" onClick={() => navigate('/calendario/marcar_falta')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver férias aprovadas</a>
                        </div>
                    </div>


                    <div className="col-md-10" style={{ minHeight: '85vh ' }}>
                        <div className="form-container">
                            <h3>Calendário</h3>
                            <CalendarComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function transformFaltasAndFeriasToEvents(faltas, ferias) {
        const eventos = [];

        const faltasEvents = faltas.map((falta) => ({
            title: `Falta: ${falta.motivo}`,
            start: new Date(moment(falta.data_falta, "DD-MM-YYYY").toDate()),
            end: new Date(moment(falta.data_falta, "DD-MM-YYYY").toDate()),
            allDay: true,
            resource: falta,
        }));

        const feriasEvents = ferias.map((feria) => ({
            title: 'Férias',
            start: new Date(moment(feria.data_inicio, "DD-MM-YYYY").toDate()),
            end: new Date(moment(feria.data_fim, "DD-MM-YYYY").toDate() + 1),
            allDay: true,
            resource: feria,
        }));

        eventos.push(...faltasEvents, ...feriasEvents);

        return eventos;
    };

    function CalendarComponent() {
        moment.locale("pt")
        const localizer = momentLocalizer(moment);
        const events = transformFaltasAndFeriasToEvents(faltas, ferias);

        const eventPropGetter = (event) => {
            let backgroundColor = '';
            switch (event.resource.estado) {
                case "Justificada":
                    backgroundColor = '#28a745';
                    break;
                case "Por Justificar":
                    backgroundColor = '#ffc107';
                    break;
                case "Injustificada":
                    backgroundColor = '#dc3545';
                    break;
                case "Em Análise":
                    backgroundColor = 'orange';
                    break;
                case "Aprovadas":
                    backgroundColor = '#28a745';
                    break;
                default:
                    backgroundColor = '#6c757d';
            }

            return {
                style: {
                    backgroundColor,
                    color: '#fff',
                    borderRadius: '4px',
                    border: 'none',
                },
            };
        };

        return (
            <div style={{ height: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    eventPropGetter={eventPropGetter}
                    messages={{
                        today: 'Hoje',
                        previous: 'Anterior',
                        next: 'Próximo',
                        month: 'Mês',
                        week: 'Semana',
                        day: 'Dia',
                        agenda: 'Agenda',
                        date: 'Data',
                        time: 'Hora',
                        event: 'Evento',
                    }}
                />
            </div>
        );
    };
}



