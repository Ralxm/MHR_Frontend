import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './Registar.css'
import '../../index.css'
import authService from "../Login/auth-service";


export default function Registar() {
    const [USERNAME, setUSERNAME] = useState('')
    const [PASSWORD, setPASSWORD] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login"

        if (authService.getCurrentUser()) {
            navigate('calendario')
        }
    }, [])

    function HandleRegisto(event) {
        event.preventDefault();
        authService.registo(USERNAME, PASSWORD)
            .then(res => {
                if (res === "" || res === false) {
                    alert('Erro na conexão a tentar realizar o registo');
                }
                else {
                    if (res.success) {
                        alert("Registo feito com sucesso, faça login!");
                        navigate('/login');
                    }
                    else {
                        alert('Erro a realizar o registo');
                    }
                }
            })
            .catch(err => {
                alert('Registo falhou');
                console.log(err);
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
                <div className="login-box" style={{ zIndex: 1000, backgroundColor: "#eee", boxShadow: "2px 2px 50px #777" }}>
                    <h2 className="text-center mb-4">Registar</h2>
                    <form className="w-80 mx-auto">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Utilizador</label>
                            <input type="text" className="form-control" id="username" placeholder="Introduza o seu nickname" onChange={(value) => setUSERNAME(value.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Introduza a sua password" onChange={(value) => setPASSWORD(value.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-info w-100" onClick={HandleRegisto}>Fazer registo</button>
                    </form>
                    <hr></hr>
                    <div style={{ padding: "15px" }}>
                        <h5 className="text-center" style={{ fontSize: "15px" }}>Já tem conta?&nbsp;<a style={{ color: "black" }} href="/login">Faça login!</a></h5>
                    </div>
                </div>
            </div>
        </div>
    );
}