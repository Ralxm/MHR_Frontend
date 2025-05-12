import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TableCell, Table, TableContainer, TableHead, TableRow, TableBody, IconButton, TextField, Stack, Tooltip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Close } from '@mui/icons-material'
import SidebarItems from './SidebarItems';
import { useSnackbar } from 'notistack';

export default function Feriados() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [feriados, setFeriados] = useState([]);
    const [selectedFeriado, setSelectedFeriado] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [selectedFeriadoApagar, setSelectedFeriadoApagar] = useState();

    useEffect(() => {
        document.title = "Feriados";

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
        carregarFeriados();
    }, []);

    function carregarFeriados() {
        handleServices.carregarFeriados()
            .then(res => {
                setFeriados(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleDelete = (id) => {
        handleServices.apagarFeriado(id)
            .then(res => {
                enqueueSnackbar(res, { variant: 'success' });
                carregarFeriados();
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
            });
    };

    function formatDateToPortuguese(dateString) {
        if (!dateString) return '';

        const monthsPT = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril',
            'Maio', 'Junho', 'Julho', 'Agosto',
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const monthName = monthsPT[date.getMonth()];

        return `${day}-${month} (${day} de ${monthName})`;
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
                            <div className='d-flex align-items-center'>
                                <h2 style={{ color: '#333', fontWeight: '600', margin: 0 }}>Feriados</h2>
                                <Tooltip
                                    title="A criação de um feriado inclui a escolha de um ano. Este, no entanto, é irrelevante para o funcionamento da aplicação. Poderá escolher qualquer ano."
                                    placement="right"
                                    arrow
                                    className='mx-2 mt-2'
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}>
                                        !
                                    </div>
                                </Tooltip>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Criar feriado
                            </Button>
                        </div>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="departamentos table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Data</TableCell>
                                        <TableCell>Tipo</TableCell>
                                        <TableCell align='right'>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {feriados.map((feriado) => (
                                        <TableRow key={feriado.id_feriado}>
                                            <TableCell>{feriado.nome}</TableCell>
                                            <TableCell>{formatDateToPortuguese(feriado.data_feriado)}</TableCell>
                                            <TableCell>{feriado.tipo}</TableCell>
                                            <TableCell align='right'>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => {
                                                        setSelectedFeriado(feriado);
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
                                                    onClick={() => setSelectedFeriadoApagar(feriado)}
                                                >
                                                    Apagar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Modal para editar um feriado */}
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
                                        Editar Feriado: {selectedFeriado?.nome}
                                    </Typography>
                                    <IconButton onClick={() => setIsEditModalOpen(false)}>
                                        <Close />
                                    </IconButton>
                                </div>

                                <FeriadoForm
                                    feriado={selectedFeriado}
                                    onClose={() => setIsEditModalOpen(false)}
                                    refresh={carregarFeriados}
                                    mode="edit"
                                    enqueueSnackbar={enqueueSnackbar}
                                />
                            </Paper>
                        </Modal>

                        {/* Modal para criar um feriado */}
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
                                        Criar Novo Feriado
                                    </Typography>
                                    <IconButton onClick={() => setIsCreateModalOpen(false)}>
                                        <Close />
                                    </IconButton>
                                </div>

                                <FeriadoForm
                                    onClose={() => setIsCreateModalOpen(false)}
                                    refresh={carregarFeriados}
                                    mode="create"
                                    enqueueSnackbar={enqueueSnackbar}
                                />
                            </Paper>
                        </Modal>

                        {/* Modal para apagar um departamento */}
                        <Modal
                            open={selectedFeriadoApagar}
                            onClose={() => setSelectedFeriadoApagar(null)}
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
                                        Tem a certeza que pretende apagar o feriado?
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => { setSelectedFeriadoApagar(null) }}
                                            sx={{ width: '50%' }}
                                        >
                                            Fechar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => { handleDelete(selectedFeriadoApagar.id_feriado); setSelectedFeriadoApagar(null) }}
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

function FeriadoForm({ feriado, onClose, refresh, mode, enqueueSnackbar }) {
    const [formData, setFormData] = useState({
        id_feriado: '',
        nome: '',
        data_feriado: '',
        tipo: ""
    });

    console.log(feriado)

    useEffect(() => {
        if (mode == 'edit' && feriado) {
            setFormData({
                id_feriado: feriado.id_feriado,
                nome: feriado.nome,
                data_feriado: feriado.data_feriado,
                tipo: feriado.tipo
            });
        }
    }, [feriado, mode]);

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
                response = await handleServices.criarFeriado(formData);
            } else {
                response = await handleServices.atualizarFeriado(formData.id_feriado, formData);
            }

            enqueueSnackbar(response, { variant: 'success' });
            refresh();
            onClose();
        } catch (err) {
            enqueueSnackbar(err, { variant: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    name="nome"
                    label="Nome do feriado"
                    value={formData.nome}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    name="data_feriado"
                    label="Data do feriado"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.data_feriado}
                    onChange={handleChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel id="absence-type-label">Tipo de feriado</InputLabel>
                    <Select
                        name="tipo"
                        label="Tipo de feriado"
                        value={formData.tipo}
                        onChange={handleChange}
                    >
                        <MenuItem value={"Fixo"}>Fixo</MenuItem>
                        <MenuItem value={"Móvel"}>Móvel</MenuItem>
                    </Select>
                </FormControl>

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