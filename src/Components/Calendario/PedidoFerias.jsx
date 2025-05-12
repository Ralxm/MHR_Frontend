import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SidebarItems from './SidebarItems';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

export default function PedidosFerias() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [ferias, setFerias] = useState([])

    const [selectedFeria, setSelectedFeria] = useState(null)
    const [selectedFeriaApagar, setSelectedFeriaApagar] = useState(null)

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
        carregarFerias();
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

    function carregarFerias() {
        handleServices.carregarFerias()
            .then(res => {
                setFerias(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as faltas: " + err)
            })
    }

    const handleCloseVerDetalhes = () => {
        setSelectedFeria(null)
    }

    const handleCloseApagar = () => {
        setSelectedFeriaApagar(null)
    }

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
                carregarFerias();
                handleCloseApagar();
            })
            .catch(err => {
                console.log("Erro a apagar a despesa: " + err);
            });
    }

    function getQuantidadeFerias(tipo, ferias) {
        let count = 0;
        ferias.map((feria) => {
            if (feria.estado == tipo) {
                count++;
            }
        })
        return count;
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
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <SidebarItems tipo_user={tipo_user}></SidebarItems>
                    </div>


                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Pedidos de férias</h2>
                        <div className='row'>
                            <div className='col-md-6'>
                                <CalendarComponent ferias={ferias}></CalendarComponent>
                            </div>
                            <div className='col-md-6'>

                                <ListFerias></ListFerias>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver os detalhes de uma feria */}
            <Modal
                open={selectedFeria}
                onClose={handleCloseVerDetalhes}
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
                        maxHeight: { xs: 500, sm: 850 },
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
                    <Button onClick={handleCloseVerDetalhes} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            <Modal
                open={selectedFeriaApagar}
                onClose={handleCloseApagar}
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
                            onClick={() => { handleCloseApagar() }}
                            sx={{ width: '50%' }}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => { handleApagarFeria(event); handleCloseApagar() }}
                            sx={{ width: '50%' }}
                        >
                            Apagar
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    );

    function ListFerias() {
        return (
            <TableContainer component={Box} sx={{ pl: 0 }}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Data do pedido</TableCell>
                            <TableCell align="left">Data de ínicio</TableCell>
                            <TableCell align="left">Data de fim</TableCell>
                            <TableCell align="left">Duração</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ferias.map((feria) => {
                            if (feria.estado == "Pendente" || feria.estado == "Em análise") {
                                return (
                                    <TableRow key={feria.id_falta} >
                                        <TableCell align="left">{convertDate(feria.data_pedido)}</TableCell>
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
        )
    }

    function DetalhesFeria({ feria }) {
        console.log(feria)
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
                validador: id_perfil,
                comentarios: formData.comentarios,
            }

            handleServices.atualizarFeria(datapost)
                .then(res => {
                    alert("Pedido de férias atualizado com sucesso")
                    carregarFerias();
                    handleCloseVerDetalhes();
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
                </div>
                <div className="my-3">
                    <TextField
                        label="Data de início"
                        type="date"
                        name="data_inicio"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.data_inicio}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="my-3">
                    <TextField
                        label="Data de fim"
                        type="date"
                        name="data_conclusao"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.data_conclusao}
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
                        value={formData.validador ? formData.validador : "Sem validador"}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <FormControl fullWidth>
                        <InputLabel shrink>Estado</InputLabel>
                        <Select
                            label="Estado"
                            name="estado"
                            InputLabelProps={{ shrink: true }}
                            onChange={handleChange}
                            value={formData.estado}
                        >
                            <MenuItem value={"Aprovada"}>Aprovada</MenuItem>
                            <MenuItem value={"Pendente"}>Pendente</MenuItem>
                            <MenuItem value={"Rejeitada"}>Rejeitada</MenuItem>
                        </Select>
                    </FormControl>
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
                    />
                </div>


                <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                    Guardar
                </button>
            </form>
        );
    }

    function CalendarComponent({ ferias }) {
        if (ferias) {
            moment.locale("pt")
            const localizer = momentLocalizer(moment);
            const events = transformFeriasToEvents(ferias);

            const eventPropGetter = (event) => {
                let backgroundColor = '';
                switch (event.resource.estado) {
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
}

function transformFeriasToEvents(ferias) {
    const eventos = [];

    const feriasEvents = ferias.map((feria) => ({
        title: 'Férias: ' + feria.perfil.nome,
        start: new Date(moment(feria.data_inicio, "YYYY-MM-DD").toDate()),
        end: new Date(moment(feria.data_conclusao).toDate() + 1),
        allDay: true,
        resource: feria,
    }));

    eventos.push(...feriasEvents);

    return eventos;
};

