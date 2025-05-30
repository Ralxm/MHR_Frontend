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
import SidebarItems from '../Blog/Sidebar';
import { useSnackbar } from 'notistack';

export default function Blog() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('1')
    const [cols, setCols] = useState(3)

    const [selectedPostAprovar, setSelectedPostAprovar] = useState()
    const [selectedPostRejeitar, setSelectedPostRejeitar] = useState();
    const [selectedPostApagar, setSelectedPostApagar] = useState();

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    const [filtro, setFiltro] = useState('')
    const [filtroTipo, setFiltroTipo] = useState('Todos')

    useEffect(() => {
        document.title = "Blog"

        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo == 5) {
            navigate('/vagas')
        }

        if (tipo == 1 || tipo == 2) {
            navigate('/blog/todas')
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
                const sortedPosts = res.sort((a, b) => {

                const getSortDate = (post) => {
                    if (post.tipo === 'Notícia' && post.data_noticia) {
                        return new Date(post.data_noticia);
                    }
                    if (post.tipo === 'Visita' && post.data_visita) {
                        return new Date(post.data_visita);
                    }
                    return new Date(post.created_at);
                };

                const dateA = getSortDate(a);
                const dateB = getSortDate(b);
                
                return dateB - dateA;
            });
            
            setPosts(sortedPosts);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function handleAceitarPublicacao(id) {
        handleServices.aceitarPublicacao(id, id_perfil)
            .then(res => {
                enqueueSnackbar(res, { variant: 'success' });
                carregarBlog();
                setSelectedPostAprovar(null)
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
            })
    }

    function handleRejeitarPublicacao(id) {
        handleServices.rejeitarPublicacao(id, id_perfil)
            .then(res => {
                enqueueSnackbar(res, { variant: 'success' });
                carregarBlog();
                setSelectedPostRejeitar(null)
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
            })
    }

    function handleApagarPublicacao(id) {
        handleServices.apagarPublicacao(id, id_perfil)
            .then(res => {
                enqueueSnackbar(res, { variant: 'success' });
                carregarBlog();
                setSelectedPostApagar(null);
            })
            .catch(err => {
                enqueueSnackbar(err, { variant: 'error' });
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
            <div className="app-container" style={{ position: 'relative', zIndex: 1000 }}>
                <NavBar />
                <div className="container-fluid">
                    <div className="row d-flex justify-content-between">
                        {(tipo_user == 1 || tipo_user == 2) &&
                            <div className='col-md-2'>
                                <div className="sidebar" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                                    <SidebarItems tipo_user={tipo_user}></SidebarItems>
                                </div>

                            </div>
                        }
                        <div className="col-md-12" style={{ zIndex: 1000 }}>
                            <div className="items-container mt-3" style={{ minHeight: '85vh', border: 'none' }}>
                                <div className='d-flex justify-content-between mb-3' style={{ height: '55px' }}>
                                    <button className='btn btn-primary' onClick={() => setIsCreatePostModalOpen(true)}>Criar publicação</button>
                                    <div>
                                        <FormControl sx={{ minWidth: '150px', height: '100%', mx: 2 }}>
                                            <InputLabel shrink>Tipo</InputLabel>
                                            <Select
                                                label="Estado"
                                                name="estado"
                                                InputLabelProps={{ shrink: true }}
                                                onChange={(value) => setFiltroTipo(value.target.value)}
                                                value={filtroTipo}
                                            >
                                                <MenuItem value={"Todos"} selected>Todos</MenuItem>
                                                <MenuItem value={"Notícia"}>Notícia</MenuItem>
                                                <MenuItem value={"Visita"}>Visita</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Título"
                                            value={filtro}
                                            onChange={(e) => setFiltro(e.target.value)}
                                        />
                                    </div>


                                </div>
                                <div className='row mb-3'>
                                    <div className='container-fluid'>
                                        <div className='row g-3'>
                                            <TabelaPosts
                                                posts={posts}
                                                tipo_user={tipo_user}
                                                id_perfil={id_perfil}
                                                tipo={'User'}
                                                onAceitar={setSelectedPostAprovar}
                                                onRejeitar={setSelectedPostRejeitar}
                                                cols={cols}
                                                onApagar={setSelectedPostApagar}
                                                filtro={filtro}
                                                filtroTipo={filtroTipo}
                                                to={"User"}
                                            >

                                            </TabelaPosts>
                                        </div>
                                    </div>
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
                        maxHeight: '90svh',
                        overflowY: 'auto',
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <ModalCriarPost />
                </Paper>
            </Modal>

            {/* Modal para aceitar uma publicação */}
            <Modal
                open={selectedPostAprovar}
                onClose={() => setSelectedPostAprovar(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 550 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Tem a certeza que pretende aprovar a publicação?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { setSelectedPostAprovar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => { handleAceitarPublicacao(selectedPostAprovar.id_publicacao); setSelectedPostAprovar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Aprovar
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para rejeitar uma publicação */}
            <Modal
                open={selectedPostRejeitar}
                onClose={() => setSelectedPostRejeitar(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 550 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Tem a certeza que pretende rejeitar a publicação?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { setSelectedPostRejeitar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => { handleRejeitarPublicacao(selectedPostRejeitar.id_publicacao); setSelectedPostRejeitar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Apagar
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Modal>

            {/* Modal para apagar uma publicação */}
            <Modal
                open={selectedPostApagar}
                onClose={() => setSelectedPostApagar(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: 300, sm: 550 },
                        borderRadius: 4,
                        p: 4,
                        display: 'flex'
                    }}
                    className='row'
                >
                    <Box className='col-md-12'>
                        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
                            Tem a certeza que pretende apagar a publicação?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => { setSelectedPostApagar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Fechar
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => { handleApagarPublicacao(selectedPostApagar.id_publicacao); setSelectedPostApagar(null) }}
                                sx={{ width: '50%' }}
                            >
                                Apagar
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Modal>
        </div >
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

        const [previewUrl, setPreviewUrl] = useState(null);

        useEffect(() => {
            return () => {
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
            };
        }, [previewUrl]);

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
                    enqueueSnackbar(res, { variant: 'success' });
                    carregarBlog();
                    setIsCreatePostModalOpen(false);
                })
                .catch(err => {
                    enqueueSnackbar(err, { variant: 'error' });
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
                                    setPreviewUrl(URL.createObjectURL(files[0]));
                                }
                            }}
                            accept={{
                                'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
                            }}
                            maxSize={10 * 1024 * 1024}
                        />

                        <div className='d-flex justify-content-center'>
                            {previewUrl && (
                                <div style={{ marginTop: '16px' }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Preview da Imagem:
                                    </Typography>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

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