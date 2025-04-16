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
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SidebarItems from './SidebarItems';

export default function FaltasUtilizadores() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [faltas, setFaltas] = useState([])

    const [selectedFalta, setSelectedFalta] = useState(null)

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

    useEffect(() => {
        const openFalta = sessionStorage.getItem('openFalta');
        if (openFalta) {
            faltas.map((falta) => {
                console.log(falta.id_falta)
                console.log(openFalta)
                if (falta.id_falta == openFalta) {
                    setSelectedFalta(falta)
                }
            })
        }
    }, [faltas])

    useEffect(() => {
        if (selectedFalta) {
            const openFalta = sessionStorage.getItem('openFalta');
            if (openFalta) {
                sessionStorage.removeItem('openFalta');
            }
        }
    }, [selectedFalta])

    const handleCloseVerDetalhes = () => {
        setSelectedFalta(null)
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

    function carregarFaltas() {
        handleServices.carregarFaltas()
            .then(res => {
                setFaltas(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as faltas: " + err)
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
                        <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Ver faltas de utilizadores</h2>
                        <div className='row'>
                            <ListFaltas></ListFaltas>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver os detalhes de uma falta */}
            <Modal
                open={selectedFalta}
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
                    <Button onClick={handleCloseVerDetalhes} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>
        </div>
    );

    function ListFaltas() {
        return (
            <TableContainer component={Box} sx={{ pl: 0 }}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nome</TableCell>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Anexo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faltas.map((falta) => (
                            <TableRow key={falta.id_falta} >
                                <TableCell align="left">{falta.perfil.nome}</TableCell>
                                <TableCell align="left">{convertDate(falta.data_falta)}</TableCell>
                                <TableCell align="left">{falta.justificacao ? <a href={falta.justificacao} target="_blank"><button className='btn btn-outline-primary'>Abrir</button></a> : "Sem justificação"}</TableCell>
                                <TableCell align="left"><Chip label={falta.estado} size='10px' color={getShadowClass(falta.estado)}></Chip></TableCell>
                                <TableCell align="right"><button className='btn btn-secondary' onClick={() => setSelectedFalta(falta)}>Ver detalhes</button></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    function DetalhesFalta({ falta }) {
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
            formDataToSend.append('validador', id_perfil);
            formDataToSend.append('data_falta', formData.data_falta);
            formDataToSend.append('estado', formData.estado);

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
                </div>
                <div className="mb-4">
                    <label><strong>Motivo:</strong></label>
                    <Typography>{formData.motivo}</Typography>
                </div>

                <label><strong>Informações:</strong></label>
                <div className="my-3">
                    <TextField
                        label="Data"
                        type="date"
                        name="data"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.data_falta}
                        onChange={handleChange}
                        disabled={formData.estado != "Pendente"}
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
                    <FormControl fullWidth disabled={formData.estado == "Pendente"}>
                        <InputLabel shrink>Estado</InputLabel>
                        <Select
                            label="Estado"
                            name="estado"
                            value={formData.estado || ''}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value={"Rejeitada"}>Rejeitada</MenuItem>
                            <MenuItem value={"Aprovada"}>Aprovada</MenuItem>
                            {formData.estado == "Pendente" && <MenuItem value={"Pendente"}>Pendente</MenuItem>}
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
                        disabled={formData.estado == "Pendente"}
                    />
                </div>


                <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                    Justificar
                </button>
            </form>
        );
    }
}
