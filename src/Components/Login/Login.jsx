import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import NavBar from "../../Universal/NavBar";
import Footer from "../../Universal/Footer";
import './Login.css'

//Background na página de login
//repeat
//space
//round


export default function Login() {
    return (
        <div className="page-container">
            <div className="content" style={{
                background: `url('${process.env.PUBLIC_URL}/Logosvg.svg')`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "auto",
                transform: "rotate(-25deg) scale(1.5)",
                backgroundAttachment: "fixed",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden"
            }}>
                <div className="login-box" style={{transform: "rotate(25deg) scale(0.75)"}}>
                    <h2 className="text-center mb-4">Login</h2>
                    <form className="w-80 mx-auto">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Utilizador</label>
                            <input type="text" className="form-control" id="username" placeholder="Introduza o seu nome" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Introduza a sua password" />
                        </div>
                        <button type="submit" className="btn btn-dark w-100">Login</button>
                    </form>
                    <div style={{margin: "30px"}}>
                        <h5 className="text-center mb-4">Não tem conta?</h5>
                        <div className="text-center mb-4">
                            <a href="/registar">Registar</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}