import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab } from '@mui/material';
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle'
import DoughnutPieChart from '../../Universal/DoughnutPieChart';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import TableVagas from './TabelaVagas'

export default function Vagas() {
    const navigate = useNavigate();
    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [isCreateVagaModalOpen, setIsCreateVagaModalOpen] = useState(false)
    const [isCreateCandidaturaModalOpen, setIsCreateCandidaturaModalOpen] = useState(false)

    const [isListagem, setIsListagem] = useState(true)

    const [departamentos, setDepartamentos] = useState([]);
    const [vagas, setVagas] = useState([])

    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [selectedVaga, setSelectedVaga] = useState(null)
    const [selectedVagaDepartamento, setSelectedVagaDepartamento] = useState(null)


    {/*Variáveis para a criação da vaga*/ }
    const [departamentoVaga, setDepartamentoVaga] = useState([])
    const [descricao, setDescricao] = useState('')
    const [requisitos, setRequisitos] = useState('')
    const [titulo_vaga, setTitulo_Vaga] = useState('')

    {/*Variáveis para a criação do curriculo*/ }
    const [selectedVagaCandidatura, setSelectedVagaCandidatura] = useState(null)
    const [email, setEmail] = useState('')
    const [telemovel, setTelemovel] = useState('')
    const [curriculo, setCurriculo] = useState('')

    const handleVerDetalhesVaga = (vaga) => {
        let departamentoEncontrado;
        departamentos.map((departamento) => {
            if (departamento.id_departamento == vaga.id_departamento) {
                departamentoEncontrado = departamento
            }
        })
        if (departamentoEncontrado) {
            setSelectedVagaDepartamento(departamentoEncontrado)
        }
        setSelectedVaga(vaga)
    }

    const handleCandidatar = (vaga) => {
        setIsCreateCandidaturaModalOpen(true)
        setSelectedVagaCandidatura(vaga)
    }

    const handleCloseCandidatar = () => {
        setIsCreateCandidaturaModalOpen(false)
    }

    const handleCloseDetalhesVaga = () => {
        setSelectedVaga(null);
        setSelectedVagaDepartamento(null)
    }

    const toggleCreateVagaModal = (departamento) => {
        setDepartamentoVaga(departamento)
        setIsCreateVagaModalOpen(!isCreateVagaModalOpen)
    }

    const handleOpenGrafico = () => {
        setIsListagem(false)
    }

    const handleOpenListagem = () => {
        setIsListagem(true)
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

        carregarDepartamentos();
        carregarVagas();

        document.title = "Vagas";
    }, []);

    function carregarDepartamentos() {
        handleServices.listDepartamentos()
            .then(res => {
                setDepartamentos(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function carregarVagas() {
        handleServices.listVagas()
            .then(res => {
                setVagas(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function handleCriarVaga(event) {
        event.preventDefault();

        const datapost = {
            id_departamento: departamentoVaga.id_departamento,
            descricao: descricao,
            requisitos: requisitos,
            titulo_vaga: titulo_vaga,
            created_by: id_user
        }

        handleServices.createVaga(datapost)
            .then(res => {
                alert("Vaga criada com sucesso");
                navigate(0)
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleCriarCandidatura(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append('id_vaga', selectedVagaCandidatura.id_vaga);
        formData.append('id_utilizador', id_user);
        formData.append('telemovel', telemovel);
        formData.append('email', email);
        formData.append('status', "Pendente");

        if (curriculo && curriculo.length > 0) {
            formData.append('curriculo', curriculo)
        }

        console.log(formData)

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
                        <div className="col-md-4" style={{ zIndex: 1000 }}>
                            <div className='row'>
                                <div className="items-container p-3" style={{ height: '85vh' }}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <span><strong>Departamentos</strong></span>
                                        {isListagem ?
                                            <div>
                                                <button className='btn btn-primary btn-sm mx-1'>Listagem</button>
                                                <button className='btn btn-outline-secondary btn-sm' onClick={handleOpenGrafico}>Gráfico</button>
                                            </div>
                                            :
                                            <div>
                                                <button className='btn btn-outline-secondary btn-sm mx-1' onClick={handleOpenListagem}>Listagem</button>
                                                <button className='btn btn-primary btn-sm' >Gráfico</button>
                                            </div>
                                        }
                                    </div>

                                    {isListagem ?
                                            <div className='row my-3'>
                                            <ListDepartamentos departamentos={departamentos}></ListDepartamentos>
                                            </div>
                                            :
                                            <div>
                                                {/*código com o gráfico */}
                                            </div>
                                        }
                                    
                                </div>
                            </div>
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-8" style={{ zIndex: 1000 }}>
                            <div className="items-container" style={{ height: '85vh', overflowY: 'auto' }}>
                                <div className='d-flex justify-content-between align-items-center mx-3 mb-3 mt-1'>
                                    <span>{selectedDepartamento ?
                                        <div>
                                            <strong>Vagas do departamento: </strong>
                                            <span>{selectedDepartamento.nome_departamento}</span>
                                        </div>
                                        :
                                        <strong>Todas as vagas</strong>}</span>
                                    {selectedDepartamento && <button className='btn btn-warning btn-sm' onClick={() => { setSelectedDepartamento(null) }}>Remover Filtro</button>}
                                </div>
                                <TableVagas vagas={vagas} departamentos={departamentos} selectedDepartamento={selectedDepartamento} onVerDetalhes={handleVerDetalhesVaga} onCandidatar={handleCandidatar}></TableVagas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver os detalhes da vaga*/}
            <Modal
                open={selectedVaga}
                onClose={handleCloseDetalhesVaga}
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
                        height: { xs: 500, sm: 530 },
                        borderRadius: 4,
                        p: 4,
                        overflowY: 'scroll'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6">
                        Detalhes da Vaga
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {selectedVaga && <DetalhesVaga vaga={selectedVaga} />}
                    </Typography>
                    <Button onClick={handleCloseDetalhesVaga} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            {/* Modal para a criação de uma vaga */}
            <Modal
                open={isCreateVagaModalOpen}
                onClose={toggleCreateVagaModal}
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
                        Criar uma vaga
                    </Typography>
                    <form>
                        <Stack spacing={2}>
                            <Typography className="mb-2" id="modal-modal-title" variant="h7" sx={{ mb: 2 }}>
                                Departamento: {departamentoVaga.nome_departamento}
                            </Typography>
                            <TextField
                                label="Título da Vaga"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(value) => { setTitulo_Vaga(value.target.value) }}
                            />
                            <TextField
                                label="Descricao"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(value) => { setDescricao(value.target.value) }}
                            />
                            <TextField
                                label="Requisitos"
                                type="text"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(value) => { setRequisitos(value.target.value) }}
                            />

                            <Button variant="contained" color="primary" onClick={handleCriarVaga}>
                                Criar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Modal>

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
                            {selectedVagaCandidatura &&
                                <Typography className="mb-2" id="modal-modal-title" variant="h8" sx={{ mb: 2 }}>
                                    Vaga: {selectedVagaCandidatura.titulo_vaga}
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

    function ListDepartamentos({ departamentos }) {
        return (departamentos.map((departamento) => {
            if (departamento.id_departamento != 1) {
                return (
                    <div className={'p-3 mb-3 border-top border-bottom'}>
                        <div className='row mb-2'>
                            <div className='col-md-6'>
                                <strong>Nome: </strong> {departamento.nome_departamento}
                            </div>
                            <div className='col-md-6'>
                                <strong>Responsável: </strong> {departamento.responsavel_departamento}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6'>
                                <strong>Descrição: </strong> {departamento.descricao}
                            </div>

                            <div className='col-md-6'>
                                <button className='btn btn-outline-secondary m-2' onClick={() => { toggleCreateVagaModal(departamento) }}>Criar vaga</button>
                                <button className='btn btn-secondary m-2' onClick={() => { setSelectedDepartamento(departamento) }}>Ver vagas</button>
                            </div>
                        </div>
                    </div>
                )
            }
        })
        );
    }

    function DetalhesVaga({ vaga }) {

        const [formData, setFormData] = useState({
            ...vaga,
            id_departamento: vaga.id_departamento || (selectedVagaDepartamento?.id_departamento || '')
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((formData) => ({
                ...formData,
                [name]: value,
            }));
        };

        return (
            <form>
                <div className="mb-3">
                    <label className="form-label"><strong>Departamento:</strong></label>
                    <select
                        name="id_departamento"
                        value={formData.id_departamento}
                        onChange={handleChange}
                        className="form-control"
                    >
                        {departamentos.map((departamento) => {
                            if (departamento.id_departamento != 1) {
                                return (
                                    <option value={departamento.id_departamento}>{departamento.nome_departamento}</option>
                                )
                            }
                        })}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Título da vaga:</strong></label>
                    <input
                        type="text"
                        name="titulo_vaga"
                        value={formData.titulo_vaga}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Descrição:</strong></label>
                    <input
                        type="text"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Requisitos:</strong></label>
                    <input
                        type="text"
                        name="requisitos"
                        value={formData.requisitos}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="button" className='btn btn-primary col-md-12 mb-1'>Guardar alterações</button>

            </form>
        )
    }
}
