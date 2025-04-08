import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Vagas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Stack, Button, Modal, Paper, Typography, TextField, Chip, Box, Tab, FormControl, InputLabel, Select, MenuItem, Card, Grid, Accordion, AccordionSummary, AccordionActions, AccordionDetails } from '@mui/material';
import { LockOpen, Lock, Person, ArrowBack } from '@mui/icons-material'
import FileDropZoneSingle from '../../Universal/FileDropZoneSingle'
import DoughnutPieChart from './DoughnutPieChart';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import CandidaturaCard from './CandidaturaCard';

export default function EditarVaga() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();

    const [vaga, setVaga] = useState(null)

    const [departamentos, setDepartamentos] = useState([]);

    {/*Variáveis para a criação da vaga*/ }
    const [departamento, setDepartamento] = useState()
    const [descricao, setDescricao] = useState('')
    const [requisitos, setRequisitos] = useState('')
    const [oferecemos, setOferecemos] = useState('')
    const [titulo_vaga, setTitulo_Vaga] = useState('')
    const [numero_vagas, setNumero_Vagas] = useState()
    const [data_inicio, setData_Inicio] = useState('')
    const [data_fecho, setData_Fim] = useState('')
    const [estado, setEstado] = useState('')
    const [tipo, setTipo] = useState('')
    const [local, setLocal] = useState('')


    useEffect(() => {
        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo == 5 || tipo == 4 || tipo == 3) {
            navigate('/vagas')
        }

        let user = localStorage.getItem("id_utilizador")
        if (user) {
            setUtilizador(user)
            setTipoUser(localStorage.getItem("tipo"))
        }

        carregarDepartamentos();
        carregarVaga();

        document.title = "Criar uma vaga";
    }, []);

    useEffect(() => {
        if (vaga) {
            setDepartamento(vaga.id_departamento)
            setDescricao(vaga.descricao)
            setRequisitos(vaga.requisitos)
            setOferecemos(vaga.oferecemos)
            setTitulo_Vaga(vaga.titulo_vaga)
            setNumero_Vagas(vaga.numero_vagas)
            setData_Inicio(convertDateToInputFormat(vaga.data_inicio))
            setData_Fim(convertDateToInputFormat(vaga.data_fecho))
            setEstado(vaga.estado)
            setLocal(vaga.local)
            setTipo(vaga.tipo)
        }
    }, [vaga])

    function carregarDepartamentos() {
        handleServices.listDepartamentos()
            .then(res => {
                setDepartamentos(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function carregarVaga() {
        handleServices.getVaga(id)
            .then(res => {
                console.log(res[0])
                setVaga(res[0])
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
            id_vaga: vaga.id_vaga,
            id_departamento: departamento,
            descricao: descricao,
            requisitos: requisitos,
            oferecemos: oferecemos,
            titulo_vaga: titulo_vaga,
            numero_vagas: numero_vagas,
            estado: estado,
            data_inicio: data_inicio,
            data_fecho: data_fecho,
        }

        handleServices.updateVaga(datapost)
            .then(res => {
                alert("Vaga atualizada com sucesso");
                navigate('/vagas/' + vaga.id_vaga)
            })
            .catch(err => {
                console.log(err);
            });
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
                                            onClick={() => navigate('/vagas')}
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
                                                        Edição de vaga
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className='row p-3'>
                                                <TextField
                                                    label="Título da vaga"
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    fullWidth
                                                    value={titulo_vaga}
                                                    onChange={(value) => { setTitulo_Vaga(value.target.value) }}
                                                />
                                            </div>

                                            <div className='row p-3 d-flex justify-content-between align-items-center'>
                                                <TextField
                                                    label="Data de inicio"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={data_inicio}
                                                    onChange={(value) => { setData_Inicio(value.target.value) }}
                                                    sx={{ width: '45%' }}
                                                />
                                                <TextField
                                                    label="Data de fecho"
                                                    type="date"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={data_fecho}
                                                    onChange={(value) => { setData_Fim(value.target.value) }}
                                                    sx={{ width: '45%' }}
                                                />
                                            </div>

                                            <div className='row d-flex p-3 justify-content-between align-items-center'>
                                                <FormControl sx={{ width: '23%' }}>
                                                    <InputLabel shrink>Departamento</InputLabel>
                                                    <Select
                                                        label="Departamento"
                                                        value={departamento || ''}
                                                        onChange={(value) => setDepartamento(value.target.value)}
                                                    >
                                                        {departamentos.map((departamento) => {
                                                            if (departamento.id_departamento != 1) {
                                                                return (
                                                                    <MenuItem value={departamento.id_departamento}>{departamento.nome_departamento}</MenuItem>
                                                                )
                                                            }
                                                        })}
                                                    </Select>
                                                </FormControl>
                                                <FormControl sx={{ width: '23%' }}>
                                                    <InputLabel shrink>Tipo Vaga</InputLabel>
                                                    <Select
                                                        label="Tipo"
                                                        value={tipo}
                                                        onChange={(value) => setTipo(value.target.value)}
                                                    >
                                                        <MenuItem value={'Full-Time'}>Full-Time</MenuItem>
                                                        <MenuItem value={'Part-Time'}>Part-Time</MenuItem>
                                                        <MenuItem value={'Part-Time Temporário'}>Part-Time Temporário</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <FormControl sx={{ width: '23%' }}>
                                                    <InputLabel shrink>Local </InputLabel>
                                                    <Select
                                                        label="Departamento"
                                                        value={local}
                                                        onChange={(value) => setLocal(value.target.value)}
                                                    >
                                                        <MenuItem value={'Presencial'}>Presencial</MenuItem>
                                                        <MenuItem value={'Híbrido'}>Híbrido</MenuItem>
                                                        <MenuItem value={'Remoto'}>Remoto</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    label="Número de vagas"
                                                    type="number"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={numero_vagas}
                                                    onChange={(value) => { setNumero_Vagas(value.target.value) }}
                                                    sx={{ width: '30%' }}
                                                />
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
                                                    label="O que procuramos"
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
                                                    label="O que oferecemos"
                                                    multiline
                                                    minRows={6}
                                                    maxRows={6}
                                                    type="text"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={oferecemos}
                                                    onChange={(value) => { setOferecemos(value.target.value) }}
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
