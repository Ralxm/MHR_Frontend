import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, Card, Typography, Divider, CardContent, Button } from "@mui/material";
import { LockOpen, Lock, People, Business, CalendarToday, ArrowForward } from '@mui/icons-material'


export default function TabelaIdeias({ ideias }) {
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
      {ideias.map((ideia) => {
        return (
          <div className="col-md-3" key={ideia.id_ideia} style={{zIndex: 1001}}>
            <Card
              sx={{
                height: '100%',
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
              <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  mb={2}
                >
                  <Chip
                    label={ideia.estado}
                    size="small"
                    color={ ideia.estado === 'Em análise' ? 'warning' : ideia.estado === 'Aceite' ? 'success' : 'error' }
                    sx={{ fontWeight: 500 }}
                  />
                </Stack>

                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    minHeight: '64px'
                  }}
                >
                  {ideia.titulo_ideia}
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
                    textOverflow: 'ellipsis'
                  }}
                >
                  {ideia.descricao ? ideia.descricao.substring(0, 100) : "Sem descrição"}...
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(`/ideia/${ideia.id_ideia}`, { state: { ideia } })}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Ver detalhes
                    </Button>
                  </Box>

                  {(tipo_user == 1 || tipo_user == 2) && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {}}
                        >
                          Apagar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {navigate(`/ideia/editar/${ideia.id_ideia}`)}}
                        >
                          Editar
                        </Button>
                      </Stack>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  )
}

