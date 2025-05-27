import React from 'react';
import { Stack, Typography, Chip, Box, Card, } from '@mui/material';

export default function CandidaturaCard({ candidatura, handleVerCandidaturas, setSelectedCandidatura, carregarComentarios }) {
    function convertDate(d) {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate
    }
    console.log(candidatura)

    return (
        <Card
            variant="outlined"
            sx={{
                mt: 2,
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#f5f5f5'
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Stack spacing={1}>
                    <Typography component="div">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div>
                                <strong>Data:</strong> {candidatura.data_submissao.includes("Z") ? convertDate(candidatura.data_submissao) : candidatura.data_submissao}
                            </div>
                            <Chip
                                label={candidatura.status || "Status não disponível"}
                                color={
                                    candidatura.status.includes("Aceite") ? "success" :
                                        candidatura.status.includes("Rejeitada") ? "error" :
                                            candidatura.status.includes("Em análise") ? "warning" : "default"
                                }
                                className='mx-1'
                            />
                        </div>
                    </Typography>
                    <Typography component="div">
                        <strong>Nome:</strong> {candidatura.utilizador.nome_utilizador}
                    </Typography>
                    <button
                        className='btn btn-outline-primary'
                        onClick={() => {
                            handleVerCandidaturas();
                            setSelectedCandidatura(candidatura);
                            carregarComentarios(candidatura.id_candidatura);
                        }}
                    >
                        Ver detalhes
                    </button>
                </Stack>
            </Box>
        </Card>
    )

}