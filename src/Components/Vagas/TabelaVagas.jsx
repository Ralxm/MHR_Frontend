import { create } from "@mui/material/styles/createTransitions";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, Card, Typography, Divider, CardContent, Button } from "@mui/material";
import { LockOpen, Lock, People, Business, CalendarToday, ArrowForward } from '@mui/icons-material'


export default function BasicTable({ vagas, departamentos, selectedDepartamento, onVerDetalhes, onApagar, onEditar, filtro }) {
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

  const filteredVagas = vagas.filter(vaga => {
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
  });

  return (
    <>
      {filteredVagas.map((vaga) => {
        let nome;
        let dep;
        departamentos.map((departamento) => {
          if (vaga.id_departamento == departamento.id_departamento) {
            nome = departamento.nome_departamento;
            dep = departamento;
          }
        })
        return (
          <div className="col-md-3" key={vaga.id_vaga} style={{zIndex: 1001}}>
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
                    icon={<Business fontSize="small" />}
                    label={dep?.nome_departamento || 'Departamento'}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    icon={vaga.estado === 'Aberta' ? <LockOpen fontSize="small" /> :
                      vaga.estado === 'Ocupada' ? <Lock fontSize="small" /> :
                        <People fontSize="small" />}
                    label={vaga.estado}
                    size="small"
                    color={
                      vaga.estado === 'Aberta' ? 'success' :
                        vaga.estado === 'Ocupada' ? 'error' :
                          'warning'
                    }
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
                  {vaga.titulo_vaga}
                </Typography>

                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    icon={<People fontSize="small" />}
                    label={`${vaga.numero_vagas} vaga(s)`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                  <Chip
                    icon={<CalendarToday fontSize="small" />}
                    label={`Fecha ${convertDate(vaga.data_fecho)}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                </Stack>

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
                  {vaga.requisitos.substring(0, 100)}...
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(`/vagas/${vaga.id_vaga}`, { state: { vaga, dep } })}
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
                          onClick={() => onApagar(vaga.id_vaga)}
                        >
                          Apagar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate('/vagas/editar/' + vaga.id_vaga)}
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

