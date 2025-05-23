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
import SidebarItems from './SidebarItems';

export default function Calendario() {
    const navigate = useNavigate();

    const [isLoadingFaltasFerias, setLoadingFaltasFerias] = useState(false)

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [faltas, setFaltas] = useState([])
    const [ferias, setFerias] = useState([])

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
        try {
            if (id_perfil) {
                setLoadingFaltasFerias(true)
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
            }
        }
        catch {

        }
        finally {
            setLoadingFaltasFerias(false)
        }
    }, [id_perfil])

    if (isLoadingFaltasFerias) {
        return (<div>A carregar as faltas e férias</div>)
    }

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
                        <SidebarItems tipo_user={tipo_user}></SidebarItems>
                    </div>


                    <div className="m-4 p-4 rounded" style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className="form-container">
                            <h3>Calendário</h3>
                            {!isLoadingFaltasFerias && <CalendarComponent faltas={faltas} ferias={ferias} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function CalendarComponent({ faltas, ferias }) {
        if (faltas && ferias) {
            moment.locale("pt")
            const localizer = momentLocalizer(moment);
            const events = transformFaltasAndFeriasToEvents(faltas, ferias);
            console.log(events)

            const eventPropGetter = (event) => {
                let backgroundColor = '';
                switch (event.resource.estado) {
                    case "Justificada":
                        backgroundColor = '#28a745';
                        break;
                    case "Por Justificar":
                        backgroundColor = '#ffc107';
                        break;
                    case "Rejeitada":
                        backgroundColor = '#dc3545';
                        break;
                    case "Em análise":
                        backgroundColor = 'orange';
                        break;
                    case "Aprovada":
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
                <div style={{ minHeight: '70vh' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ minHeight: '70vh' }}
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
        }

    };
}

function transformFaltasAndFeriasToEvents(faltas, ferias) {
    const eventos = [];

    const faltasEvents = faltas.map((falta) => ({
        title: falta.motivo ? `Falta: ${falta.motivo}` : "Falta",
        start: new Date(moment(falta.data_falta, "YYYY-MM-DD").toDate()),
        end: new Date(moment(falta.data_falta, "YYYY-MM-DD").toDate()),
        allDay: true,
        resource: falta,
    }));

    const feriasEvents = ferias.map((feria) => ({
        title: 'Férias',
        start: new Date(moment(feria.data_inicio, "YYYY-MM-DD").toDate()),
        end: new Date(moment(feria.data_conclusao).toDate() + 1),
        allDay: true,
        resource: feria,
    }));

    eventos.push(...faltasEvents, ...feriasEvents);

    return eventos;
};



