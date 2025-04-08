import React, { useEffect, useRef, useState } from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";

export default function SumarioVagas({ vagas, departamentos, candidaturas, tipo_user, onSetDepartamento }) {
    return (
        <TableContainer component={Box} sx={{ pl: 0 }}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table" className="disable-edge-padding mt-4">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Departamento</TableCell>
                        <TableCell align="left">Vagas</TableCell>
                        {(tipo_user == 1 || tipo_user == 2) &&
                            <TableCell align="left">Candidaturas</TableCell>
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departamentos.map((departamento) => {
                        if (departamento.id_departamento != 1) {
                            let quantVagas = 0;
                            let quantCandidaturas = 0;

                            vagas.map((vaga) => {
                                if (vaga.id_departamento == departamento.id_departamento) {
                                    quantVagas++;
                                    candidaturas.map((candidatura) => {
                                        if (candidatura.id_vaga == vaga.id_vaga) {
                                            quantCandidaturas++;
                                        }
                                    })
                                }
                            })

                            return (
                                <>         
                                    <TableRow onClick={() => {onSetDepartamento(departamento)}} sx={{cursor: "pointer"}}>
                                        <TableCell align="left">{departamento.nome_departamento}</TableCell>
                                        <TableCell align="left">{quantVagas}</TableCell>
                                        {(tipo_user == 1 || tipo_user == 2) &&
                                            <TableCell align="left">{quantCandidaturas}</TableCell>
                                        }
                                    </TableRow>
                                </>
                            )
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}