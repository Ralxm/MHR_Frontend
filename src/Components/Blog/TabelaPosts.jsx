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


export default function TabelaPosts({ posts, tipo_user, id_perfil, tipo, onAceitar, onRejeitar }) {
    const navigate = useNavigate();

    const filteredPosts = posts.filter(post => {
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

    return (
        filteredPosts.map((post) => {
            return (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, display: 'flex', gap: 3, cursor: 'pointer', width: '100%', overflow: 'auto', flexDirection: { xs: 'column', md: 'row' } }} 
                onClick={() => navigate('/blog/' + post.id_publicacao, {state: {post}})}>
                    {post.imagem && (
                        <Box
                            sx={{
                                minWidth: 300,
                                height: 150,
                                borderRadius: 2,
                                overflow: 'hidden',
                                flexShrink: 0
                            }}
                        >
                            <img
                                src={`http://localhost:8080/${post.imagem}`}
                                alt={post.titulo}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    )}

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack spacing={2}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                                    {post.titulo}
                                </Typography>
                                <Chip
                                    label={post.estado}
                                    color={
                                        post.estado === "Aprovada" ? "success" :
                                            post.estado === "Rejeitada" ? "error" : "warning"
                                    }
                                    size="small"
                                />
                            </div>

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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <LocationOn fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {post.local_visita}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CalendarToday fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {post.data_visita}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Schedule fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {post.duracao_visita} horas
                                        </Typography>
                                    </div>
                                </div>
                            )}

                            <Typography variant="body1" sx={{
                                mt: 1,
                                wordBreak: 'break-word',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {post.texto?.length > 200 ? `${post.texto.substring(0, 200)}...` : post.texto}
                            </Typography>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Chip
                                    label={post.tipo}
                                    variant="outlined"
                                    color={post.tipo === "Notícia" ? "primary" : "secondary"}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {post.views || 0} visualizações
                                </Typography>
                            </div>

                            {tipo === "Self" ? (
                                <>
                                    <Divider sx={{ my: 1 }} />
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
                                            sx={{mx: 1}}
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
                                                navigate('/blog/editar/' + post.id_publicacao)
                                            }}
                                        >
                                            Apagar
                                        </Button>
                                    </div>
                                </>
                            ) : (tipo == "Admin" && (tipo_user == 1 || tipo_user == 2)) ? (
                                <>
                                    <Divider sx={{ my: 1 }} />
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
                                </>
                            ) : null}
                        </Stack>
                    </Box>
                </Paper >
            );
        })
    )
}