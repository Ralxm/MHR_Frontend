import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Despesas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab } from '@mui/material';
import FileDropZone from '../../Universal/FileDropZone'
import DoughnutPieChart from './DoughnutPieChart';
import Table from './TabelaDespesas';
import TableSumarios from './TabelaSumario'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import authService from '../Login/auth-service';
import handleServices from './handle-services';

export default function Despesas() {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDespesa, setSelectedDespesa] = useState(null);
    const [acao, setAcao] = useState(null);
    const [despesasData, setDespesasData] = useState([]);
    const [tab, setTab] = useState('1')
    const [isApagarModalOpen, setIsApagarModalOpen] = useState(false);

    const [despesaApagar, setDespesaApagar] = useState(null)

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [despesas, setDespesas] = useState([]);
    const [despesasGestao, setDespesasGestao] = useState([])
    const [despesasHistorico, setDespesasHistorico] = useState([])

    const [despesasChart, setDespesasChart] = useState([]);
    const [tipoDespesas, setTipoDespesas] = useState('Pessoal')

    const [id_perfil, setPerfil] = useState()
    const [date, setDate] = useState('')
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState()
    const [ficheiros, setFicheiros] = useState([])

    const [despesaAnalisar, setDespesaAnalisar] = useState(null)
    const [acaoAnalisar, setAcaoAnalisar] = useState('')

    const [action, setAction] = useState(false)

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const toggleCreateDespesa = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const handleVerDetalhes = (despesa, acao) => {
        setSelectedDespesa(despesa);
        setAcao(acao);
        if (selectedDespesa) {
            selectedDespesa.estado = "Em análise";
            selectedDespesa.validador = id_perfil;
        }
    };

    const handleVerDetalhesEAnalisar = (despesa, acao) => {
        if (despesa.estado == "Pendente") {
            handleAnalisar(despesa)
        }
        setDespesaAnalisar(despesa)
        setAcaoAnalisar(acao)
    };

    const handleCloseDetalhes = () => {
        setSelectedDespesa(null);
    };

    const handleApagar = (despesa) => {
        setDespesaApagar(despesa)
        setIsApagarModalOpen(true)
    };

    const toggleApagarDespesa = () => {
        setIsApagarModalOpen(!isApagarModalOpen)
    }

    const toggleAction = () => {
        setAction(!action)
    }

    const handleRemoveFile = (index) => {
        setFicheiros(prev => prev.filter((_, i) => i !== index))
    };

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

        document.title = "Despesas";
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
        handleServices.listDespesas(id_perfil)
            .then(res => {
                setDespesas(res);
            })

            .catch(err => {
                console.log("Não foi possivel encontrar as despesas do utilizador: " + err)
            })
    }, [id_perfil])

    useEffect(() => {
        if (tipo_user && (tipo_user == 1 || tipo_user == 2)) {
            handleServices.listDespesasGestao()
                .then(res => {
                    setDespesasGestao(res);
                })
                .catch(err => {
                    console.log(err)
                })
            handleServices.listDespesasHistorico()
                .then(res => {
                    setDespesasHistorico(res);
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, tipo_user)

    function carregarDespesas() {
        handleServices.listDespesas(id_perfil)
            .then(res => {
                setDespesas(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as despesas do utilizador: " + err)
            })
    }

    function carregarDespesasGestao() {
        if (tipo_user && (tipo_user == 1 || tipo_user == 2)) {
            handleServices.listDespesasGestao()
                .then(res => {
                    setDespesasGestao(res);
                })
                .catch(err => {
                    console.log(err)
                })
            handleServices.listDespesasHistorico()
                .then(res => {
                    setDespesasHistorico(res);
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }


    useEffect(() => {
        setDespesasChart(despesas)
    }, [despesas])

    useEffect(() => {
        const summarizedData = summarizeDespesas(despesasChart);
        setDespesasData(summarizedData);
    }, [despesasChart])

    useEffect(() => {
        toggleAction()
        setSelectedDespesa(despesaAnalisar);
        setAcao(acaoAnalisar);
    }, [despesaAnalisar, acaoAnalisar])

    useEffect(() => {
        switch (tab) {
            case '1':
                setDespesasChart(despesas);
                setTipoDespesas("Pessoal")
                break;
            case '2':
                setDespesasChart(despesas)
                setTipoDespesas("Pessoal")
                break;
            case '3':
                setDespesasChart(despesasGestao)
                setTipoDespesas("Empresa")
                break;
            case '4':
                setDespesasChart(despesasHistorico)
                setTipoDespesas("Empresa")
                break;
        }
    }, [tab])

    function handleCriar(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('id_perfil', id_perfil);
        formData.append('_data', date);
        formData.append('descricao', descricao);
        formData.append('valor', valor);
        formData.append('estado', "Pendente");

        if (ficheiros && ficheiros.length > 0) {
            ficheiros.forEach(file => {
                formData.append('anexos', file);
            });
        }

        handleServices.createDespesa(formData)
            .then(res => {
                alert("Despesa criada com sucesso");
                carregarDespesas();
                carregarDespesasGestao();
                toggleCreateDespesa();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleApagarDespesa(event) {
        event.preventDefault();
        handleServices.apagarDespesa(despesaApagar.id_despesa)
            .then(res => {
                alert("Despesa apagada com sucesso")
                carregarDespesas();
                carregarDespesasGestao();
                toggleApagarDespesa();
            })
            .catch(err => {
                console.log("Erro a apagar a despesa: " + err);
            });
    }

    function handleAnalisar(despesa) {
        if (despesa.estado == "Pendente") {
            const formDataToSend = new FormData();

            formDataToSend.append('id_departamento', despesa.id_departamento);
            formDataToSend.append('id_projeto', despesa.id_projeto);
            formDataToSend.append('id_perfil', despesa.id_perfil);
            formDataToSend.append('id_despesa', despesa.id_despesa);
            formDataToSend.append('_data', despesa._data);
            formDataToSend.append('descricao', despesa.descricao);
            formDataToSend.append('valor', despesa.valor);
            formDataToSend.append('validador', id_perfil);
            formDataToSend.append('estado', "Em análise");
            formDataToSend.append('reembolsado_por', despesa.reembolsada_por);
            formDataToSend.append('comentarios', despesa.comentarios);

            handleServices.atualizarDespesa(formDataToSend)
                .then(res => {
                    despesasGestao.map((des) => {
                        if (des.id_despesa == despesa.id_despesa) {
                            des.estado = "Em análise"
                            des.validador = id_perfil
                        }
                        setAcao('analisar')
                    })

                })
                .catch(err => {
                    alert(err)
                })
        }
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
                                        <span><strong>Sumário de Despesas</strong></span>
                                        {(tipo_user == 1 || tipo_user == 2) && (
                                            tipoDespesas === "Pessoal" ? (
                                                <div>
                                                    <Chip label="Pessoal" color='primary' className='mx-2'></Chip>
                                                    <Chip label="Empresa" color='gray'></Chip>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Chip label="Pessoal" color='gray' className='mx-2'></Chip>
                                                    <Chip label="Empresa" color='primary'></Chip>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className='row my-3'>
                                        {despesas && despesasData &&
                                            <DoughnutPieChart data={despesasData} />
                                        }
                                    </div>
                                    <div className='row'>
                                        {despesas &&
                                            <SumarioDespesas despesas={despesasChart}></SumarioDespesas>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-8" style={{ zIndex: 1000 }}>
                            {/* Listagem de uma despesa */}
                            <div className="items-container" style={{ height: '85vh', overflowY: 'auto' }}>
                                <div className="d-flex mb-3">
                                    <Box sx={{ width: 1, typography: 'body1' }}>
                                        <TabContext value={tab}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" style={{ flexGrow: 1 }}>
                                                        <Tab label="As minhas despesas" value="1" sx={{ textTransform: 'none' }} />
                                                        <Tab label="As minhas despesas por aprovar" value="2" sx={{ textTransform: 'none' }} />

                                                        {/* Esta tab só aparece se a conta logada for manager */}
                                                        {(tipo_user == 1 || tipo_user == 2) &&
                                                            <Tab label="Gestão de despesas" value="3" sx={{ textTransform: 'none' }} />
                                                        }
                                                        {(tipo_user == 1 || tipo_user == 2) &&
                                                            <Tab label="Histórico" value="4" sx={{ textTransform: 'none' }} />
                                                        }
                                                        {/* Esta tab só aparece se a conta logada for manager */}
                                                    </TabList>

                                                    <button className='btn btn-outline-secondary mb-2' onClick={toggleCreateDespesa}>
                                                        Criar despesa
                                                    </button>
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <Table data={despesas} onVerDetalhes={handleVerDetalhes} onApagar={handleApagar} tipo={'Todas'} action={action}></Table>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <Table data={despesas} onVerDetalhes={handleVerDetalhes} onApagar={handleApagar} tipo={'Por Aprovar'} action={action}></Table>
                                            </TabPanel>
                                            <TabPanel value="3">
                                                <Table data={despesasGestao} onVerDetalhes={handleVerDetalhesEAnalisar} tipo={'Analisar'} action={action}></Table>
                                            </TabPanel>
                                            <TabPanel value="4">
                                                <Table data={despesasHistorico} onVerDetalhes={handleVerDetalhes} tipo={'Historico'} action={action}></Table>
                                            </TabPanel>
                                        </TabContext>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para mostrar os detalhes de uma despesa */}
            <Modal
                open={selectedDespesa}
                onClose={handleCloseDetalhes}
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
                        Detalhes da Despesa
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {selectedDespesa && <DetalhesDespesa despesa={selectedDespesa} />}
                    </Typography>
                    <Button onClick={handleCloseDetalhes} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            {/* Modal para a criação de uma despesa */}
            <Modal
                open={isCreateModalOpen}
                onClose={toggleCreateDespesa}
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
                        Criar uma Despesa
                    </Typography>
                    <form>
                        <Stack spacing={2}>
                            <TextField
                                label="Data"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={(value) => { setDate(value.target.value) }}
                            />
                            <TextField
                                label="Descrição"
                                fullWidth
                                onChange={(value) => { setDescricao(value.target.value) }}
                            />
                            <TextField
                                label="Valor"
                                type="number"
                                fullWidth
                                onChange={(value) => { setValor(value.target.value) }}
                            />
                            <FileDropZone
                                onDrop={(files) => {
                                    if (files && files.length > 0) {
                                        setFicheiros(prevFiles => {
                                            const previousFiles = Array.isArray(prevFiles) ? prevFiles : [];
                                            return [...previousFiles, ...files];
                                        });
                                    }
                                }}
                                accept={{
                                    'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                    'application/pdf': ['.pdf'],
                                }}
                                maxSize={5 * 1024 * 1024}
                                handleRemoveFile={handleRemoveFile}
                                multiple={true}
                            />

                            <Button variant="contained" color="primary" onClick={handleCriar}>
                                Criar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Modal>

            {/*Modal para apagar uma despesa */}
            <Modal
                open={isApagarModalOpen}
                onClose={toggleApagarDespesa}
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
                        Tem a certeza que quer eliminar esta despesa?
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { toggleApagarDespesa() }}
                            sx={{ width: '50%' }}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => { handleApagarDespesa(event); toggleApagarDespesa() }}
                            sx={{ width: '50%' }}
                        >
                            Apagar
                        </Button>
                    </Stack>
                </Paper>
            </Modal>
        </div>
    );

    function DetalhesDespesa({ despesa }) {
        const [newFiles, setNewFiles] = useState([]);
        const [existingFiles, setExistingFiles] = useState(
            despesa.anexo ? JSON.parse(despesa.anexo) : []
        );

        const convertDateToInputFormat = (date) => {
            const datePart = date.split(' ')[0];
            return datePart;
        };

        const [formData, setFormData] = useState({
            _data: convertDateToInputFormat(despesa._data),
            descricao: despesa.descricao,
            valor: despesa.valor,
            anexo: despesa.anexo,
            validador: selectedDespesa.validador,
            estado: selectedDespesa.estado,
            reembolsado_por: despesa.reembolsado_por,
            comentarios: despesa.comentarios,
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleFileDrop = (files) => {
            if (files && files.length > 0) {
                setNewFiles(prevFiles => [...prevFiles, ...files]);
            }
        };

        const handleRemoveFile = (index, isNewFile) => {
            if (isNewFile) {
                setNewFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
            } else {
                setExistingFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const formDataToSend = new FormData();

            formDataToSend.append('id_departamento', despesa.id_departamento);
            formDataToSend.append('id_projeto', despesa.id_projeto);
            formDataToSend.append('id_perfil', despesa.id_perfil);

            formDataToSend.append('id_despesa', despesa.id_despesa);
            formDataToSend.append('_data', formData._data);
            formDataToSend.append('descricao', formData.descricao);
            formDataToSend.append('valor', formData.valor);

            newFiles.forEach(file => {
                formDataToSend.append('anexos', file);
            });

            formDataToSend.append('existingAnexos', JSON.stringify(existingFiles));

            if (acao == "reembolsar") {
                formData.estado = "Reembolsada";
                formData.reembolsado_por = id_perfil;
            }

            if (formData.estado == "Pendente" && acao == "analisar") {
                formData.estado = "Em análise"
            }

            if (formData.estado == "Em análise" && acao == "editar") {
                formData.estado = "Pendente"
            }

            formDataToSend.append('validador', formData.validador);
            formDataToSend.append('estado', formData.estado);
            formDataToSend.append('reembolsado_por', formData.reembolsado_por);
            formDataToSend.append('comentarios', formData.comentarios);

            handleServices.atualizarDespesa(formDataToSend)
                .then(res => {
                    alert("Despesa atualizada com sucesso")
                    setAcao(null)
                    carregarDespesas();
                    carregarDespesasGestao();
                    handleCloseDetalhes();
                })
                .catch(err => {
                    console.log(err);
                })
        };


        return (
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label><strong>Nome do criador:</strong>&nbsp;<span>{despesa.perfil.nome}</span></label>
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Data:</strong></label>
                    <input
                        type="date"
                        name="_data"
                        value={formData._data}
                        onChange={handleChange}
                        className="form-control"
                        disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada" || acao == "analisar"}
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
                        disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada" || acao == "analisar"}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Valor:</strong></label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className="form-control"
                        disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada" || acao == "analisar"}
                    />
                </div>
                <div className="mb-3">
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        <label className="form-label"><strong>Anexos:</strong></label>
                    </div>

                    {existingFiles.map((filePath, index) => (
                        <div key={`existing-${index}`} className="d-flex justify-content-between align-items-center mb-2">
                            <a href={"http://localhost:8080/" + filePath} target="_blank" rel="noopener noreferrer">
                                <button type="button" className='btn btn-outline-info btn-sm'>Anexo {index + 1}</button>
                            </a>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveFile(index, false)}
                                disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada" || acao == "analisar"}
                            >
                                Remover
                            </button>
                        </div>
                    ))}

                    <FileDropZone
                        onDrop={handleFileDrop}
                        accept={{
                            'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            'application/pdf': ['.pdf'],
                        }}
                        maxSize={5 * 1024 * 1024}
                        multiple={true}
                        disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada" || acao == "analisar"}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Validador:</strong></label>
                    <input
                        type="text"
                        name="validador"
                        value={despesa.validadorPerfil ? despesa.validadorPerfil.nome : "Sem validador"}
                        onChange={handleChange}
                        className="form-control"
                        disabled={true}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Estado:</strong></label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="form-control"
                        disabled={acao == "editar"}
                    >
                        {(despesa.estado == "Aprovada" || despesa.estado == "Reembolsada") && <option value="Reembolsada">Reembolsada</option>}
                        {despesa.estado != "Aprovada" && acao != "reembolsar" && <option value="Em análise">Em análise</option>}
                        {despesa.estado != "Aprovada" && acao != "reembolsar" && <option value="Aprovada">Aprovada</option>}
                        {despesa.estado != "Aprovada" && acao != "reembolsar" && <option value="Rejeitada">Rejeitada</option>}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Reembolsada por:</strong></label>
                    <input
                        type="text"
                        name="reembolsada_por"
                        value={despesa.reembolsadorPerfil ? despesa.reembolsadorPerfil.nome : "Sem Reembolsador"}
                        onChange={handleChange}
                        className="form-control"
                        disabled={true}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Comentários:</strong></label>
                    <textarea
                        name="comentarios"
                        value={formData.comentarios}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                        disabled={acao == "editar"}
                        style={{ resize: 'none' }}
                    />
                </div>

                {despesa.estado == "Aprovada" && acao == "reembolsar" ?
                    <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                        Reembolsar
                    </button>

                    :

                    <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1" disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada"}>
                        Guardar Alterações
                    </button>
                }

            </form>
        );
    }

    function SumarioDespesas({ despesas }) {
        return (
            <div className="container">
                <TableSumarios despesas={despesas} action={action}>

                </TableSumarios>
            </div>
        )
    }
}

const summarizeDespesas = (despesas) => {
    const summary = {};

    despesas.forEach((despesa) => {
        const estado = despesa.estado;
        const valor = parseFloat(despesa.valor.replace(',', '.'));

        if (!summary[estado]) {
            summary[estado] = 0;
        }
        summary[estado] += valor;
    });

    return Object.keys(summary).map((estado) => ({
        name: estado,
        value: summary[estado],
    }));
};