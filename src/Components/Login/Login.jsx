import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './Login.css'
import '../../index.css'
import authService from './auth-service';
import { useSnackbar } from 'notistack';

export default function Login() {
    const url = "http://localhost:8080/";
    const { enqueueSnackbar } = useSnackbar();

    const [USERNAME, setUSERNAME] = useState('')
    const [PASSWORD, setPASSWORD] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login"

        if(authService.getCurrentUser()){
            navigate('calendario')
        }
        
    }, [])

    function HandleLogin(event){
        event.preventDefault();
        authService.login(USERNAME, PASSWORD)
        .then(res => {
            if(res === "" || res === false){
                enqueueSnackbar("Erro na autenticação", { variant: 'error' });
            }
            else{
                if(res.estado == "Ativa" || res.estado == "Restrita"){
                    navigate('/calendario');
                }
                else{
                    enqueueSnackbar("A sua conta não está ativa", { variant: 'error' });
                }
            }
        })
        .catch(err => {
            enqueueSnackbar("Autenticação falhou", { variant: 'success' });
            console.log(err)
        })
    }

    return (
        <div className="page-container">
            <div className="content" style={{
                background: `url('${process.env.PUBLIC_URL}/Logosvg.svg')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                opacity: 0.4
            }}>
            </div>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="login-box" style={{zIndex: 1000, backgroundColor: "#eee", boxShadow: "2px 2px 50px #777"}}>
                    <h2 className="text-center mb-4">Login</h2>
                    <form className="w-80 mx-auto">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Utilizador</label>
                            <input type="text" className="form-control" id="username" placeholder="Introduza o seu nickname" onChange={(value) => setUSERNAME(value.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Introduza a sua password" onChange={(value) => setPASSWORD(value.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-info w-100" onClick={HandleLogin}>Entra na tua conta</button>
                    </form>
                    <div style={{margin: "30px"}}>
                        <h5 className="text-center mb-4" style={{fontSize: "15px", cursor: "pointer"}}>&nbsp;<a style={{color: "black"}} href="/recuperar">Esqueceu-se da password?</a></h5>
                    </div>
                    <hr></hr>
                    <div style={{padding: "15px"}}>
                        <h5 className="text-center" style={{fontSize: "15px"}}>Não tem conta?&nbsp;<a style={{color: "black"}} href="/registar">Registar</a></h5>
                    </div>
                </div>
            </div>
        </div>
    );
}