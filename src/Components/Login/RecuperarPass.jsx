import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import './Login.css'
import '../../index.css'
import authService from './auth-service';

export default function Recuperar() {
    const url = "http://localhost:8080/";

    const [USERNAME, setUSERNAME] = useState('')
    const [tokenRecuperar, setTokenRecuperar] = useState('')
    const [tokenUser, setTokenUser] = useState('')

    const [recuperarPhase, setRecuperar] = useState(true)
    const [tokenPhase, setTokenP] = useState(false)
    const [alterarPhase, setAlterar] = useState(false)

    const [password, setPassword] = useState('')
    const [passwordD, setpasswordD] = useState('')
    
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login"

        if(authService.getCurrentUser()){
            navigate('calendario')
        }
        
    }, [])

    function HandleRecuperar(event){
        event.preventDefault();
        authService.recuperar(USERNAME)
        .then(res => {
            if(res.success){
                alert("Foi enviado um token para o seu email")
                setTokenRecuperar(res.token)
                setRecuperar(false)
                setTokenP(true)
            }
            else{
                alert("Erro a criar o token")
            }
        })
        .catch(err => {
            alert('Tentativa falhada')
            console.log(err)
        })
    }

    function HandleVerificarToken(event){
        event.preventDefault();
        if(tokenRecuperar == tokenUser){
            setTokenP(false)
            setAlterar(true)
        }
    }

    function HandleAlterar(event){
        event.preventDefault();

        if(password != passwordD){
            alert("As passwords não são iguais")
        }
        else{
            authService.alterar(USERNAME, password, tokenRecuperar)
            .then(res => {
                if(res.success){
                    alert("A password foi alterada com sucesso. Faça login.")
                    navigate('/login')
                }
                else{
                    alert(res.message)
                }
            })
            .catch(err => {
                alert('Tentativa falhada')
            })
        } 
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
            {recuperarPhase &&
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="login-box" style={{zIndex: 1000, backgroundColor: "#eee", boxShadow: "2px 2px 50px #777"}}>
                    <h2 className="text-center mb-4">Recuperar Password</h2>
                    <form className="w-80 mx-auto">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Utilizador</label>
                            <input type="text" className="form-control" id="username" placeholder="Introduza o seu nickname" onChange={(value) => setUSERNAME(value.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-info w-100" onClick={HandleRecuperar}>Recuperar password</button>
                    </form>
                    <hr></hr>
                    <div style={{padding: "15px"}}>
                        <h5 className="text-center" style={{fontSize: "15px"}}>Lembrou-se?&nbsp;<a style={{color: "black"}} href="/login">Faça login!</a></h5>
                    </div>
                </div>
            </div>
            }

            {tokenPhase &&
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="login-box" style={{zIndex: 1000, backgroundColor: "#eee", boxShadow: "2px 2px 50px #777"}}>
                    <h2 className="text-center mb-4">Verificação do token</h2>
                    <form className="w-80 mx-auto">
                        <div className="mb-3">
                            <label htmlFor="token" className="form-label">Token</label>
                            <input type="text" className="form-control" id="token" placeholder="Introduza o token que recebeu no email" onChange={(value) => setTokenUser(value.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-info w-100" onClick={HandleVerificarToken}>Verificar token</button>
                    </form>
                </div>
            </div>
            }

            {alterarPhase &&
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="login-box" style={{zIndex: 1000, backgroundColor: "#eee", boxShadow: "2px 2px 50px #777"}}>
                    <h2 className="text-center mb-4">Verificação do token</h2>
                    <form className="w-80 mx-auto">
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="text" className="form-control" id="password" placeholder="Introduza a sua nova password" onChange={(value) => setPassword(value.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordD" className="form-label">Repita password</label>
                            <input type="text" className="form-control" id="passwordD" placeholder="Introduza a password uma vez mais" onChange={(value) => setpasswordD(value.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-info w-100" onClick={HandleAlterar}>Alterar palavra-passe</button>
                    </form>
                </div>
            </div>
            }
        </div>
    );
}