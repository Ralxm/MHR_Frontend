import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Blog.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, TextField, Tab, Stack, FormControl, InputLabel, Select, MenuItem, IconButton, Autocomplete } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Delete, Close } from '@mui/icons-material'
import TabelaPosts from './TabelaPosts';
import FileDropZone from '../../Universal/FileDropZoneSingle';
import SidebarItems from '../Blog/Sidebar';

export default function BlogPotUtilizador() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [posts, setPosts] = useState([]);

    const [selectedPostAprovar, setSelectedPostAprovar] = useState()
    const [selectedPostRejeitar, setSelectedPostRejeitar] = useState();
    const [selectedPostApagar, setSelectedPostApagar] = useState();

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    const [perfis, setPerfis] = useState([]);
    const [selectedPerfil, setSelectedPerfil] = useState();

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
        carregarPerfis();
    }, [])

    useEffect(() => {
        if (id_user) {
            handleServices.find_perfil(id_user)
                .then(res => {
                    setPerfil(res.id_perfil);
                    setSelectedPerfil(res)
                })
                .catch(err => {
                    console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
                })
        }
    }, [id_user])


    function carregarPerfis() {
        handleServices.carregarPerfis(id_user)
            .then(res => {
                setPerfis(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function carregarBlog() {
        handleServices.carregarBlog()
            .then(res => {
                setPosts(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err)
            })
    }

    function handleAceitarPublicacao(id) {
        handleServices.aceitarPublicacao(id, id_perfil)
            .then(res => {
                alert(res);
                carregarBlog();
                setSelectedPostAprovar(null)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function handleRejeitarPublicacao(id) {
        handleServices.rejeitarPublicacao(id, id_perfil)
            .then(res => {
                alert(res);
                carregarBlog();
                setSelectedPostRejeitar(null)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function handleApagarPublicacao(id) {
        handleServices.apagarPublicacao(id, id_perfil)
            .then(res => {
                alert(res);
                setSelectedPostApagar(null);
            })
            .catch(err => {
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
            <div className="app-container" style={{ position: 'relative', zIndex: 1000 }}>
                <NavBar />
                <div style={{ display: 'flex', height: 'calc(100vh - [navbar-height])' }}>
                    {(tipo_user == 1 || tipo_user == 2) &&
                        <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto', position: 'sticky', top: 0 }}>
                            <SidebarItems tipo_user={tipo_user} onCriar={setIsCreatePostModalOpen}></SidebarItems>
                        </div>
                    }
                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Filtrar publicações por utilizador</h2>
                            <FormControl sx={{ width: '200px' }}>
                                <Autocomplete
                                    options={perfis.filter(perfil => perfil.nome)}
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
                                        setSelectedPerfil(newValue);
                                    }}
                                    value={selectedPerfil}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Utilizador"
                                            variant="outlined"
                                        />
                                    )}
                                    fullWidth
                                />
                            </FormControl>
                        </div>

                        <div className='row d-flex'>
                            <TabelaPosts
                                posts={posts}
                                tipo_user={tipo_user}
                                id_perfil={id_perfil}
                                tipo={'Por_User'}
                                onAceitar={setSelectedPostAprovar}
                                onRejeitar={setSelectedPostRejeitar}
                                user={selectedPerfil}
                                loggedid={id_perfil}
                                cols={3}
                                onApagar={setSelectedPostApagar}
                            />
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
                    alert(res)
                    carregarBlog();
                    setIsCreatePostModalOpen(false);
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