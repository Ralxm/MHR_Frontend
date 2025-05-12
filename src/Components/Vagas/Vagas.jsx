import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle'
import DoughnutPieChart from './DoughnutPieChart';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import TableVagas from './TabelaVagas'
import SumarioVagas from './SumarioVagas';
import { useSnackbar } from 'notistack';

export default function Vagas() {
    const navigate = useNavigate();
    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const { enqueueSnackbar } = useSnackbar();

    const [isCreateVagaModalOpen, setIsCreateVagaModalOpen] = useState(false)
    const [isCreateCandidaturaModalOpen, setIsCreateCandidaturaModalOpen] = useState(false)

    const [isListagem, setIsListagem] = useState(false)

    const [departamentos, setDepartamentos] = useState([]);
    const [vagas, setVagas] = useState([])
    const [candidaturas, setCandidaturas] = useState([]);

    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [selectedVaga, setSelectedVaga] = useState(null)
    const [selectedVagaDepartamento, setSelectedVagaDepartamento] = useState(null)

    const [filtroTitulo, setFiltroTitulo] = useState('')

    {/*Variáveis para a criação da vaga*/ }
    const [departamento, setDepartamento] = useState()
    const [descricao, setDescricao] = useState('')
    const [requisitos, setRequisitos] = useState('')
    const [titulo_vaga, setTitulo_Vaga] = useState('')
    const [numero_vagas, setNumero_Vagas] = useState()
    const [estado, setEstado] = useState('')
    const [data_inicio, setData_Inicio] = useState('')
    const [data_fecho, setData_Fim] = useState('')

    {/* Variável para apagar uma vaga */ }
    const [selectedVagaEditar, setSelectedVagaEditar] = useState(null)

    {/* Variável para apagar uma vaga */ }
    const [selectedVagaApagar, setSelectedVagaApagar] = useState(null)
    const [isApagarModalOpen, setIsApagarModalOpen] = useState(false)

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

    {/* Função para criar uma candidatura */ }
    const handleCandidatar = (vaga) => {
        setIsCreateCandidaturaModalOpen(true)
        setSelectedVagaCandidatura(vaga)
    }

    {/* Função para fechar o modal de criar uma candidatura */ }
    const handleCloseCandidatar = () => {
        setIsCreateCandidaturaModalOpen(false)
    }

    {/* Função para fechar o modal de detalhes de uma vaga */ }
    const handleCloseDetalhesVaga = () => {
        setSelectedVaga(null);
        setSelectedVagaDepartamento(null)
    }

    {/* Função para criar uma vaga */ }
    const toggleCreateVagaModal = () => {
        setIsCreateVagaModalOpen(!isCreateVagaModalOpen)
    }

    {/* Função para trocar para o gráfico no lado esquerdo */ }
    const handleOpenGrafico = () => {
        setIsListagem(false)
    }

    {/* Função para trocar para a listagem no lado esquerdo */ }
    const handleOpenListagem = () => {
        setIsListagem(true)
    }

    {/* Função para apagar uma vaga */ }
    const handleApagarVaga = (id_vaga) => {
        setSelectedVagaApagar(id_vaga)
        setIsApagarModalOpen(true)
    };

    {/* Função para fechar o modal de apagar uma vaga */ }
    const closeApagar = () => {
        setIsApagarModalOpen(false)
    };

    {/* Função para abrir o model de edição de uma vaga */ }
    const handleEditarVaga = (vaga) => {
        setSelectedVagaEditar(vaga)
    }

    const setSelectedDepartamentoGrafico = (departamento) => {
        setSelectedDepartamento(departamento)
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
        carregarCandidaturas();

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

    function carregarCandidaturas() {
        handleServices.listCandidaturas()
            .then(res => {
                setCandidaturas(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function _handleApagarVaga(event) {
        event.preventDefault();

        handleServices.deleteVaga(selectedVagaApagar)
            .then(res => {
                enqueueSnackbar("Vaga apagada com sucesso", { variant: 'success' });
                carregarVagas();
                closeApagar();
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
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
                        <div className="col-md-3" style={{ zIndex: 1000, position: 'sticky', top: 0 }}>
                            <div className='row' style={{ position: 'sticky', top: 10 }}>
                                <div className="items-container " style={{ minHeight: '85vh' }}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <span><strong>Departamentos</strong></span>
                                    </div>

                                    <div className='row d-flex justify-content-between mt-4'>
                                        <div className='col-md-6'>
                                            <DoughnutPieChart vagas={vagas} departamentos={departamentos} candidaturas={candidaturas} onSetDepartamento={setSelectedDepartamentoGrafico} tipo='vagas'></DoughnutPieChart>
                                        </div>
                                        <div className='col-md-6'>
                                            <DoughnutPieChart vagas={vagas} departamentos={departamentos} candidaturas={candidaturas} onSetDepartamento={setSelectedDepartamentoGrafico} tipo='candidaturas'></DoughnutPieChart>
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <SumarioVagas vagas={vagas} departamentos={departamentos} candidaturas={candidaturas} tipo_user={tipo_user} onSetDepartamento={setSelectedDepartamentoGrafico}></SumarioVagas>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-9">
                            <div className="items-container" style={{ minHeight: '85vh' }}>
                                <div className='d-flex justify-content-between align-items-center mx-3 mb-3 mt-1'>
                                    <span>{selectedDepartamento ?
                                        <div style={{ zIndex: 1001 }}>
                                            <strong>Vagas do departamento: </strong>
                                            <span>{selectedDepartamento.nome_departamento}</span>
                                        </div>
                                        :
                                        <strong style={{ zIndex: 1001 }}>Todas as vagas</strong>}</span>
                                    <div className='d-flex' style={{ zIndex: 1001 }}>
                                        <input className='mx-2' onChange={(value) => { setFiltroTitulo(value.target.value) }}></input>
                                        {selectedDepartamento && <button className='btn btn-warning mx-2' onClick={() => { setSelectedDepartamento(null) }}>Remover Filtro</button>}
                                        {(tipo_user == 1 || tipo_user == 2) && <a href='/vagas/criar'><button className='btn btn-outline-secondary'>Criar Vaga</button></a>}
                                    </div>

                                </div>
                                <div className='container-fluid px-4'>
                                    <div className='row g-3'>
                                        <TableVagas vagas={vagas} departamentos={departamentos} selectedDepartamento={selectedDepartamento} onVerDetalhes={handleVerDetalhesVaga} onApagar={handleApagarVaga} onEditar={handleEditarVaga} filtro={filtroTitulo}></TableVagas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Modal para apagar uma vaga */}
            <Modal
                open={isApagarModalOpen}
                onClose={closeApagar}
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
                        Tem a certeza que quer eliminar esta vaga?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { closeApagar() }}
                            sx={{ width: '50%' }}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => { _handleApagarVaga(event); closeApagar() }}
                            sx={{ width: '50%' }}
                        >
                            Apagar
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    )
}
