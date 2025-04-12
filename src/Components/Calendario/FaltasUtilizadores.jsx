import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Calendario.css';
import '../../index.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Chip, Box, TableCell, TableRow, TableBody, Table, TableHead, TableContainer } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SidebarItems from './SidebarItems';

export default function FaltasUtilizadores() {
    const navigate = useNavigate();

    const [id_user, setUtilizador] = useState();
    const [tipo_user, setTipoUser] = useState();
    const [id_perfil, setPerfil] = useState()

    const [faltas, setFaltas] = useState([])

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

    function carregarFaltas() {
        handleServices.carregarFaltas()
            .then(res => {
                console.log(res)
                setFaltas(res);
            })
            .catch(err => {
                console.log("Não foi possivel encontrar as faltas: " + err)
            })
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
                    <div className="sidebar col-md-2" style={{ backgroundColor: '#f8f9fa', padding: '20px', minHeight: '90vh', overflowY: 'auto' }}>
                        <SidebarItems></SidebarItems>
                    </div>


                    <div className='m-4 p-4 rounded' style={{ flex: 1, minHeight: '85svh', background: "white" }}>
                        <h2 className='mb-4' style={{ color: '#333', fontWeight: '600' }}>Ver faltas de utilizadores</h2>
                        <div className='row'>
                            <ListFaltas></ListFaltas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function ListFaltas() {
        return (
            <TableContainer component={Box} sx={{ pl: 0 }}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nome</TableCell>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Anexo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {faltas.map((falta) => (
                            <TableRow key={falta.id_falta} >
                                <TableCell align="left">{falta.perfil.nome}</TableCell>
                                <TableCell align="left">{falta.data_falta}</TableCell>
                                <TableCell align="left">{falta.anexo}</TableCell>
                                <TableCell align="left"><Chip label={falta.estado} size='10px'></Chip></TableCell>
                                <TableCell align="right"><button className='btn btn-secondary'>Ver detalhes</button></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}
