import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Despesas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab } from '@mui/material';
import FileDropZone from '../../Universal/FileDropZone'
import DoughnutPieChart from '../../Universal/DoughnutPieChart';
import Table from './TabelaDespesas';
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

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [despesas, setDespesas] = useState([]);
    const [despesasPorAprovar, setDespesasPorAprovar] = useState([])

    const [id_perfil, setPerfil] = useState()
    const [date, setDate] = useState('')
    const [descricao, setDescricao] = useState('')
    const [valor, setValor] = useState()
    const [ficheiro, setFicheiro] = useState('')

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const toggleCreateDespesa = () => {
        setIsCreateModalOpen(!isCreateModalOpen);
    };

    const handleVerDetalhes = (despesa, acao) => {
        setSelectedDespesa(despesa);
        setAcao(acao);
    };

    const handleVerDetalhesEAnalisar = (despesa, acao) => {
        setSelectedDespesa(despesa);
        if(despesa.estado == "Pendente"){
            handleAnalisar(despesa)
        }
        setAcao(acao);
    };

    const handleCloseDetalhes = () => {
        setSelectedDespesa(null);
    };

    const handleApagar = (despesa) => {
        setSelectedDespesa(despesa)
        setIsApagarModalOpen(true)
    };

    const toggleApagarDespesa = () => {
        setIsApagarModalOpen(!isApagarModalOpen)
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
            handleServices.listDespesasPorAprovar()
                .then(res => {
                    setDespesasPorAprovar(res);
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, tipo_user)

    useEffect(() => {
        const summarizedData = summarizeDespesas(despesas);
        setDespesasData(summarizedData);
    }, [despesas])

    function handleCriar(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('id_perfil', id_perfil);
        formData.append('_data', date);
        formData.append('descricao', descricao);
        formData.append('valor', valor);
        formData.append('estado', "Pendente");

        if (ficheiro) {
            formData.append('anexo', ficheiro);
        }

        handleServices.createDespesa(formData)
            .then(res => {
                alert("Despesa criada com sucesso");
                navigate(0)
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleApagarDespesa(event) {
        event.preventDefault();
        handleServices.apagarDespesa(selectedDespesa.id_despesa)
            .then(res => {
                alert("Despesa apagada com sucesso")
                navigate(0)
            })
            .catch(err => {
                console.log("Erro a apagar a despesa: " + err);
            });
    }

    function handleAnalisar(despesa) {
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
            despesa.estado = "Em análise"
            despesa.validador = id_perfil
        })
        .catch(err => {
            alert(err)
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
            <NavBar />
            <div className="page-container-despesas">
                <div className="container-fluid">
                    <div className="row">
                        {/* Coluna da esquerda */}
                        <div className="col-md-4" style={{ zIndex: 1000 }}>
                            <div className='row'>
                                <div className="items-container" style={{ height: '85vh' }}>
                                    <h3>Sumário de despesas</h3>
                                    <div className='row my-5'>
                                        {despesas && despesasData &&
                                            <DoughnutPieChart data={despesasData} />
                                        }
                                    </div>
                                    <div className='row'>
                                        {despesas &&
                                            <SumarioDespesas despesas={despesas}></SumarioDespesas>
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
                                                        <Tab label="As minhas despesas" value="1" />
                                                        <Tab label="por aprovar" value="2" />

                                                        {/* Esta tab só aparece se a conta logada for manager */}
                                                        {(tipo_user == 1 || tipo_user == 2) &&
                                                            <Tab label="Gestão de despesas" value="3" />
                                                        }
                                                        {/* Esta tab só aparece se a conta logada for manager */}
                                                    </TabList>

                                                    <button className='btn btn-outline-secondary mb-2' onClick={toggleCreateDespesa}>
                                                        Criar despesa
                                                    </button>
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <Table data={despesas} onVerDetalhes={handleVerDetalhes} onApagar={handleApagar} tipo={'Todas'}></Table>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <Table data={despesas} onVerDetalhes={handleVerDetalhes} tipo={'Por Aprovar'}></Table>
                                            </TabPanel>
                                            <TabPanel value="3">
                                                <Table data={despesasPorAprovar} onVerDetalhes={handleVerDetalhesEAnalisar} tipo={'Analisar'}></Table>
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
                                        setFicheiro(files[0]);
                                    }
                                }}
                                accept={{
                                    'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                    'application/pdf': ['.pdf'],
                                }}
                                maxSize={5 * 1024 * 1024}
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
                            onClick={() => { toggleApagarDespesa(); handleCloseDetalhes() }}
                            sx={{ width: '50%' }}
                        >
                            Fechar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={(event) => { handleApagarDespesa(event); handleCloseDetalhes(); toggleApagarDespesa() }}
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
        console.log(despesa)
        const [newFile, setNewFile] = useState(null);
        const [fileName, setFileName] = useState(despesa.anexo ? despesa.anexo.split('/').pop() : '');

        const convertDateToInputFormat = (date) => {
            const datePart = date.split(' ')[0];
            return datePart;
        };

        const [formData, setFormData] = useState({
            _data: convertDateToInputFormat(despesa._data),
            descricao: despesa.descricao,
            valor: despesa.valor,
            anexo: despesa.anexo,
            validador: despesa.validador,
            estado: despesa.estado,
            reembolsada_por: despesa.reembolsada_por,
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
                setNewFile(files[0]);
                setFileName(files[0].name);
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

            if (newFile) {
                formDataToSend.append('anexo', newFile);
            }

            formDataToSend.append('validador', formData.validador);
            formDataToSend.append('estado', formData.estado);
            formDataToSend.append('reembolsado_por', formData.reembolsada_por);
            formDataToSend.append('comentarios', formData.comentarios);

            handleServices.atualizarDespesa(formDataToSend)
                .then(res => {
                    alert("Despesa atualizada com sucesso")
                    navigate(0);
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
                        type="text"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className="form-control"
                        disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada" || acao == "analisar"}
                    />
                </div>
                <div className="mb-3">
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        <label className="form-label"><strong>Anexo:</strong></label>
                        {formData.anexo && (
                            <a href={formData.anexo} target="_blank">
                                <button type="button" className='btn btn-outline-info'>Abrir</button>
                            </a>
                        )}
                    </div>

                    <FileDropZone
                        onDrop={handleFileDrop}
                        accept={{
                            'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            'application/pdf': ['.pdf'],
                        }}
                        maxSize={5 * 1024 * 1024}
                        currentFile={fileName}
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
                        disabled = {true}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Estado:</strong></label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="form-control"
                        disabled = {acao == "editar"}
                    >
                        <option value="Aprovada">Aprovada</option>
                        <option value="Em análise">Em análise</option>
                        <option value="Rejeitada">Rejeitada</option>
                        <option value="Reembolsada">Reembolsada</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Reembolsada por:</strong></label>
                    <input
                        type="text"
                        name="reembolsada_por"
                        value={formData.reembolsada_por}
                        onChange={handleChange}
                        className="form-control"
                        disabled = {true}
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
                        disabled = {acao == "editar"}
                        style={{ resize: 'none' }}
                    />
                </div>
                <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1" disabled={despesa.estado === "Aprovada" || despesa.estado === "Reembolsada" || despesa.estado === "Rejeitada"}>
                    Salvar Alterações
                </button>
            </form>
        );
    }
}



function SumarioDespesas({ despesas }) {
    let valorAprovado = 0;
    let valorRejeitado = 0;
    let valorEmAnalise = 0;
    let valorReembolsado = 0;
    let valorPendente = 0;

    let totalAprovado = 0;
    let totalRejeitado = 0;
    let totalEmAnalise = 0;
    let totalReembolsado = 0;
    let totalPendente = 0;

    despesas.map((despesa) => {
        if (despesa.estado === "Aprovada") {
            valorAprovado += parseFloat(despesa.valor);
            totalAprovado++;
        }
        else if (despesa.estado === "Em análise") {
            valorRejeitado += parseFloat(despesa.valor);
            totalRejeitado++;
        }
        else if (despesa.estado === "Rejeitada") {
            valorEmAnalise += parseFloat(despesa.valor);
            totalEmAnalise++;
        }
        else if (despesa.estado === "Reembolsada") {
            valorReembolsado += parseFloat(despesa.valor);
            totalReembolsado++;
        }
        else if (despesa.estado === "Pendente") {
            valorPendente += parseFloat(despesa.valor);
            totalPendente++;
        }
    });
    return (
        <div className="container mb-3 p-3">
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Estado:</strong></td>
                        <td><strong>Quantidade</strong></td>
                        <td><strong>Valor</strong></td>
                    </tr>
                    <tr>
                        <td>Reembolsadas</td>
                        <td>{totalReembolsado}</td>
                        <td>{valorReembolsado}€</td>
                    </tr>
                    <tr>
                        <td>Aprovadas</td>
                        <td>{totalAprovado}</td>
                        <td>{valorAprovado}€</td>
                    </tr>
                    <tr>
                        <td>Em análise</td>
                        <td>{totalEmAnalise}</td>
                        <td>{valorEmAnalise}€</td>
                    </tr>
                    <tr>
                        <td>Rejeitadas</td>
                        <td>{totalRejeitado}</td>
                        <td>{valorRejeitado}€</td>
                    </tr>
                    <tr>
                        <td>Pendentes</td>
                        <td>{totalPendente}</td>
                        <td>{valorPendente}€</td>
                    </tr>
                </tbody>
            </table>

            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{totalAprovado + totalEmAnalise + totalReembolsado + totalRejeitado + totalPendente}</td>
                        <td>{valorAprovado + valorEmAnalise + valorReembolsado + valorRejeitado + valorPendente}€</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
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