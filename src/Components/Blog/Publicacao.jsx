import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Blog.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Card, CardContent, Avatar, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack, Close, Phone, LocationOn, Attachment } from '@mui/icons-material'
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { useTheme } from '@mui/material/styles';

export default function Publicacao() {
    const { id } = useParams();
    const { state } = useLocation();
    const [post, setPost] = useState(state?.post);
    const navigate = useNavigate();
    const theme = useTheme();

    const [hasViwed, setHasViwed] = useState(false)

    const [isPostLoading, setIsPostLoading] = useState(true);

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        if (!post) {
            carregarPost(id);
        }
        else {
            setIsPostLoading(false)
            post.data_noticia = convertDate(post.data_noticia)
            post.data_visita = convertDate(post.data_visita)
            post.created_at = convertDate(post.created_at)
        }
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
        if (post) {
            document.title = "Publicação: " + post.titulo;
            if(!hasViwed){
                ver(post.id_publicacao)
                setHasViwed(true)
            }
        }
    }, [post, id_user, tipo_user])

    function ver(id){
        handleServices.ver(id)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }


    async function carregarPost(id) {
        setIsPostLoading(true);
        try {
            const res = await handleServices.getPublicacao(id);
            console.log(res)
            const processedPost = {
                ...res[0],
                data_noticia: convertDate(res[0].data_noticia),
                data_visita: convertDate(res[0].data_visita),
                created_at: convertDate(res[0].created_at)
            };
            setPost(processedPost);
        } catch (err) {
            console.log(err);
        } finally {
            setIsPostLoading(false);
        }
    }

    function convertDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }

    function stringToColor(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }


    if (isPostLoading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Error loading post.</div>;
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
                        <div className="col-md-12" style={{ zIndex: 1000 }}>
                            <div className='row'>
                                <div className="items-container p-4 d-flex" style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <div className='col-md-2 d-flex flex-column'>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<ArrowBack />}
                                            onClick={() => navigate('/blog')}
                                            className='col-md-4 mb-3'
                                        >
                                            Voltar
                                        </Button>
                                    </div>

                                    <div className='col-md-8'>
                                        <div className='card h-100 p-4' style={{ borderRadius: '10px' }}>
                                            <div className='row mb-3'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <h2 className='mb-0' style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                        {post && post.titulo}
                                                    </h2>
                                                    <Chip
                                                        label={post?.estado || ''}
                                                        sx={{
                                                            borderRadius: '20px',
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            height: '36px',
                                                            padding: '0 12px'
                                                        }}
                                                        color={
                                                            post?.estado === 'Aprovada' ? 'success' :
                                                                post?.estado === 'Rejeitada' ? 'error' :
                                                                    'warning'
                                                        }
                                                    />
                                                </div>
                                                <h7 className="mt-1">
                                                    Visualizações: {post && post.views + 1}
                                                </h7>
                                            </div>

                                            <div className='row mb-4'>
                                                <div className='d-flex justify-content-between'>
                                                    <div className='dates-container p-3 d-flex align-items-center' style={{ backgroundColor: '#e9f7fe', borderRadius: '8px', flex: 1, marginRight: '15px' }}>
                                                        <div>
                                                            <div style={{ color: '#3498db' }}>
                                                                Data de publicacao: {post && post.created_at}
                                                                {post.tipo == "Notícia" ?
                                                                    <div>
                                                                        Data da notícia: {post && post.data_noticia}
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        Data da visita: {post && post.data_visita}<br></br>
                                                                        Local da visita: {post && post.local_visita}<br></br>
                                                                        Duração da visita: {post && post.duracao_visita} hora(s)
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='vacancy-container p-3'
                                                        style={{
                                                            backgroundColor:
                                                                post?.tipo === 'Notícia' ? theme.palette.primary.main :
                                                                    post?.tipo === 'Visita' ? theme.palette.secondary.main :
                                                                        theme.palette.warning.main,
                                                            borderRadius: '20px',
                                                            textAlign: 'center',
                                                            minWidth: '120px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <h5 style={{
                                                            color:
                                                                post?.tipo === 'Notícia' ? theme.palette.primary.contrastText :
                                                                    post?.tipo === 'Visita' ? theme.palette.secondary.contrastText :
                                                                        theme.palette.warning.contrastText,
                                                            marginBottom: '0',
                                                            fontSize: '1rem',
                                                            fontWeight: 500,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            {post?.tipo || ''}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='row flex-grow-1 mb-2'>
                                                <div className='col-md-12'>
                                                    {post?.imagem && (
                                                        <div className='row mb-4'>
                                                            <div className='col-md-12'>
                                                                <Box
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '400px',
                                                                        borderRadius: '8px',
                                                                        overflow: 'hidden',
                                                                        boxShadow: 2,
                                                                        mb: 3
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`http://localhost:8080/${post.imagem}`}
                                                                        alt={post.titulo}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <h5 className='mb-3' style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '6px' }}>
                                                        <i className="bi bi-file-text me-2"></i>
                                                        Texto:
                                                    </h5>
                                                    <textarea
                                                        className='form-control mt-2 p-3 bg-light'
                                                        style={{
                                                            resize: 'none',
                                                            border: "1px solid #ddd",
                                                            minHeight: '40vh',
                                                            borderRadius: '8px',
                                                            fontSize: '1rem',
                                                            lineHeight: '1.6'
                                                        }}
                                                        disabled={tipo_user != 1 && tipo_user != 2}
                                                        value={post && post.texto}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-md-2' style={{ display: 'flex', flexDirection: 'column' }}>
                                        <header className='mb-2' style={{ width: '100%', zIndex: 1, }}>
                                            <div className='d-flex justify-content-end'>

                                            </div>
                                        </header>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
