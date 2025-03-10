import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import NavBar from "../../Universal/NavBar";
import Footer from "../../Universal/Footer";
import './Registar.css'

//Background na página de login
//repeat
//space
//round


export default function Registar() {
    return (
        <div className="page-container">
            <NavBar />
            <div className="content" style={{background: `url('${process.env.PUBLIC_URL}/Logo_preto.png')`, backgroundRepeat: "round"}}>
                <div className="login-box">
                    <h2 className="text-center mb-4">Registar</h2>
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
                        <h5 className="text-center mb-4" >Já tem conta?</h5>
                        <div className="text-center mb-4">
                            <a>Faça Login</a>
                        </div>
                    </div>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
}