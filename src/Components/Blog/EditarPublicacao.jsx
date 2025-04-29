import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Blog.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Autocomplete, List, ListItem, IconButton, ListItemText } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack, Delete } from '@mui/icons-material'
import authService from '../Login/auth-service';
import handleServices from './handle-services';

export default function EditarPublicacao() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [perfil, setPerfil] = useState();

    const [post, setPost] = useState(null)

    const [tipo, setTipo] = useState();
    const [titulo, setTitulo] = useState();
    const [texto, setTexto] = useState();
    const [data_noticia, setData_Noticia] = useState();
    const [local_visita, setLocal_Visita] = useState();
    const [data_visita, setData_Visita] = useState();
    const [duracao_visita, setDuracao_Visita] = useState();
    const [motivo_visita, setMotivo_Visita] = useState();
    const [estado, setEstado] = useState();
    const [imagem, setImagem] = useState();

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }


        //let tipo = localStorage.getItem('tipo');
        //if (tipo == 5 || tipo == 4 || tipo == 3) {
        //    navigate('/blog')
        //}

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        carregarPost();

        document.title = "Editar Publicação";
    }, []);

    useEffect(() => {
        if (post) {
            setTipo(post.tipo)
            setTitulo(post.titulo)
            setTexto(post.texto);
            setData_Noticia(post.data_noticia);
            setLocal_Visita(post.local_visita);
            setData_Visita(convertDateToInputFormat(post.data_visita));
            setDuracao_Visita(post.duracao_visita);
            setMotivo_Visita(post.motivo_visita);
            setEstado(post.estado);
            setImagem(post.imagem);
        }
    }, [post])

    useEffect(() => {
        if (id_user) {
            handleServices.find_perfil(id_user)
                .then(res => {
                    setPerfil(res)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [id_user])

    useEffect(() => {
        if(post && perfil){
            if(post.id_perfil != perfil.id_perfil){
                navigate('/blog')
            }
        }
    }, [perfil, post])

    function carregarPost() {
        handleServices.getPublicacao(id)
            .then(res => {
                console.log(res[0])
                setPost(res[0])
            })
            .catch(err => {
                console.log(err)
            })
    }

    function convertDateToInputFormat(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function handleEditar(event) {
        event.preventDefault();

        const datapost = {
            id_publicacao: id,
            tipo: tipo,
            titulo: titulo,
            texto: texto,
            estado: estado,
            data_noticia: tipo === 'Notícia' ? data_noticia : null,
            local_visita: tipo === 'Visita' ? local_visita : null,
            data_visita: tipo === 'Visita' ? data_visita : null,
            duracao_visita: tipo === 'Visita' ? duracao_visita : null,
            motivo_visita: tipo === 'Visita' ? motivo_visita : null
        };

        handleServices.editarPublicacao(datapost)
            .then(res => {
                console.log(res)
                alert(res.message)
                navigate('/blog/' + res.data)
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
                                            className='col-md-4'
                                        >
                                            Voltar
                                        </Button>
                                    </div>

                                    <div className='col-md-8'>
                                        <div className='card h-100 p-4' style={{ borderRadius: '10px' }}>
                                            <div className='row mb-3'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <h2 className='mb-0' style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                        Edição da publicação
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className='row p-3'>
                                                <TextField
                                                    label="Título da publicação"
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    value={titulo}
                                                    onChange={(value) => { setTitulo(value.target.value) }}
                                                />
                                            </div>

                                            <div className='row p-1 d-flex align-items-center'>
                                                {tipo == "Notícia" ?
                                                    (
                                                        <>
                                                            <div className='col-md-6'>
                                                                <TextField
                                                                    label="Data da notícia"
                                                                    type="date"
                                                                    InputLabelProps={{ shrink: true }}
                                                                    value={data_noticia}
                                                                    onChange={(value) => { setData_Noticia(value.target.value) }}
                                                                    fullWidth
                                                                />
                                                            </div>
                                                            <div className='col-md-6'>
                                                                <FormControl fullWidth>
                                                                    <InputLabel shrink>Tipo de publicação</InputLabel>
                                                                    <Select
                                                                        label="Tipo de publicação"
                                                                        value={tipo}
                                                                        InputLabelProps={{ shrink: true }}
                                                                        onChange={(value) => { setTipo(value.target.value) }}
                                                                    >
                                                                        <MenuItem value={"Notícia"}>Notícia</MenuItem>
                                                                        <MenuItem value={"Visita"}>Visita</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <>
                                                            <div className='col-md-6'>
                                                                <TextField
                                                                    label="Data da visita"
                                                                    type="date"
                                                                    InputLabelProps={{ shrink: true }}
                                                                    value={data_visita}
                                                                    onChange={(value) => { setData_Visita(value.target.value) }}
                                                                    fullWidth
                                                                />
                                                            </div>
                                                            <div className='col-md-6'>
                                                                <FormControl fullWidth>
                                                                    <InputLabel shrink>Tipo de publicação</InputLabel>
                                                                    <Select
                                                                        label="Tipo de publicação"
                                                                        value={tipo}
                                                                        InputLabelProps={{ shrink: true }}
                                                                        onChange={(value) => { setTipo(value.target.value) }}
                                                                    >
                                                                        <MenuItem value={"Notícia"}>Notícia</MenuItem>
                                                                        <MenuItem value={"Visita"}>Visita</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>

                                            {tipo == "Visita" &&
                                                <>
                                                    <div className='row p-1 mt-3'>
                                                        <div className='col-md-6'>
                                                            <TextField
                                                                label="Local de Visita"
                                                                type="text"
                                                                InputLabelProps={{ shrink: true }}
                                                                value={local_visita}
                                                                onChange={(value) => { setLocal_Visita(value.target.value) }}
                                                                fullWidth
                                                            />
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <TextField
                                                                label="Duração da visita (horas)"
                                                                type="number"
                                                                InputLabelProps={{ shrink: true }}
                                                                value={duracao_visita}
                                                                onChange={(value) => { setDuracao_Visita(value.target.value) }}
                                                                fullWidth
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className='row p-1 mt-3'>
                                                        <div className='col-md-12'>
                                                            <TextField
                                                                label="Motivo da visita"
                                                                type="text"
                                                                InputLabelProps={{ shrink: true }}
                                                                value={motivo_visita}
                                                                onChange={(value) => { setMotivo_Visita(value.target.value) }}
                                                                fullWidth
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            <div className='row p-3 mt-1'>
                                                <TextField
                                                    label="Texto"
                                                    multiline
                                                    minRows={9}
                                                    maxRows={9}
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    value={texto}
                                                    onChange={(value) => { setTexto(value.target.value) }}
                                                    variant="outlined"
                                                />
                                            </div>

                                            <div className='row p-3 d-flex' style={{ flexGrow: 1 }}>
                                                <button className='btn btn-primary' onClick={handleEditar}>Guardar</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-md-2'>

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
