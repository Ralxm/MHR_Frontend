import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect } from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";
import { Dropdown } from 'react-bootstrap';

const createData = (id_despesa, id_departamento, id_projeto, id_perfil, _data, descricao, valor, anexo, validador, estado, reembolsado_por, comentarios, perfil, validadorPerfil, reembolsadorPerfil) => {
    return { id_despesa, id_departamento, id_projeto, id_perfil, _data, descricao, valor, anexo, validador, estado, reembolsado_por, comentarios, perfil, validadorPerfil, reembolsadorPerfil };
}

export default function BasicTable({ data, onVerDetalhes, tipo, onApagar, action }) {

    let rows = data.map((despesa) => {
        return createData(despesa.id_despesa, despesa.id_departamento, despesa.id_projeto, despesa.id_perfil, despesa.data, despesa.descricao, despesa.valor, despesa.anexo, despesa.validador, despesa.estado, despesa.reembolsado_por, despesa.comentarios, despesa.perfil, despesa.validadorPerfil, despesa.reembolsadorPerfil);
    })

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

    function formatDateTime(isoString) {
        return isoString.replace('T', ' ').split('.')[0];
    }

    if (tipo == "Por Aprovar") {
        rows.map((despesa, index) => {
            if (!(despesa.estado === "Em análise" || despesa.estado === "Pendente")) {
                delete rows[index]
            }
        })
    }

    if (tipo == "Analisar") {
        return (
            <TableContainer component={Box} sx={{ pl: 0 }}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Valor</TableCell>
                            <TableCell align="left">Anexo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                            >
                                <TableCell align="left">{formatDateTime(row._data)}</TableCell>
                                <TableCell align="left">{row.valor} €</TableCell>
                                <TableCell align="left">
                                    {row.anexo && (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-anexos">
                                                Anexos ({JSON.parse(row.anexo).length})
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {JSON.parse(row.anexo).map((filePath, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        href={"http://localhost:8080/" + filePath.replace(/\\/g, '/')}
                                                        target="_blank"
                                                        as="a"
                                                    >
                                                        Anexo {index + 1}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </TableCell>
                                <TableCell align="left"><Chip label={row.estado} color={getShadowClass(row.estado)} size='10px'></Chip></TableCell>
                                {row.estado == "Aprovada" ?
                                    <TableCell align="right"><button className='btn btn-secondary' onClick={() => onVerDetalhes(row, "reembolsar")}>Reembolsar</button></TableCell>
                                    :
                                    <TableCell align="right"><button className='btn btn-secondary' onClick={() => onVerDetalhes(row, "analisar")}>Analisar</button></TableCell>
                                }

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
    else if (tipo == "Reembolsar") {
        return (
            <TableContainer component={Box} sx={{ pl: 0 }}>
                <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Valor</TableCell>
                            <TableCell align="left">Anexo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.name}
                            >
                                <TableCell align="left">{row._data}</TableCell>
                                <TableCell align="left">{row.valor} €</TableCell>
                                <TableCell align="left">
                                    {row.anexo && (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-anexos">
                                                Anexos ({JSON.parse(row.anexo).length})
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {JSON.parse(row.anexo).map((filePath, index) => (
                                                    <Dropdown.Item
                                                        key={index}
                                                        href={"http://localhost:8080/" + filePath.replace(/\\/g, '/')}
                                                        target="_blank"
                                                        as="a"
                                                    >
                                                        Anexo {index + 1}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </TableCell>
                                <TableCell align="left"><Chip label={row.estado} color={getShadowClass(row.estado)} size='10px'></Chip></TableCell>
                                <TableCell align="right"><button className='btn btn-secondary' onClick={() => onVerDetalhes(row, "reembolsar")}>Reembolsar</button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }


    return (
        <TableContainer component={Box} sx={{ pl: 0 }}>
            <Table sx={{ minWidth: 750 }} aria-label="simple table" className="disable-edge-padding">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Data</TableCell>
                        <TableCell align="left">Valor</TableCell>
                        <TableCell align="left">Anexo</TableCell>
                        <TableCell align="left" mar>Estado</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                        >
                            <TableCell align="left">{row._data}</TableCell>
                            <TableCell align="left">{row.valor} €</TableCell>
                            <TableCell align="left">
                                {row.anexo && (
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-anexos">
                                            Anexos ({JSON.parse(row.anexo).length})
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {JSON.parse(row.anexo).map((filePath, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    href={"http://localhost:8080/" + filePath.replace(/\\/g, '/')}
                                                    target="_blank"
                                                    as="a"
                                                >
                                                    Anexo {index + 1}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </TableCell>
                            <TableCell align="left"><Chip label={row.estado} color={getShadowClass(row.estado)} size='10px'></Chip></TableCell>
                            <TableCell align="right">
                                {(row.estado == "Em análise" || row.estado == "Pendente") && <button className='btn btn-outline-danger mx-2' onClick={() => onApagar(row)}>Apagar</button>}
                                <button className='btn btn-secondary' onClick={() => onVerDetalhes(row, "editar")}>Ver detalhes</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

