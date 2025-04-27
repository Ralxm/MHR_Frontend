import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, Card, Typography, Divider, CardContent, Button } from "@mui/material";
import { LockOpen, Lock, People, Business, CalendarToday, ArrowForward } from '@mui/icons-material'


export default function TabelaIdeias({ ideias, onVerDetalhes, onAceitar, onApagar }) {
  let tipo_user = localStorage.getItem("tipo")
  const navigate = useNavigate();

  useEffect(() => {

  }, [])

  function convertDate(d) {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate
  }

  /*const filteredVagas = vagas.filter(vaga => {
    if (selectedDepartamento && vaga.id_departamento !== selectedDepartamento.id_departamento) {
      return false;
    }
    
    if (filtro && filtro.trim() !== '') {
      const searchTerm = filtro.toLowerCase();
      const title = vaga.titulo_vaga.toLowerCase();
      if (!title.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });*/

  return (
    <>
      {ideias.map((ideia) => (
        <div className="col-md-3" key={ideia.id_ideia} style={{ zIndex: 1001 }}>
          <Card
            sx={{
              height: '25svh',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
              },
              backgroundColor: "white"
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 0.5
              }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    flex: 1,
                    mr: 1,
                    lineHeight: 1.2,
                  }}
                >
                  {ideia.titulo_ideia}
                </Typography>
                
                <Chip
                  label={ideia.estado}
                  size="small"
                  color={ 
                    ideia.estado === 'Em análise' ? 'warning' : 
                    ideia.estado === 'Aceite' ? 'success' : 'error' 
                  }
                  sx={{ 
                    fontWeight: 500,
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {convertDate(ideia.created_at)}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexGrow: 1
                }}
              >
                {ideia.descricao ? ideia.descricao.substring(0, 100) : "Sem descrição"}...
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => onVerDetalhes(ideia)}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Ver detalhes
                </Button>

                {(tipo_user == 1 || tipo_user == 2) && ideia.estado == "Em análise" && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {onApagar(ideia)}}
                      >
                        Rejeitar
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={() => onAceitar(ideia)}
                      >
                        Aceitar
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
}

