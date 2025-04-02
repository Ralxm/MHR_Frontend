import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";


export default function BasicTable({ vagas, departamentos, selectedDepartamento, onVerDetalhes, onCandidatar }) {
    let tipo_user = localStorage.getItem("tipo")

    const [candidaturas, setCandidaturas] = useState([]);

    useEffect(() => {
        
    }, [])


    return (
        <TableContainer component={Box} sx={{ pl: 0 }}>
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
        </TableContainer>
    );
}

