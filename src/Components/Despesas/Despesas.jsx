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
    const [despesasData, setDespesasData] = useState([]);
    const [tab, setTab] = useState('1')

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

    const handleVerDetalhes = (despesa) => {
        setSelectedDespesa(despesa);
    };

    const handleCloseDetalhes = () => {
        setSelectedDespesa(null);
    };

    const handleFileDrop = (acceptedFiles) => {
        console.log('Arquivos aceitos:', acceptedFiles);
    };

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if(tipo == 5){
            navigate('/vagas')
        }

        let user = localStorage.getItem("id_utilizador")
        if(user){
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        document.title = "Despesas";
    }, []);

    useEffect(() => {
        if(id_user){
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
        if(tipo_user && (tipo_user == 1 || tipo_user == 2)){
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

    function handleCriar(event){
        event.preventDefault();
        handleServices.createDespesa(id_perfil, date, descricao, valor, ficheiro)
        .then(res => {
            alert("Despesa criada com sucesso")
        })
        .catch(err => {
            console.log("Erro a criar a despesa: " + err)
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
                                                <Table data={despesas} onVerDetalhes={handleVerDetalhes} tipo={'Todas'}></Table>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <Table data={despesas} onVerDetalhes={handleVerDetalhes} tipo={'Por Aprovar'}></Table>
                                            </TabPanel>
                                            <TabPanel value="3">
                                                <Table data={despesasPorAprovar} onVerDetalhes={handleVerDetalhes} tipo={'Analisar'}></Table>
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
                                onChange={(value) => {setDate(value.target.value)}}
                            />
                            <TextField
                                label="Descrição"
                                fullWidth
                                onChange={(value) => {setDescricao(value.target.value)}}
                            />
                            <TextField
                                label="Valor"
                                type="number"
                                fullWidth
                                onChange={(value) => {setValor(value.target.value)}}
                            />
                            <FileDropZone
                                onDrop={handleFileDrop}
                                accept={{
                                    'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                    'application/pdf': ['.pdf'],
                                }}
                                maxSize={2 * 1024 * 1024} //2 megabytes
                                onChange={(value) => {setFicheiro(value.target.value)}}
                            />

                            <Button variant="contained" color="primary" onClick={handleCriar}>
                                Criar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Modal>
        </div>
    );
}

function DetalhesDespesa({ despesa }) {
    const convertDateToInputFormat = (date) => {
        const datePart = date.split(' ')[0];
        return datePart;
    };

    const [formData, setFormData] = useState({
        data: convertDateToInputFormat(despesa.data),
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

    const handleSubmit = (e) => {
        e.preventDefault();
        //código para depois fazer as alterações na base de dados
    };

    if (despesa.estado == "Em análise" || despesa.estado == "Pendente") {
        return (
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label"><strong>Data:</strong></label>
                    <input
                        type="date"
                        name="data"
                        value={formData.data}
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
                    <label className="form-label"><strong>Valor:</strong></label>
                    <input
                        type="text"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Anexo:</strong></label>
                    <input
                        type="text"
                        name="anexo"
                        value={formData.anexo}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Validador:</strong></label>
                    <input
                        type="text"
                        name="validador"
                        value={formData.validador}
                        onChange={handleChange}
                        className="form-control"
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Estado:</strong></label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="form-control"
                        disabled
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
                        disabled
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
                        disabled
                        style={{ resize: 'none' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary col-md-12 mb-1">
                    Salvar Alterações
                </button>
            </form>
        );
    }
    else {
        return (
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label"><strong>Data:</strong></label>
                    <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        className="form-control"
                        disabled
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
                        disabled
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
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Anexo:</strong></label>
                    <input
                        type="text"
                        name="anexo"
                        value={formData.anexo}
                        onChange={handleChange}
                        className="form-control"
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Validador:</strong></label>
                    <input
                        type="text"
                        name="validador"
                        value={formData.validador}
                        onChange={handleChange}
                        className="form-control"
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Estado:</strong></label>
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="form-control"
                        disabled
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
                        disabled
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
                        disabled
                        style={{ resize: 'none' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary col-md-12 mb-1">
                    Salvar Alterações
                </button>
            </form>
        );
    }
}

function SumarioDespesas( {despesas} ) {
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