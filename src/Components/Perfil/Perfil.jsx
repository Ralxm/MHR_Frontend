import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Perfil.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Autocomplete, List, ListItem, IconButton, ListItemText } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack, Delete } from '@mui/icons-material'
import authService from '../Login/auth-service';
import handleServices from './handle-services';

export default function Perfil() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [perfil, setPerfil] = useState();

    const [action, setAction] = useState('ver'); //ver, editar

    const [nome, setNome] = useState();
    const [email, setEmail] = useState();
    const [numero_mecanografico, setNumeroMecanografico] = useState();
    const [morada, setMorada] = useState();
    const [telemovel, setTelemovel] = useState();
    const [data_nascimento, setData_Nascimento] = useState();
    const [distrito, setDistrito] = useState();

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        document.title = "Editar Publicação";
    }, []);

    useEffect(() => {
        if (id_user) {
            handleServices.find_perfil(id_user)
                .then(res => {
                    setPerfil(res)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [id_user])

    useEffect(() => {
        if (perfil) {
            setNome(perfil.nome);
            setEmail(perfil.email);
            setNumeroMecanografico(perfil.numero_mecanografico);
            setMorada(perfil.morada);
            setTelemovel(perfil.telemovel);
            setData_Nascimento(perfil.data_nascimento);
            setDistrito(perfil.distrito);
        }
    }, [perfil])

    function convertDateToInputFormat(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function handleEditar(event) {
        event.preventDefault();

        const datapost = {
            id_perfil: perfil.id_perfil,
            id_departamento: perfil.id_departamento,
            nome: nome,
            email: email,
            morada: morada,
            telemovel: telemovel,
            data_nascimento: data_nascimento,
            distrito: distrito
        };

        handleServices.atualizarPerfil(datapost)
        .then(res => {
            alert(res)
            navigate(0)
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div id="root">
            <div className="content" style={{
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
            }}> </div>
            <NavBar />
            <div className="page-container-despesas">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12" style={{ zIndex: 1000 }}>
                            <div className='row'>
                                <div className="items-container p-4 d-flex" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <div className='col-md-2 d-flex flex-column'>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<ArrowBack />}
                                            onClick={() => navigate('/calendario')}
                                            className='col-md-4'
                                        >
                                            Voltar
                                        </Button>
                                    </div>

                                    <div className='col-md-8'>
                                        <div className='card h-100 p-4' style={{ borderRadius: '10px' }}>
                                            <div className='row mb-3'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <h2 className='mb-0' style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                        Dados do utilizador
                                                    </h2>
                                                    <button className='btn btn-primary' onClick={() => setAction(action === 'ver' ? 'editar' : 'ver')}>
                                                        {action === 'ver' ? 'Editar Perfil' : 'Cancelar Edição'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Nome */}
                                            <div className='row p-3'>
                                                {action === 'ver' ? (
                                                    <Typography variant="body1">
                                                        <strong>Nome:</strong> {nome || 'Não disponível'}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        label="Nome completo"
                                                        type="text"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        value={nome || ''}
                                                        onChange={(e) => setNome(e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {/* Email */}
                                            <div className='row p-3'>
                                                {action === 'ver' ? (
                                                    <Typography variant="body1">
                                                        <strong>Email:</strong> {email || 'Não disponível'}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        label="Email"
                                                        type="email"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        value={email || ''}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {/* Morada */}
                                            <div className='row p-3'>
                                                {action === 'ver' ? (
                                                    <Typography variant="body1">
                                                        <strong>Morada:</strong> {morada || 'Não disponível'}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        label="Morada"
                                                        type="text"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        value={morada || ''}
                                                        onChange={(e) => setMorada(e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {/* Telemóvel */}
                                            <div className='row p-3'>
                                                {action === 'ver' ? (
                                                    <Typography variant="body1">
                                                        <strong>Telemóvel:</strong> {telemovel || 'Não disponível'}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        label="Telemóvel"
                                                        type="tel"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        value={telemovel || ''}
                                                        onChange={(e) => setTelemovel(e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {/* Data de Nascimento */}
                                            <div className='row p-3'>
                                                {action === 'ver' ? (
                                                    <Typography variant="body1">
                                                        <strong>Data de Nascimento:</strong> {data_nascimento ? convertDateToInputFormat(data_nascimento) : 'Não disponível'}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        label="Data de Nascimento"
                                                        type="date"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        value={data_nascimento ? convertDateToInputFormat(data_nascimento) : ''}
                                                        onChange={(e) => setData_Nascimento(e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {/* Distrito */}
                                            <div className='row p-3'>
                                                {action === 'ver' ? (
                                                    <Typography variant="body1">
                                                        <strong>Distrito:</strong> {distrito || 'Não disponível'}
                                                    </Typography>
                                                ) : (
                                                    <TextField
                                                        label="Distrito"
                                                        type="text"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        value={distrito || ''}
                                                        onChange={(e) => setDistrito(e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {action === 'editar' && (
                                                <div className='row p-3 d-flex' style={{ flexGrow: 1 }}>
                                                    <button className='btn btn-success' onClick={handleEditar}>
                                                        Guardar Alterações
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='col-md-2'>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
