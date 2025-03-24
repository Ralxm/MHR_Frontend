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

let despesas = [{
    data: "19-02-2023",
    descricao: 'Uma descricao interessante',
    valor: '49.02',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Aprovada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "23-11-2024",
    descricao: 'Uma descricao interessante',
    valor: '156.72',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Em análise",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "11-12-2024",
    descricao: 'Uma descricao interessante',
    valor: '288.99',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Rejeitada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "04-01-2025",
    descricao: 'Uma descricao interessante',
    valor: '56.23',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Rejeitada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "23-02-2025",
    descricao: 'Uma descricao interessante',
    valor: '542.55',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Reembolsada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
}];

export default function Despesas() {
    const navigate = useNavigate();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDespesa, setSelectedDespesa] = useState(null);
    const [despesasData, setDespesasData] = useState([]);
    const [tab, setTab] = useState('1')

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

        document.title = "Despesas";

        const summarizedData = summarizeDespesas(despesas);
        setDespesasData(summarizedData);
    }, []);

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
                                        <DoughnutPieChart data={despesasData} />
                                    </div>
                                    <div className='row'>
                                        <SumarioDespesas />
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
                                                        <Tab label="Gestão de despesas" value="3" />
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
                            />
                            <TextField
                                label="Descrição"
                                fullWidth
                            />
                            <TextField
                                label="Valor"
                                type="number"
                                fullWidth
                            />
                            <FileDropZone
                                onDrop={handleFileDrop}
                                accept={{
                                    'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                    'application/pdf': ['.pdf'],
                                }}
                                maxSize={2 * 1024 * 1024} //2 megabytes
                            />

                            <Button type="submit" variant="contained" color="primary">
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
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
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

function ExemplosDespesas({ onVerDetalhes }) {
    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aprovada":
                return "success";
            case "Em análise":
                return "warning";
            case "Rejeitada":
                return "error";
            case "Reembolsada":
                return "success";
            default:
                return "";
        }
    };

    return (
        <div className="row">
            {despesas.map((despesa, index) => (
                <div key={index} className="col-md-12 mb-3">
                    <div className={`border rounded p-3 ${getShadowClass(despesa.estado)}`}>
                        <div className="row d-flex align-items-center">
                            <div className="col-md-2">
                                <strong>Data:</strong> {despesa.data}
                            </div>
                            <div className="col-md-2">
                                <strong>Valor:</strong> {despesa.valor}
                            </div>
                            <div className="col-md-3">
                                <strong>Anexo: </strong><a href={despesa.anexo} target="_blank" style={{ color: 'black' }}>Clique aqui</a>
                            </div>
                            <div className="col-md-3">
                                <Chip label={despesa.estado} color={getShadowClass(despesa.estado)} size='10px'></Chip>
                            </div>
                            <div className="col-md-2">
                                <button className='btn btn-secondary' onClick={() => onVerDetalhes(despesa)}>Ver detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SumarioDespesas() {
    let valorAprovado = 0;
    let valorRejeitado = 0;
    let valorEmAnalise = 0;
    let valorReembolsado = 0;

    let totalAprovado = 0;
    let totalRejeitado = 0;
    let totalEmAnalise = 0;
    let totalReembolsado = 0;
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
                </tbody>
            </table>

            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{totalAprovado + totalEmAnalise + totalReembolsado + totalRejeitado}</td>
                        <td>{valorAprovado + valorEmAnalise + valorReembolsado + valorRejeitado}€</td>
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