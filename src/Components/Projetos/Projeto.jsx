import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from "../../Universal/NavBar";
import Footer from "../../Universal/Footer";
import './Projetos.css';
import '../../index.css'

export default function Projeto(){
    const { id } = useParams();

    useEffect(() => {
        document.title = "Projeto"
    }, [])

    return (
            <div id="root">
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
                }}> </div>
                <div></div>
                <NavBar />
                <div className="page-container-projetos">
                    <div className="container-fluid">
                        <div className="row" >
                            {/* Coluna da esquerda */}
                            
    
                            {/* Coluna da direita */}
                            
                        </div>
                    </div>
                </div>
            </div>
        );
}