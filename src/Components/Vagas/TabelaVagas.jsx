import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip, Stack, Card, Typography, Divider } from "@mui/material";


export default function BasicTable({ vagas, departamentos, selectedDepartamento, onVerDetalhes, onApagar, onEditar }) {
    let tipo_user = localStorage.getItem("tipo")
    const navigate = useNavigate();
    useEffect(() => {

    }, [])

    const filteredVagas = selectedDepartamento
        ? vagas.filter(vaga => vaga.id_departamento === selectedDepartamento.id_departamento)
        : vagas;

    return (
        <>
            {filteredVagas.map((vaga) => {
                let nome;
                let dep;
                departamentos.map((departamento) => {
                    if (vaga.id_departamento == departamento.id_departamento) {
                        nome = departamento.nome_departamento;
                        dep = departamento;
                    }
                })
                return (
                    <div className="col-md-4" key={vaga.id_vaga}>
                        <Card variant="outlined" className="h-100">
                            <Box className="pt-2 px-2">
                                <Stack sx={{ justifyContent: 'space-between', alignItems: 'left' }}>
                                    <Typography gutterBottom variant="h6" component="div" className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {nome}
                                        </div>
                                        <div>
                                            <a
                                                href={`/vagas/${vaga.id_vaga}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/vagas/${vaga.id_vaga}`, { state: { vaga, dep } });
                                                }}
                                            >
                                                <button className="btn btn-outline-primary btn-sm">Ver detalhes</button>
                                            </a>
                                        </div>
                                    </Typography>
                                    <Typography gutterBottom variant="h7" component="div">
                                        {vaga.titulo_vaga}
                                    </Typography>
                                </Stack>
                                <Typography color="text.secondary" variant="body2">
                                    {vaga.requisitos}
                                </Typography>
                                {(tipo_user == 1 || tipo_user == 2) &&
                                    <>
                                        <Divider variant="fullWidth" className="mb-2"></Divider>
                                        <Typography gutterBottom variant="h6" component="div" className="d-flex justify-content-between">
                                            <div>

                                            </div>
                                            <div>
                                                <button className="btn btn-outline-danger btn-sm mx-2" onClick={() => onApagar(vaga.id_vaga)}>Apagar Vaga</button>
                                                <button className="btn btn-primary btn-sm" onClick={() => onVerDetalhes(vaga)}>Editar Vaga</button>
                                            </div>
                                        </Typography>
                                    </>
                                }
                            </Box>
                        </Card>
                    </div>
                )
            })}
        </>
    )
    /*<TableContainer component={Box} sx={{ pl: 0 }}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table" className="disable-edge-padding">
            <TableHead>
                <TableRow>
                    <TableCell align="left">Departamento</TableCell>
                    <TableCell align="left">Título</TableCell>
                    <TableCell align="left">Descrição</TableCell>
                    <TableCell align="left">Requisitos</TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {vagas.map((vaga) => {
                    if (selectedDepartamento) {
                        if (vaga.id_departamento == selectedDepartamento.id_departamento) {
                            return (
                                <TableRow>
                                    <TableCell align="left">{selectedDepartamento.nome_departamento}</TableCell>
                                    <TableCell align="left">{vaga.titulo_vaga}</TableCell>
                                    <TableCell align="left">{vaga.descricao}</TableCell>
                                    <TableCell align="left">{vaga.requisitos}</TableCell>
                                    <TableCell align="right"><button className="btn btn-outline-secondary" onClick={() => { onVerDetalhes(vaga) }}>Ver detalhes</button></TableCell>
                                </TableRow>
                            )
                        }
                    }
                    else {
                        let nome;
                        departamentos.map((departamento) => {
                            if (vaga.id_departamento == departamento.id_departamento) {
                                nome = departamento.nome_departamento;
                            }
                        })
                        return (
                            <TableRow>
                                <TableCell align="left">{nome}</TableCell>
                                <TableCell align="left">{vaga.titulo_vaga}</TableCell>
                                <TableCell align="left">{vaga.descricao}</TableCell>
                                <TableCell align="left">{vaga.requisitos}</TableCell>
                                <TableCell align="right">
                                    <button className="btn btn-outline-warning mx-2" onClick={() => { onCandidatar(vaga) }}>Candidatar</button>
                                    {(tipo_user == 1 || tipo_user == 2) && <button className="btn btn-outline-danger mx-2 my-1" onClick={() => { onVerDetalhes(vaga) }}>Ver Candidaturas</button>}
                                    <button className="btn btn-secondary" onClick={() => { onVerDetalhes(vaga) }}>Ver Detalhes</button>
                                </TableCell>
                            </TableRow>
                        )
                    }
                })}
            </TableBody>
        </Table>
    </TableContainer>*/
}

