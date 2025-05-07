import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TableCell, Table, TableContainer, TableHead, TableRow, TableBody, MenuItem, IconButton, Chip, TextField, Stack, FormControl, Label, Select, InputLabel } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Delete, Close } from '@mui/icons-material'
import FileDropZone from '../../Universal/FileDropZoneSingle';
import SidebarItems from './SidebarItems';

export default function TiposFalta() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [tipos_faltas, setTipos_Faltas] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [selectedTipoApagar, setSelectedTipoApagar] = useState();

    useEffect(() => {
        document.title = "Tipos de falta";

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
        carregarTiposFaltas();
    }, []);

    function carregarTiposFaltas() {
        handleServices.listTipoFaltas()
            .then(res => {
                setTipos_Faltas(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleDelete = (id) => {
        handleServices.apagarTipoFalta(id)
            .then(res => {
                alert(res);
                carregarTiposFaltas();
            })
            .catch(err => {
                console.log(err);
            });

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
                <div style={{ display: 'flex', height: 'calc(100vh - [navbar-height])' }}>
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <SidebarItems tipo_user={localStorage.getItem('tipo')}></SidebarItems>
                    </div>

                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h2 style={{ color: '#333', fontWeight: '600', margin: 0 }}>Tipos de Falta</h2>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Criar tipo de falta
                            </Button>
                        </div>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="departamentos table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tipo</TableCell>
                                        <TableCell align='left'>Descrição</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tipos_faltas.map((tipo) => (
                                        <TableRow key={tipo.id_tipofalta}>
                                            <TableCell>{tipo.tipo}</TableCell>
                                            <TableCell align='left'>{tipo.descricao}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedTipo(tipo);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    onClick={() => setSelectedTipoApagar(tipo)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Modal para editar um departamento */}
                        <Modal
                            open={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            aria-labelledby="edit-departamento-modal-title"
                        >
                            <Paper
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: { xs: '90%', sm: '80%', md: '600px' },
                                    maxHeight: '90vh',
                                    overflow: 'auto',
                                    borderRadius: 4,
                                    p: 4,
                                }}
                            >
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <Typography variant="h6" component="h2">
                                        Editar Tipo de Falta: {selectedTipo?.tipo}
                                    </Typography>
                                    <IconButton onClick={() => setIsEditModalOpen(false)}>
                                        <Close />
                                    </IconButton>
                                </div>

                                <TipoFaltaForm
                                    tipo={selectedTipo}
                                    onClose={() => setIsEditModalOpen(false)}
                                    refresh={carregarTiposFaltas}
                                    mode="edit"
                                />
                            </Paper>
                        </Modal>

                        {/* Modal para criar um departamento */}
                        <Modal
                            open={isCreateModalOpen}
                            onClose={() => setIsCreateModalOpen(false)}
                            aria-labelledby="create-departamento-modal-title"
                        >
                            <Paper
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: { xs: '90%', sm: '80%', md: '600px' },
                                    maxHeight: '90vh',
                                    overflow: 'auto',
                                    borderRadius: 4,
                                    p: 4,
                                }}
                            >
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <Typography variant="h6" component="h2">
                                        Criar Novo Departamento
                                    </Typography>
                                    <IconButton onClick={() => setIsCreateModalOpen(false)}>
                                        <Close />
                                    </IconButton>
                                </div>

                                <TipoFaltaForm
                                    onClose={() => setIsCreateModalOpen(false)}
                                    refresh={carregarTiposFaltas}
                                    mode="create"
                                />
                            </Paper>
                        </Modal>

                        {/* Modal para apagar um departamento */}
                        <Modal
                            open={selectedTipoApagar}
                            onClose={() => setSelectedTipoApagar(null)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Paper
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: { xs: 300, sm: 600 },
                                    borderRadius: 4,
                                    p: 4,
                                    display: 'flex'
                                }}
                                className='row'
                            >
                                <Box className='col-md-12'>
                                    <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                                        Tem a certeza que pretende apagar o tipo de falta?
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => { setSelectedTipoApagar(null) }}
                                            sx={{ width: '50%' }}
                                        >
                                            Fechar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => { handleDelete(selectedTipoApagar.id_tipofalta); setSelectedTipoApagar(null) }}
                                            sx={{ width: '50%' }}
                                        >
                                            Apagar
                                        </Button>
                                    </Stack>
                                </Box>
                            </Paper>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TipoFaltaForm({ tipo, onClose, refresh, mode }) {
    const [formData, setFormData] = useState({
        id_tipofalta: '',
        tipo: '',
        descricao: '',
    });

    useEffect(() => {

        if (mode == 'edit' && tipo) {
            setFormData({
                id_tipofalta: tipo.id_tipofalta,
                tipo: tipo.tipo,
                descricao: (tipo.descricao).trim(),
            });
        }
    }, [tipo, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (mode === 'create') {
                response = await handleServices.criarTipoFalta(formData);
            } else {
                response = await handleServices.atualizarTipoFalta(formData.id_tipofalta, formData);
            }

            alert(response);
            refresh();
            onClose();
        } catch (err) {
            console.error(err);

        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    name="tipo"
                    label="Tipo de falta"
                    value={formData.tipo}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    name="descricao"
                    label="Descrição"
                    value={formData.descricao}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {mode === 'create' ? 'Criar' : 'Guardar Alterações'}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
}