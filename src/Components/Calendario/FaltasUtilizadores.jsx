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
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SidebarItems from './SidebarItems';

export default function FaltasUtilizadores() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [faltas, setFaltas] = useState([])

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

        carregarFaltas();
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

    function carregarFaltas() {
        handleServices.listFaltas()
            .then(res => {
                setFaltas(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
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
                        <SidebarItems></SidebarItems>
                    </div>


                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Ver faltas de utilizadores</h2>
                        <div className='row'>
                            <ListFaltas></ListFaltas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function ListFaltas() {
        return faltas.map((falta) => {
            return (
                <div className='col-md-3 mb-3'>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
                            },
                            backgroundColor: "white"
                        }}
                    >
                        <CardContent sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <Typography
                                variant="h6"
                                component="h3"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    minHeight: '64px'
                                }}
                            >
                                {falta.id_falta} - {falta.id_perfil}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {falta.comentarios}
                            </Typography>

                            <Box sx={{ mt: 'auto' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        endIcon={<ArrowForward />}
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    >
                                        Ver detalhes
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </div>
            )
        })
    }
}
