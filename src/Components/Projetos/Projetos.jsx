import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Projetos.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem, List, ListItem, IconButton, ListItemText, Autocomplete } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Delete, Close } from '@mui/icons-material'
import FileDropZone from '../../Universal/FileDropZoneSingle';
import TabelaProjetos from './TabelaProjetos';
import ProjetosPieChart from './ProjetosPieChart'
import IdeiasPieChart from './IdeiasPieChart'
import TabelaIdeias from './TabelaIdeias';
import TabelaSumarioProjetos from './TabelaSumarioProjetos';
import TabelaSumarioIdeias from './TabelaSumarioIdeias';

export default function Projetos() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [projetos, setProjetos] = useState([]);
    const [ideias, setIdeias] = useState([]);
    const [tab, setTab] = useState('1')

    const [isCreateProjetoModalOpen, setIsCreateProjetoModalOpen] = useState(false)
    const [isCreateIdeiaModalOpen, setIsCreateIdeiaModalOpen] = useState(false)
    const [selectedIdeia, setSelectedIdeia] = useState();
    const [selectedIdeiaTransformar, setSelectedIdeiaTransformar] = useState();
    const [selectedIdeiaApagar, setSelectedIdeiaApagar] = useState();
    const [selectedProjetoApagar, setSelectedProjetoApagar] = useState();

    const [filtroEstado, setFiltroEstado] = useState("Todos")

    {/* Variáveis para a criação de um projeto */ }
    const [perfis, setPerfis] = useState([]);
    const [titulo_projeto, setTitulo_Projeto] = useState()
    const [descricao, setDescricao] = useState()
    const [objetivos, setObjetivos] = useState()
    const [data_inicio, setData_Inicio] = useState()
    const [data_final_prevista, setData_Final_Prevista] = useState()

    useEffect(() => {
        document.title = "Projetos e ideias"

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

        carregarPerfis();
        carregarProjetos();
        carregarIdeias();
    }, [])

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

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const handleCloseCreateProjetoModal = () => {
        setIsCreateProjetoModalOpen(false)
    }

    const handleCloseCreateIdeiaModal = () => {
        setIsCreateIdeiaModalOpen(false)
    }

    function carregarPerfis() {
        handleServices.carregarPerfis(id_user)
            .then(res => {
                setPerfis(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function carregarProjetos() {
        handleServices.carregarProjetos()
            .then(res => {
                setProjetos(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function carregarIdeias() {
        handleServices.carregarIdeias()
            .then(res => {
                setIdeias(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function handleApagarIdeia() {
        handleServices.apagarIdeia(selectedIdeiaApagar.id_ideia, id_perfil)
            .then(res => {
                alert(res);
                carregarIdeias();
                setSelectedIdeiaApagar(null);
            })
            .catch(err => {
                console.log(err)
            })
    }

    function handleApagarProjeto() {
        handleServices.apagarProjeto(selectedProjetoApagar.id_projeto)
            .then(res => {
                alert(res);
                carregarProjetos();
                setSelectedProjetoApagar(null);
            })
            .catch(err => {
                alert("Não foi possível apagar o projeto. Verifique se este tem algum utilizador, ponto na linha temporal ou comentario associado.")
                console.log(err)
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
            <div className="page-container-projetos">
                <div className="container-fluid">
                    <div className="row" >
                        {/* Coluna da esquerda */}
                        <div className="col-md-3" style={{ zIndex: 1000 }}>
                            <div className='row items-container' style={{ position: 'sticky', top: 10 }}>
                                {tab == 1 ?
                                    <span><strong>Projetos</strong></span>
                                    :
                                    <span><strong>Ideias</strong></span>
                                }
                                <div className='row mt-4'>
                                    {tab == 1 ?
                                        <ProjetosPieChart projetos={projetos}></ProjetosPieChart>
                                        :
                                        <IdeiasPieChart ideias={ideias}></IdeiasPieChart>
                                    }
                                </div>
                                <div className='row mt-4'>
                                    {tab == 1 ?
                                        <TabelaSumarioProjetos projetos={projetos}></TabelaSumarioProjetos>
                                        :
                                        <TabelaSumarioIdeias ideias={ideias}></TabelaSumarioIdeias>
                                    }
                                </div>
                            </div>

                        </div>


                        {/* Coluna da direita */}
                        <div className="col-md-9" style={{ zIndex: 1000 }}>
                            <div className="items-container" style={{ minHeight: '85vh' }}>
                                <div className='row mb-3'>
                                    <Box sx={{ width: 1, typography: 'body1' }}>
                                        <TabContext value={tab}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" style={{ flexGrow: 1 }}>
                                                        <Tab label="Projetos" value="1" sx={{ textTransform: 'none' }} />
                                                        <Tab label="Ideias" value="2" sx={{ textTransform: 'none' }} />
                                                    </TabList>

                                                    {tab == 1 && (tipo_user == 1 || tipo_user == 2) &&
                                                        <>
                                                            <FormControl sx={{ minWidth: '210px', mx: 2, marginBottom: '10px' }}>
                                                                <InputLabel shrink>Estado</InputLabel>
                                                                <Select
                                                                    label="Estado"
                                                                    name="estado"
                                                                    InputLabelProps={{ shrink: true }}
                                                                    onChange={(value) => setFiltroEstado(value.target.value)}
                                                                    value={filtroEstado}
                                                                >
                                                                    <MenuItem value={"Todos"} selected>Todos</MenuItem>
                                                                    <MenuItem value={"Em desenvolvimento"}>Em desenvolvimento</MenuItem>
                                                                    <MenuItem value={"Concluído"}>Concluído</MenuItem>
                                                                    <MenuItem value={"Parado"}>Parado</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                            <button className='btn btn-outline-primary mb-2' onClick={() => setIsCreateProjetoModalOpen(true)}>
                                                                Criar projeto
                                                            </button>
                                                        </>
                                                    }
                                                    {tab == 2 &&
                                                        <button className='btn btn-outline-secondary mb-2' onClick={() => setIsCreateIdeiaModalOpen(true)}>
                                                            Sugerir ideia
                                                        </button>
                                                    }
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>
                                                        <TabelaProjetos projetos={projetos} onApagar={setSelectedProjetoApagar} filtro={filtroEstado}></TabelaProjetos>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>
                                                        <TabelaIdeias ideias={ideias} onVerDetalhes={setSelectedIdeia} onAceitar={setSelectedIdeiaTransformar} onApagar={setSelectedIdeiaApagar}></TabelaIdeias>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </TabContext>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para a criação de um projeto */}
            <Modal
                open={isCreateProjetoModalOpen}
                onClose={handleCloseCreateProjetoModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 700, sm: 1400 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Criar um projeto
                        </Typography>
                        <ModalCriarProjeto
                            titulo_projeto={titulo_projeto}
                            data_inicio={data_inicio}
                            data_final_prevista={data_final_prevista}
                            descricao={descricao}
                            objetivos={objetivos}
                            perfis={perfis}
                        >
                        </ModalCriarProjeto>
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para a criação de uma ideia */}
            <Modal
                open={isCreateIdeiaModalOpen}
                onClose={handleCloseCreateIdeiaModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 500, sm: 700 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Sugerir uma ideia
                        </Typography>
                        <ModalCriarIdeia></ModalCriarIdeia>
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para ver os detalhes de uma ideia */}
            <Modal
                open={selectedIdeia}
                onClose={() => setSelectedIdeia(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 500, sm: 700 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >


                    <Box className='col-md-12'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                                Detalhes de ideia
                            </Typography>
                            <IconButton className='mb-3' onClick={() => setSelectedIdeia(null)}>
                                <Close />
                            </IconButton>
                        </div>
                        {selectedIdeia && <DetalhesIdeia ideia={selectedIdeia}></DetalhesIdeia>}
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para transformar uma ideia num projeto */}
            <Modal
                open={selectedIdeiaTransformar}
                onClose={() => setSelectedIdeiaTransformar(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 700, sm: 1400 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Transformar a ideia em um projeto
                        </Typography>
                        <ModalTransformarIdeia ideia={selectedIdeiaTransformar} perfis={perfis}></ModalTransformarIdeia>
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para apagar uma ideia */}
            <Modal
                open={selectedIdeiaApagar}
                onClose={() => setSelectedIdeiaApagar(null)}
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
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Tem a certeza que pretende rejeitar a ideia?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { setSelectedIdeiaApagar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => { handleApagarIdeia(); setSelectedIdeiaApagar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Rejeitar
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para apagar um projeto */}
            <Modal
                open={selectedProjetoApagar}
                onClose={() => setSelectedProjetoApagar(null)}
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
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Tem a certeza que pretende apagar o projeto?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { setSelectedProjetoApagar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => { handleApagarProjeto(); setSelectedProjetoApagar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Apagar
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Modal>
        </div>
    );

    function ModalCriarProjeto({ titulo_projeto, data_inicio, data_final_prevista, descricao, objetivos, perfis }) {
        const [_titulo, set_Titulo] = useState(titulo_projeto || "");
        const [_descricao, set_Descricao] = useState(descricao || "");
        const [_requisitos, set_Objetivos] = useState(objetivos || "");
        const [_futuras_melhorias, set_Futuras_Melhorias] = useState();
        const [_data_inicio, setData_Inicio] = useState(data_inicio || "");
        const [_data_final_prevista, setData_Final_Prevista] = useState(data_final_prevista || "");


        const [perfisSelecionados, setPerfisSelecionados] = useState([])

        const handleSelectPerfil = (event) => {
            const id = event.target.value;

            if (!perfisSelecionados.some(perfil => perfil.id_perfil === id)) {
                const selectedPerfil = perfis.find(p => p.id_perfil === id);
                setPerfisSelecionados([...perfisSelecionados, selectedPerfil]);
            }
        }

        const handleRemovePerfil = (id) => {
            setPerfisSelecionados(perfisSelecionados.filter(perfil => perfil.id_perfil !== id));
        }

        function handleCriar() {
            const datapost = {
                id_ideia: null,
                titulo_projeto: _titulo,
                estado: "Em desenvolvimento",
                descricao: _descricao,
                requisitos: _requisitos,
                futuras_melhorias: _futuras_melhorias,
                data_inicio: data_inicio,
                data_final_prevista: data_final_prevista,
            }

            handleServices.criarProjeto(datapost)
                .then(res => {
                    if (perfisSelecionados.length > 0 && res.id_projeto) {

                        handleServices.criarPerfisProjetos(perfisSelecionados, res.id_projeto)
                            .then(res => {
                                alert("Projeto e perfis associados com sucesso!");
                            })
                            .catch(err => {
                                alert(err)
                            })
                    } else {
                        alert(res.message || "Projeto criado com sucesso!");
                    }
                    navigate('/projeto/' + res.id_projeto)
                })
                .catch(err => {
                    alert(err)
                })
        }

        return (
            <>
                <div className='row d-flex'>
                    <Box className='col-md-4'>
                        <form>
                            <Stack spacing={2}>
                                <TextField
                                    label="Título do projeto"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={_titulo}
                                    onChange={(value) => { set_Titulo(value.target.value) }}
                                />
                                <TextField
                                    label="Data de ínicio"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={_data_inicio}
                                    onChange={(value) => { setData_Inicio(value.target.value) }}
                                />
                                <TextField
                                    label="Data de final prevista"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={_data_final_prevista}
                                    onChange={(value) => { setData_Final_Prevista(value.target.value) }}
                                />
                                <TextField
                                    label="Descrição"
                                    fullWidth
                                    value={_descricao}
                                    multiline
                                    rows={8}
                                    onChange={(value) => { set_Descricao(value.target.value) }}
                                />
                            </Stack>
                        </form>
                    </Box>
                    <Box className='col-md-4'>
                        <form>
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={perfis.filter(perfil =>
                                            perfil.nome && !perfisSelecionados.some(p => p.id_perfil === perfil.id_perfil)
                                        )}
                                        getOptionLabel={(option) => option.nome}
                                        renderOption={(props, option) => (
                                            <MenuItem {...props} key={option.id_perfil}>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{option.nome}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{option.email}</div>
                                                </div>
                                            </MenuItem>
                                        )}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                handleSelectPerfil({ target: { value: newValue.id_perfil } });
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Utilizadores"
                                                variant="outlined"
                                            />
                                        )}
                                        fullWidth
                                    />
                                </FormControl>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Perfis Selecionados:
                                    </Typography>
                                    <List>
                                        {perfisSelecionados.map((perfil) => (
                                            <ListItem
                                                key={perfil.id_perfil}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => handleRemovePerfil(perfil.id_perfil)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={perfil.nome}
                                                    secondary={perfil.email}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                    <Box className='col-md-4'>
                        <form>
                            <Stack spacing={2}>
                                <TextField
                                    label="Requisitos"
                                    fullWidth
                                    multiline
                                    rows={8}
                                    value={_requisitos}
                                    onChange={(value) => { set_Objetivos(value.target.value) }}
                                />
                                <TextField
                                    label="Futuras Melhorias"
                                    fullWidth
                                    multiline
                                    rows={7}
                                    value={_futuras_melhorias}
                                    onChange={(value) => { set_Futuras_Melhorias(value.target.value) }}
                                />
                            </Stack>
                        </form>
                    </Box>
                </div>
                <Button fullWidth sx={{ mt: 3 }} variant="contained" color="primary" onClick={handleCriar}>
                    Criar
                </Button>
            </>
        )
    }

    function ModalCriarIdeia() {
        const [titulo_ideia, setTitulo_Ideia] = useState();
        const [descricao, setDescricao] = useState();
        const [newFile, setNewFile] = useState()

        function handleCriar() {
            const formData = new FormData();

            formData.append('id_perfil', id_perfil)
            formData.append('titulo_ideia', titulo_ideia)
            formData.append('descricao', descricao)
            formData.append('estado', "Em análise")

            if (newFile) {
                formData.append('ficheiro_complementar', newFile)
            }

            handleServices.criarIdeia(formData)
                .then(res => {
                    alert(res)
                    carregarIdeias();
                    handleCloseCreateIdeiaModal();
                })
                .catch(err => {
                    alert(err)
                })
        }

        return (
            <>
                <div className='row d-flex'>
                    <Box className='col-md-12'>
                        <form>
                            <Stack spacing={2}>
                                <TextField
                                    label="Título do projeto"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={titulo_ideia}
                                    onChange={(value) => { setTitulo_Ideia(value.target.value) }}
                                />
                                <TextField
                                    label="Descrição"
                                    fullWidth
                                    value={descricao}
                                    multiline
                                    rows={8}
                                    onChange={(value) => { setDescricao(value.target.value) }}
                                />
                                <FileDropZone
                                    onDrop={(files) => {
                                        if (files && files.length > 0) {
                                            setNewFile(files[0]);
                                        }
                                    }}
                                    accept={{
                                        'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                                        'application/pdf': ['.pdf'],
                                    }}
                                    maxSize={10 * 1024 * 1024}
                                />
                            </Stack>
                        </form>
                    </Box>
                </div>
                <Button fullWidth sx={{ mt: 3 }} variant="contained" color="primary" onClick={handleCriar}>
                    Criar
                </Button>
            </>
        )
    }

    function DetalhesIdeia({ ideia }) {
        const [newFile, setNewFile] = useState();
        const [descricao, setDescricao] = useState(ideia.descricao || '');
        const [titulo_ideia, setTitulo_Ideia] = useState(ideia.titulo_ideia.trim() || '');

        const formData = new FormData()

        formData.append('id_ideia', ideia.id_ideia)
        formData.append('titulo_ideia', titulo_ideia)
        formData.append('descricao', descricao)
        formData.append('estado', ideia.estado)
        formData.append('validador', ideia.validador)

        if (newFile) {
            formData.append('ficheiro_complementar', newFile)
        }

        function handleSubmit(event) {
            event.preventDefault();

            console.log(formData)

            handleServices.atualizarIdeia(formData)
                .then(res => {
                    alert(res)
                    carregarIdeias();
                    setSelectedIdeia(null);
                })
                .catch(err => {
                    console.log(err)
                })
        }

        return (
            <form onSubmit={{}}>
                <div className='mb-3'>
                    <label><strong>Nome do sugestor:</strong>&nbsp;<span>{ideia && ideia.perfil.nome}</span></label>
                </div>

                <div className="mb-3">
                    <div className='d-flex justify-content-between align-items-center my-2'>
                        <label className="form-label"><strong>Anexo:</strong></label>
                        {ideia.ficheiro_complementar && (
                            <a href={ideia.ficheiro_complementar} target="_blank" rel="noopener noreferrer">
                                <button type="button" className='btn btn-outline-info btn-sm'>Abrir</button>
                            </a>
                        )}
                    </div>
                    <FileDropZone
                        onDrop={(files) => {
                            if (files && files.length > 0) {
                                setNewFile(files[0]);
                            }
                        }}
                        accept={{
                            'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            'application/pdf': ['.pdf'],
                        }}
                        maxSize={10 * 1024 * 1024}
                        disabled={ideia.estado != "Em análise" || id_perfil != ideia.id_perfil}
                    ></FileDropZone>
                </div>

                <div className="mb-3">
                    <TextField
                        label="Título"
                        type="text"
                        name="titulo_ideia"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={titulo_ideia}
                        onChange={(value) => setTitulo_Ideia(value.target.value)}
                        disabled={ideia.estado != "Em análise" || id_perfil != ideia.id_perfil}
                    />
                </div>
                <div className="mb-3">
                    <TextField
                        label="Descrição"
                        type="text"
                        name="descricao"
                        multiline
                        rows={6}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={descricao}
                        onChange={(value) => setDescricao(value.target.value)}
                        disabled={ideia.estado != "Em análise" || id_perfil != ideia.id_perfil}
                    />
                </div>
                <div className="mb-3">
                    <TextField
                        label="Validador"
                        type="text"
                        name="validador"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={ideia.validador ? ideia.validadorPerfil.nome : "Sem validador"}
                        onChange={{}}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <FormControl fullWidth disabled={(ideia.estado != "Em análise" || id_perfil != ideia.id_perfil) || (tipo_user != 1 && tipo_user != 2)}>
                        <InputLabel shrink>Estado</InputLabel>
                        <Select
                            label="Estado"
                            name="estado"
                            value={ideia.estado || ''}
                            onChange={{}}
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value={"Rejeitada"}>Rejeitada</MenuItem>
                            <MenuItem value={"Aceite"}>Aceite</MenuItem>
                            <MenuItem value={"Em análise"}>Em análise</MenuItem>
                        </Select>
                    </FormControl>

                </div>


                <button onClick={handleSubmit} className="btn btn-primary col-md-12 mb-1">
                    Guardar
                </button>
            </form>
        )
    }

    function ModalTransformarIdeia({ ideia, perfis }) {
        const [_titulo, set_Titulo] = useState(ideia.titulo_ideia.trim() || "");
        const [_descricao, set_Descricao] = useState(ideia.descricao || "");
        const [_requisitos, set_Objetivos] = useState();
        const [_futuras_melhorias, set_Futuras_Melhorias] = useState();
        const [_data_inicio, setData_Inicio] = useState();
        const [_data_final_prevista, setData_Final_Prevista] = useState();

        const [perfisSelecionados, setPerfisSelecionados] = useState([])

        useEffect(() => {
            handleSelectPerfil({ target: { value: ideia.id_perfil } })
        }, ideia, perfis)

        const handleSelectPerfil = (event) => {
            const id = event.target.value;

            if (!perfisSelecionados.some(perfil => perfil.id_perfil === id)) {
                const selectedPerfil = perfis.find(p => p.id_perfil === id);
                setPerfisSelecionados([...perfisSelecionados, selectedPerfil]);
            }
        }

        const handleRemovePerfil = (id) => {
            setPerfisSelecionados(perfisSelecionados.filter(perfil => perfil.id_perfil !== id));
        }

        function handleCriar() {
            const datapost = {
                id_ideia: ideia.id_ideia,
                titulo_projeto: _titulo,
                estado: "Em desenvolvimento",
                descricao: _descricao,
                requisitos: _requisitos,
                futuras_melhorias: _futuras_melhorias,
                data_inicio: _data_inicio,
                data_final_prevista: _data_final_prevista,
            }

            handleServices.aceitarIdeia(ideia.id_ideia, id_perfil)
                .then(res => {
                    handleServices.criarProjeto(datapost)
                        .then(res => {
                            if (perfisSelecionados.length > 0 && res.id_projeto) {

                                handleServices.criarPerfisProjetos(perfisSelecionados, res.id_projeto)
                                    .then(res => {
                                        alert("Ideia transformada em projeto com sucesso e utilizadores foram associados ao projeto!");
                                    })
                                    .catch(err => {
                                        alert(err)
                                    })
                            } else {
                                alert(res.message || "Ideia transformada em projeto com sucesso!");
                            }
                            navigate('/projeto/' + res.id_projeto)
                        })
                        .catch(err => {
                            alert(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }

        return (
            <>
                <div className='row d-flex'>
                    <Box className='col-md-4'>
                        <form>
                            <Stack spacing={2}>
                                <TextField
                                    label="Título do projeto"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={_titulo}
                                    onChange={(value) => { set_Titulo(value.target.value) }}
                                />
                                <TextField
                                    label="Data de ínicio"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={_data_inicio}
                                    onChange={(value) => { setData_Inicio(value.target.value) }}
                                />
                                <TextField
                                    label="Data de final prevista"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={_data_final_prevista}
                                    onChange={(value) => { setData_Final_Prevista(value.target.value) }}
                                />
                                <TextField
                                    label="Descrição"
                                    fullWidth
                                    value={_descricao}
                                    multiline
                                    rows={8}
                                    onChange={(value) => { set_Descricao(value.target.value) }}
                                />
                            </Stack>
                        </form>
                    </Box>
                    <Box className='col-md-4'>
                        <form>
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={perfis.filter(perfil =>
                                            perfil.nome && !perfisSelecionados.some(p => p.id_perfil === perfil.id_perfil)
                                        )}
                                        getOptionLabel={(option) => option.nome}
                                        renderOption={(props, option) => (
                                            <MenuItem {...props} key={option.id_perfil}>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{option.nome}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{option.email}</div>
                                                </div>
                                            </MenuItem>
                                        )}
                                        onChange={(event, newValue) => {
                                            if (newValue) {
                                                handleSelectPerfil({ target: { value: newValue.id_perfil } });
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Utilizadores"
                                                variant="outlined"
                                            />
                                        )}
                                        fullWidth
                                    />
                                </FormControl>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Perfis Selecionados:
                                    </Typography>
                                    <List>
                                        {perfisSelecionados.map((perfil) => (
                                            <ListItem
                                                key={perfil.id_perfil}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => handleRemovePerfil(perfil.id_perfil)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={perfil.nome}
                                                    secondary={perfil.email}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                    <Box className='col-md-4'>
                        <form>
                            <Stack spacing={2}>
                                <TextField
                                    label="Requisitos"
                                    fullWidth
                                    multiline
                                    rows={8}
                                    value={_requisitos}
                                    onChange={(value) => { set_Objetivos(value.target.value) }}
                                />
                                <TextField
                                    label="Futuras Melhorias"
                                    fullWidth
                                    multiline
                                    rows={7}
                                    value={_futuras_melhorias}
                                    onChange={(value) => { set_Futuras_Melhorias(value.target.value) }}
                                />
                            </Stack>
                        </form>
                    </Box>
                </div>
                <Button fullWidth sx={{ mt: 3 }} variant="contained" color="primary" onClick={handleCriar}>
                    Criar
                </Button>
            </>
        )
    }
}