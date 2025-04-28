import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect } from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";

export default function TabelaSumarioProjetos({ projetos }) {

    const getShadowClass = (estado) => {
        switch (estado) {
            case "Concluído":
                return "success";
            case "Em desenvolvimento":
                return "warning";
            case "Parado":
                return "error";
            default:
                return "";
        }
    };


    let totalEmDesenvolvimento = 0;
    let totalConcluido = 0;
    let totalParado = 0;

    projetos.map((projeto) => {
        switch(projeto.estado){
            case 'Em desenvolvimento':
                totalEmDesenvolvimento++;
                break;
            case 'Concluído':
                totalConcluido++;
                break;
            case 'Parado':
                totalParado++;
                break;
        }
    });

    return (
        <TableContainer component={Box} sx={{ pl: 0 }}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table" className="disable-edge-padding">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Estado</TableCell>
                        <TableCell align="left">Quantidade</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        <TableRow>
                            <TableCell align="left"><Chip label="Em desenvolvimento" color={getShadowClass("Em desenvolvimento")}></Chip></TableCell>
                            <TableCell align="left">{totalEmDesenvolvimento}</TableCell>
                        </TableRow>  
                        <TableRow>
                            <TableCell align="left"><Chip label="Parado" color={getShadowClass("Parado")}></Chip></TableCell>
                            <TableCell align="left">{totalParado}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Chip label="Concluído" color={getShadowClass("Concluído")}></Chip></TableCell>
                            <TableCell align="left">{totalConcluido}</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

