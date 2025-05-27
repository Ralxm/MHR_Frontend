import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Card, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack, Close } from '@mui/icons-material'
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle'
import DoughnutPieChart from './DoughnutPieChart';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import CandidaturaCard from './CandidaturaCard';
import { useSnackbar } from 'notistack';

export default function Vagas() {
    const { id } = useParams();
    const { state } = useLocation();
    const [vaga, setVaga] = useState(state?.vaga);
    const [departamento, setDepartamento] = useState(state?.dep)
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [isVagaLoading, setIsVagaLoading] = useState(true);

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [candidaturas, setCandidaturas] = useState([])
    const [comentarios, setComentarios] = useState([])
    const [candidaturaUser, setCandidaturaUser] = useState()

    const [selectedCandidatura, setSelectedCandidatura] = useState(null)
    const [selectedCandidaturaUser, setSelectedCandidaturaUser] = useState(null)

    const [isCreateCandidaturaModalOpen, setIsCreateCandidaturaModalOpen] = useState(false)
    const [isVerCandidaturasModalOpen, setIsVerCandidaturasModalOpen] = useState(false)

    const [isDecidirCandidaturaModal, setIsDecidirCandidaturaModal] = useState(false)
    const [action, setAction] = useState('')

    const [isApagarCandidaturaModalOpen, setIsApagarCandidaturaModalOpen] = useState(false)

    {/* Variável para criação de um comentário */ }
    const [comentario, setComentario] = useState('')

    {/*Variáveis para a criação do curriculo*/ }
    const [email, setEmail] = useState('')
    const [telemovel, setTelemovel] = useState('')
    const [curriculo, setCurriculo] = useState('')

    {/* Variável para responder a candidatura com email */ }
    const [emailResposta, setEmailResposta] = useState('')


    {/* Função para criar uma candidatura */ }
    const handleCandidatar = (vaga) => {
        setIsCreateCandidaturaModalOpen(true)
    }

    {/* Função para fechar o modal de criar uma candidatura */ }
    const handleCloseCandidatar = () => {
        setIsCreateCandidaturaModalOpen(false)
    }

    const handleVerCandidaturas = (vaga) => {
        setIsVerCandidaturasModalOpen(true)
    }

    const handleCloseVerCandidaturas = () => {
        setIsVerCandidaturasModalOpen(false)
    }

    const handleDecidirCandidaturas = (action) => {
        setIsDecidirCandidaturaModal(true)
        setAction(action)
    }

    const handleCloseDecidirCandidaturas = () => {
        setIsDecidirCandidaturaModal(false)
        setAction('')
    }

    const handleCloseSelectedCandidaturaUser = () => {
        setSelectedCandidaturaUser(null)
    }

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        if (!vaga) {
            carregarVaga(id);
        }
        else {
            setIsVagaLoading(false)
            vaga.data_inicio = convertDate(vaga.data_inicio)
            vaga.data_fecho = convertDate(vaga.data_fecho)
        }

        const shouldOpen = sessionStorage.getItem('shouldOpenModal');
        if (shouldOpen === 'true') {
            setIsVerCandidaturasModalOpen(true);
            sessionStorage.removeItem('shouldOpenModal');
        }

        const checkState = sessionStorage.getItem('checkState');
        if (checkState === 'true') {
            carregarVaga(id)
            sessionStorage.removeItem('checkState');
        }
    }, []);

    useEffect(() => {
        if (vaga) {
            const storedValue = sessionStorage.getItem('shouldOpenDetalhesCandidaturaUser');
            const type = sessionStorage.getItem('type');
            if (storedValue && type) {
                const parsedValue = JSON.parse(storedValue);
                if (type == 'admin') {
                    handleVerCandidaturas(vaga.id_vaga)
                    setSelectedCandidatura(parsedValue)
                }
                else if (type == 'user') {
                    setSelectedCandidaturaUser(parsedValue);
                }
                carregarComentarios(parsedValue.id_candidatura)
                sessionStorage.removeItem('shouldOpenDetalhesCandidaturaUser');
                sessionStorage.removeItem('type');
            }
        }
    }, [vaga])

    useEffect(() => {
        if (vaga) {
            document.title = "Vaga: " + vaga.titulo_vaga;

            if (tipo_user == 1 || tipo_user == 2) {
                carregarCandidaturas(vaga.id_vaga);
            }
            else if (id_user && vaga.id_vaga) {
                carregarCandidaturaUser(id_user);
            }
            if (!departamento && vaga) {
                handleServices.getDepartamento(vaga.id_departamento)
                    .then(res => {
                        setDepartamento(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }, [vaga, id_user, tipo_user])

    function carregarCandidaturas(id) {
        setIsLoading(true)
        handleServices.listCandidaturasPorVaga(id)
            .then(res => {
                res.map((candidatura) => {
                    candidatura.data_submissao = convertDate(candidatura.data_submissao)
                })
                setCandidaturas(res)
            })
            .catch(err => {
                console.log(err)
            })
        setIsLoading(false)
    }

    async function carregarVaga(id) {
        setIsVagaLoading(true);
        try {
            const res = await handleServices.getVaga(id);
            const processedVaga = {
                ...res[0],
                data_inicio: convertDate(res[0].data_inicio),
                data_fecho: convertDate(res[0].data_fecho)
            };
            setVaga(processedVaga);
        } catch (err) {
            console.log(err);
        } finally {
            setIsVagaLoading(false);
        }
    }

    function carregarComentarios(id) {
        handleServices.listComentarios(id)
            .then(res => {
                setComentarios(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function carregarCandidaturaUser(id_user) {
        handleServices.getCandidaturaUser(id_user, vaga.id_vaga)
            .then(res => {
                setCandidaturaUser(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function convertDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }

    function formatDateTime(isoString) {
        return isoString.replace('T', ' ').split('.')[0];
    }

    function handleCriarCandidatura(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append('id_vaga', vaga.id_vaga);
        formData.append('id_utilizador', id_user);
        formData.append('telemovel', telemovel);
        formData.append('email', email);
        formData.append('status', "Pendente");

        if (curriculo) {
            formData.append('curriculo', curriculo)
        }

        handleServices.createCandidatura(formData)
            .then(res => {
                enqueueSnackbar("Candidatura criada com sucesso", { variant: 'success' });
                carregarCandidaturaUser(id_user);
                handleCloseCandidatar();
            })
            .catch(err => {
                enqueueSnackbar("Erro acriar a candidatura: " + err, { variant: 'error' });
            });
    }

    function handleComentar(comentario) {
        let candidatura;

        const datapost = {
            comentario: comentario,
            responsavel: id_user
        }

        if (selectedCandidaturaUser) {
            datapost.id_candidatura = selectedCandidaturaUser.id_candidatura
            candidatura = selectedCandidaturaUser;
        }
        else {
            datapost.id_candidatura = selectedCandidatura.id_candidatura
            candidatura = selectedCandidatura
        }

        handleServices.createComentario(datapost)
            .then(res => {
                enqueueSnackbar("Comentário criado com sucesso", { variant: 'success' });
                sessionStorage.setItem('shouldOpenDetalhesCandidaturaUser', JSON.stringify(candidatura));
                sessionStorage.setItem('type', 'admin')
                navigate(0)
            })
            .catch(err => {
                enqueueSnackbar("Erro a criar o comentário: " + err, { variant: 'error' });
            });
    }

    function aceitarCandidatura(id_candidatura) {
        const datapost = {
            id_candidatura: id_candidatura,
            responsavel: id_user,
            resultado: "Aceite"
        }

        handleServices.aceitarCandidatura(datapost)
            .then(res => {
                enqueueSnackbar("Candidatura aceite com sucesso", { variant: 'success' });
                //sessionStorage.setItem('shouldOpenModal', 'true');
                //sessionStorage.setItem('checkState', 'true')
                navigate(0)
            })
            .catch(err => {
                console.log(err);
            });
    }

    function analisarCandidatura(id_candidatura) {
        handleServices.analisarCandidatura(id_candidatura)
            .then(res => {
                enqueueSnackbar("Candidatura alterada para em análise", { variant: 'success' });
                sessionStorage.setItem('shouldOpenModal', 'true');
                sessionStorage.setItem('checkState', 'true')
                navigate(0)
            })
            .catch(err => {
                console.log(err);
            });
    }

    function rejeitarCandidatura(id_candidatura) {
        const datapost = {
            id_candidatura: id_candidatura,
            responsavel: id_user,
            resultado: "Rejeitada"
        }

        handleServices.rejeitarCandidatura(datapost)
            .then(res => {
                enqueueSnackbar("Candidatura rejeitada com sucesso", { variant: 'success' });
                sessionStorage.setItem('shouldOpenModal', 'true');
                navigate(0)
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
            });
    }

    function handleApagarCandidatura(id) {
        handleServices.apagarCandidatura(id)
            .then(res => {
                enqueueSnackbar(res, { variant: 'success' });
                carregarCandidaturaUser(id_user);
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
            });
    }

    if (isVagaLoading) {
        return <div>Loading...</div>;
    }

    if (!vaga) {
        return <div>Error loading vaga.</div>;
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
                                            onClick={() => navigate('/vagas')}
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
                                                        {vaga && vaga.titulo_vaga}
                                                    </h2>
                                                    <Chip icon={vaga?.estado === 'Aberta' ?
                                                        <LockOpen />
                                                        :
                                                        vaga?.estado === 'Fechada' ?
                                                            <Lock />
                                                            :
                                                            <Person />
                                                    }
                                                        label={vaga?.estado || ''}
                                                        sx={{
                                                            borderRadius: '20px',
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            height: '36px',
                                                            padding: '0 12px'
                                                        }}
                                                        color={
                                                            vaga?.estado === 'Aberta' ? 'success' :
                                                                vaga?.estado === 'Fechada' ? 'error' :
                                                                    'warning'
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className='row mb-4'>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='dates-container p-3 d-flex align-items-center' style={{ backgroundColor: '#e9f7fe', borderRadius: '8px', flex: 1, marginRight: '15px' }}>
                                                        <div>
                                                            <div style={{ color: '#3498db' }}>
                                                                Data de ínicio: {vaga && vaga.data_inicio}
                                                            </div>
                                                            <div style={{ color: '#e74c3c' }}>
                                                                Data de fecho: {vaga && vaga.data_fecho}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='dates-container p-3 d-flex align-items-center' style={{ backgroundColor: '#e9f7fe', borderRadius: '8px', flex: 1, marginRight: '15px' }}>
                                                        <div>
                                                            <div style={{ color: '#3498db' }}>
                                                                Tipo: {vaga && vaga.tipo}
                                                            </div>
                                                            <div style={{ color: '#e74c3c' }}>
                                                                Local: {vaga && vaga.local}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='vacancy-container p-3' style={{ backgroundColor: '#e8f8f0', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
                                                        <h5 style={{ color: '#27ae60', marginBottom: '5px' }}>
                                                            <i className="bi bi-people-fill me-2"></i>
                                                            Vagas
                                                        </h5>
                                                        <h4 style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                            {vaga && vaga.numero_vagas}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='mb-4 d-flex'>
                                                <div className='col-md-12'>
                                                    <div className='department-badge p-2' style={{ backgroundColor: '#e8f4f8', borderRadius: '6px' }}>
                                                        <h4 className='mb-0' style={{ color: '#2980b9' }}>
                                                            {departamento && departamento.nome_departamento}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row flex-grow-1 mb-2'>
                                                <div className='col-md-12'>
                                                    <h5 className='mb-3' style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '6px' }}>
                                                        <i className="bi bi-file-text me-2"></i>
                                                        Descrição:
                                                    </h5>
                                                    <textarea
                                                        className='form-control mt-2 p-3 bg-light'
                                                        style={{
                                                            resize: 'none',
                                                            border: "1px solid #ddd",
                                                            minHeight: '40vh',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            lineHeight: '1.6'
                                                        }}
                                                        disabled={tipo_user != 1 && tipo_user != 2}
                                                        value={vaga && vaga.descricao}
                                                    />
                                                </div>
                                            </div>


                                            <div className='row flex-grow-1'>
                                                <div className='col-md-6'>
                                                    <h5 className='mb-3' style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '6px' }}>
                                                        <i className="bi bi-list-check me-2"></i>
                                                        O que procuramos:
                                                    </h5>
                                                    <textarea
                                                        className='form-control mt-2 p-3 bg-light'
                                                        style={{
                                                            resize: 'none',
                                                            border: "1px solid #ddd",
                                                            minHeight: '50vh',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            lineHeight: '1.6'
                                                        }}
                                                        disabled={tipo_user != 1 && tipo_user != 2}
                                                        value={vaga && vaga.requisitos}
                                                    />
                                                </div>
                                                <div className='col-md-6 h-100'>
                                                    <h5 className='mb-3' style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '6px' }}>
                                                        <i className="bi bi-list-check me-2"></i>
                                                        O que oferecemos:
                                                    </h5>
                                                    <textarea
                                                        className='form-control mt-2 p-3 bg-light'
                                                        style={{
                                                            resize: 'none',
                                                            border: "1px solid #ddd",
                                                            minHeight: '50vh',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            lineHeight: '1.6'
                                                        }}
                                                        disabled={tipo_user != 1 && tipo_user != 2}
                                                        value={vaga && vaga.oferecemos}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-md-2' style={{ display: 'flex', flexDirection: 'column', height: '80vh', overflow: 'hidden' }}>
                                        <header className='mb-2' style={{ width: '100%', zIndex: 1, }}>
                                            <div className='d-flex justify-content-end'>
                                                <button className='btn btn-success' style={{ width: '90%' }} onClick={handleCandidatar} disabled={candidaturaUser != null || vaga.estado == "Ocupada" || vaga.estado == "Em análise"}>
                                                    Candidatar
                                                </button>
                                            </div>
                                        </header>

                                        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem' }}>
                                            <div className='d-flex justify-content-center'>
                                                <div className='col-md-1'>
                                                    &nbsp;
                                                </div>
                                                <div className='col-md-11' >
                                                    {/* Mostra as candidaturas para os admins */}
                                                    {(tipo_user == 1 || tipo_user == 2) && candidaturas && candidaturas.length > 0 && (
                                                        <div>
                                                            <Accordion defaultExpanded className='mt-2'>
                                                                <AccordionSummary aria-controls="panel-all-content" id="panel-all-header">
                                                                    <Typography sx={{ fontWeight: 'bold' }}>Todas as Candidaturas ({candidaturas.length})</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    {candidaturas.length > 0 ? (
                                                                        candidaturas.map((candidatura) => (
                                                                            <CandidaturaCard
                                                                                key={candidatura.id_candidatura}
                                                                                candidatura={candidatura}
                                                                                handleVerCandidaturas={handleVerCandidaturas}
                                                                                setSelectedCandidatura={setSelectedCandidatura}
                                                                                carregarComentarios={carregarComentarios}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Typography>Nenhuma candidatura encontrada</Typography>
                                                                    )}
                                                                </AccordionDetails>
                                                            </Accordion>

                                                            <Accordion>
                                                                <AccordionSummary aria-controls="panel-accepted-content" id="panel-accepted-header">
                                                                    <Typography sx={{ fontWeight: 'bold' }}>Aceites ({candidaturas.filter(c => c.status.includes("Aceite")).length})</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    {candidaturas.filter(c => c.status.includes("Aceite")).length > 0 ? (
                                                                        candidaturas.filter(c => c.status.includes("Aceite")).map((candidatura) => (
                                                                            <CandidaturaCard
                                                                                key={candidatura.id_candidatura}
                                                                                candidatura={candidatura}
                                                                                handleVerCandidaturas={handleVerCandidaturas}
                                                                                setSelectedCandidatura={setSelectedCandidatura}
                                                                                carregarComentarios={carregarComentarios}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Typography>Nenhuma candidatura aceite</Typography>
                                                                    )}
                                                                </AccordionDetails>
                                                            </Accordion>

                                                            <Accordion>
                                                                <AccordionSummary aria-controls="panel-pending-content" id="panel-pending-header">
                                                                    <Typography sx={{ fontWeight: 'bold' }}>Em Análise ({candidaturas.filter(c => c.status.includes("Em análise")).length})</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    {candidaturas.filter(c => c.status.includes("Em análise")).length > 0 ? (
                                                                        candidaturas.filter(c => c.status.includes("Em análise")).map((candidatura) => (
                                                                            <CandidaturaCard
                                                                                key={candidatura.id_candidatura}
                                                                                candidatura={candidatura}
                                                                                handleVerCandidaturas={handleVerCandidaturas}
                                                                                setSelectedCandidatura={setSelectedCandidatura}
                                                                                carregarComentarios={carregarComentarios}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Typography>Nenhuma candidatura em análise</Typography>
                                                                    )}
                                                                </AccordionDetails>
                                                            </Accordion>

                                                            <Accordion>
                                                                <AccordionSummary aria-controls="panel-rejected-content" id="panel-rejected-header">
                                                                    <Typography sx={{ fontWeight: 'bold' }}>Pendentes ({candidaturas.filter(c => c.status.includes("Pendente")).length})</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    {candidaturas.filter(c => c.status.includes("Pendente")).length > 0 ? (
                                                                        candidaturas.filter(c => c.status.includes("Pendente")).map((candidatura) => (
                                                                            <CandidaturaCard
                                                                                key={candidatura.id_candidatura}
                                                                                candidatura={candidatura}
                                                                                handleVerCandidaturas={handleVerCandidaturas}
                                                                                setSelectedCandidatura={setSelectedCandidatura}
                                                                                carregarComentarios={carregarComentarios}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Typography>Nenhuma candidatura rejeitada</Typography>
                                                                    )}
                                                                </AccordionDetails>
                                                            </Accordion>

                                                            <Accordion>
                                                                <AccordionSummary aria-controls="panel-rejected-content" id="panel-rejected-header">
                                                                    <Typography sx={{ fontWeight: 'bold' }}>Rejeitadas ({candidaturas.filter(c => c.status.includes("Rejeitada")).length})</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    {candidaturas.filter(c => c.status.includes("Rejeitada")).length > 0 ? (
                                                                        candidaturas.filter(c => c.status.includes("Rejeitada")).map((candidatura) => (
                                                                            <CandidaturaCard
                                                                                key={candidatura.id_candidatura}
                                                                                candidatura={candidatura}
                                                                                handleVerCandidaturas={handleVerCandidaturas}
                                                                                setSelectedCandidatura={setSelectedCandidatura}
                                                                                carregarComentarios={carregarComentarios}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <Typography>Nenhuma candidatura rejeitada</Typography>
                                                                    )}
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </div>
                                                    )}

                                                    {/* Mostra as candidatura feita pelo utilizador normal logado */}
                                                    {(tipo_user != 1 && tipo_user != 2) && candidaturaUser &&
                                                        <CandidaturaCard
                                                            key={candidaturaUser.id_candidatura}
                                                            candidatura={candidaturaUser}
                                                            handleVerCandidaturas={setSelectedCandidaturaUser}
                                                            setSelectedCandidatura={setSelectedCandidaturaUser}
                                                            carregarComentarios={carregarComentarios}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para a criação de uma candidatura */}
            <Modal
                open={isCreateCandidaturaModalOpen}
                onClose={handleCloseCandidatar}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 500 },
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                        Candidatura
                    </Typography>
                    <form>
                        <Stack spacing={2}>
                            {vaga &&
                                <Typography className="mb-2" id="modal-modal-title" variant="h8" sx={{ mb: 2 }}>
                                    Vaga: {vaga.titulo_vaga}
                                </Typography>
                            }
                            <TextField
                                label="Email"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(value) => { setEmail(value.target.value) }}
                            />
                            <TextField
                                label="Telemovel"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(value) => { setTelemovel(value.target.value) }}
                            />
                            <FileDropZoneSingle
                                onDrop={(files) => {
                                    if (files && files.length > 0) {
                                        setCurriculo(files[0]);
                                    }
                                }}
                                accept={{
                                    'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                    'application/pdf': ['.pdf'],
                                }}
                                maxSize={10 * 1024 * 1024}
                            />

                            <Button variant="contained" color="primary" onClick={handleCriarCandidatura}>
                                Criar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Modal>

            {/* Modal para ver os detalhes de uma candidatura */}
            <Modal
                open={isVerCandidaturasModalOpen}
                onClose={handleCloseVerCandidaturas}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '80%', md: '70%' },
                        maxWidth: '1200px',
                        height: '80vh',
                        borderRadius: 4,
                        p: 0,
                        display: 'flex',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            width: '30%',
                            borderRight: '1px solid #e0e0e0',
                            overflowY: 'auto',
                            p: 2,
                        }}
                    >
                        <Typography variant="h6" component="div">
                            Candidaturas
                        </Typography>

                        {candidaturas && candidaturas.length > 0 && (
                            <div>
                                <Accordion className='mt-2'>
                                    <AccordionSummary aria-controls="panel-all-content" id="panel-all-header">
                                        <Typography sx={{ fontWeight: 'bold' }}>Todas as Candidaturas ({candidaturas.length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {candidaturas.length > 0 ? (
                                            candidaturas.map((candidatura) => (
                                                <CandidaturaCard
                                                    key={candidatura.id_candidatura}
                                                    candidatura={candidatura}
                                                    handleVerCandidaturas={handleVerCandidaturas}
                                                    setSelectedCandidatura={setSelectedCandidatura}
                                                    carregarComentarios={carregarComentarios}
                                                />
                                            ))
                                        ) : (
                                            <Typography>Nenhuma candidatura encontrada</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary aria-controls="panel-accepted-content" id="panel-accepted-header">
                                        <Typography sx={{ fontWeight: 'bold' }}>Aceites ({candidaturas.filter(c => c.status.includes("Aceite")).length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {candidaturas.filter(c => c.status.includes("Aceite")).length > 0 ? (
                                            candidaturas.filter(c => c.status.includes("Aceite")).map((candidatura) => (
                                                <CandidaturaCard
                                                    key={candidatura.id_candidatura}
                                                    candidatura={candidatura}
                                                    handleVerCandidaturas={handleVerCandidaturas}
                                                    setSelectedCandidatura={setSelectedCandidatura}
                                                    carregarComentarios={carregarComentarios}
                                                />
                                            ))
                                        ) : (
                                            <Typography>Nenhuma candidatura aceite</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary aria-controls="panel-pending-content" id="panel-pending-header">
                                        <Typography sx={{ fontWeight: 'bold' }}>Em Análise ({candidaturas.filter(c => c.status.includes("Em análise")).length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {candidaturas.filter(c => c.status.includes("Em análise")).length > 0 ? (
                                            candidaturas.filter(c => c.status.includes("Em análise")).map((candidatura) => (
                                                <CandidaturaCard
                                                    key={candidatura.id_candidatura}
                                                    candidatura={candidatura}
                                                    handleVerCandidaturas={handleVerCandidaturas}
                                                    setSelectedCandidatura={setSelectedCandidatura}
                                                    carregarComentarios={carregarComentarios}
                                                />
                                            ))
                                        ) : (
                                            <Typography>Nenhuma candidatura em análise</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary aria-controls="panel-rejected-content" id="panel-rejected-header">
                                        <Typography sx={{ fontWeight: 'bold' }}>Pendentes ({candidaturas.filter(c => c.status.includes("Pendente")).length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {candidaturas.filter(c => c.status.includes("Pendente")).length > 0 ? (
                                            candidaturas.filter(c => c.status.includes("Pendente")).map((candidatura) => (
                                                <CandidaturaCard
                                                    key={candidatura.id_candidatura}
                                                    candidatura={candidatura}
                                                    handleVerCandidaturas={handleVerCandidaturas}
                                                    setSelectedCandidatura={setSelectedCandidatura}
                                                    carregarComentarios={carregarComentarios}
                                                />
                                            ))
                                        ) : (
                                            <Typography>Nenhuma candidatura rejeitada</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary aria-controls="panel-rejected-content" id="panel-rejected-header">
                                        <Typography sx={{ fontWeight: 'bold' }}>Rejeitadas ({candidaturas.filter(c => c.status.includes("Rejeitada")).length})</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {candidaturas.filter(c => c.status.includes("Rejeitada")).length > 0 ? (
                                            candidaturas.filter(c => c.status.includes("Rejeitada")).map((candidatura) => (
                                                <CandidaturaCard
                                                    key={candidatura.id_candidatura}
                                                    candidatura={candidatura}
                                                    handleVerCandidaturas={handleVerCandidaturas}
                                                    setSelectedCandidatura={setSelectedCandidatura}
                                                    carregarComentarios={carregarComentarios}
                                                />
                                            ))
                                        ) : (
                                            <Typography>Nenhuma candidatura rejeitada</Typography>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: '70%',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#fafafa',
                            overflowY: 'auto'
                        }}
                    >
                        {selectedCandidatura ?
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ mb: 4 }}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <Typography variant="h5" gutterBottom>
                                            Detalhes da Candidatura
                                        </Typography>
                                        <IconButton onClick={handleCloseVerCandidaturas}>
                                            <Close />
                                        </IconButton>
                                    </div>


                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Data de Submissão:</strong> {formatDateTime(selectedCandidatura.data_submissao)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Estado:</strong>
                                                <Chip
                                                    label={selectedCandidatura.status || "Status não disponível"}
                                                    color={
                                                        selectedCandidatura.status.includes("Aceite") ? "success" :
                                                            selectedCandidatura.status.includes("Rejeitada") ? "error" :
                                                                selectedCandidatura.status.includes("Em análise") ? "warning" : "default"
                                                    }
                                                    className='mx-1'
                                                />
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Email:</strong> {selectedCandidatura.email}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Telemóvel:</strong> {selectedCandidatura.telemovel}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">
                                                <strong>Currículo:</strong> {' '}
                                                {selectedCandidatura.curriculo != null ?
                                                    <a href={'http://localhost:8080/' + selectedCandidatura.curriculo.replace(/\\/g, '/')} target="_blank">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        >
                                                            Abrir currículo
                                                        </Button>
                                                    </a>
                                                    :
                                                    <div>
                                                        Sem currículo
                                                    </div>
                                                }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Comentários ({comentarios?.length || 0})
                                    </Typography>

                                    <Box sx={{ mb: 1, maxHeight: '300px', overflowY: 'auto' }}>
                                        {comentarios ? (
                                            comentarios.map((comentario, index) => (
                                                <Card key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="subtitle2" color="primary">
                                                            {comentario.perfil.nome}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {convertDate(comentario.created_at)}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1">
                                                        {comentario.comentario}
                                                    </Typography>
                                                </Card>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                Nenhum comentário ainda.
                                            </Typography>
                                        )}
                                    </Box>
                                    <hr></hr>

                                    <Box component="form" sx={{ mb: 2, mt: 1 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Adicionar Comentário
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            placeholder="Escreva o seu comentário..."
                                            sx={{ mb: 2 }}
                                            onChange={(value) => setComentario(value.target.value)}
                                            value={comentario}
                                        />
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => { handleComentar(comentario, 'admin'); setComentario("") }}
                                            >
                                                Enviar Comentário
                                            </Button>

                                        </div>
                                    </Box>
                                </Box>
                                <div className='modal-footer'>
                                    <div className='d-flex justify-content-between'>
                                        <button
                                            type="button"
                                            className='btn btn-success'
                                            onClick={() => { handleDecidirCandidaturas('Aceitar') }}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            type="button"
                                            className='btn btn-warning mx-2'
                                            onClick={() => { handleDecidirCandidaturas('Analisar') }}
                                        >
                                            Analisar
                                        </button>
                                        <button
                                            type="button"
                                            className='btn btn-danger'
                                            onClick={() => { handleDecidirCandidaturas('Rejeitar') }}
                                        >
                                            Rejeitar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            <Typography variant="h6" color="textSecondary" sx={{ m: 'auto' }}>
                                Selecione uma candidatura para ver os detalhes
                            </Typography>
                        }
                    </Box>
                </Paper>
            </Modal>

            {/*Modal para aceitar uma candidatura */}
            <Modal
                open={isDecidirCandidaturaModal}
                onClose={handleCloseDecidirCandidaturas}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 650 },
                        height: { xs: 300, sm: action === "Analisar" ? 150 : 400 },
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    {action == "Aceitar" &&
                        <>
                            <Typography id="modal-modal-title" variant="h6">
                                Tem a certeza que quer aceitar esta candidatura?
                            </Typography>
                            <Typography id="modal-modal-title" variant="h7">
                                O texto escrito em baixo será enviado para o candidato
                            </Typography>
                            <TextField
                                label="Texto"
                                type="text"
                                multiline
                                minRows={8}
                                maxRows={8}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(e) => setEmailResposta(e.target.value)}
                                variant="outlined"
                                className="my-3"
                            />
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { handleCloseDecidirCandidaturas() }}
                                    sx={{ width: '50%' }}
                                >
                                    Fechar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => { aceitarCandidatura(selectedCandidatura.id_candidatura) }}
                                    sx={{ width: '50%' }}
                                >
                                    Aceitar
                                </Button>
                            </Stack>
                        </>
                    }
                    {action == "Analisar" &&
                        <>
                            <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                                Alterar a candidatura para "Em análise"?
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { handleCloseDecidirCandidaturas() }}
                                    sx={{ width: '50%' }}
                                >
                                    Fechar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => { analisarCandidatura(selectedCandidatura.id_candidatura) }}
                                    sx={{ width: '50%' }}
                                >
                                    Alterar
                                </Button>
                            </Stack>
                        </>
                    }
                    {action == "Rejeitar" &&
                        <>
                            <Typography id="modal-modal-title" variant="h6">
                                Tem a certeza que quer rejeitar esta candidatura?
                            </Typography>
                            <Typography id="modal-modal-title" variant="h7">
                                O texto escrito em baixo será enviado para o candidato
                            </Typography>
                            <TextField
                                label="Texto"
                                type="text"
                                multiline
                                minRows={8}
                                maxRows={8}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(e) => setEmailResposta(e.target.value)}
                                variant="outlined"
                                className="my-3"
                            />
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { handleCloseDecidirCandidaturas() }}
                                    sx={{ width: '50%' }}
                                >
                                    Fechar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => { rejeitarCandidatura(selectedCandidatura.id_candidatura) }}
                                    sx={{ width: '50%' }}
                                >
                                    Rejeitar
                                </Button>
                            </Stack>
                        </>
                    }
                </Paper>
            </Modal>

            {/* Modal para o utilizador ver os detalhes da sua própria candidatura */}
            <Modal
                open={selectedCandidaturaUser}
                onClose={handleCloseSelectedCandidaturaUser}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '80%', md: '70%' },
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        borderRadius: 4,
                        p: 0,
                        display: 'flex',
                        overflow: 'hidden',
                    }}
                >

                    <Box
                        sx={{
                            width: '100%',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#fafafa',
                            overflowY: 'auto'
                        }}
                    >
                        {selectedCandidaturaUser ?
                            <div>
                                <DetalhesCandidaturaUser></DetalhesCandidaturaUser>
                            </div>
                            :
                            <Typography variant="h6" color="textSecondary" sx={{ m: 'auto' }}>
                                Selecione uma candidatura para ver os detalhes
                            </Typography>
                        }
                    </Box>
                </Paper>
            </Modal>

            {/*Modal para o utilizador apagar a própria candidatura */}
            <Modal
                open={isApagarCandidaturaModalOpen}
                onClose={() => setIsApagarCandidaturaModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 550 },
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                        Tem a certeza que pretende elimnar a candidatura?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsApagarCandidaturaModalOpen(false) }
                            sx={{ width: '50%' }}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => { handleApagarCandidatura(selectedCandidaturaUser.id_candidatura); setIsApagarCandidaturaModalOpen(false); handleCloseSelectedCandidaturaUser() }}
                            sx={{ width: '50%' }}
                        >
                            Eliminar
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
        </div >
    )

    function DetalhesCandidaturaUser() {
        const [newFile, setNewFile] = useState([]);

        const [comentarioUser, setComentarioUser] = useState('')

        const [formData, setFormData] = useState(selectedCandidaturaUser);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const formDataToSend = new FormData();

            formDataToSend.append('id_candidatura', formData.id_candidatura);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('telemovel', formData.telemovel);
            formDataToSend.append('responsavel', formData.responsavel);
            formDataToSend.append('resultado', formData.resultado);
            formDataToSend.append('status', formData.status)

            if (newFile) {
                formDataToSend.append('curriculo', newFile);
            }


            handleServices.atualizarCandidatura(formDataToSend)
                .then(res => {
                    enqueueSnackbar("Candidatura atualizada com sucesso", { variant: 'success' });
                    navigate(0);
                })
                .catch(err => {
                    enqueueSnackbar(err, { variant: 'error' });
                })
        };


        return (
            <>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        <div className='d-flex justify-content-between align-items-center'>
                            Detalhes da Candidatura
                            <IconButton onClick={() => setSelectedCandidaturaUser(null)} color="error">
                                <Close />
                            </IconButton>
                        </div>
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                <strong>Data de Submissão:</strong> {selectedCandidaturaUser && convertDate(selectedCandidaturaUser.data_submissao)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                <strong>Estado:</strong>
                                <Chip
                                    label={selectedCandidaturaUser && selectedCandidaturaUser?.status || "Status não disponível"}
                                    color={
                                        selectedCandidaturaUser && selectedCandidaturaUser?.status.includes("Aceite") ? "success" :
                                            selectedCandidaturaUser?.status.includes("Rejeitada") ? "error" : "default"
                                    }
                                    className='mx-1'
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                <TextField
                                    label="Email"
                                    type="text"
                                    name="email"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">
                                <TextField
                                    label="Telemovel"
                                    type="text"
                                    name="telemovel"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={formData.telemovel}
                                    onChange={handleChange}
                                />
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" className='mb-2'>
                                <strong>Currículo:</strong>
                                {selectedCandidaturaUser && selectedCandidaturaUser.curriculo != null ?
                                    <a href={'http://localhost:8080/' + selectedCandidaturaUser.curriculo.replace(/\\/g, '/')} target="_blank">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ ml: 1 }}
                                        >
                                            Abrir currículo
                                        </Button>
                                    </a>
                                    :
                                    <div>
                                        Sem currículo
                                    </div>
                                }
                            </Typography>
                            <FileDropZoneSingle
                                onDrop={(files) => {
                                    if (files && files.length > 0) {
                                        setNewFile(files[0]);
                                    }
                                }}
                                accept={{
                                    'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                    'application/pdf': ['.pdf'],
                                }}
                                maxSize={10 * 1024 * 1024}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Comentários ({comentarios?.length || 0})
                    </Typography>

                    <Box sx={{ mb: 4, maxHeight: '300px', overflowY: 'auto' }}>
                        {comentarios ? (
                            comentarios.map((comentario, index) => (
                                <Card key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" color="primary">
                                            {comentario.perfil.nome}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(comentario.created_at).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {comentario.comentario}
                                    </Typography>
                                </Card>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Nenhum comentário ainda.
                            </Typography>
                        )}
                    </Box>

                    <Box component="form" sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Adicionar Comentário
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            placeholder="Escreva o seu comentário..."
                            sx={{ mb: 2 }}
                            onChange={(value) => setComentarioUser(value.target.value)}
                            value={comentarioUser}
                        />
                        <div className='d-flex justify-content-between align-items-center'>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { handleComentar(comentarioUser, 'user'); setComentarioUser("") }}
                            >
                                Enviar Comentário
                            </Button>
                            <div>
                                {selectedCandidaturaUser && selectedCandidaturaUser.status.includes("Pendente") &&
                                    <button className='btn btn-danger' onClick={() => { setIsApagarCandidaturaModalOpen(true) }}>Apagar candidatura</button>
                                }
                                <button className='btn btn-success mx-1' onClick={handleSubmit}>Guardar</button>
                            </div>
                        </div>
                    </Box>
                </Box>
            </>
        )
    }
}
