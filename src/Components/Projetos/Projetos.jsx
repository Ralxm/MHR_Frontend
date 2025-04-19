import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Projetos.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import FileDropZone from '../../Universal/FileDropZoneSingle';
import TabelaProjetos from './TabelaProjetos';

let projetos = [{
    id_projeto: 1,
    titulo_projeto: 'titulo 1',
    estado: "Em Desenvolvimento",
    data_atribuicao: '12-03-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '01-03-2025',
    data_final_prevista: '29-03-2025'
},
{
    id_projeto: 2,
    titulo_projeto: 'titulo 2',
    estado: "Concluído",
    data_atribuicao: '12-02-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '03-03-2025',
    data_final_prevista: '25-03-2025'
},
{
    id_projeto: 3,
    titulo_projeto: 'titulo 2',
    estado: "Concluído",
    data_atribuicao: '12-02-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '03-03-2025',
    data_final_prevista: '25-03-2025'
},
{
    titulo_projeto: 'titulo 2',
    estado: "Concluído",
    data_atribuicao: '12-02-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '03-03-2025',
    data_final_prevista: '25-03-2025'
}]

export default function Projetos() {
    const navigate = useNavigate();

    //const [projetos, setProjetos] = useState([]);
    const [tab, setTab] = useState('1')

    useEffect(() => {
        document.title = "Projetos e ideias"

        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo == 5) {
            navigate('/vagas')
        }
    }, [])

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
            <div></div>
            <NavBar />
            <div className="page-container-projetos">
                <div className="container-fluid">
                    <div className="row" >
                        {/* Coluna da esquerda */}
                        <div className="col-md-3" style={{ zIndex: 1000 }}>
                            <div className='row items-container'>
                                {tab == 1 ?
                                    <span><strong>Projetos</strong></span>
                                    :
                                    <span><strong>Ideias</strong></span>
                                }
                            </div>
                        </div>


                        {/* Coluna da direita */}
                        <div className="col-md-9" style={{ zIndex: 1000 }}>
                            <div className="items-container" style={{ minHeight: '85vh' }}>
                                <div className='row mb-3'>
                                    <Box sx={{ width: 1, typography: 'body1' }}>
                                        <TabContext value={tab}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" style={{ flexGrow: 1 }}>
                                                        <Tab label="Projetos" value="1" sx={{ textTransform: 'none' }} />
                                                        <Tab label="Ideias" value="2" sx={{ textTransform: 'none' }} />
                                                    </TabList>

                                                    {tab == 2 &&
                                                        <button className='btn btn-outline-secondary mb-2'>
                                                            Sugerir ideia
                                                        </button>
                                                    }
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>
                                                        <TabelaProjetos projetos={projetos}></TabelaProjetos>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="2">
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

function ListProjetos() {
    const getShadowClass = (estado) => {
        switch (estado) {
            case "Justificada":
                return "shadow-justificada";
            case "Por Justificar":
                return "shadow-por-justificar";
            case "Injustificada":
                return "shadow-injustificada";
            case "Em Análise":
                return "shadow-em-analise";
            default:
                return "";
        }
    };

    return projetos.map((projeto) => (
        <div className={`border rounded p-3 mb-3 ${getShadowClass(projeto.estado)}`} style={{ cursor: "pointer" }} onClick={() => window.location.href = '/projeto/' + projeto.id_projeto}>
            <div className='row mb-2'>
                <div className='col-md-6'>
                    <strong>Título: </strong> {projeto.titulo_projeto}
                </div>
                <div className='col-md-6'>
                    <strong>Estado: </strong> {projeto.estado}
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <strong>Tipo: </strong> {projeto.descricao}
                </div>
            </div>
        </div>
    ));
}