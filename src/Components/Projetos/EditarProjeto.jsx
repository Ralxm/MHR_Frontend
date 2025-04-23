import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Projetos.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Autocomplete, List, ListItem, IconButton, ListItemText } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack, Delete } from '@mui/icons-material'
import authService from '../Login/auth-service';
import handleServices from './handle-services';

export default function EditarProjeto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [perfis, setPerfis] = useState([]);
    const [projeto, setProjeto] = useState(null)

    const [titulo_projeto, setTitulo_Projeto] = useState('')
    const [estado, setEstado] = useState('')
    const [descricao, setDescricao] = useState('')
    const [requisitos, setRequisitos] = useState('')
    const [futuras_melhorias, setFuturas_Melhorias] = useState()
    const [data_inicio, setData_Inicio] = useState('')
    const [data_final_prevista, setData_Final_Prevista] = useState('')

    const [perfisSelecionadosInicial, setPerfisSelecionadosInicial] = useState([])
    const [perfisSelecionados, setPerfisSelecionados] = useState([])

    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo == 5 || tipo == 4 || tipo == 3) {
            navigate('/projetos')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }
        carregarProjeto();
        carregarPerfis();
        
        document.title = "Editar Projeto";
    }, []);

    useEffect(() => {
        if (projeto) {
            setTitulo_Projeto(projeto.titulo_projeto)
            setEstado(projeto.estado)
            setDescricao(projeto.descricao)
            setRequisitos(projeto.requisitos)
            setFuturas_Melhorias(projeto.futuras_melhorias)
            setData_Inicio(convertDateToInputFormat(projeto.data_inicio))
            setData_Final_Prevista(convertDateToInputFormat(projeto.data_final_prevista))

            carregarPerfisSelecionados(projeto.id_projeto);
        }
    }, [projeto])

    function carregarProjeto() {
        handleServices.getProjeto(id)
            .then(res => {
                setProjeto(res[0])
            })
            .catch(err => {
                console.log(err)
            })
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

    function carregarPerfisSelecionados(id) {
        handleServices.carregarUtilizadores(id)
            .then(res => {
                const perfis = res.map(item => item.perfil);
                setPerfisSelecionados(perfis);
                setPerfisSelecionadosInicial(perfis);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar o perfil do utilizador: " + err);
            });
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
            id_projeto: projeto.id_projeto,
            titulo_projeto: titulo_projeto,
            estado: estado,
            descricao: descricao,
            requisitos: requisitos,
            futuras_melhorias: futuras_melhorias,
            data_inicio: data_inicio,
            data_final_prevista: data_final_prevista
        }

        console.log(datapost)

        handleServices.updateProjeto(datapost)
            .then(res => {
                handleServices.atualizarPerfisProjeto(perfisSelecionadosInicial, perfisSelecionados, projeto.id_projeto)
                .then(res => {
                    alert("Projeto e perfis atualizados com sucesso")
                })
                .catch(err => {
                    alert("Projeto atualizado com sucesso mas os utilizadores não foram atualizados")
                })
                navigate('/projeto/' + projeto.id_projeto)
            })
            .catch(err => {
                console.log(err);
            });
    }

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
                                            onClick={() => navigate('/projetos')}
                                            className='col-md-4'
                                        >
                                            Voltar
                                        </Button>
                                        <Box className='col-md-11 mt-4'>
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
                                                            Perfis pertencentes ao projeto:
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

                                    <div className='col-md-8'>
                                        <div className='card h-100 p-4' style={{ borderRadius: '10px' }}>
                                            <div className='row mb-3'>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <h2 className='mb-0' style={{ color: '#2c3e50', fontWeight: '600' }}>
                                                        Edição do projeto
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className='row p-3'>
                                                <TextField
                                                    label="Título do projeto"
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    value={titulo_projeto}
                                                    onChange={(value) => { setTitulo_Projeto(value.target.value) }}
                                                />
                                            </div>

                                            <div className='row p-1 d-flex align-items-center'>
                                                <div className='col-md-4'>
                                                    <TextField
                                                        label="Data de inicio"
                                                        type="date"
                                                        InputLabelProps={{ shrink: true }}
                                                        value={data_inicio}
                                                        onChange={(value) => { setData_Inicio(value.target.value) }}
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className='col-md-4'>
                                                    <FormControl fullWidth>
                                                        <InputLabel shrink>Estado</InputLabel>
                                                        <Select
                                                            label="Estado"
                                                            value={estado || ''}
                                                            onChange={(value) => { setEstado(value.target.value) }}
                                                        >
                                                            <MenuItem value={"Em desenvolvimento"}>{"Em desenvolvimento"}</MenuItem>
                                                            <MenuItem value={"Concluído"}>{"Concluído"}</MenuItem>
                                                            <MenuItem value={"Parado"}>{"Parado"}</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className='col-md-4'>
                                                    <TextField
                                                        label="Data final prevista"
                                                        type="date"
                                                        InputLabelProps={{ shrink: true }}
                                                        value={data_final_prevista}
                                                        onChange={(value) => { setData_Final_Prevista(value.target.value) }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </div>

                                            <div className='row p-3'>
                                                <TextField
                                                    label="Descrição"
                                                    multiline
                                                    minRows={9}
                                                    maxRows={9}
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    value={descricao}
                                                    onChange={(value) => { setDescricao(value.target.value) }}
                                                    variant="outlined"
                                                />
                                            </div>

                                            <div className='row d-flex p-3 justify-content-between align-items-center'>
                                                <TextField
                                                    label="Requisitos"
                                                    multiline
                                                    minRows={6}
                                                    maxRows={6}
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={requisitos}
                                                    onChange={(value) => { setRequisitos(value.target.value) }}
                                                    variant="outlined"
                                                    sx={{ width: '45%' }}
                                                />
                                                <TextField
                                                    label="Futuras melhorias"
                                                    multiline
                                                    minRows={6}
                                                    maxRows={6}
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={futuras_melhorias}
                                                    onChange={(value) => { setFuturas_Melhorias(value.target.value) }}
                                                    variant="outlined"
                                                    sx={{ width: '45%' }}
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
