import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Gestao.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, Chip } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Delete, Close } from '@mui/icons-material'
import FileDropZone from '../../Universal/FileDropZoneSingle';
import SidebarItems from './Sidebar';

export default function Gestao() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('1')

    const [selectedPostAprovar, setSelectedPostAprovar] = useState()
    const [selectedPostRejeitar, setSelectedPostRejeitar] = useState();
    const [selectedPostApagar, setSelectedPostApagar] = useState();

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Blog"

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
            setTipoUser(tipo)
        }
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


    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };


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
                <div className="container-fluid">
                    <div className="row d-flex justify-content-betwee">
                        {(tipo_user == 1 || tipo_user == 2) &&
                            <div className='col-md-2'>
                                <div className="sidebar" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                                    <SidebarItems></SidebarItems>
                                </div>

                            </div>
                        }
                        <div className="col-md-12" style={{ zIndex: 1000 }}>
                            <div className="items-container" style={{ minHeight: '85vh' }}>
                                <div className='row mb-3'>
                                    <Box sx={{ width: 1, typography: 'body1' }}>
                                        <TabContext value={tab}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" style={{ flexGrow: 1 }}>
                                                        <Tab label="Utilizadores" value="1" sx={{ textTransform: 'none' }} />
                                                        <Tab label="Departamentos" value="2" sx={{ textTransform: 'none' }} />
                                                    </TabList>
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>

                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>

                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </TabContext>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}