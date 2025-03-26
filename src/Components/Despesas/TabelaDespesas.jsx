import { create } from "@mui/material/styles/createTransitions";
import React  from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";

const createData = (id_despesa, data, descricao, valor, anexo, validador, estado, reembolsada_por, comentarios) => {
	return { id_despesa, data, descricao, valor, anexo, validador, estado, reembolsada_por, comentarios };
}

export default function BasicTable( {data, onVerDetalhes, tipo, onApagar} ){
    let rows = data.map((despesa) => {
        return createData(despesa.id_despesa, despesa.data, despesa.descricao, despesa.valor, despesa.anexo, despesa.validador, despesa.estado, despesa.reembolsada_por, despesa.comentarios);
    })

    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aprovada":
                return "success";
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

    if(tipo == "Por Aprovar"){
        rows.map((despesa, index) => {
            if(!(despesa.estado === "Em análise" || despesa.estado === "Pendente")){
                delete rows[index]
            }
        })
    }

    if(tipo == "Analisar"){
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
                                <TableCell align="left">{row.data}</TableCell>
                                <TableCell align="left">{row.valor}</TableCell>
                                {row.anexo && <TableCell align="left"><a href={row.anexo} target="_blank" ><button className='btn btn-secondary'>Abrir</button></a></TableCell>}
                                <TableCell align="left"><Chip label={row.estado} color={getShadowClass(row.estado)} size='10px'></Chip></TableCell>
                                <TableCell align="right"><button className='btn btn-secondary' onClick={() => onVerDetalhes(row)}>Analisar</button></TableCell>
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
                        <TableCell align="left">Estado</TableCell>
                        <TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.name}
						>
							<TableCell align="left">{row.data}</TableCell>
							<TableCell align="left">{row.valor}</TableCell>
							<TableCell align="left">{row.anexo && <a href={row.anexo} target="_blank" ><button className='btn btn-secondary'>Abrir</button></a>}</TableCell>
                            <TableCell align="left"><Chip label={row.estado} color={getShadowClass(row.estado)} size='10px'></Chip></TableCell>
                            <TableCell align="right">
                                <button className='btn btn-outline-danger mx-2' onClick={() => onApagar(row)}>Apagar</button>
                                <button className='btn btn-secondary' onClick={() => onVerDetalhes(row)}>Ver detalhes</button>
                                </TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

