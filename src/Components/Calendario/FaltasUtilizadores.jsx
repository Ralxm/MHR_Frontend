import React, { use, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer, Modal, Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SidebarItems from './SidebarItems';
import * as XLSX from 'xlsx';
import { useSnackbar } from 'notistack';

export default function FaltasUtilizadores() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [faltas, setFaltas] = useState([])

    const [selectedFalta, setSelectedFalta] = useState(null)

    const [filtro, setFiltro] = useState('Todos');
    const [filtro_data_inicio, setFiltro_Data_Inicio] = useState(null)
    const [filtro_data_fim, setFiltro_Data_Fim] = useState(null)

    const [selectedFaltas, setSelectedFaltas] = useState([]);

    const [importedFaltas, setImportedFaltas] = useState([]);
    const [showImportModal, setShowImportModal] = useState(false);

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

        document.title = "Calendário";

        carregarFaltas();
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
        const openFalta = sessionStorage.getItem('openFalta');
        if (openFalta) {
            faltas.map((falta) => {
                if (falta.id_falta == openFalta) {
                    setSelectedFalta(falta)
                }
            })
        }
    }, [faltas])

    useEffect(() => {
        if (selectedFalta) {
            const openFalta = sessionStorage.getItem('openFalta');
            if (openFalta) {
                sessionStorage.removeItem('openFalta');
            }
        }
    }, [selectedFalta])

    const handleCloseVerDetalhes = () => {
        setSelectedFalta(null)
    }

    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aprovada":
                return "success";
            case "Em análise":
                return "warning";
            case "Rejeitada":
                return "error";
            default:
                return "";
        }
    };

    const exportToExcel = (selectedFaltas) => {
        if (selectedFaltas.length === 0) {
            enqueueSnackbar("Nenhuma falta selecionada para exportar", { variant: 'error' });
            return;
        }

        console.log(selectedFaltas)

        const data = selectedFaltas.map((falta) => ({
            "ID Perfil": falta.id_perfil,
            "Nome do utilizador": falta.perfil.nome,
            "ID Tipo de falta": falta.id_tipofalta,
            "Tipo de Falta": falta.tipo_falta.tipo,
            "Descrição do tipo de falta": falta.tipo_falta.descricao,
            "Data da Falta": convertDate(falta.data_falta),
            "Estado": falta.estado,
            "Justificação": falta.justificacao ? "Com anexo" : "Sem justificação",
            "Link da justificação": falta.justificacao ? falta.justificacao : "",
            "Motivo": falta.motivo || "N/A",
            "Comentários": falta.comentarios || "N/A",
            "Validado por": falta.validadorPerfil?.nome || "N/A",
            "Data de criação da falta": falta.created_at || "N/A",
            "Data de última edição da falta": falta.updated_at || "N/A",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Faltas");

        XLSX.writeFile(workbook, `faltas_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const parseDateField = (dateValue) => {
        // If it's already a Date object (from Excel)
        if (dateValue instanceof Date) {
            // Excel dates sometimes come as serial numbers, we need to handle this case
            // Create a new date in local time, then convert to ISO string
            const date = new Date(dateValue);
            const isoString = date.toISOString();

            // If the date is completely wrong (like 12/05/2025), try parsing as Excel serial number
            if (date.getFullYear() > new Date().getFullYear() + 5) { // If year is way in the future
                const excelSerialNumber = dateValue;
                const utcDays = Math.floor(excelSerialNumber - 25569); // 25569 = days from 1900 to 1970
                const utcValue = utcDays * 86400 * 1000; // Convert to milliseconds
                return new Date(utcValue).toISOString();
            }
            return isoString;
        }

        // If it's a string (like "26-10-2025")
        if (typeof dateValue === 'string') {
            // Remove any time portion if present
            const dateOnly = dateValue.split(' ')[0];

            const separator = dateOnly.includes('-') ? '-' : '/';
            const parts = dateOnly.split(separator);

            if (parts.length === 3) {
                let day, month, year;

                if (parts[0].length === 4) { // YYYY-MM-DD format
                    year = parts[0];
                    month = parts[1];
                    day = parts[2];
                } else { // DD-MM-YYYY or MM-DD-YYYY format
                    day = parts[0];
                    month = parts[1];
                    year = parts[2];
                }

                // Create date in local time (Excel dates are timezone-less)
                const dateObj = new Date(year, month - 1, day);
                return dateObj.toISOString();
            }
        }

        // If it's a number (Excel serial number format)
        if (typeof dateValue === 'number') {
            const utcDays = Math.floor(dateValue - 25569); // 25569 = days from 1900 to 1970
            const utcValue = utcDays * 86400 * 1000; // Convert to milliseconds
            return new Date(utcValue).toISOString();
        }

        console.warn('Could not parse date, using current date instead');
        return new Date().toISOString();
    };

    const handleFileImport = async (file) => {
        if (!file) return;

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const parsedFaltas = jsonData.map(item => {
                return {
                    id_perfil: item["ID Perfil"],
                    nome_utilizador: item["Nome do utilizador"],
                    id_tipofalta: item["ID Tipo de falta"],
                    tipo_falta: item["Descrição do tipo de falta"],
                    data_falta: parseDateField(item["Data da Falta"]),
                    estado: item["Estado"] || "Pendente",
                    motivo: item["Motivo"] === "N/A" ? null : item["Motivo"],
                    comentarios: item["Comentários"] === "N/A" ? null : item["Comentários"],
                };
            });

            setImportedFaltas(parsedFaltas);
            setShowImportModal(true);
        } catch (error) {
            enqueueSnackbar("Erro a importar o ficheiro excel", { variant: 'error' });
        }
    };

    const handleCreateImportedFaltas = () => {
        const faltasToCreate = importedFaltas.map(falta => ({
            id_perfil: falta.id_perfil,
            id_tipofalta: falta.id_tipofalta,
            data_falta: falta.data_falta,
            estado: falta.estado,
            motivo: falta.motivo,
            comentarios: falta.comentarios
        }));

        handleServices.CriarManyFaltas(faltasToCreate)
            .then(res => {
                enqueueSnackbar(`${res.data.length} faltas criadas com sucesso!`, { variant: 'success' });
                setShowImportModal(false);
                setImportedFaltas([]);
                carregarFaltas();
            })
            .catch(err => { 
                enqueueSnackbar(`Ocorreu um erro ao criar as faltas: ${err.message}`, { variant: 'success' });
            });
    };

    function carregarFaltas() {
        handleServices.carregarFaltas()
            .then(res => {
                setFaltas(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as faltas: " + err)
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

    function formatDateTime(isoString) {
        return isoString.replace('T', ' ').split('.')[0];
    }

    return (
        <div id="root">
            <div
                className="content"
                style={{
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
                }}
            />
            <div className="app-container" style={{ position: 'relative', zIndex: 1000 }}>
                <NavBar />
                <div style={{ display: 'flex', height: 'calc(100vh - [navbar-height])' }}>
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', overflowY: 'auto', position: 'sticky', top: 0 }}>
                        <SidebarItems tipo_user={tipo_user}></SidebarItems>
                    </div>


                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Ver faltas de utilizadores</h2>
                            <div>
                                <TextField
                                    label="Data Inicial"
                                    type="date"
                                    name="filtro_data_inicio"
                                    onChange={(value) => setFiltro_Data_Inicio(value.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Data Final"
                                    type="date"
                                    name="filtro_data_inicio"
                                    onChange={(value) => setFiltro_Data_Fim(value.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mx: 2 }}
                                />
                                <FormControl sx={{ minWidth: '150px' }}>
                                    <InputLabel shrink>Estado</InputLabel>
                                    <Select
                                        label="Estado"
                                        name="estado"
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(value) => setFiltro(value.target.value)}
                                        value={filtro}
                                    >
                                        <MenuItem value={"Todos"} selected>Todos</MenuItem>
                                        <MenuItem value={"Pendente"}>Pendente</MenuItem>
                                        <MenuItem value={"Em análise"}>Em análise</MenuItem>
                                        <MenuItem value={"Rejeitada"}>Rejeitada</MenuItem>
                                        <MenuItem value={"Aprovada"}>Aprovada</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div className='row'>
                            <ListFaltas filtro={filtro} filtro_data_inicio={filtro_data_inicio} filtro_data_fim={filtro_data_fim} selectedFaltas={selectedFaltas}></ListFaltas>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para ver os detalhes de uma falta */}
            <Modal
                open={selectedFalta}
                onClose={handleCloseVerDetalhes}
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
                        maxHeight: { xs: 500, sm: 850 },
                        borderRadius: 4,
                        p: 4,
                        overflowY: 'scroll'
                    }}
                >
                    <Typography id="modal-modal-title" variant="h6">
                        Detalhes da Falta
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {selectedFalta && <DetalhesFalta falta={selectedFalta} />}
                    </Typography>
                    <Button onClick={handleCloseVerDetalhes} className='col-md-12'>Fechar</Button>
                </Paper>
            </Modal>

            {/* Modal para ver todas as faltas importadas através de um ficheiro excel */}
            <Modal
                open={showImportModal}
                onClose={() => setShowImportModal(false)}
                aria-labelledby="import-modal-title"
                aria-describedby="import-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '80%', md: '70%' },
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        p: 4,
                    }}
                >
                    <Typography id="import-modal-title" variant="h6" component="h2">
                        Pré-visualização de Importação ({importedFaltas.length} faltas)
                    </Typography>

                    <TableContainer sx={{ mt: 2, mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome do Perfil</TableCell>
                                    <TableCell>Tipo de Falta</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Comentários</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {importedFaltas.map((falta, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{falta.nome_utilizador}</TableCell>
                                        <TableCell>{falta.tipo_falta}</TableCell>
                                        <TableCell>{convertDate(falta.data_falta)}</TableCell>
                                        <TableCell>{falta.estado}</TableCell>
                                        <TableCell>{falta.motivo || "N/A"}</TableCell>
                                        <TableCell>{falta.comentarios || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            onClick={() => setShowImportModal(false)}
                            sx={{ mr: 2 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateImportedFaltas}
                        >
                            Criar Faltas
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </div>
    );

    function ListFaltas({ filtro, filtro_data_inicio, filtro_data_fim, selectedFaltas }) {

        const selectAllFaltas = () => {
            const filteredIds = filteredFaltas.map(falta => falta.id_falta);

            const newSelection = [...new Set([
                ...selectedFaltas,
                ...filteredFaltas
            ])];

            setSelectedFaltas(newSelection);
        };

        const deselectAllFaltas = () => {
            const filteredIds = filteredFaltas.map(falta => falta.id_falta);
            setSelectedFaltas(selectedFaltas.filter(
                falta => !filteredIds.includes(falta.id_falta)
            ));
        };

        const toggleSelectAll = () => {
            const allFilteredSelected = filteredFaltas.every(falta =>
                selectedFaltas.some(f => f.id_falta === falta.id_falta)
            );

            if (allFilteredSelected) {
                deselectAllFaltas();
            } else {
                selectAllFaltas();
            }
        };

        const handleSelectFalta = (falta, isChecked) => {
            if (isChecked) {
                setSelectedFaltas([...selectedFaltas, falta]);
            } else {
                setSelectedFaltas(selectedFaltas.filter(f => f.id_falta !== falta.id_falta));
            }
        };

        const filteredFaltas = faltas.filter((falta) => {
            const estadoMatches = filtro == "Todos" || falta.estado === filtro;

            const faltaDate = new Date(falta.data_falta);

            const afterStartDate = !filtro_data_inicio || faltaDate >= new Date(filtro_data_inicio);

            const beforeEndDate = !filtro_data_fim || faltaDate <= new Date(filtro_data_fim);

            return estadoMatches && afterStartDate && beforeEndDate;
        });

        return (
            <TableContainer component={Box} sx={{ pl: 0 }}>
                <div>
                    <button className='btn btn-outline-primary' onClick={toggleSelectAll}>
                        {selectedFaltas.length > 0 ? "Remover seleção" : "Selecionar todas"}
                    </button>
                    <button className='btn btn-outline-primary mx-2' onClick={() => exportToExcel(selectedFaltas)} disabled={selectedFaltas.length == 0}>
                        Exportar faltas selecionadas
                    </button>

                    <button
                        className='btn btn-outline-primary'
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        Importar faltas
                    </button>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        accept=".xlsx, .xls"
                        onChange={(e) => handleFileImport(e.target.files[0])}
                    >
                    </input>
                </div>
                <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                            </TableCell>
                            <TableCell align="left">Nome</TableCell>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Anexo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFaltas.map((falta) => {
                            const isSelected = selectedFaltas.some(f => f.id_falta === falta.id_falta);

                            return (
                                <TableRow key={falta.id_falta}>
                                    <TableCell padding="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => handleSelectFalta(falta, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell align="left">{falta.perfil.nome}</TableCell>
                                    <TableCell align="left">{convertDate(falta.data_falta)}</TableCell>
                                    <TableCell align="left">{falta.justificacao ? <a href={falta.justificacao} target="_blank"><button className='btn btn-outline-primary'>Abrir</button></a> : "Sem justificação"}</TableCell>
                                    <TableCell align="left"><Chip label={falta.estado} size='10px' color={getShadowClass(falta.estado)}></Chip></TableCell>
                                    <TableCell align="right"><button className='btn btn-secondary' onClick={() => setSelectedFalta(falta)}>Ver detalhes</button></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    function DetalhesFalta({ falta }) {
        const convertDateToInputFormat = (date) => {
            const datePart = date.split('T')[0];
            return datePart;
        };

        const [formData, setFormData] = useState({
            ...falta,
            data_falta: convertDateToInputFormat(falta.data_falta),
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            const formDataToSend = new FormData();

            formDataToSend.append('id_falta', formData.id_falta);
            formDataToSend.append('id_calendario', formData.id_calendario);
            formDataToSend.append('id_perfil', formData.id_perfil);
            formDataToSend.append('id_tipofalta', formData.id_tipofalta);

            formDataToSend.append('comentarios', formData.comentarios);
            formDataToSend.append('motivo', formData.motivo);
            formDataToSend.append('validador', id_perfil);
            formDataToSend.append('data_falta', formData.data_falta);
            formDataToSend.append('estado', formData.estado);

            handleServices.atualizarFalta(formDataToSend)
                .then(res => {
                    enqueueSnackbar("Falta atualizada com sucesso", { variant: 'success' });
                    carregarFaltas();
                    handleCloseVerDetalhes();
                })
                .catch(err => {
                    enqueueSnackbar(err, { variant: 'error' });
                })
        };


        return (
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label><strong>Nome:</strong>&nbsp;<span>{falta.perfil.nome}</span></label>
                </div>

                <div className="mb-3">
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        <label className="form-label"><strong>Anexo:</strong></label>
                        {falta.justificacao && (
                            <a href={falta.justificacao} target="_blank" rel="noopener noreferrer">
                                <button type="button" className='btn btn-outline-info btn-sm'>Abrir</button>
                            </a>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label><strong>Motivo:</strong></label>
                    <Typography>{formData.motivo}</Typography>
                </div>

                <label><strong>Informações:</strong></label>
                <div className="my-3">
                    <TextField
                        label="Data"
                        type="date"
                        name="data"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.data_falta}
                        onChange={handleChange}
                        disabled={formData.estado != "Pendente"}
                    />
                </div>
                <div className="mb-3">
                    <TextField
                        label="Validador"
                        type="text"
                        name="validador"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.validador ? formData.validadorPerfil.nome : "Sem validador"}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <FormControl fullWidth disabled={formData.estado == "Pendente"}>
                        <InputLabel shrink>Estado</InputLabel>
                        <Select
                            label="Estado"
                            name="estado"
                            value={formData.estado || ''}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value={"Em análise"}>Em análise</MenuItem>
                            <MenuItem value={"Rejeitada"}>Rejeitada</MenuItem>
                            <MenuItem value={"Aprovada"}>Aprovada</MenuItem>
                            {formData.estado == "Pendente" && <MenuItem value={"Pendente"}>Pendente</MenuItem>}
                        </Select>
                    </FormControl>

                </div>
                <div className="mb-3">
                    <TextField
                        label="Comentários"
                        type="text"
                        name="comentarios"
                        rows={6}
                        multiline
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={formData.comentarios}
                        onChange={handleChange}
                        disabled={formData.estado == "Pendente"}
                    />
                </div>


                <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                    Justificar
                </button>
            </form>
        );
    }
}
