import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../../Universal/NavBar";
import './Projetos.css';
import '../../index.css'
import authService from '../Login/auth-service';

let projetos = [{
    id_projeto: 1,
    titulo_projeto: 'titulo 1',
    estado: "Em Desenvolvimento",
    data_atribuicao: '12-03-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '01-03-2025',
    data_final_prevista: '29-03-2025'
},
{
    id_projeto: 2,
    titulo_projeto: 'titulo 2',
    estado: "Concluído",
    data_atribuicao: '12-02-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '03-03-2025',
    data_final_prevista: '25-03-2025'
},
{
    id_projeto: 3,
    titulo_projeto: 'titulo 2',
    estado: "Concluído",
    data_atribuicao: '12-02-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '03-03-2025',
    data_final_prevista: '25-03-2025'
},
{
    titulo_projeto: 'titulo 2',
    estado: "Concluído",
    data_atribuicao: '12-02-2025',
    descricao: 'descricao',
    objetivos: 'objetivos',
    data_inicio: '03-03-2025',
    data_final_prevista: '25-03-2025'
}]

export default function Projetos() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Projetos e ideias"

        if (!authService.getCurrentUser()) {
            navigate('/login')
        }

        let tipo = localStorage.getItem('tipo');
        if (tipo == 5) {
            navigate('/vagas')
        }
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
                        <div className="col-md-9" style={{ zIndex: 1000 }}>
                            <div className='row items-container'>
                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                    <h3 className='mb-0'>Projetos</h3>
                                    {/* função de criação de projeto apenas se a conta logada for um manager
                                        <button className='btn btn-info'>Criar um projeto</button>
                                         */}
                                </div>

                                <ListProjetos></ListProjetos>
                            </div>
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-3" style={{ zIndex: 1000 }}>
                            <div className='row items-container'>
                                <h3>Submissão de Ideia</h3>
                                <form>
                                    <label>Título</label>
                                    <input></input>
                                </form>
                            </div>
                            <div className='row items-container'>
                                <h3>Ideias</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function ListProjetos() {
    const getShadowClass = (estado) => {
        switch (estado) {
            case "Justificada":
                return "shadow-justificada";
            case "Por Justificar":
                return "shadow-por-justificar";
            case "Injustificada":
                return "shadow-injustificada";
            case "Em Análise":
                return "shadow-em-analise";
            default:
                return "";
        }
    };

    return projetos.map((projeto) => (
        <div className={`border rounded p-3 mb-3 ${getShadowClass(projeto.estado)}`} style={{ cursor: "pointer" }} onClick={() => window.location.href = '/projeto/' + projeto.id_projeto}>
            <div className='row mb-2'>
                <div className='col-md-6'>
                    <strong>Título: </strong> {projeto.titulo_projeto}
                </div>
                <div className='col-md-6'>
                    <strong>Estado: </strong> {projeto.estado}
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <strong>Tipo: </strong> {projeto.descricao}
                </div>
            </div>
        </div>
    ));
}