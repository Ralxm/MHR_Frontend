import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField, Stack } from '@mui/material';
import SidebarItems from './SidebarItems';
import FeriasPieChart from './FeriasPieChart';
import { useSnackbar } from 'notistack';

export default function FeriasPessoais() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

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
            handleServices.listFerias(id_perfil)
                .then(res => {
                    setFerias(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas: " + err)
                })
        }
    }, [id_perfil])

    function carregarFerias() {
        handleServices.listFerias(id_perfil)
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

    function formatDateTime(isoString) {
        return isoString.replace('T', ' ').split('.')[0];
    }

    function handleApagarFeria(event) {
        event.preventDefault();
        handleServices.apagarFeria(selectedFeriaApagar.id_solicitacao)
            .then(res => {
                enqueueSnackbar("Pedido de férias apagado com sucesso", { variant: 'success' });
                carregarFerias();
                handleCloseApagar();
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
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
                        <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Férias</h2>
                        <div className='row'>
                            <div className='col-md-3'>
                                <Paper elevation={3} sx={{
                                    p: 2,
                                    height: '100%',
                                    minHeight: '70vh',
                                    borderRadius: '12px',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {ferias.length > 0 ? (
                                        <>
                                            <FeriasPieChart ferias={ferias} />
                                            <TableContainer component={Box} sx={{ pl: 0, mt: 3 }}>
                                                <Table aria-label="simple table" className="disable-edge-padding">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="left">Estado</TableCell>
                                                            <TableCell align="left">Quantidade</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Pendente"} size='10px' color={getShadowClass('Pendente')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFerias('Pendente', ferias)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Em análise"} size='10px' color={getShadowClass('Em análise')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFerias('Em análise', ferias)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Rejeitada"} size='10px' color={getShadowClass('Rejeitada')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFerias('Rejeitada', ferias)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Aprovada"} size='10px' color={getShadowClass('Aprovada')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFerias('Aprovada', ferias)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </>
                                    ) : (
                                        <Typography>Não há faltas registadas</Typography>
                                    )}
                                </Paper>


                            </div>
                            <div className='col-md-9'>

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
                        Detalhes da Falta
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
                        {ferias.map((feria) => (
                            <TableRow key={feria.id_falta} >
                                <TableCell align="left">{formatDateTime(feria.data_pedido)}</TableCell>
                                <TableCell align="left">{convertDate(feria.data_inicio)}</TableCell>
                                <TableCell align="left">{convertDate(feria.data_conclusao)}</TableCell>
                                <TableCell align="left">{feria.duracao} {feria.duracao > 1 ? "dias" : "dia"} </TableCell>
                                <TableCell align="left"><Chip label={feria.estado} size='10px' color={getShadowClass(feria.estado)}></Chip></TableCell>
                                <TableCell align="right">
                                    {feria.estado == "Pendente" && <button className='btn btn-outline-danger mx-2' onClick={() => { setSelectedFeriaApagar(feria) }}>Apagar</button>}
                                    <button className='btn btn-secondary' onClick={() => { setSelectedFeria(feria) }}>Ver detalhes</button>
                                </TableCell>
                            </TableRow>
                        ))}
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

            const formDataToSend = new FormData();

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
                    enqueueSnackbar(res.message, { variant: 'success' });
                    carregarFerias();
                    handleCloseVerDetalhes();
                })
                .catch(err => {
                    enqueueSnackbar(err, { variant: 'error' });
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
                        value={formData.validador ? formData.perfilValidador.nome : "Sem validador"}
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
                    Guardar
                </button>
            </form>
        );
    }
}
