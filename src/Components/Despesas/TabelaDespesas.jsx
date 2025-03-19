import { create } from "@mui/material/styles/createTransitions";
import React  from 'react';
import { TableCell, TableRow, TableBody, Table, TableHead, Box, TableContainer, Chip } from "@mui/material";

const createData = (data, descricao, valor, anexo, validador, estado, reembolsada_por, comentarios) => {
	return { data, descricao, valor, anexo, validador, estado, reembolsada_por, comentarios };
}

export default function BasicTable( {data, onVerDetalhes, tipo} ){
    let rows = data.map((despesa) => {
        return createData(despesa.data, despesa.descricao, despesa.valor, despesa.anexo, despesa.validador, despesa.estado, despesa.reembolsada_por, despesa.comentarios);
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
							<TableCell align="left">{row.anexo}</TableCell>
                            <TableCell align="left"><Chip label={row.estado} color={getShadowClass(row.estado)} size='10px'></Chip></TableCell>
                            <TableCell align="right"><button className='btn btn-secondary' onClick={() => onVerDetalhes(row)}>Ver detalhes</button></TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

