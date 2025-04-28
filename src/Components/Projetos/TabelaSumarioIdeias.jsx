import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect } from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";

export default function TabelaSumarioIdeias({ ideias }) {

    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aceite":
                return "success";
            case "Em análise":
                return "warning";
            case "Rejeitada":
                return "error";
            default:
                return "";
        }
    };


    let totalEmAnalise = 0;
    let totalAceite = 0;
    let totalRejeitada = 0;

    ideias.map((ideia) => {
        switch (ideia.estado) {
            case 'Em análise':
                totalEmAnalise++;
                break;
            case 'Aceite':
                totalAceite++;
                break;
            case 'Parado':
                totalRejeitada++;
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
                        <TableCell align="left"><Chip label="Em análise" color={getShadowClass("Em análise")}></Chip></TableCell>
                        <TableCell align="left">{totalEmAnalise}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left"><Chip label="Rejeitada" color={getShadowClass("Rejeitada")}></Chip></TableCell>
                        <TableCell align="left">{totalRejeitada}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left"><Chip label="Aceite" color={getShadowClass("Aceite")}></Chip></TableCell>
                        <TableCell align="left">{totalAceite}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

