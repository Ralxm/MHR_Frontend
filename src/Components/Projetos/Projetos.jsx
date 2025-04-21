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
import { Delete } from '@mui/icons-material'
import FileDropZone from '../../Universal/FileDropZoneSingle';
import TabelaProjetos from './TabelaProjetos';
import ProjetosPieChart from './ProjetosPieChart'

export default function Projetos() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [projetos, setProjetos] = useState([]);
    const [tab, setTab] = useState('1')

    const [isCreateProjetoModalOpen, setIsCreateProjetoModalOpen] = useState(false)

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
                            <div className='row items-container'>
                                {tab == 1 ?
                                    <span><strong>Projetos</strong></span>
                                    :
                                    <span><strong>Ideias</strong></span>
                                }
                                <div className='row mt-4'>
                                    <ProjetosPieChart projetos={projetos}></ProjetosPieChart>
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
                                                        <button className='btn btn-outline-primary mb-2' onClick={() => setIsCreateProjetoModalOpen(true)}>
                                                            Criar projeto
                                                        </button>
                                                    }
                                                    {tab == 2 &&
                                                        <button className='btn btn-outline-secondary mb-2'>
                                                            Sugerir ideia
                                                        </button>
                                                    }
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>
                                                        <TabelaProjetos projetos={projetos}></TabelaProjetos>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="2">
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
                        width: { xs: 500, sm: 900 },
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
        </div>
    );

    function ModalCriarProjeto({ titulo_projeto, data_inicio, data_final_prevista, descricao, objetivos, perfis }) {
        const [_titulo, set_Titulo] = useState(titulo_projeto || "");
        const [_descricao, set_Descricao] = useState(descricao || "");
        const [_objetivos, set_Objetivos] = useState(objetivos || "");
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
                objetivos: _objetivos,
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
                    <Box className='col-md-6'>
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
                                    rows={6}
                                    onChange={(value) => { set_Descricao(value.target.value) }}
                                />
                                <TextField
                                    label="Objetivos"
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={_objetivos}
                                    onChange={(value) => { set_Objetivos(value.target.value) }}
                                />
                            </Stack>
                        </form>
                    </Box>
                    <Box className='col-md-6'>
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
                </div>
                <Button fullWidth sx={{ mt: 3 }} variant="contained" color="primary" onClick={handleCriar}>
                    Criar
                </Button>
            </>
        )
    }
}