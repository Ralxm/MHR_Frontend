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

export default function MarcarFerias() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [ferias, setFerias] = useState([])
    const [calendario, setCalendario] = useState()
    const [dias_restantes_ferias, setDias_Restantes_Ferias] = useState();

    {/* Variáveis para criar uma falta */ }
    const [data_inicio, setData_Inicio] = useState();
    const [data_conclusao, setData_Conclusao] = useState();
    const [duracao, setDuracao] = useState(0);

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
            handleServices.getCalendario(id_perfil)
                .then(res => {
                    setCalendario(res[0]);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
                })
            handleServices.getFeriasUser(id_perfil)
                .then(res => {
                    console.log(res)
                    setFerias(res)
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
                })

        }
    }, [id_perfil])

    useEffect(() => {
        if (data_conclusao && data_inicio) {
            const startDate = new Date(data_inicio);
            const endDate = new Date(data_conclusao);
            
            const calculateBusinessDays = (start, end) => {
                let count = 0;
                const current = new Date(start);
                
                while (current <= end) {
                    const dayOfWeek = current.getDay();
                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        count++;
                    }
                    current.setDate(current.getDate() + 1);
                }
                return count;
            };
            
            const businessDays = calculateBusinessDays(startDate, endDate);
            setDuracao(businessDays);
        }
    }, data_conclusao, data_inicio)

    useEffect(() => {
        if (calendario && ferias) {
            const anoAtual = new Date().getFullYear();
            let totalDuracao = 0;
    
            ferias.map((feria) => {
                if (feria.estado === "Aprovada") {
                    const ano = new Date(feria.data_inicio).getFullYear();
                    
                    if (ano === anoAtual) {
                        totalDuracao += feria.duracao;
                    }
                }
            });
    
            setDias_Restantes_Ferias(calendario.dias_ferias_ano_atual - totalDuracao)
        }
    }, [ferias]);


    function handleCriarFerias(event) {
        event.preventDefault();

        const datapost = {
            id_perfil: id_perfil,
            id_calendario: calendario.id_calendario,
            data_inicio: data_inicio,
            data_conclusao: data_conclusao,
            duracao: duracao,
        }

        if(duracao <= dias_restantes_ferias){
            handleServices.createFerias(datapost)
            .then(res => {
                alert(res)
            })
            .catch(err => {
                console.log(err)
            })
        }
        else{
            alert("Não tem dias de férias suficientes")
        }
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


                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Marcar férias</h2>
                            <div className='mb-3' style={{ backgroundColor: '#e9f7fe', padding: '10px' }}>
                                <h3><strong>Dias de férias restantes: {dias_restantes_ferias}</strong></h3>
                            </div>

                        </div>

                        <div className='row mb-4 d-flex align-items-center justify-content-between'>
                            <div className='col-md-5'>
                                <TextField
                                    label="Data de ínicio"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(value) => setData_Inicio(value.target.value)}
                                />
                            </div>
                            <div className='col-md-5'>
                                <TextField
                                    label="Data de fim"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(value) => setData_Conclusao(value.target.value)}
                                />
                            </div>
                        </div>

                        <div className='row'>
                            <h3><strong>Total de dias que as férias vão ocupar: {duracao} </strong></h3>
                        </div>

                        <div className='row mt-4'>
                            <div className='col-md-3'>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleCriarFerias}
                                >
                                    Submeter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
