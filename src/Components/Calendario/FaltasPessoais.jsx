import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField } from '@mui/material';
import FileDropZone from '../../Universal/FileDropZoneSingle'
import SidebarItems from './SidebarItems';
import FaltasPieChart from './FaltasPieChart';

export default function FaltasPessoais() {
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
            handleServices.carregarFaltasPessoais(id_perfil)
                .then(res => {
                    setFaltas(res);
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar as faltas: " + err)
                })
        }
    }, [id_perfil])

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

    function convertDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }

    function getQuantidadeFaltas(tipo, faltas){
        let count = 0;
        faltas.map((falta) => {
            if(falta.estado == tipo){
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
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto' }}>
                        <SidebarItems tipo_user={tipo_user}></SidebarItems>
                    </div>


                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Faltas</h2>
                        <div className='row'>
                            <div className='col-md-3'>
                                <Paper elevation={3} sx={{
                                    p: 2,
                                    height: '100%',
                                    minHeight: '70vh',
                                    borderRadius: '12px',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {faltas.length > 0 ? (
                                        <>
                                            <FaltasPieChart faltas={faltas} />
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
                                                            <TableCell align="left">{getQuantidadeFaltas('Pendente', faltas)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Em análise"} size='10px' color={getShadowClass('Em análise')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFaltas('Em análise', faltas)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Rejeitada"} size='10px' color={getShadowClass('Rejeitada')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFaltas('Rejeitada', faltas)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left"><Chip label={"Aprovada"} size='10px' color={getShadowClass('Aprovada')} /></TableCell>
                                                            <TableCell align="left">{getQuantidadeFaltas('Aprovada', faltas)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </>
                                    ) : (
                                        <Typography>Não há faltas registradas</Typography>
                                    )}
                                </Paper>


                            </div>
                            <div className='col-md-9'>

                                <ListFaltas></ListFaltas>
                            </div>
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
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Anexo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faltas.map((falta) => (
                            <TableRow key={falta.id_falta} >
                                <TableCell align="left">{convertDate(falta.data_falta)}</TableCell>
                                <TableCell align="left">{falta.justificacao && <a href={falta.justificacao} target="_blank"><button className='btn btn-outline-primary'>Abrir</button></a>}</TableCell>
                                <TableCell align="left"><Chip label={falta.estado} size='10px' color={getShadowClass(falta.estado)}></Chip></TableCell>
                                <TableCell align="right"><button className='btn btn-secondary' onClick={() => { setSelectedFalta(falta) }}>{falta.estado == "Pendente" ? "Justificar" : "Ver detalhes"}</button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

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

        console.log(formData)

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
}
