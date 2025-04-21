import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Projetos.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Card, CardContent, Avatar, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack, Close, Phone, LocationOn, Attachment } from '@mui/icons-material'
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle';

export default function Projeto() {
    const { id } = useParams();
    const { state } = useLocation();
    const [projeto, setProjeto] = useState(state?.vaga);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isProjetoLoading, setIsProjetoLoading] = useState(true);

    const [pertenceProjeto, setPertenceProjeto] = useState(false);

    const [isLinhaTemporalModalOpen, setIsLinhaTemporalModalOpen] = useState(false)

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [utilizadores, setUtilizadores] = useState([])
    const [linha_temporal, setLinha_Temporal] = useState([])
    const [comentarios, setComentarios] = useState([])

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        if (!projeto) {
            carregarProjeto(id);
        }
        else {
            setIsProjetoLoading(false)
            projeto.data_inicio = convertDate(projeto.data_inicio)
            projeto.data_final_prevista = convertDate(projeto.data_final_prevista)
        }

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
        if (projeto) {
            document.title = "Projeto: " + projeto.titulo_projeto;

            carregarUtilizadores(id);
            carregarLinhaTemporalProjeto(id);
            carregarComentarios(id);
        }
    }, [projeto, id_user, tipo_user])

    useEffect(() => {
        if (utilizadores) {
            utilizadores.map((user) => {
                if (user.id_perfil == id_perfil) {
                    setPertenceProjeto(true)
                }
            })
        }
    }, [utilizadores])

    async function carregarProjeto(id) {
        setIsProjetoLoading(true);
        try {
            const res = await handleServices.getProjeto(id);
            const processedProjeto = {
                ...res[0],
                data_inicio: convertDate(res[0].data_inicio),
                data_final_prevista: convertDate(res[0].data_final_prevista)
            };
            setProjeto(processedProjeto);
        } catch (err) {
            console.log(err);
        } finally {
            setIsProjetoLoading(false);
        }
    }

    async function carregarUtilizadores(id) {
        try {
            const res = await handleServices.carregarUtilizadores(id);
            setUtilizadores(res)
        } catch (err) {
            console.log(err);
        }
    }

    async function carregarLinhaTemporalProjeto(id) {
        try {
            const res = await handleServices.carregarLinhaTemporalProjeto(id);
            setLinha_Temporal(res)
        } catch (err) {
            console.log(err);
        }
    }

    async function carregarComentarios(id) {
        try {
            const res = await handleServices.carregarComentariosProjeto(id);
            console.log(res)
            setComentarios(res)
        } catch (err) {
            console.log(err);
        }
    }

    function convertDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }

    function stringToColor(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    const handleCloseLinhaTemporalModal = () => {
        setIsLinhaTemporalModalOpen(false)
    }

    /*function handleCriarCandidatura(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append('id_vaga', vaga.id_vaga);
        formData.append('id_utilizador', id_user);
        formData.append('telemovel', telemovel);
        formData.append('email', email);
        formData.append('status', "Pendente");

        console.log("a")
        console.log(curriculo)
        if (curriculo) {
            console.log("tenho um curriculo")
            console.log(curriculo)
            formData.append('curriculo', curriculo)
        }


        handleServices.createCandidatura(formData)
            .then(res => {
                alert("Candidatura criada com sucesso");
                navigate(0)
            })
            .catch(err => {
                console.log(err);
            });
    }*/

    if (isProjetoLoading) {
        return <div>Loading...</div>;
    }

    if (!projeto) {
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
                                            onClick={() => navigate('/projetos')}
                                            className='col-md-4 mb-3'
                                        >
                                            Voltar
                                        </Button>

                                        <Typography variant="subtitle2" className='mb-2'>
                                            Utilizadores presentes no projeto:
                                        </Typography>

                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            {utilizadores && utilizadores.length > 0 && utilizadores.map((perfil) => (
                                                <Card key={perfil.id_perfil} sx={{ mb: 1, p: 1 }} variant="outlined" className='col-md-11'>
                                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Avatar sx={{
                                                                width: 32,
                                                                height: 32,
                                                                bgcolor: stringToColor(perfil.perfil.nome),
                                                            }}>
                                                                {perfil.perfil.nome.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <div className='mx-4'>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    {perfil.perfil.nome}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {perfil.perfil.email}
                                                                </Typography>
                                                                <Stack direction="row" spacing={1} mt={0.5}>
                                                                    {perfil.perfil.telemovel && (
                                                                        <Chip
                                                                            size="small"
                                                                            label={perfil.perfil.telemovel}
                                                                            icon={<Phone fontSize="small" />}
                                                                        />
                                                                    )}
                                                                    {perfil.distrito && (
                                                                        <Chip
                                                                            size="small"
                                                                            label={perfil.perfil.distrito}
                                                                            icon={<LocationOn fontSize="small" />}
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            </div>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='col-md-8'>
                                        <div className='card h-100 p-4' style={{ borderRadius: '10px' }}>
                                            <div className='row mb-3'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <h2 className='mb-0' style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                        {projeto && projeto.titulo_projeto}
                                                    </h2>
                                                    <Chip icon={projeto?.estado === 'Concluído' ?
                                                        <LockOpen />
                                                        :
                                                        projeto?.estado === 'Parado' ?
                                                            <Lock />
                                                            :
                                                            <Person />
                                                    }
                                                        label={projeto?.estado || ''}
                                                        sx={{
                                                            borderRadius: '20px',
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            height: '36px',
                                                            padding: '0 12px'
                                                        }}
                                                        color={
                                                            projeto?.estado === 'Concluído' ? 'success' :
                                                                projeto?.estado === 'Parado' ? 'error' :
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
                                                                Data de ínicio: {projeto && projeto.data_inicio}
                                                            </div>
                                                            <div style={{ color: '#e74c3c' }}>
                                                                Data de final prevista: {projeto && projeto.data_final_prevista}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='vacancy-container p-3' style={{ backgroundColor: '#e8f8f0', borderRadius: '8px', textAlign: 'center', minWidth: '120px' }}>
                                                        <h5 style={{ color: '#27ae60', marginBottom: '5px' }}>
                                                            <i className="bi bi-people-fill me-2"></i>
                                                            Utilizadores no projeto
                                                        </h5>
                                                        <h4 style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                            {utilizadores && utilizadores.length}
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
                                                        value={projeto && projeto.descricao}
                                                    />
                                                </div>
                                            </div>


                                            <div className='row flex-grow-1'>
                                                <div className='col-md-12'>
                                                    <h5 className='mb-3' style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '6px' }}>
                                                        <i className="bi bi-list-check me-2"></i>
                                                        Objetivos
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
                                                        value={projeto && projeto.objetivos}
                                                    />
                                                </div>
                                            </div>

                                            <div className='row flex-grow-1 mt-2'>
                                                <div className='col-md-12'>
                                                    <h5 className='mb-3' style={{
                                                        color: '#2c3e50',
                                                        borderBottom: '2px solid #3498db',
                                                        paddingBottom: '6px'
                                                    }}>
                                                        <i className="bi bi-chat-left-text me-2"></i>
                                                        Comentários
                                                    </h5>

                                                    <CriarComentario></CriarComentario>

                                                    <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                        {comentarios.map((comentario) => (
                                                            <Card key={comentario.id_comentario} sx={{ mb: 2, p: 2 }}>
                                                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                                                    <Avatar sx={{ bgcolor: stringToColor(comentario.perfil.nome) }}>
                                                                        {comentario.perfil.nome.charAt(0)}
                                                                    </Avatar>
                                                                    <Box sx={{ flexGrow: 1 }}>
                                                                        <Stack direction="row" justifyContent="space-between">
                                                                            <Typography variant="subtitle2" fontWeight="bold">
                                                                                {comentario.perfil.nome}
                                                                            </Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {new Date(comentario.created_at).toLocaleString()}
                                                                            </Typography>
                                                                        </Stack>
                                                                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                                                            {comentario.comentario}
                                                                        </Typography>
                                                                        {comentario.anexo && (
                                                                            <Button
                                                                                variant="outlined"
                                                                                size="small"
                                                                                href={comentario.anexo}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                startIcon={<Attachment />}
                                                                            >
                                                                                Ver Anexo
                                                                            </Button>
                                                                        )}
                                                                    </Box>
                                                                </Stack>
                                                            </Card>
                                                        ))}
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-md-2' style={{ display: 'flex', flexDirection: 'column', height: '80vh', overflow: 'hidden' }}>
                                        <header className='mb-2' style={{ width: '100%', zIndex: 1, }}>
                                            <div className='d-flex justify-content-end'>
                                                <button className='btn btn-success' style={{ width: '90%' }} onClick={() => setIsLinhaTemporalModalOpen(true)} disabled={!pertenceProjeto}>
                                                    Linha temporal
                                                </button>
                                            </div>
                                        </header>

                                        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0.5rem' }}>
                                            <div className='d-flex justify-content-center'>
                                                <div className='col-md-1'>
                                                    &nbsp;
                                                </div>
                                                <div className='col-md-11 mb-2'>
                                                    Linha temporal:
                                                </div>
                                            </div>

                                            <div style={{ position: 'relative', marginLeft: '16px' }}>
                                                {/* Linha que fica do lado esquerdo dos cards */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '16px',
                                                    top: 0,
                                                    bottom: 0,
                                                    width: '2px',
                                                    backgroundColor: 'black',
                                                }} />
                                                {/* Linha que fica do lado esquerdo dos cards */}


                                                {linha_temporal && linha_temporal.map((registo, index) => (
                                                    <div key={registo.id_registo} style={{
                                                        position: 'relative',
                                                        marginBottom: '16px',
                                                        paddingLeft: '32px',
                                                    }}>
                                                        {/* Bolinhas na linha */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: '8px',
                                                            top: '8px',
                                                            width: '16px',
                                                            height: '16px',
                                                            borderRadius: '50%',
                                                            backgroundColor: registo.tipo === "Objetivo" ? '#1976d2' : '#ff0000',
                                                            border: '3px solid white',
                                                            zIndex: 1
                                                        }} />
                                                        {/* Bolinhas na linha */}

                                                        <Card sx={{
                                                            width: '100%',
                                                            boxShadow: 1,
                                                            borderLeft: registo.tipo === "Objetivo" ? '3px solid #1976d2' : '3px solid #ff0000',
                                                        }}>
                                                            <CardContent className='p-2 pt-0'>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Typography variant="subtitle2" color={registo.tipo === "Objetivo" ? "primary" : "error"}>
                                                                        {registo.tipo}
                                                                    </Typography>
                                                                    <IconButton sx={{marginRight: '-5px'}}>
                                                                        <Close color='error' />
                                                                    </IconButton>
                                                                </Stack>

                                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                                    {registo.descricao}
                                                                </Typography>

                                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                                    Criado por: {registo && registo.perfil.nome}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para a criação de uma candidatura 
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
            </Modal>*/}


            {/* Modal para a criação de um ponto na linha temporal */}
            <Modal
                open={isLinhaTemporalModalOpen}
                onClose={handleCloseLinhaTemporalModal}
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
                        Linha temporal
                    </Typography>
                    <ModalLinhaTemporal></ModalLinhaTemporal>
                </Paper>
            </Modal>
        </div >
    )

    function ModalLinhaTemporal() {
        const [tipo, setTipo] = useState()
        const [descricao, setDescricao] = useState()

        function handleCriarLinhaTemporal() {
            const datapost = {
                id_ideia: projeto.id_ideia,
                id_projeto: projeto.id_projeto,
                autor: id_perfil,
                tipo: tipo,
                descricao: descricao,
                created_by: id_perfil
            }

            handleServices.criarLinhaTemporal(datapost)
                .then(res => {
                    alert(res)
                    navigate(0)
                })
                .catch(err => {
                    console.log(err)
                })
        }

        return (
            <form>
                <Stack spacing={2}>
                    <FormControl fullWidth>
                        <InputLabel id="user-select-label">Tipo</InputLabel>
                        <Select
                            labelId="user-select-label"
                            label="Tipo"
                            onChange={(value) => { setTipo(value.target.value) }}
                            variant="outlined"
                        >
                            <MenuItem value={"Objetivo"}>Objetivo</MenuItem>
                            <MenuItem value={"Bloqueio"}>Bloqueio</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Descricao"
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        onChange={(value) => { setDescricao(value.target.value) }}
                    />

                    <Button variant="contained" color="primary" onClick={handleCriarLinhaTemporal}>
                        Criar
                    </Button>
                </Stack>
            </form>
        )
    }

    function CriarComentario() {
        const [newFile, setNewFile] = useState();
        const [comentario, setComentario] = useState();

        function handleCriar(event) {
            event.preventDefault();

            const formData = new FormData();

            formData.append('id_projeto', projeto.id_projeto);
            formData.append('id_ideia', projeto.id_ideia);
            formData.append('autor', id_perfil);
            formData.append('comentario', comentario);

            if (newFile) {
                formData.append('anexo', newFile)
            }

            handleServices.criarComentarioProjeto(formData)
                .then(res => {
                    alert(res);
                    navigate(0)
                })
                .catch(err => {
                    console.log(err);
                });
        }

        return (
            <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                <TextField
                    label="Adicionar comentário"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={comentario}
                    onChange={(value) => setComentario(value.target.value)}
                    sx={{ mb: 2 }}
                />

                <FileDropZoneSingle
                    onDrop={(files) => setNewFile(files[0])}
                    accept={{
                        'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                        'application/pdf': ['.pdf'],
                        'application/*': ['.doc', '.docx', '.xls', '.xlsx']
                    }}
                    maxSize={10 * 1024 * 1024}
                />

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleCriar}
                    disabled={!pertenceProjeto || !(comentario && comentario.length > 0)}
                >
                    Enviar Comentário
                </Button>
            </Box>
        )
    }
}
