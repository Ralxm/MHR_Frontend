import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import SidebarItems from './SidebarItems';
import FaltasPieChart from './FaltasPieChart';
import FeriasPieChart from './FeriasPieChart';
import FileDropZone from '../../Universal/FileDropZoneSingle';

export default function Calendario() {
    const navigate = useNavigate();

    const [isLoadingFaltasFerias, setLoadingFaltasFerias] = useState(false)

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const [tab, setTab] = useState('1')

    const [isLoading, setIsLoading] = useState(true)

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [faltas, setFaltas] = useState([])
    const [ferias, setFerias] = useState([])

    const [calendario, setCalendario] = useState()
    const [dias_restantes_ferias, setDias_Restantes_Ferias] = useState();

    const [tipos_falta, setTipos_Falta] = useState([])

    const [selectedFalta, setSelectedFalta] = useState(null)
    const [selectedFeria, setSelectedFeria] = useState(null)
    const [selectedFeriaApagar, setSelectedFeriaApagar] = useState(null)

    const [isCriarFaltaModalOpen, setIsCriarFaltaModalOpen] = useState(false)
    const [isCriarFeriaModalOpen, setIsCriarFeriaModalOpen] = useState(false)

    {/* Criação de uma féria */ }
    const [data_inicio, setData_Inicio] = useState();
    const [data_conclusao, setData_Conclusao] = useState();
    const [duracao, setDuracao] = useState(0);

    {/* Criação de uma falta */ }
    const [tipo_falta, setTipo_Falta] = useState()
    const [data_falta, setData_Falta] = useState()
    const [motivo, setMotivo] = useState('')

    const handleCloseVerDetalhesFeria = () => {
        setSelectedFeria(null)
    }

    const handleCloseApagarFeria = () => {
        setSelectedFeriaApagar(null)
    }

    const handleCloseVerDetalhesFalta = () => {
        setSelectedFalta(null)
    }

    const handleCloseCriarFalta = () => {
        setIsCriarFaltaModalOpen(false)
    }

    const handleCloseCriarFeria = () => {
        setIsCriarFeriaModalOpen(false)
    }

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
                handleServices.getCalendario(id_perfil)
                    .then(res => {
                        setCalendario(res[0]);
                    })
                    .catch(err => {
                        console.log("Não foi possivel encontrar as faltas do utilizador: " + err)
                    })
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
            }
        }
        catch {

        }
        finally {
            setLoadingFaltasFerias(false)
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
    }, [data_conclusao])

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
    }, [data_inicio])

    useEffect(() => {
        if (calendario && ferias) {
            const anoAtual = new Date().getFullYear();
            let totalDuracao = 0;

            ferias.forEach((feria) => {
                if (feria.estado === "Aprovada") {
                    const ano = new Date(feria.data_inicio).getFullYear();
                    if (ano === anoAtual) {
                        totalDuracao += feria.duracao;
                    }
                }
            });

            setDias_Restantes_Ferias(calendario.dias_ferias_ano_atual - totalDuracao);
            setIsLoading(false);
        }
    }, [ferias]);

    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aprovada":
                return "success";
            case "Em análise":
                return "warning";
            case "Rejeitada":
                return "error";
            default:
                return "";
        }
    };

    function convertDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }

    function handleApagarFeria(event) {
        event.preventDefault();
        handleServices.apagarFeria(selectedFeriaApagar.id_solicitacao)
            .then(res => {
                alert("Pedido de ferias apagado com sucesso")
                navigate(0)
            })
            .catch(err => {
                console.log("Erro a apagar a despesa: " + err);
            });
    }

    function handleCriarFerias(event) {
        event.preventDefault();

        const datapost = {
            id_perfil: id_perfil,
            id_calendario: calendario.id_calendario,
            data_inicio: data_inicio,
            data_conclusao: data_conclusao,
            duracao: duracao,
        }

        console.log(datapost)

        if (new Date(data_inicio) > new Date(data_conclusao)) {
            alert("O dia final não pode ser antes do dia de ínicio!!!")
            return;
        }
        else if (duracao >= dias_restantes_ferias) {
            alert("Não tem dias de férias suficientes");
            return;
        }

        handleServices.createFerias(datapost)
            .then(res => {
                alert(res)
                navigate(0)
            })
            .catch(err => {
                console.log(err)
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
                <div className="container-fluid">
                    <div className='row d-flex justify-content-between'>
                        {(tipo_user == 1 || tipo_user == 2) &&
                            <div className='col-md-2'>
                                <div className="sidebar" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                                    <SidebarItems tipo_user={tipo_user}></SidebarItems>
                                </div>

                            </div>
                        }
                        <div className={(tipo_user == 1 || tipo_user == 2) ? 'col-md-10 mt-3' : 'col-md-12 mt-3'}>
                            {/* DIV COM OS DOIS CARDS COM INFORMAÇÕES DE FÉRIAS E FALTAS */}
                            <div className='row d-flex'>
                                <div className="col-md-6">
                                    <div className='items-container' style={{ height: '40svh' }}>
                                        <div className='row'>
                                            <div className='col d-flex justify-content-between align-items-center'>
                                                <span><strong>Faltas</strong></span>
                                                <button className='btn btn-primary' onClick={() => setIsCriarFaltaModalOpen(true)}>Criar Falta</button>
                                            </div>
                                        </div>
                                        {/* DIV COM O CARD DAS FALTAS */}
                                        <div className='row mt-3'>
                                            <div className='col-md-4' >
                                                <FaltasPieChart faltas={faltas}></FaltasPieChart>
                                            </div>
                                            <div className='col-md-8' style={{ height: '30svh', overflowY: 'auto' }}>
                                                <TableContainer component={Box} sx={{ pl: 0 }}>
                                                    <Table sx={{ minWidth: 500 }} aria-label="simple table" className="disable-edge-padding">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Data</TableCell>
                                                                <TableCell align="left">Anexo</TableCell>
                                                                <TableCell align="left">Estado</TableCell>
                                                                <TableCell align="right"></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {faltas.map((falta) => {
                                                                if (falta.estado == "Pendente" || falta.estado == "Em análise") {
                                                                    return (
                                                                        <TableRow key={falta.id_falta} >
                                                                            <TableCell align="left">{convertDate(falta.data_falta)}</TableCell>
                                                                            <TableCell align="left">{falta.justificacao && <a href={falta.justificacao} target="_blank"><button className='btn btn-outline-primary'>Abrir</button></a>}</TableCell>
                                                                            <TableCell align="left"><Chip label={falta.estado} size='10px' color={getShadowClass(falta.estado)}></Chip></TableCell>
                                                                            <TableCell align="right"><button className='btn btn-secondary' onClick={() => { setSelectedFalta(falta) }}>{falta.estado == "Pendente" ? "Justificar" : "Ver detalhes"}</button></TableCell>
                                                                        </TableRow>
                                                                    )
                                                                }
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-md-6">
                                    <div className='items-container' style={{ height: '40svh' }}>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <span><strong>Férias</strong></span>
                                            <button className='btn btn-primary' onClick={() => setIsCriarFeriaModalOpen(true)}>Marcar Férias</button>
                                        </div>
                                        {/* DIV COM O CARD DAS FERIAS */}
                                        <div className='row mt-3'>
                                            <div className='col-md-4' >
                                                <FeriasPieChart ferias={ferias}></FeriasPieChart>
                                            </div>
                                            <div className='col-md-8' style={{ height: '30svh', overflowY: 'auto' }}>
                                                <TableContainer component={Box} sx={{ pl: 0 }}>
                                                    <Table sx={{ minWidth: 400 }} aria-label="simple table" className="disable-edge-padding">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="left">Data de ínicio</TableCell>
                                                                <TableCell align="left">Data de fim</TableCell>
                                                                <TableCell align="left">Duração</TableCell>
                                                                <TableCell align="left">Estado</TableCell>
                                                                <TableCell align="right"></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {ferias.map((feria) => {
                                                                if (feria.estado == "Aprovada") {
                                                                    return (
                                                                        <TableRow key={feria.id_falta} >
                                                                            <TableCell align="left">{convertDate(feria.data_inicio)}</TableCell>
                                                                            <TableCell align="left">{convertDate(feria.data_conclusao)}</TableCell>
                                                                            <TableCell align="left">{feria.duracao} {feria.duracao > 1 ? "dias" : "dia"} </TableCell>
                                                                            <TableCell align="left"><Chip label={feria.estado} size='10px' color={getShadowClass(feria.estado)}></Chip></TableCell>
                                                                            <TableCell align="right">
                                                                                {feria.estado == "Pendente" && <button className='btn btn-outline-danger mx-2' onClick={() => { setSelectedFeriaApagar(feria) }}>Apagar</button>}
                                                                                <button className='btn btn-secondary' onClick={() => { setSelectedFeria(feria) }}>Ver detalhes</button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                }
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* DIV COM OS SEPARADORES E O CALENDÁRIO */}
                            <div className='row mt-3'>
                                <div className='col'>
                                    <div className='items-container'>
                                        <Box sx={{ width: 1, typography: 'body1' }}>
                                            <TabContext value={tab}>
                                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <TabList onChange={handleChangeTab} aria-label="lab API tabs example" style={{ flexGrow: 1 }}>
                                                            <Tab label="Calendário" value="1" sx={{ textTransform: 'none' }} />
                                                            <Tab label="Faltas" value="2" sx={{ textTransform: 'none' }} />
                                                            <Tab label="Ferias" value="3" sx={{ textTransform: 'none' }} />
                                                        </TabList>
                                                    </div>
                                                </Box>

                                                <TabPanel value="1">
                                                    <div style={{ flex: 1, minHeight: '60svh', background: "white" }}>
                                                        <div className="form-container">
                                                            <h3>Calendário</h3>
                                                            {!isLoadingFaltasFerias && <CalendarComponent faltas={faltas} ferias={ferias} />}
                                                        </div>
                                                    </div>
                                                </TabPanel>

                                                <TabPanel value="2">
                                                    <TableContainer component={Box} sx={{ pl: 0 }}>
                                                        <Table sx={{ minWidth: 500 }} aria-label="simple table" className="disable-edge-padding">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Data</TableCell>
                                                                    <TableCell align="left">Anexo</TableCell>
                                                                    <TableCell align="left">Estado</TableCell>
                                                                    <TableCell align="right"></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {faltas.map((falta) => {
                                                                    return (
                                                                        <TableRow key={falta.id_falta} >
                                                                            <TableCell align="left">{convertDate(falta.data_falta)}</TableCell>
                                                                            <TableCell align="left">{falta.justificacao && <a href={falta.justificacao} target="_blank"><button className='btn btn-outline-primary'>Abrir</button></a>}</TableCell>
                                                                            <TableCell align="left"><Chip label={falta.estado} size='10px' color={getShadowClass(falta.estado)}></Chip></TableCell>
                                                                            <TableCell align="right"><button className='btn btn-secondary' onClick={() => { setSelectedFalta(falta) }}>{falta.estado == "Pendente" ? "Justificar" : "Ver detalhes"}</button></TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </TabPanel>

                                                <TabPanel value="3">
                                                    <TableContainer component={Box} sx={{ pl: 0 }}>
                                                        <Table sx={{ minWidth: 400 }} aria-label="simple table" className="disable-edge-padding">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Data de ínicio</TableCell>
                                                                    <TableCell align="left">Data de fim</TableCell>
                                                                    <TableCell align="left">Duração</TableCell>
                                                                    <TableCell align="left">Estado</TableCell>
                                                                    <TableCell align="right"></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {ferias.map((feria) => {
                                                                    return (
                                                                        <TableRow key={feria.id_falta} >
                                                                            <TableCell align="left">{convertDate(feria.data_inicio)}</TableCell>
                                                                            <TableCell align="left">{convertDate(feria.data_conclusao)}</TableCell>
                                                                            <TableCell align="left">{feria.duracao} {feria.duracao > 1 ? "dias" : "dia"} </TableCell>
                                                                            <TableCell align="left"><Chip label={feria.estado} size='10px' color={getShadowClass(feria.estado)}></Chip></TableCell>
                                                                            <TableCell align="right">
                                                                                {feria.estado == "Pendente" && <button className='btn btn-outline-danger mx-2' onClick={() => { setSelectedFeriaApagar(feria) }}>Apagar</button>}
                                                                                <button className='btn btn-secondary' onClick={() => { setSelectedFeria(feria) }}>Ver detalhes</button>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
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

            {/* Modal para ver os detalhes de uma falta */}
            <Modal
                open={selectedFalta}
                onClose={handleCloseVerDetalhesFalta}
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
                        height: { xs: 500, sm: 850 },
                        borderRadius: 4,
                        p: 4,
                        overflowY: 'scroll'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6">
                        Detalhes da Falta
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {selectedFalta && <DetalhesFalta falta={selectedFalta} />}
                    </Typography>
                    <Button onClick={handleCloseVerDetalhesFalta} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            {/* Modal para ver os detalhes de uma feria */}
            <Modal
                open={selectedFeria}
                onClose={handleCloseVerDetalhesFeria}
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
                        minHeight: { xs: 500, sm: 500 },
                        borderRadius: 4,
                        p: 4,
                        overflowY: 'scroll'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6">
                        Detalhes do pedido de férias
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {selectedFeria && <DetalhesFeria feria={selectedFeria} />}
                    </Typography>
                    <Button onClick={handleCloseVerDetalhesFeria} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            <Modal
                open={selectedFeriaApagar}
                onClose={handleCloseApagarFeria}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 570 },
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                        Tem a certeza que quer eliminar este pedido de férias?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { handleCloseApagarFeria() }}
                            sx={{ width: '50%' }}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => { handleApagarFeria(event); handleCloseApagarFeria() }}
                            sx={{ width: '50%' }}
                        >
                            Apagar
                        </Button>
                    </Stack>
                </Paper>
            </Modal>

            {/* Modal para criar uma feria */}
            <Modal
                open={isCriarFeriaModalOpen}
                onClose={handleCloseCriarFeria}
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
                        height: { xs: 500, sm: 500 },
                        borderRadius: 4,
                        p: 4,
                        overflowY: 'scroll'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6">
                        Marcar férias
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <CriarFeria data_inicio={data_inicio} data_conclusao={data_conclusao} duracao={duracao} />
                    </Typography>
                    <Button onClick={handleCloseCriarFeria} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            {/* Modal para criar uma falta */}
            <Modal
                open={isCriarFaltaModalOpen}
                onClose={handleCloseCriarFalta}
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
                        height: { xs: 500, sm: 600 },
                        borderRadius: 4,
                        p: 4,
                        overflowY: 'scroll'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6">
                        Marcar falta
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <CriarFalta tipo_falta={tipo_falta} data_falta={data_falta} motivo={motivo} />
                    </Typography>
                    <Button onClick={handleCloseCriarFalta} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>
        </div>
    );

    function CalendarComponent({ faltas, ferias }) {
        if (faltas && ferias) {
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

    function DetalhesFalta({ falta }) {
        const [newFile, setNewFile] = useState([]);

        const convertDateToInputFormat = (date) => {
            const datePart = date.split('T')[0];
            return datePart;
        };

        const [formData, setFormData] = useState({
            ...falta,
            data_falta: convertDateToInputFormat(falta.data_falta),
        });

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

            formDataToSend.append('id_falta', formData.id_falta);
            formDataToSend.append('id_calendario', formData.id_calendario);
            formDataToSend.append('id_perfil', formData.id_perfil);
            formDataToSend.append('id_tipofalta', formData.id_tipofalta);

            formDataToSend.append('comentarios', formData.comentarios);
            formDataToSend.append('motivo', formData.motivo);
            formDataToSend.append('validador', formData.validador);
            formDataToSend.append('data_falta', formData.data_falta);
            formDataToSend.append('estado', "Em análise");

            if (newFile) {
                formDataToSend.append('justificacao', newFile)
            }

            handleServices.atualizarFalta(formDataToSend)
                .then(res => {
                    alert("Despesa atualizada com sucesso")
                    navigate(0);
                })
                .catch(err => {
                    console.log(err);
                })
        };


        return (
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label><strong>Nome:</strong>&nbsp;<span>{falta.perfil.nome}</span></label>
                </div>

                <div className="mb-3">
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        <label className="form-label"><strong>Anexo:</strong></label>
                        {falta.justificacao && (
                            <a href={falta.justificacao} target="_blank" rel="noopener noreferrer">
                                <button type="button" className='btn btn-outline-info btn-sm'>Abrir</button>
                            </a>
                        )}
                    </div>

                    <FileDropZone
                        onDrop={(files) => {
                            if (files && files.length > 0) {
                                setNewFile(files[0]);
                            }
                        }}
                        accept={{
                            'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            'application/pdf': ['.pdf'],
                        }}
                        maxSize={5 * 1024 * 1024}
                        multiple={true}
                        disabled={falta.estado == "Aprovada" || falta.estado == "Rejeitada"}
                    />
                </div>
                <div className="mb-4">
                    <TextField
                        label="Motivo"
                        type="text"
                        name="motivo"
                        rows={6}
                        multiline
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.motivo}
                        onChange={handleChange}
                        disabled={falta.estado == "Aprovada" || falta.estado == "Rejeitada"}
                    />
                </div>

                <label><strong>Informações:</strong></label>
                <div className="my-3">
                    <FormControl fullWidth disabled={formData.estado == "Aprovada" || formData.estado == "Rejeitada"}>
                        <InputLabel id="absence-type-label">Tipo de falta</InputLabel>
                        <Select
                            labelId="absence-type-label"
                            label="Tipo de falta"
                            value={formData.id_tipofalta}
                            onChange={(value) => setFormData({ ...formData, id_tipofalta: value.target.value })}
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
                <div className="my-3">
                    <TextField
                        label="Data"
                        type="date"
                        name="data"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.data_falta}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <TextField
                        label="Validador"
                        type="text"
                        name="validador"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.validador ? formData.validadorPerfil.nome : "Sem validador"}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <TextField
                        label="Estado"
                        type="text"
                        name="estado"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.estado}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <TextField
                        label="Comentários"
                        type="text"
                        name="comentarios"
                        rows={6}
                        multiline
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.comentarios}
                        onChange={handleChange}
                        disabled
                    />
                </div>


                <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                    Justificar
                </button>
            </form>
        );
    }

    function DetalhesFeria({ feria }) {
        const convertDateToInputFormat = (date) => {
            const datePart = date.split('T')[0];
            return datePart;
        };

        const [formData, setFormData] = useState({
            ...feria,
            data_inicio: convertDateToInputFormat(feria.data_inicio),
            data_conclusao: convertDateToInputFormat(feria.data_conclusao),
            data_pedido: convertDateToInputFormat(feria.data_pedido),
        });

        useEffect(() => {
            if (formData.data_conclusao && formData.data_inicio) {
                const startDate = new Date(formData.data_inicio);
                const endDate = new Date(formData.data_conclusao);

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
                setFormData(prevFormData => ({
                    ...prevFormData,
                    duracao: businessDays
                }));
            }
        }, [formData.data_conclusao])

        useEffect(() => {
            if (formData.data_conclusao && formData.data_inicio) {
                const startDate = new Date(formData.data_inicio);
                const endDate = new Date(formData.data_conclusao);

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
                setFormData(prevFormData => ({
                    ...prevFormData,
                    duracao: businessDays
                }));
            }
        }, [formData.data_inicio])

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const datapost = {
                id_solicitacao: formData.id_solicitacao,
                data_inicio: formData.data_inicio,
                data_conclusao: formData.data_conclusao,
                duracao: formData.duracao,
                estado: formData.estado,
                validador: formData.validador,
                comentarios: formData.comentarios
            }

            handleServices.atualizarFeria(datapost)
                .then(res => {
                    alert(res)
                    navigate(0);
                })
                .catch(err => {
                    console.log(err);
                })
        };


        return (
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label><strong>Nome:</strong>&nbsp;<span>{feria.perfil.nome}</span></label>
                </div>

                <div className="my-3">
                    {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                        <>
                            <label><strong>Data do pedido:</strong></label>
                            <Typography>
                                {formData.data_pedido}
                            </Typography>
                        </>
                        :
                        <TextField
                            label="Data do pedido"
                            type="date"
                            name="data_pedido"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.data_pedido}
                            onChange={handleChange}
                            disabled
                        />
                    }
                </div>
                <div className="my-3">
                    {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                        <>
                            <label><strong>Data de ínicio:</strong></label>
                            <Typography>
                                {formData.data_inicio}
                            </Typography>

                        </>
                        :
                        <TextField
                            label="Data de início"
                            type="date"
                            name="data_inicio"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.data_inicio}
                            onChange={handleChange}
                            disabled={formData.estado == "Aprovada" || formData.estado == "Rejeitada"}
                        />
                    }
                </div>
                <div className="my-3">
                    {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                        <>
                            <label><strong>Data de fim</strong></label>
                            <Typography>
                                {formData.data_conclusao}
                            </Typography>
                        </>
                        :
                        <TextField
                            label="Data de fim"
                            type="date"
                            name="data_conclusao"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.data_conclusao}
                            onChange={handleChange}
                            disabled={formData.estado == "Aprovada" || formData.estado == "Rejeitada"}
                        />
                    }
                </div>
                <div className="mb-3">
                    {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                        <>
                            <label><strong>Validador:</strong></label>
                            <Typography>
                                {formData.validador}
                            </Typography>

                        </>
                        :
                        <TextField
                            label="Validador"
                            type="text"
                            name="validador"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.validador ? formData.validadorPerfil.nome : "Sem validador"}
                            onChange={handleChange}
                            disabled
                        />
                    }
                </div>
                <div className="mb-3">
                    {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                        <>
                            <label><strong>Estado:</strong></label>
                            <Typography>
                                {formData.estado}
                            </Typography>

                        </>
                        :
                        <TextField
                            label="Estado"
                            type="text"
                            name="estado"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.estado}
                            onChange={handleChange}
                            disabled
                        />
                    }
                </div>
                <div className="mb-3">
                    {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                        <>
                            <label><strong>Comentários:</strong></label>
                            <Typography>
                                {formData.comentarios ? formData.comentarios : "Sem comentário"}
                            </Typography>

                        </>
                        :
                        <TextField
                            label="Comentários"
                            type="text"
                            name="comentarios"
                            rows={6}
                            multiline
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.comentarios}
                            onChange={handleChange}
                            disabled
                        />
                    }
                </div>

                {(formData.estado == "Aprovada" || formData.estado == "Rejeitada") ?
                    <></>
                    :
                    <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                        Guardar
                    </button>
                }
            </form>
        );
    }

    function CriarFalta({ tipo_falta, data_falta, motivo }) {
        const [_motivo, set_Motivo] = useState(motivo);
        const [newFile, setNewFile] = useState()

        function handleCriarFalta(event) {
            event.preventDefault()

            const formData = new FormData()

            console.log(formData)

            formData.append('id_calendario', calendario.id_calendario);
            formData.append('id_perfil', id_perfil);
            formData.append('id_tipofalta', tipo_falta);

            formData.append('motivo', _motivo);
            formData.append('data_falta', data_falta);
            formData.append('estado', "Pendente");

            if (newFile) {
                formData.append('justificacao', newFile)
            }

            handleServices.createFalta(formData)
                .then(res => {
                    alert(res)
                    navigate(0)
                })
                .catch(err => {
                    console.log(err)
                })
        }

        return (
            <div>
                <form>
                    <Stack spacing={2} className='mt-3'>
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

                        <TextField
                            label="Data da falta"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={data_falta}
                            onChange={(value) => { setData_Falta(value.target.value) }}
                        />
                        <TextField
                            label="Motivo"
                            type="text"
                            rows={6}
                            multiline
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={_motivo}
                            onChange={(value) => { set_Motivo(value.target.value) }}
                        />

                        <FileDropZone
                            onDrop={(files) => {
                                if (files && files.length > 0) {
                                    setNewFile(files[0]);
                                }
                            }}
                            accept={{
                                'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                'application/pdf': ['.pdf'],
                            }}
                            maxSize={5 * 1024 * 1024}
                            multiple={true}
                        />

                        <Button variant="contained" color="primary" onClick={handleCriarFalta}>
                            Criar
                        </Button>
                    </Stack>
                </form>
            </div>
        )
    }

    function CriarFeria({ data_inicio, data_conclusao, duracao }) {
        return (
            <div>
                <div className='d-flex justify-content-center align-items-center'>
                    <div className='mb-3' style={{ backgroundColor: '#e9f7fe', padding: '10px' }}>
                        <h3><strong>Saldo de férias: {isLoading ? "A calcular" : dias_restantes_ferias}</strong></h3>
                    </div>

                </div>

                <form>
                    <Stack spacing={2} className='mt-3'>
                        <TextField
                            label="Data de ínicio"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={data_inicio}
                            onChange={(value) => { setData_Inicio(value.target.value) }}
                        />
                        <TextField
                            label="Data de fim"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={data_conclusao}
                            onChange={(value) => { setData_Conclusao(value.target.value) }}
                        />

                        <Typography variant='h6' className='my-3'>
                            Total de dias que as férias vão ocupar: {duracao}
                        </Typography>


                        <Button variant="contained" color="primary" onClick={handleCriarFerias}>
                            Criar
                        </Button>
                    </Stack>
                </form>
            </div>
        )
    }
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





