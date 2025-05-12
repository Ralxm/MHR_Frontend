import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Gestao.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, Chip } from '@mui/material';
import SidebarItems from './Sidebar';
import { useSnackbar } from 'notistack';

export default function Empresa() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [empresa, setEmpresa] = useState(null);

    const [action, setAction] = useState('ver')

    const [nome_empresa, setNome_Empresa] = useState('');
    const [contacto_empresa, setContacto_Empresa] = useState('');
    const [email_empresa, setEmail_Empresa] = useState('');

    useEffect(() => {
        document.title = "Informações da empresa"

        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo != 1 && tipo != 2) {
            navigate('/calendario')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        carregarEmpresa();
    }, [])

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
        setValues()
    }, [empresa])

    function setValues() {
        if (empresa) {
            setNome_Empresa(empresa.nome_empresa?.trim() || '');
            setEmail_Empresa(empresa.email_empresa?.trim() || '');
            setContacto_Empresa(
                typeof empresa.contacto_empresa === 'string' ?
                    empresa.contacto_empresa.trim() :
                    String(empresa.contacto_empresa || '')
            );
        }
    }

    function carregarEmpresa() {
        handleServices.carregarEmpresa()
            .then(res => {
                setEmpresa(res[0]);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    async function handleEditar(event) {
        event.preventDefault();

        const datapost = {
            nome_empresa: nome_empresa,
            contacto_empresa: contacto_empresa,
            email_empresa: email_empresa
        };

        handleServices.atualizarEmpresa(datapost)
            .then(res => {
                enqueueSnackbar(res, { variant: 'success' });
                carregarEmpresa();
                setAction('ver')
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
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
            <div className="app-container" style={{ position: 'relative', zIndex: 1000 }}>
                <NavBar />
                <div style={{ display: 'flex', height: 'calc(100vh - [navbar-height])' }}>
                    {(tipo_user == 1 || tipo_user == 2) &&
                        <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                            <SidebarItems tipo_user={tipo_user}></SidebarItems>
                        </div>
                    }
                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between'>
                            <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Informações da empresa</h2>
                            <button className='btn btn-primary' onClick={() => { setAction(action === 'ver' ? 'editar' : 'ver'); if (action == "editar") { setValues() } }}>
                                {action === 'ver' ? 'Editar Perfil' : 'Cancelar Edição'}
                            </button>
                        </div>

                        <div className='row py-2'>
                            {action === 'ver' ? (
                                <Typography variant="body1">
                                    <strong>Nome:</strong> {nome_empresa || 'Não disponível'}
                                </Typography>
                            ) : (
                                <TextField
                                    label="Nome"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={nome_empresa || ''}
                                    onChange={(e) => setNome_Empresa(e.target.value)}
                                />
                            )}
                        </div>

                        <div className='row py-2'>
                            {action === 'ver' ? (
                                <Typography variant="body1">
                                    <strong>Contacto:</strong> {contacto_empresa || 'Não disponível'}
                                </Typography>
                            ) : (
                                <TextField
                                    label="Contacto"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={contacto_empresa || ''}
                                    onChange={(e) => setContacto_Empresa(e.target.value)}
                                />
                            )}
                        </div>

                        <div className='row py-2'>
                            {action === 'ver' ? (
                                <Typography variant="body1">
                                    <strong>Email:</strong> {email_empresa || 'Não disponível'}
                                </Typography>
                            ) : (
                                <TextField
                                    label="Email"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={email_empresa || ''}
                                    onChange={(e) => setEmail_Empresa(e.target.value)}
                                />
                            )}
                        </div>

                        {action === 'editar' && (
                            <div className='row py-3 d-flex' style={{ flexGrow: 1 }}>
                                <button className='btn btn-success' onClick={handleEditar}>
                                    Guardar Alterações
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}