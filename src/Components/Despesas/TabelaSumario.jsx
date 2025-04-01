import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect } from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";

export default function BasicTable({ despesas, action }) {

    useEffect(() => {

    }, [action])

    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aprovada":
                return "primary";
            case "Em análise":
                return "warning";
            case "Rejeitada":
                return "error";
            case "Reembolsada":
                return "success";
            default:
                return "";
        }
    };

    let valorAprovado = 0;
    let valorRejeitado = 0;
    let valorEmAnalise = 0;
    let valorReembolsado = 0;
    let valorPendente = 0;

    let totalAprovado = 0;
    let totalRejeitado = 0;
    let totalEmAnalise = 0;
    let totalReembolsado = 0;
    let totalPendente = 0;

    despesas.map((despesa) => {
        if (despesa.estado === "Aprovada") {
            valorAprovado += parseFloat(despesa.valor);
            totalAprovado++;
        }
        else if (despesa.estado === "Em análise") {
            valorEmAnalise += parseFloat(despesa.valor);
            totalEmAnalise++;
        }
        else if (despesa.estado === "Rejeitada") {
            valorRejeitado += parseFloat(despesa.valor);
            totalRejeitado++;
        }
        else if (despesa.estado === "Reembolsada") {
            valorReembolsado += parseFloat(despesa.valor);
            totalReembolsado++;
        }
        else if (despesa.estado === "Pendente") {
            valorPendente += parseFloat(despesa.valor);
            totalPendente++;
        }
    });

    return (
        <TableContainer component={Box} sx={{ pl: 0 }}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table" className="disable-edge-padding">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Estado</TableCell>
                        <TableCell align="left">Quantidade</TableCell>
                        <TableCell align="left">Valor</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        <TableRow>
                            <TableCell align="left"><Chip label="Pendente" color={getShadowClass("Pendente")}></Chip></TableCell>
                            <TableCell align="left">{totalPendente}</TableCell>
                            <TableCell align="left">{valorPendente}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Chip label="Em análise" color={getShadowClass("Em análise")}></Chip></TableCell>
                            <TableCell align="left">{totalEmAnalise}</TableCell>
                            <TableCell align="left">{valorEmAnalise}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Chip label="Rejeitadas" color={getShadowClass("Rejeitada")}></Chip></TableCell>
                            <TableCell align="left">{totalRejeitado}</TableCell>
                            <TableCell align="left">{valorRejeitado}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Chip label="Aprovadas" color={getShadowClass("Aprovada")}></Chip></TableCell>
                            <TableCell align="left">{totalAprovado}</TableCell>
                            <TableCell align="left">{valorAprovado}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><Chip label="Reembolsadas" color={getShadowClass("Reembolsada")}></Chip></TableCell>
                            <TableCell align="left">{totalReembolsado}</TableCell>
                            <TableCell align="left">{valorReembolsado}</TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

