import React, { useEffect, useState, useMemo } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Gestao.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TableCell, Table, TableContainer, TableHead, TableRow, TableBody, MenuItem, IconButton, Chip, TextField, Stack, FormControl, Label, Select, InputLabel } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Delete, Close } from '@mui/icons-material'
import FileDropZone from '../../Universal/FileDropZoneSingle';
import SidebarItems from './Sidebar';

export default function AuditLog() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [filtro, setFiltro] = useState('Todos')
    const [filtroAtividade, setFiltroAtividade] = useState('Todos')

    const [AuditLog, setAuditLog] = useState([]);

    useEffect(() => {
        document.title = "Departamentos";

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
        carregarAuditLog();
    }, []);

    function formatDateTime(isoString) {
        return isoString.replace('T', ' ').split('.')[0];
    }

    const filteredLogs = useMemo(() => {
        if (!AuditLog.length) return [];

        if (filtro === 'Todos' && filtroAtividade === 'Todos') {
            return AuditLog;
        }

        const lowerFiltro = filtro.toLowerCase();
        const lowerActivity = filtroAtividade.toLowerCase();

        if (filtroAtividade !== 'Todos') {
            return AuditLog.filter(log =>
                log.tipo_atividade.toLowerCase() === lowerActivity
            );
        }

        return AuditLog.filter(log => {
            const lowerTipo = log.tipo_atividade.toLowerCase();

            switch (lowerFiltro) {
                case 'despesas':
                    return lowerTipo.includes('despesa');
                case 'login':
                    return lowerTipo.includes('login');
                case 'registo':
                    return lowerTipo.includes('registo');
                case 'recuperação de password':
                    return lowerTipo.includes('recuperação de password');
                case 'alteração de password':
                    return lowerTipo.includes('alteração de password');
                case 'vagas':
                    return lowerTipo.includes('vaga');
                case 'candidaturas':
                    return lowerTipo.includes('candidatura');
                case 'faltas':
                    return lowerTipo.includes('falta');
                case 'férias':
                    return lowerTipo.includes('férias');
                case 'projetos':
                    return lowerTipo.includes('projeto');
                case 'ideias':
                    return lowerTipo.includes('ideia');
                case 'linha temporal':
                    return lowerTipo.includes('linha temporal');
                case 'blog':
                    return lowerTipo.includes('publicação');
                case 'comentários candidaturas':
                    return lowerTipo.includes('comentário em candidatura');
                case 'comentários projetos':
                    return lowerTipo.includes('comentário em projeto');
                case 'departamentos':
                    return lowerTipo.includes('departamento');
                case 'empresa':
                    return lowerTipo.includes('informações da empresa');
                default:
                    return true;
            }
        });
    }, [AuditLog, filtro, filtroAtividade]);

    function carregarAuditLog() {
        handleServices.carregarAuditLog()
            .then(res => {
                setAuditLog(res);
            })
            .catch(err => {
                console.log("Erro ao carregar os registos do auditlog: " + err);
            });
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
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <SidebarItems tipo_user={localStorage.getItem('tipo')}></SidebarItems>
                    </div>

                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h2 style={{ color: '#333', fontWeight: '600', margin: 0 }}>Registos</h2>
                            <div>
                                <FormControl sx={{ minWidth: 200, mx: 2 }} size="small">
                                    <InputLabel id="log-type-filter-label">Filtrar por tipo</InputLabel>
                                    <Select
                                        labelId="log-type-filter-label"
                                        value={filtro}
                                        label="Filtrar por tipo"
                                        onChange={(e) => setFiltro(e.target.value)}
                                    >
                                        <MenuItem value="Todos">Todos</MenuItem>
                                        <MenuItem value="Login">Login</MenuItem>
                                        <MenuItem value="Registo">Registo</MenuItem>
                                        <MenuItem value="Recuperação de password">Recuperação de password</MenuItem>
                                        <MenuItem value="Alteração de password">Alteração de password</MenuItem>
                                        <MenuItem value="Despesas">Despesas</MenuItem>
                                        <MenuItem value="Vagas">Vagas</MenuItem>
                                        <MenuItem value="Candidaturas">Candidaturas</MenuItem>
                                        <MenuItem value="Faltas">Faltas</MenuItem>
                                        <MenuItem value="Férias">Férias</MenuItem>
                                        <MenuItem value="Projetos">Projetos</MenuItem>
                                        <MenuItem value="Ideias">Ideias</MenuItem>
                                        <MenuItem value="Linha Temporal">Linha Temporal</MenuItem>
                                        <MenuItem value="Blog">Blog</MenuItem>
                                        <MenuItem value="Comentários Candidaturas">Comentários Candidaturas</MenuItem>
                                        <MenuItem value="Comentários Projetos">Comentários Projetos</MenuItem>
                                        <MenuItem value="Departamentos">Departamentos</MenuItem>
                                        <MenuItem value="Empresa">Empresa</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <InputLabel id="type-filter-label">Filtrar por tipo de atividade</InputLabel>
                                    <Select
                                        labelId="type-filter-label"
                                        value={filtroAtividade}
                                        label="Filtrar por tipo"
                                        onChange={(e) => { setFiltroAtividade(e.target.value) }}
                                    >
                                        <MenuItem value="Todos">Todos</MenuItem>
                                        {(() => {
                                            switch (filtro) {
                                                case "Despesas":
                                                    return [
                                                        <MenuItem key="cd" value="Criação de despesa">Criação de despesa</MenuItem>,
                                                        <MenuItem key="ed" value="Edição de despesa">Edição de despesa</MenuItem>,
                                                        <MenuItem key="del" value="Eliminação de despesa">Eliminação de despesa</MenuItem>,
                                                    ];
                                                case "Vagas":
                                                    return [
                                                        <MenuItem key="cv" value="Criação de vaga">Criação de vaga</MenuItem>,
                                                        <MenuItem key="ev" value="Edição de vaga">Edição de vaga</MenuItem>,
                                                        <MenuItem key="delv" value="Eliminação de vaga">Eliminação de vaga</MenuItem>,
                                                    ];
                                                case "Candidaturas":
                                                    return [
                                                        <MenuItem key="cc" value="Criação de candidatura">Criação de candidatura</MenuItem>,
                                                        <MenuItem key="ec" value="Edição de candidatura">Edição de candidatura</MenuItem>,
                                                        <MenuItem key="delc" value="Eliminação de candidatura">Eliminação de candidatura</MenuItem>,
                                                    ];
                                                case "Faltas":
                                                    return [
                                                        <MenuItem key="cf" value="Criação de falta">Criação de falta</MenuItem>,
                                                        <MenuItem key="ef" value="Edição de falta">Edição de falta</MenuItem>,
                                                        <MenuItem key="delf" value="Eliminação de falta">Eliminação de falta</MenuItem>,
                                                    ];
                                                case "Ferias":
                                                    return [
                                                        <MenuItem key="cfer" value="Criação de férias">Criação de férias</MenuItem>,
                                                        <MenuItem key="efer" value="Edição de férias">Edição de férias</MenuItem>,
                                                        <MenuItem key="delfer" value="Eliminação de férias">Eliminação de férias</MenuItem>,
                                                    ];
                                                case "Projetos":
                                                    return [
                                                        <MenuItem key="cp" value="Criação de projeto">Criação de projeto</MenuItem>,
                                                        <MenuItem key="ep" value="Edição de projeto">Edição de projeto</MenuItem>,
                                                        <MenuItem key="delp" value="Eliminação de projeto">Eliminação de projeto</MenuItem>,
                                                    ];
                                                case "Ideias":
                                                    return [
                                                        <MenuItem key="ci" value="Criação de ideia">Criação de ideia</MenuItem>,
                                                        <MenuItem key="ei" value="Edição de ideia">Edição de ideia</MenuItem>,
                                                        <MenuItem key="deli" value="Eliminação de ideia">Eliminação de ideia</MenuItem>,
                                                    ];
                                                case "Linha Temporal":
                                                    return [
                                                        <MenuItem key="clt" value="Criação de ponto na LT">Criação de ponto na LT</MenuItem>,
                                                        <MenuItem key="elt" value="Edição de ponto na LT">Edição de ponto na LT</MenuItem>,
                                                        <MenuItem key="dlt" value="Eliminação de ponto na LT">Eliminação de ponto na LT</MenuItem>,
                                                    ];
                                                case "Blog":
                                                    return [
                                                        <MenuItem key="cb" value="Criação de publicação">Criação de publicação</MenuItem>,
                                                        <MenuItem key="eb" value="Edição de publicação">Edição de publicação</MenuItem>,
                                                        <MenuItem key="delb" value="Eliminação de publicação">Eliminação de publicação</MenuItem>,
                                                    ];
                                                case "Comentários Candidaturas":
                                                    return [
                                                        <MenuItem key="ccc" value="Criação de comentário em candidatura">Criação de comentário em candidatura</MenuItem>,
                                                        <MenuItem key="dcc" value="Eliminação de comentário em candidatura">Eliminação de comentário em candidatura</MenuItem>,
                                                    ];
                                                case "Comentários Projetos":
                                                    return [
                                                        <MenuItem key="ccp" value="Criação de comentário em projeto">Criação de comentário em projeto</MenuItem>,
                                                        <MenuItem key="dcp" value="Eliminação de comentário em projeto">Eliminação de comentário em projeto</MenuItem>,
                                                    ];
                                                case "Departamentos":
                                                    return [
                                                        <MenuItem key="cdp" value="Criação de departamento">Criação de departamento</MenuItem>,
                                                        <MenuItem key="edp" value="Edição de departamento">Edição de departamento</MenuItem>,
                                                        <MenuItem key="ddp" value="Eliminação de departamento">Eliminação de departamento</MenuItem>,
                                                    ];
                                                case "Empresa":
                                                    return [
                                                        <MenuItem key="default" value="Edição das informações da empresa">Edição das informações da empresa</MenuItem>,
                                                    ];
                                            }
                                        })()}
                                    </Select>
                                </FormControl>
                            </div>

                        </div>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="departamentos table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Perfil</TableCell>
                                        <TableCell>Data da atividade</TableCell>
                                        <TableCell>Tipo de atividade</TableCell>
                                        <TableCell>Descrição</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredLogs.length > 0 ? (
                                        filteredLogs.map((log) => (
                                            <TableRow key={log.id_log}>
                                                <TableCell>{log.utilizador || "Sem utilizador"}</TableCell>
                                                <TableCell>{formatDateTime(log.data_atividade)}</TableCell>
                                                <TableCell>{log.tipo_atividade}</TableCell>
                                                <TableCell>{log.descricao}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                Nenhum registro encontrado
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}