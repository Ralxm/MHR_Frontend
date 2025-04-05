import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Card } from '@mui/material';
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle'
import DoughnutPieChart from './DoughnutPieChart';
import authService from '../Login/auth-service';
import handleServices from './handle-services';

export default function Vagas() {
    const { id } = useParams();
    const { state } = useLocation();
    const vaga = state?.vaga;
    const departamento = state?.dep
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [candidaturas, setCandidaturas] = useState([])

    const [isCreateCandidaturaModalOpen, setIsCreateCandidaturaModalOpen] = useState(false)

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
    }, []);

    useEffect(() => {
        if (vaga) {
            document.title = "Vaga: " + vaga.titulo_vaga;
        }
        else {
            carregarVaga(id)
        }
        vaga.data_inicio = convertDate(vaga.data_inicio)
        vaga.data_fecho = convertDate(vaga.data_fecho)

        carregarCandidaturas(vaga.id_vaga)
    }, [vaga])

    function carregarCandidaturas(id) {
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
    }

    function carregarVaga(id) {
        handleServices.getVaga(id)
            .then(res => {
                vaga = res;
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
                                                <h2>{vaga.titulo_vaga}</h2>
                                                <div>
                                                    <h6>Data de ínicio: {vaga.data_inicio}</h6>
                                                    <h6>Data de fecho: {vaga.data_fecho}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <h4>{departamento.nome_departamento}</h4>
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
                                                    disabled={tipo_user != 1 && tipo_user != 2}>{vaga.requisitos}
                                                </textarea>
                                            </div>
                                            <div className='col-md-7'>
                                                <textarea
                                                    className='col-md-12 mt-4 bg-white text-dark'
                                                    style={{ resize: 'none', border: "none", minHeight: '60vh' }}
                                                    disabled={tipo_user != 1 && tipo_user != 2}>{vaga.descricao}
                                                </textarea>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-2'>
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
                                                {candidaturas && candidaturas.map((candidatura) => {
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
                                                })}
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
        </div>
    )
}
