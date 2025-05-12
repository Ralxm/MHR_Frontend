import React, { useEffect, useRef, useState } from 'react';
import { data, useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Blog.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import authService from '../Login/auth-service';
import handleServices from './handle-services';
import { Box, Modal, Paper, Typography, Button, Stack, Chip, Avatar, Divider } from '@mui/material';
import { CalendarToday, LocationOn, Schedule } from '@mui/icons-material'


export default function TabelaPosts({ posts, tipo_user, id_perfil, tipo, onAceitar, onRejeitar, onApagar, user, loggedid, cols, filtro, filtroTipo, to }) {
    const navigate = useNavigate();

    let filteredPosts = posts.filter(post => {
        if (tipo === "Por_User") {
            return post.id_perfil === user?.id_perfil;
        }

        if (tipo === "User") {
            return post.estado != "Em análise";
        }

        if (tipo === "Admin") {
            return post.estado == "Em análise";
        }

        if (tipo === "Self") {
            return post.id_perfil == id_perfil;
        }

        if (tipo === "Visitas") {
            return post.tipo == "Visita" && post.estado == "Aprovada";
        }

        if (tipo === "Notícias") {
            return post.tipo == "Notícia" && post.estado == "Aprovada";
        }

        return false;
    });


    filteredPosts = filteredPosts.filter(post => {
        if (filtro && filtro.trim() !== '') {
            const searchTerm = filtro.toLowerCase();
            const title = post.titulo.toLowerCase();
            if (!title.includes(searchTerm)) {
                return false;
            }
        }

        if (to == "User") {
            if (filtroTipo != "Todos" && post.tipo != filtroTipo) {
                return false
            }
        }

        return true
    });

    return (
        filteredPosts.map((post) => {
            return (
                <div className={`col-md-${cols} mb-3`}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            width: '100%',
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            '&:hover': {
                                boxShadow: 4
                            }
                        }}
                        onClick={() => navigate('/blog/' + post.id_publicacao, { state: { post } })}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '180px',
                                borderRadius: 1,
                                overflow: 'hidden',
                                mb: 1,
                                backgroundColor: post.imagem ? 'transparent' : 'action.hover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {post.imagem ? (
                                <img
                                    src={`http://localhost:8080/${post.imagem}`}
                                    alt={post.titulo}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <CalendarToday fontSize="large" color="disabled" />
                            )}
                        </Box>

                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                {post.titulo}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            <Stack spacing={1.5}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                        {post.perfil?.nome?.charAt(0) || 'U'}
                                    </Avatar>
                                    <Typography variant="body2" color="text.secondary">
                                        {post.perfil?.nome || 'Utilizador'} • {post.created_at}
                                    </Typography>
                                </div>

                                {post.tipo === "Notícia" ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CalendarToday fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {post.data_noticia}
                                        </Typography>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                        <CalendarToday fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {post.data_visita}
                                        </Typography>
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip
                                        label={post.tipo}
                                        variant="outlined"
                                        color={post.tipo === "Notícia" ? "primary" : "secondary"}
                                        size="small"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {post.views || 0} visualizações
                                    </Typography>
                                </div>
                            </Stack>
                        </Box>

                        {(tipo == "Admin" || post.id_perfil == loggedid) &&
                            <Divider></Divider>
                        }

                        {tipo == "Admin" &&
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    cursor: 'default'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ mx: 1 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRejeitar(post)
                                    }}
                                >
                                    Rejeitar
                                </Button>
                                <Button
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAceitar(post)
                                    }}
                                >
                                    Aceitar
                                </Button>
                            </div>
                        }

                        {loggedid == post.id_perfil &&
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 1,
                                    cursor: 'default'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mx: 1 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/blog/editar/' + post.id_publicacao)
                                    }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onApagar(post)
                                    }}
                                >
                                    Apagar
                                </Button>
                            </div>
                        }
                    </Paper>
                </div>
            );
        })
    )
}