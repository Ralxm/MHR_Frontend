import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Gestao.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TableCell, Table, TableContainer, TableHead, TableRow, TableBody, MenuItem, IconButton, Chip, TextField, Stack, FormControl, Select, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import { Close } from '@mui/icons-material'
import SidebarItems from './Sidebar';
import { useSnackbar } from 'notistack';

export default function Utilizadores() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [utilizadores, setUtilizadores] = useState([]);
    const [candidaturas, setCandidaturas] = useState([])
    const [perfis, setPerfis] = useState([])
    const [departamentos, setDepartamentos] = useState([])

    const [filtro, setFiltro] = useState('todos');

    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [isCreatePerfilModalOpen, setIsCreatePerfilModalOpen] = useState(false);
    const [userCandidaturas, setUserCandidaturas] = useState([]);
    const [selectedUserEditar, setSelectedUserEditar] = useState(null);
    const [selectedUtilizador, setSelectedUtilizador] = useState(null);

    const filteredUtilizadores = utilizadores.filter(user => {
        if (filtro === 'todos') return true;
        return user.id_tipo.toString() === filtro;
    });

    useEffect(() => {
        document.title = "Informações da empresa"

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

        carregarUtilizadores();
        carregarCandidaturas();
        carregarPerfis();
        carregarDepartamentos();
    }, [])

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

    const handleOpenUserDetails = (user) => {
        setSelectedUser(user);
        setUserCandidaturas(candidaturas.filter(c => c.id_utilizador === user.id_utilizador));
        setIsUserDetailsModalOpen(true);
    };

    const handleOpenCreatePerfil = (user) => {
        setSelectedUser(user);
        setIsCreatePerfilModalOpen(true);
    };

    const handleOpenCandidaturas = (userId) => {
        const userCands = candidaturas.filter(cand => cand.id_utilizador === userId);
        setUserCandidaturas(userCands);
        setSelectedUser(utilizadores.find(u => u.id_utilizador === userId));
    };

    const hasAcceptedCandidaturas = (userId) => {
        return candidaturas.some(c =>
            c.id_utilizador === userId && c.status.includes('Aceite')
        );
    };

    const getPerfilInfo = (userId) => {
        const perfil = perfis.find(p => p.id_utilizador === userId);
        return perfil ? perfil : null;
    };

    const getUserType = (idTipo) => {
        const types = {
            1: 'Admin',
            2: 'Manager',
            3: 'Utilizador Interno',
            4: 'Utilizador Externo',
            5: 'Visitante'
        };
        return types[idTipo] || 'Desconhecido';
    };

    function carregarUtilizadores() {
        handleServices.carregarUtilizadores()
            .then(res => {
                setUtilizadores(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function carregarCandidaturas() {
        handleServices.carregarCandidaturas()
            .then(res => {
                setCandidaturas(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function carregarPerfis() {
        handleServices.carregarPerfis()
            .then(res => {
                setPerfis(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function carregarDepartamentos() {
        handleServices.carregarDepartamentos()
            .then(res => {
                setDepartamentos(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
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
                    {(tipo_user == 1 || tipo_user == 2) &&
                        <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                            <SidebarItems tipo_user={tipo_user}></SidebarItems>
                        </div>
                    }
                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between'>
                            <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Utilizadores</h2>

                            <FormControl sx={{ minWidth: 200 }} size="small">
                                <InputLabel id="user-type-filter-label">Filtrar por tipo</InputLabel>
                                <Select
                                    labelId="user-type-filter-label"
                                    value={filtro}
                                    label="Filtrar por tipo"
                                    onChange={(e) => setFiltro(e.target.value)}
                                >
                                    <MenuItem value="todos">Todos</MenuItem>
                                    <MenuItem value="1">Administradores</MenuItem>
                                    <MenuItem value="2">Manager</MenuItem>
                                    <MenuItem value="3">Utilizador Interno</MenuItem>
                                    <MenuItem value="4">Utilizador Externo</MenuItem>
                                    <MenuItem value="5">Visitante</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="utilizadores table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome de Utilizador</TableCell>
                                        <TableCell>Tipo</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Perfil Associado</TableCell>
                                        <TableCell>Ver detalhes</TableCell>
                                        <TableCell>Editar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUtilizadores.map((utilizador) => {
                                        const perfil = getPerfilInfo(utilizador.id_utilizador);
                                        const showCreateProfileButton = !perfil && hasAcceptedCandidaturas(utilizador.id_utilizador);
                                        const isVisitante = utilizador.id_tipo === 5;
                                        const hasAccepted = hasAcceptedCandidaturas(utilizador.id_utilizador);

                                        return (
                                            <TableRow key={utilizador.id_utilizador}>
                                                <TableCell>{utilizador.nome_utilizador}</TableCell>
                                                <TableCell>
                                                    {getUserType(utilizador.id_tipo)}
                                                    {isVisitante && hasAccepted && (
                                                        <Chip
                                                            label="Candidatura Aceite"
                                                            color="success"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={utilizador.estado}
                                                        color={utilizador.estado === 'Ativa' ? 'success' : utilizador.estado == 'Desativada' ? 'error' : 'warning'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {perfil ? (
                                                        <Box>
                                                            <Typography variant="body2">{perfil.nome}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {perfil.email}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Chip label="Sem perfil" color="warning" size="small" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleOpenUserDetails(utilizador)}
                                                    >
                                                        Detalhes
                                                    </Button>
                                                    {showCreateProfileButton && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color={isVisitante && hasAccepted ? "success" : "primary"}
                                                            sx={{ ml: 1 }}
                                                            onClick={() => handleOpenCreatePerfil(utilizador)}
                                                        >
                                                            Criar Perfil
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {perfil &&
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            color='secondary'
                                                            onClick={() => { setSelectedUserEditar(perfil); setSelectedUtilizador(utilizador) }}
                                                        >
                                                            Editar
                                                        </Button>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

            {/* Modal para ver os detalhes de um utilizador */}
            <Modal
                open={isUserDetailsModalOpen}
                onClose={() => setIsUserDetailsModalOpen(false)}
                aria-labelledby="user-details-modal-title"
                aria-describedby="user-details-modal-description"
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
                        overflow: 'auto',
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <Typography variant="h6" component="h2">
                            Detalhes do Utilizador: {selectedUser?.nome_utilizador}
                        </Typography>
                        <IconButton onClick={() => setIsUserDetailsModalOpen(false)}>
                            <Close />
                        </IconButton>
                    </div>

                    <ModalDetalhesPerfil></ModalDetalhesPerfil>
                </Paper>
            </Modal>


            {/* Modal para criar o perfil do utilizador */}
            <Modal
                open={isCreatePerfilModalOpen}
                onClose={() => setIsCreatePerfilModalOpen(false)}
                aria-labelledby="create-profile-modal-title"
                aria-describedby="create-profile-modal-description"
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
                            Criar Perfil para {selectedUser?.nome_utilizador}
                        </Typography>
                        <IconButton onClick={() => setIsCreatePerfilModalOpen(false)}>
                            <Close />
                        </IconButton>
                    </div>

                    <ModalCriarPerfil></ModalCriarPerfil>
                </Paper>
            </Modal>

            {/* Modal para editar o perfil */}
            <Modal
                open={selectedUserEditar}
                onClose={() => setSelectedUserEditar(null)}
                aria-labelledby="create-profile-modal-title"
                aria-describedby="create-profile-modal-description"
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
                            Editar perfil de para {selectedUserEditar?.nome_utilizador}
                        </Typography>
                        <IconButton onClick={() => setSelectedUserEditar(null)}>
                            <Close />
                        </IconButton>
                    </div>

                    <ModalEditarPerfil></ModalEditarPerfil>
                </Paper>
            </Modal>
        </div >
    );

    function ModalDetalhesPerfil() {
        return (
            <>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Informações da Conta
                    </Typography>
                    <Typography variant="body2">Nome de Utilizador: {selectedUser?.nome_utilizador}</Typography>
                    <Typography variant="body2">Tipo: {getUserType(selectedUser?.id_tipo)}</Typography>
                    <Typography variant="body2">Estado: {selectedUser?.estado}</Typography>
                </Box>

                {getPerfilInfo(selectedUser?.id_utilizador) ? (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Informações do Perfil
                        </Typography>
                        <Typography variant="body2">Nome: {getPerfilInfo(selectedUser?.id_utilizador)?.nome}</Typography>
                        <Typography variant="body2">Email: {getPerfilInfo(selectedUser?.id_utilizador)?.email}</Typography>
                        <Typography variant="body2">Nº Mecanográfico: {getPerfilInfo(selectedUser?.id_utilizador)?.numero_mecanografico || 'N/A'}</Typography>
                        <Typography variant="body2">Morada: {getPerfilInfo(selectedUser?.id_utilizador)?.morada || 'N/A'}</Typography>
                        <Typography variant="body2">Telemóvel: {getPerfilInfo(selectedUser?.id_utilizador)?.telemovel || 'N/A'}</Typography>
                        <Typography variant="body2">Data de Nascimento: {getPerfilInfo(selectedUser?.id_utilizador)?.data_nascimento || 'N/A'}</Typography>
                        <Typography variant="body2">Distrito: {getPerfilInfo(selectedUser?.id_utilizador)?.distrito || 'N/A'}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Este utilizador não tem perfil associado
                        </Typography>
                        {hasAcceptedCandidaturas(selectedUser?.id_utilizador) && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsUserDetailsModalOpen(false);
                                    handleOpenCreatePerfil(selectedUser);
                                }}
                            >
                                Criar Perfil
                            </Button>
                        )}
                    </Box>
                )}

                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Candidaturas ({userCandidaturas.length})
                    </Typography>
                    {userCandidaturas.length > 0 ? (

                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Data Submissão</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {userCandidaturas.map((candidatura) => (
                                        <a href={`http://localhost:3000/vagas/${candidatura.id_vaga}`} target="_blank">
                                            <TableRow key={candidatura.id_candidatura}>
                                                <TableCell>{candidatura.id_candidatura}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={candidatura.status}
                                                        color={
                                                            candidatura.status.includes('Aceite') ? 'success' :
                                                                candidatura.status.includes('Rejeitada') ? 'error' : 'warning'
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(candidatura.data_submissao).toLocaleDateString()}
                                                </TableCell>

                                            </TableRow>
                                        </a>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    ) : (
                        <Typography variant="body2">Nenhuma candidatura encontrada</Typography>
                    )}
                </Box >
            </>
        )
    }

    function ModalCriarPerfil() {
        const [perfilForm, setPerfilForm] = useState({
            nome: '',
            email: '',
            numero_mecanografico: '',
            morada: '',
            telemovel: '',
            data_nascimento: '',
            distrito: '',
            id_departamento: '',
            dias_ferias_ano_atual: '',
            estado: 'Restrita'
        });

        useEffect(() => {
            setPerfilForm(prev => ({
                ...prev,
                dias_ferias_ano_atual: calcularDiasFerias()
            }))
        }, [])

        const calcularDiasFerias = () => {
            const hoje = new Date();
            const anoAtual = hoje.getFullYear();
            const mesAtual = hoje.getMonth();
            const mesesRestantes = 11 - mesAtual;

            const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
            const diasRestantesNoMes = diasNoMes - hoje.getDate();

            const mesesProporcionais = mesesRestantes + (diasRestantesNoMes / diasNoMes);

            const diasFeriasFuturos = mesesProporcionais * (22 / 12);

            return Math.round(diasFeriasFuturos);
        }

        const handlePerfilFormChange = (e) => {
            const { name, value } = e.target;
            setPerfilForm(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleCriarPerfil = async (e) => {
            e.preventDefault();

            const profileData = {
                ...perfilForm,
                id_utilizador: selectedUser.id_utilizador
            };

            handleServices.criarPerfil(profileData)
                .then(res => {
                    enqueueSnackbar("Perfil criado com sucesso", { variant: 'success' });
                    setIsCreatePerfilModalOpen(false);
                    carregarPerfis();
                    carregarUtilizadores();
                    setPerfilForm({
                        nome: '',
                        email: '',
                        numero_mecanografico: '',
                        morada: '',
                        telemovel: '',
                        data_nascimento: '',
                        distrito: '',
                        id_departamento: '',
                        dias_ferias_ano_atual: '',
                        estado: ''
                    });
                })
                .catch(err => {
                    enqueueSnackbar(err, { variant: 'error' });
                });
        };

        return (
            <Stack spacing={3}>
                <TextField
                    name="nome"
                    label="Nome Completo"
                    value={perfilForm.nome}
                    onChange={handlePerfilFormChange}
                    fullWidth
                    required
                />

                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={perfilForm.email}
                    onChange={handlePerfilFormChange}
                    fullWidth
                    required
                />

                <TextField
                    name="numero_mecanografico"
                    label="Número Mecanográfico"
                    value={perfilForm.numero_mecanografico}
                    onChange={handlePerfilFormChange}
                    fullWidth
                />

                <TextField
                    name="morada"
                    label="Morada"
                    value={perfilForm.morada}
                    onChange={handlePerfilFormChange}
                    fullWidth
                />

                <TextField
                    name="telemovel"
                    label="Telemóvel"
                    value={perfilForm.telemovel}
                    onChange={handlePerfilFormChange}
                    fullWidth
                />

                <TextField
                    name="data_nascimento"
                    label="Data de Nascimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={perfilForm.data_nascimento}
                    onChange={handlePerfilFormChange}
                    fullWidth
                />

                <TextField
                    name="distrito"
                    label="Distrito"
                    value={perfilForm.distrito}
                    onChange={handlePerfilFormChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                        name="id_departamento"
                        value={perfilForm.id_departamento}
                        label="Departamento"
                        onChange={handlePerfilFormChange}
                    >
                        {departamentos.map((departamento) => {
                            if (departamento.id_departamento != 1) {
                                return (
                                    <MenuItem value={departamento.id_departamento}>{departamento.nome_departamento}</MenuItem>
                                )
                            }

                        })}
                    </Select>
                </FormControl>

                <TextField
                    name="dias_ferias_ano_atual"
                    label="Dia de férias do ano atual"
                    value={perfilForm.dias_ferias_ano_atual}
                    type="number"
                    onChange={handlePerfilFormChange}
                    fullWidth
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={perfilForm.estado === "Ativa"}
                            onChange={(e) => setPerfilForm({
                                ...perfilForm,
                                estado: e.target.checked ? "Ativa" : "Restrita"
                            })}
                            color="primary"
                        />
                    }
                    label="Perfil com permissões para aceder a todo o website"
                    labelPlacement="end"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        onClick={() => setIsCreatePerfilModalOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleCriarPerfil}
                    >
                        Criar Perfil
                    </Button>
                </Stack>
            </Stack>
        )
    }

    function ModalEditarPerfil() {
        const [perfilData, setPerfilData] = useState({
            nome: '',
            email: '',
            numero_mecanografico: '',
            morada: '',
            telemovel: '',
            data_nascimento: '',
            distrito: '',
            id_departamento: '',
            estado: ''
        });

        useEffect(() => {
            if (selectedUserEditar) {
                const userPerfil = perfis.find(p => p.id_utilizador === selectedUserEditar.id_utilizador);
                if (userPerfil) {
                    setPerfilData({
                        id_utilizador: selectedUtilizador.id_utilizador || '',
                        nome: userPerfil.nome || '',
                        email: userPerfil.email || '',
                        numero_mecanografico: userPerfil.numero_mecanografico || '',
                        morada: userPerfil.morada || '',
                        telemovel: userPerfil.telemovel || '',
                        data_nascimento: userPerfil.data_nascimento || '',
                        distrito: userPerfil.distrito || '',
                        id_departamento: userPerfil.id_departamento || '',
                        estado: selectedUtilizador.estado || ''
                    });
                }
            }
        }, [selectedUserEditar]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setPerfilData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            handleServices.atualizarPerfil(perfilData, selectedUserEditar.id_perfil)
                .then(res => {
                    enqueueSnackbar(res, { variant: 'success' });
                    setSelectedUserEditar(null)
                })
                .catch(err => {
                    enqueueSnackbar(err, { variant: 'error' });
                })
        };

        return (

            <Stack spacing={3}>
                <TextField
                    name="nome"
                    label="Nome Completo"
                    value={perfilData.nome}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={perfilData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    name="numero_mecanografico"
                    label="Número Mecanográfico"
                    value={perfilData.numero_mecanografico}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    name="morada"
                    label="Morada"
                    value={perfilData.morada}
                    onChange={handleChange}
                    fullWidth
                    rows={2}
                />

                <TextField
                    name="telemovel"
                    label="Telemóvel"
                    value={perfilData.telemovel}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    name="data_nascimento"
                    label="Data de Nascimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={perfilData.data_nascimento}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    name="distrito"
                    label="Distrito"
                    value={perfilData.distrito}
                    onChange={handleChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                        name="id_departamento"
                        value={perfilData.id_departamento}
                        label="Departamento"
                        onChange={handleChange}
                    >
                        {departamentos.map((departamento) => {
                            if (departamento.id_departamento != 1) {
                                return (
                                    <MenuItem value={departamento.id_departamento}>{departamento.nome_departamento}</MenuItem>
                                )
                            }

                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                        name="estado"
                        value={perfilData.estado}
                        label="Estado"
                        onChange={handleChange}
                    >
                        <MenuItem value={"Ativa"}>Ativa</MenuItem>
                        <MenuItem value={"Desativada"}>Desativada</MenuItem>
                        <MenuItem value={"Restrita"}>Restrita</MenuItem>
                    </Select>
                </FormControl>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        onClick={() => setSelectedUserEditar(null)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Guardar Alterações
                    </Button>
                </Stack>
            </Stack>
        );
    }
}