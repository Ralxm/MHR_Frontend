import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Blog.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, Chip } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Delete, Close } from '@mui/icons-material'
import TabelaPosts from './TabelaPosts';
import FileDropZone from '../../Universal/FileDropZoneSingle';

export default function Blog() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('1')

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Blog"

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

        carregarBlog();
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

    function carregarBlog() {
        handleServices.carregarBlog()
            .then(res => {
                console.log(res)
                setPosts(res);
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
                        <div className="col-md-12" style={{ zIndex: 1000 }}>
                            <div className="items-container" style={{ minHeight: '85vh' }}>
                                <div className='row mb-3'>
                                    <Box sx={{ width: 1, typography: 'body1' }}>
                                        <TabContext value={tab}>
                                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" style={{ flexGrow: 1 }}>
                                                        <Tab label="Tudo" value="1" sx={{ textTransform: 'none' }} />
                                                        <Tab label="Notícias" value="2" sx={{ textTransform: 'none' }} />
                                                        <Tab label="Visitas" value="3" sx={{ textTransform: 'none' }} />
                                                    </TabList>

                                                    <button className='btn btn-outline-primary mb-2' onClick={() => setIsCreatePostModalOpen(true)}>
                                                        Criar publicação
                                                    </button>
                                                </div>
                                            </Box>

                                            <TabPanel value="1">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>
                                                        <TabelaPosts posts={posts} tipo_user={tipo_user}></TabelaPosts>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="2">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>

                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel value="3">
                                                <div className='container-fluid'>
                                                    <div className='row g-3'>

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

            {/* Modal para criar uma nova publicação */}
            <Modal
                open={isCreatePostModalOpen}
                onClose={() => setIsCreatePostModalOpen(false)}
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
                    }}
                >
                    <ModalCriarPost/>
                </Paper>
            </Modal>
        </div>
    );

    function ModalCriarPost() {
        const [tipo, setTipo] = useState('');
        const [titulo, setTitulo] = useState('');
        const [texto, setTexto] = useState('');
        const [data_noticia, setDataNoticia] = useState('');
        const [local_visita, setLocalVisita] = useState('');
        const [data_visita, setDataVisita] = useState('');
        const [duracao_visita, setDuracaoVisita] = useState('');
        const [motivo_visita, setMotivoVisita] = useState('');
        const [imagem, setImagem] = useState(null);
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            const formData = new FormData();
            formData.append('id_perfil', id_perfil);
            formData.append('tipo', tipo);
            formData.append('titulo', titulo);
            formData.append('texto', texto);
            formData.append('estado', 'Em análise');
            
            if (tipo === 'Notícia') {
                formData.append('data_noticia', data_noticia);
            } else {
                formData.append('local_visita', local_visita);
                formData.append('data_visita', data_visita);
                formData.append('duracao_visita', duracao_visita);
                formData.append('motivo_visita', motivo_visita);
            }
            
            if (imagem) {
                formData.append('imagem', imagem);
            }
    
            handleServices.criarPublicacao(formData)
            .then(res => {
                alert(res)
                navigate(0)
            })
            .catch(err => {
                console.log(err)
            })
        };
    
        return (
            <>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <Typography variant="h6" component="h2">
                        Criar Nova Publicação
                    </Typography>
                    <IconButton onClick={() => setIsCreatePostModalOpen(false)}>
                        <Close />
                    </IconButton>
                </div>
    
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Publicação</InputLabel>
                            <Select
                                value={tipo}
                                label="Tipo de Publicação"
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            >
                                <MenuItem value="Notícia">Notícia</MenuItem>
                                <MenuItem value="Visita">Visita</MenuItem>
                            </Select>
                        </FormControl>
    
                        <TextField
                            label="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            fullWidth
                            required
                        />
    
                        <TextField
                            label="Texto"
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                            required
                        />
    
                        {tipo === 'Notícia' ? (
                            <>
                                <TextField
                                    label="Data da Notícia"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={data_noticia}
                                    onChange={(e) => setDataNoticia(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </>
                        ) : tipo === 'Visita' ? (
                            <>
                                <TextField
                                    label="Local da Visita"
                                    value={local_visita}
                                    onChange={(e) => setLocalVisita(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Data da Visita"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={data_visita}
                                    onChange={(e) => setDataVisita(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Duração (horas)"
                                    type="number"
                                    value={duracao_visita}
                                    onChange={(e) => setDuracaoVisita(e.target.value)}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Motivo da Visita"
                                    value={motivo_visita}
                                    onChange={(e) => setMotivoVisita(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </>
                        ) : null}
    
                        <FileDropZone
                            onDrop={(files) => {
                                if (files && files.length > 0) {
                                    setImagem(files[0]);
                                }
                            }}
                            accept={{
                                'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            }}
                            maxSize={10 * 1024 * 1024}
                        />
    
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button 
                                variant="outlined" 
                                onClick={() => setIsCreatePostModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                            >
                                Criar
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </>
        );
    }
}