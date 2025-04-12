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

    const [status, setStatus] = useState({
        isCalendarioOpen: true,
        isMarcarFaltasOpen: false,
        isMarcarFeriasOpen: false,
        isVerFaltasPessoaisOpen: false,
        isVerFaltasUtilizadoresOpen: false,
        isVerPedidosFeriasOpen: false,
        isVerFeriasAprovadasOpen: false
    })

    {/* Variáveis para criar uma falta */ }
    const [perfil, setPerfilFalta] = useState()
    const [calendario, setCalendario] = useState()
    const [tipo_falta, setTipo_Falta] = useState()
    const [data_falta, setData_Falta] = useState()
    const [comentario, setComentario] = useState('')

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
            handleServices.getCalendario(id_perfil)
                .then(res => {
                    setCalendario(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
                })

        }
    }, [id_perfil])

    const handleStatusChange = (key) => {
        setStatus(prevStatus => {
            const newStatus = Object.fromEntries(
                Object.keys(prevStatus).map(k => [k, false])
            );
            newStatus[key] = true;
            return newStatus;
        });
    };

    function carregarPerfis() {
        setLoadingPerfis(true)
        handleServices.listPerfis()
            .then(res => {
                setPerfis(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
            })
            .finally(() => {
                setLoadingPerfis(false)
            })
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
                        <div className='sidebar-items'>
                            <a className="sidebar-item" onClick={() => handleStatusChange('isCalendarioOpen')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Calendário</a>
                            <a className="sidebar-item" onClick={() => { handleStatusChange('isMarcarFaltasOpen'); carregarPerfis() }} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Marcar faltas</a>
                            <a className="sidebar-item" onClick={() => handleStatusChange('isMarcarFeriasOpen')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Marcar faltas</a>
                            <a className="sidebar-item" onClick={() => handleStatusChange('isVerFaltasPessoaisOpen')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver faltas pessoais</a>
                            <a className="sidebar-item" onClick={() => handleStatusChange('isVerFaltasUtilizadoresOpen')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver faltas de utilizadores</a>
                            <a className="sidebar-item" onClick={() => handleStatusChange('isVerPedidosFeriasOpen')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver pedidos de férias</a>
                            <a className="sidebar-item" onClick={() => handleStatusChange('isVerFeriasAprovadasOpen')} style={{ display: 'block', padding: '10px', margin: '5px 0', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Ver férias aprovadas</a>
                        </div>
                    </div>


                    {status.isCalendarioOpen && <CalendarioPagina></CalendarioPagina>}
                    {status.isMarcarFaltasOpen && <MarcarFaltas isLoadingPerfis={isLoadingPerfis} perfis={perfis} tipos_falta={tipos_falta} calendario={calendario}></MarcarFaltas>}


                    <div>

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

    function CalendarioPagina() {
        return (
            <div className="col-md-10" style={{ minHeight: '85vh ' }}>
                <div className="form-container">
                    <h3>Calendário</h3>
                    <CalendarComponent />
                </div>
            </div>
        )
    }
}

function MarcarFaltas({ isLoadingPerfis, perfis, tipos_falta }) {
    const [perfil, setPerfilFalta] = useState();
    const [tipo_falta, setTipo_Falta] = useState();
    const [data_falta, setData_Falta] = useState();
    const [comentario, setComentario] = useState('');
    const [calendario, setCalendario] = useState()

    return (
        <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
            <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Marcar faltas</h2>

            <div className='row mb-4 justify-content-between'>
                <div className='col-md-5 mb-3 mb-md-0'>
                    <FormControl fullWidth>
                        <InputLabel id="user-select-label">Utilizador</InputLabel>
                        <Select
                            labelId="user-select-label"
                            label="Utilizador"
                            value={perfil}
                            onChange={(value) => {setPerfilFalta(value.target.value); carregarCalendario(value.target.value)}}
                            variant="outlined"
                        >
                            {perfis.filter(perfil => perfil.nome).map((perfil) => (
                                <MenuItem key={perfil.id_perfil} value={perfil.id_perfil}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{perfil.nome}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{perfil.email}</div>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className='col-md-5'>
                    <FormControl fullWidth>
                        <InputLabel id="absence-type-label">Tipo de falta</InputLabel>
                        <Select
                            labelId="absence-type-label"
                            label="Tipo de falta"
                            value={tipo_falta}
                            onChange={(value) => setTipo_Falta(value.target.value)}
                            variant="outlined"
                        >
                            {tipos_falta.map((tipo) => (
                                <MenuItem key={tipo.id_tipofalta} value={tipo.id_tipofalta}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{tipo.tipo}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{tipo.descricao}</div>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className='row mb-4'>
                <div className='col-md-5'>
                    <TextField
                        label="Data"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={data_falta}
                        onChange={(value) => setData_Falta(value.target.value)}
                    />
                </div>
            </div>

            <div className='row'>
                <div className='col-md-12'>
                    <TextField
                        key="comments-field"
                        label="Comentários"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={comentario ?? ''}
                        onChange={(e) => { setComentario(e.target.value); }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ maxLength: 1000 }}
                        helperText={`${comentario?.length || 0}/1000 caracteres`}
                    />
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-md-3'>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={(perfil, id_tipofalta, data_falta, comentarios, calendario) => handleCriarFalta(perfil, id_tipofalta, data_falta, comentarios, calendario)}
                    >
                        Submeter
                    </Button>
                </div>
            </div>
        </div>
    );

    function carregarCalendario(perfil) {
        handleServices.getCalendario(perfil.id_perfil)
            .then(res => {
                setCalendario(res)
            })
            .catch(err => {
                console.log(err)
            })
    }
}

function handleCriarFalta(perfil, id_tipofalta, data_falta, comentarios, calendario) {
    const datapost = {
        perfil: perfil.id_perfil,
        id_tipofalta: id_tipofalta,
        data_falta: data_falta,
        comentarios: comentarios,
        calendario: calendario,
    }

    console.log(datapost)

    /*handleServices.createFalta(datapost)
        .then(res => {
            alert(res)
        })
        .catch(err => {
            console.log(err)
        })*/
}



