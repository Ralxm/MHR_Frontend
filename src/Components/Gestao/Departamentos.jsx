import React, { useEffect, useRef, useState } from 'react';
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

export default function Departamentos() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [departamentos, setDepartamentos] = useState([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [selectedDepartamentoApagar, setSelectedDepartamentoApagar] = useState();

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
        carregarDepartamentos();
    }, []);

    function carregarDepartamentos() {
        handleServices.carregarDepartamentos()
            .then(res => {
                setDepartamentos(res);
            })
            .catch(err => {
                console.log("Erro ao carregar departamentos: " + err);
            });
    }

    const handleDelete = (id) => {
        handleServices.apagarDepartamento(id)
            .then(res => {
                alert(res);
                carregarDepartamentos();
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
                            <h2 style={{ color: '#333', fontWeight: '600', margin: 0 }}>Departamentos</h2>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Criar Novo Departamento
                            </Button>
                        </div>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="departamentos table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Responsável</TableCell>
                                        <TableCell>Descrição</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {departamentos.map((departamento) => (
                                        <TableRow key={departamento.id_departamento}>
                                            <TableCell>{departamento.nome_departamento}</TableCell>
                                            <TableCell>{departamento.responsavel_departamento}</TableCell>
                                            <TableCell>
                                                {departamento.descricao && departamento.descricao.length > 50
                                                    ? `${departamento.descricao.substring(0, 50)}...`
                                                    : departamento.descricao}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedDepartamento(departamento);
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
                                                    onClick={() => setSelectedDepartamentoApagar(departamento)}
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
                                        Editar Departamento: {selectedDepartamento?.nome_departamento}
                                    </Typography>
                                    <IconButton onClick={() => setIsEditModalOpen(false)}>
                                        <Close />
                                    </IconButton>
                                </div>

                                <DepartamentoForm
                                    departamento={selectedDepartamento}
                                    onClose={() => setIsEditModalOpen(false)}
                                    refresh={carregarDepartamentos}
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

                                <DepartamentoForm
                                    onClose={() => setIsCreateModalOpen(false)}
                                    refresh={carregarDepartamentos}
                                    mode="create"
                                />
                            </Paper>
                        </Modal>

                        {/* Modal para apagar um departamento */}
                        <Modal
                            open={selectedDepartamentoApagar}
                            onClose={() => setSelectedDepartamentoApagar(null)}
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
                                        Tem a certeza que pretende apagar o departamento?
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => { setSelectedDepartamentoApagar(null) }}
                                            sx={{ width: '50%' }}
                                        >
                                            Fechar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => { handleDelete(selectedDepartamentoApagar.id_departamento); setSelectedDepartamentoApagar(null) }}
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

function DepartamentoForm({ departamento, onClose, refresh, mode }) {
    const [formData, setFormData] = useState({
        nome_departamento: '',
        descricao: '',
        responsavel_departamento: ''
    });

    useEffect(() => {
        if (mode === 'edit' && departamento) {
            setFormData({
                nome_departamento: departamento.nome_departamento,
                descricao: (departamento.descricao).trim(),
                responsavel_departamento: (departamento.responsavel_departamento).trim()
            });
        }
    }, [departamento, mode]);

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
                const datapost = {
                    nome_departamento: formData.nome_departamento,
                    descricao: formData.descricao,
                    responsavel_departamento: formData.responsavel_departamento
                }
                response = await handleServices.criarDepartamento(datapost);
            } else {
                response = await handleServices.atualizarDepartamento({
                    id_departamento: departamento.id_departamento,
                    ...formData
                });
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
                    name="nome_departamento"
                    label="Nome do Departamento"
                    value={formData.nome_departamento}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    name="responsavel_departamento"
                    label="Responsável"
                    value={formData.responsavel_departamento}
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