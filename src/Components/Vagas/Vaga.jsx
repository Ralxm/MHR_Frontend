import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Card, Grid } from '@mui/material';
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle'
import DoughnutPieChart from './DoughnutPieChart';
import authService from '../Login/auth-service';
import handleServices from './handle-services';

export default function Vagas() {
    const { id } = useParams();
    const { state } = useLocation();
    const [vaga, setVaga] = useState(state?.vaga);
    const departamento = state?.dep
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [candidaturas, setCandidaturas] = useState([])
    const [comentarios, setComentarios] = useState([])

    const [selectedCandidatura, setSelectedCandidatura] = useState(null)

    const [isCreateCandidaturaModalOpen, setIsCreateCandidaturaModalOpen] = useState(false)
    const [isVerCandidaturasModalOpen, setIsVerCandidaturasModalOpen] = useState(false)

    const [isDecidirCandidaturaModal, setIsDecidirCandidaturaModal] = useState(false)
    const [action, setAction] = useState('')

    {/* Variável para criação de um comentário */ }
    const [comentario, setComentario] = useState('')

    {/*Variáveis para a criação do curriculo*/ }
    const [email, setEmail] = useState('')
    const [telemovel, setTelemovel] = useState('')
    const [curriculo, setCurriculo] = useState('')

    {/* Função para criar uma candidatura */ }
    const handleCandidatar = (vaga) => {
        setIsCreateCandidaturaModalOpen(true)
    }

    {/* Função para fechar o modal de criar uma candidatura */ }
    const handleCloseCandidatar = () => {
        setIsCreateCandidaturaModalOpen(false)
    }

    const handleVerCandidaturas = (vaga) => {
        setIsVerCandidaturasModalOpen(true)
    }

    const handleCloseVerCandidaturas = () => {
        setIsVerCandidaturasModalOpen(false)
    }

    const handleDecidirCandidaturas = (action) => {
        setIsDecidirCandidaturaModal(true)
        setAction(action)
    }

    const handleCloseDecidirCandidaturas = () => {
        setIsDecidirCandidaturaModal(false)
        setAction('')
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

        if (!vaga && !isLoading) {
            carregarVaga(id);
        }
    }, [vaga, id, isLoading]);

    useEffect(() => {
        if (vaga) {
        document.title = "Vaga: " + vaga.titulo_vaga;
        carregarCandidaturas(vaga.id_vaga);
        }
    }, [vaga])

    function carregarCandidaturas(id) {
        setIsLoading(true)
        handleServices.listCandidaturasPorVaga(id)
            .then(res => {
                res.map((candidatura) => {
                    candidatura.data_submissao = convertDate(candidatura.data_submissao)
                })
                setCandidaturas(res)
            })
            .catch(err => {
                console.log(err)
            })
        setIsLoading(false)
    }

    async function carregarVaga(id) {
        handleServices.getVaga(id)
            .then(res => {
                const vagaAPI = res.Box
                vagaAPI = {
                    ...vagaAPI,
                    data_inicio: convertDate(vagaAPI.data_inicio),
                    data_fecho: convertDate(vagaAPI.data_fecho)
                };
                setVaga(vagaAPI)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function carregarComentarios(id) {
        handleServices.listComentarios(id)
            .then(res => {
                setComentarios(res)
            })
            .catch(err => {
                console.log(err)
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

    function handleCriarCandidatura(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append('id_vaga', vaga.id_vaga);
        formData.append('id_utilizador', id_user);
        formData.append('telemovel', telemovel);
        formData.append('email', email);
        formData.append('status', "Pendente");

        if (curriculo && curriculo.length > 0) {
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
    }

    function handleComentar() {
        const datapost = {
            id_candidatura: selectedCandidatura.id_candidatura,
            comentario: comentario,
            responsavel: id_user
        }

        handleServices.createComentario(datapost)
            .then(res => {
                alert("Comentario criado com sucesso");
                carregarComentarios(selectedCandidatura.id_candidatura)
            })
            .catch(err => {
                console.log(err);
            });
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
                        {/* Coluna da esquerda */}
                        <div className="col-md-12" style={{ zIndex: 1000 }}>
                            <div className='row'>
                                <div className="items-container p-3 d-flex" style={{ height: '85vh' }}>
                                    <div className='col-md-2'>
                                        <a href="/vagas"><button className='btn btn-outline-primary' >&#x25c0; Voltar</button></a>
                                    </div>
                                    <div className='col-md-8' style={{ height: "80vh" }}>
                                        <div className='row'>
                                            <div className='d-flex justify-content-between'>
                                                <h2>{vaga && vaga.titulo_vaga}</h2>
                                                <div>
                                                    <h6>Data de ínicio: {vaga && vaga.data_inicio}</h6>
                                                    <h6>Data de fecho: {vaga && vaga.data_fecho}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <h4>{departamento && departamento.nome_departamento}</h4>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-5'>
                                                Requisitos:
                                            </div>
                                            <div className='col-md-7'>
                                                Descrição:
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-5'>
                                                <textarea
                                                    className='col-md-12 mt-4  bg-white text-dark'
                                                    style={{ resize: 'none', border: "none", minHeight: '60vh' }}
                                                    disabled={tipo_user != 1 && tipo_user != 2}>{vaga && vaga.requisitos}
                                                </textarea>
                                            </div>
                                            <div className='col-md-7'>
                                                <textarea
                                                    className='col-md-12 mt-4 bg-white text-dark'
                                                    style={{ resize: 'none', border: "none", minHeight: '60vh' }}
                                                    disabled={tipo_user != 1 && tipo_user != 2}>{vaga && vaga.descricao}
                                                </textarea>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-2'>
                                        {(tipo_user == 1 || tipo_user == 2) &&
                                            <div className='row d-flex'>
                                                <div className='text-end mb-2'>
                                                    <button className='btn btn-primary' onClick={handleVerCandidaturas}>Ver Candidaturas</button>
                                                </div>
                                            </div>
                                        }
                                        <div className='row d-flex'>
                                            <div className='text-end'>
                                                <button className='btn btn-primary' onClick={handleCandidatar}>Candidatar</button>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <div className='col-md-1'>
                                                &nbsp;
                                            </div>
                                            <div className='col-md-11'>
                                                {/*candidaturas && candidaturas.map((candidatura) => {
                                                    return (
                                                        <Card variant="outlined" className='mt-3 p-2'>
                                                            <Box className="">
                                                                <Stack sx={{ justifyContent: 'space-between', alignItems: 'left' }}>
                                                                    <Typography component="div" >
                                                                        Data candidatura: {candidatura.data_submissao}
                                                                    </Typography>
                                                                    <Typography component="div" >
                                                                        Utilizador: {candidatura.utilizador.nome_utilizador}
                                                                    </Typography>
                                                                    <Typography component="div">
                                                                        Email: {candidatura.email}
                                                                    </Typography>
                                                                    <Typography component="div">
                                                                        Telemovel: {candidatura.telemovel}
                                                                    </Typography>
                                                                    <Typography component="div">
                                                                        Curriculo: <a><button className='btn btn-outline-primary btn-sm'>Abrir</button></a>
                                                                    </Typography>
                                                                </Stack>
                                                            </Box>
                                                        </Card>
                                                    )
                                                })*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para a criação de uma candidatura */}
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
            </Modal>

            {/* Modal para ver os detalhes de uma candidatura */}
            <Modal
                open={isVerCandidaturasModalOpen}
                onClose={handleCloseVerCandidaturas}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '80%', md: '70%' },
                        maxWidth: '1200px',
                        height: '80vh',
                        borderRadius: 4,
                        p: 0,
                        display: 'flex',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            width: '30%',
                            borderRight: '1px solid #e0e0e0',
                            overflowY: 'auto',
                            p: 2,
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                            Candidaturas
                        </Typography>
                        {candidaturas && candidaturas.map((candidatura) => (
                            <Card
                                key={candidatura.id}
                                variant="outlined"
                                sx={{
                                    mb: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <Box sx={{ p: 2 }}>
                                    <Stack spacing={1}>
                                        <Typography component="div">
                                            Data: {candidatura.data_submissao}
                                        </Typography>
                                        <Typography component="div">
                                            {candidatura.utilizador.nome_utilizador}
                                        </Typography>
                                        <button className='btn btn-outline-primary' onClick={() => { setSelectedCandidatura(candidatura); carregarComentarios(candidatura.id_candidatura) }}>Ver detalhes</button>
                                    </Stack>
                                </Box>
                            </Card>
                        ))}
                    </Box>

                    <Box
                        sx={{
                            width: '70%',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#fafafa',
                            overflowY: 'auto'
                        }}
                    >
                        {selectedCandidatura ?
                            <div>
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h5" gutterBottom>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            Detalhes da Candidatura
                                            <div>
                                                <button className='btn btn-success mx-2' onClick={() => { handleDecidirCandidaturas('Aceitar') }}>Aceitar</button>
                                                <button className='btn btn-danger' onClick={() => { handleDecidirCandidaturas('Rejeitar') }}>Rejeitar</button>
                                            </div>
                                        </div>

                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Data de Submissão:</strong> {new Date(selectedCandidatura.data_submissao).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Estado:</strong> {selectedCandidatura.status}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Email:</strong> {selectedCandidatura.email}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1">
                                                <strong>Telemóvel:</strong> {selectedCandidatura.telemovel}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">
                                                <strong>Currículo:</strong> {' '}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => window.open(selectedCandidatura.anexo, '_blank')}
                                                    sx={{ ml: 1 }}
                                                >
                                                    Abrir currículo
                                                </Button>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Comentários ({selectedCandidatura.comentarios?.length || 0})
                                    </Typography>

                                    <Box sx={{ mb: 4, maxHeight: '300px', overflowY: 'auto' }}>
                                        {comentarios ? (
                                            comentarios.map((comentario, index) => (
                                                <Card key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="subtitle2" color="primary">
                                                            {comentario.perfil.nome}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {new Date(comentario.created_at).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1">
                                                        {comentario.comentario}
                                                    </Typography>
                                                </Card>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                Nenhum comentário ainda.
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box component="form" sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Adicionar Comentário
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            placeholder="Escreva o seu comentário..."
                                            sx={{ mb: 2 }}
                                            onChange={(value) => setComentario(value.target.value)}
                                            value={comentario}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => { handleComentar(); setComentario("") }}
                                        >
                                            Enviar Comentário
                                        </Button>
                                    </Box>
                                </Box>
                            </div>
                            :
                            <Typography variant="h6" color="textSecondary" sx={{ m: 'auto' }}>
                                Selecione uma candidatura para ver os detalhes
                            </Typography>
                        }
                    </Box>
                </Paper>
            </Modal>

            {/*Modal para aceitar uma candidatura */}
            <Modal
                open={isDecidirCandidaturaModal}
                onClose={handleCloseDecidirCandidaturas}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 550 },
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    {action == "Aceitar" &&
                        <>
                            <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                                Tem a certeza que quer aceitar esta candidatura?
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {handleCloseDecidirCandidaturas()}}
                                    sx={{ width: '50%' }}
                                >
                                    Fechar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={(event) => { }}
                                    sx={{ width: '50%' }}
                                >
                                    Aceitar
                                </Button>
                            </Stack>
                        </>
                    }
                    {action == "Rejeitar" &&
                        <>
                            <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                                Tem a certeza que quer rejeitar esta candidatura?
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {handleCloseDecidirCandidaturas()}}
                                    sx={{ width: '50%' }}
                                >
                                    Fechar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={(event) => { }}
                                    sx={{ width: '50%' }}
                                >
                                    Rejeitar
                                </Button>
                            </Stack>
                        </>
                    }
                </Paper>
            </Modal>
        </div>
    )
}
