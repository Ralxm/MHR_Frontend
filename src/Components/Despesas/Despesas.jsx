import React, { useEffect, useRef, useState } from 'react';
import NavBar from "../../Universal/NavBar";
import Footer from "../../Universal/Footer";
import './Despesas.css';
import '../../index.css'
import 'react-big-calendar/lib/css/react-big-calendar.css';

let despesas = [{
    data: "19-02-2023",
    descricao: 'Uma descricao interessante',
    valor: '49.02',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Aprovada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "23-11-2024",
    descricao: 'Uma descricao interessante',
    valor: '156.72',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Em análise",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "11-12-2024",
    descricao: 'Uma descricao interessante',
    valor: '288.99',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Rejeitada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "04-01-2025",
    descricao: 'Uma descricao interessante',
    valor: '56.23',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Rejeitada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    data: "23-02-2025",
    descricao: 'Uma descricao interessante',
    valor: '542.55',
    anexo: 'link para o ficheiro',
    validador: 'nome do validador',
    estado: "Reembolsada",
    reembolsada_por: "nome do reembolsador",
    comentarios: "um comentario do validador ou reembolsador"
}];

export default function Despesas() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedDespesa, setSelectedDespesa] = useState(null);

    const toggleCreateDespesa = () => {
        setIsFormVisible(!isFormVisible);
        setSelectedDespesa(null);
    };

    const handleVerDetalhes = (despesa) => {
        setSelectedDespesa(despesa);
        setIsFormVisible(false);
    };

    const handleCloseDetalhes = () => {
        setSelectedDespesa(null);
    };

    useEffect(() =>{
        document.title = "Despesas"
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
            <div className="page-container-despesas">
                <div className="container-fluid">
                    <div className="row" >
                        {/* Coluna da esquerda */}
                        <div className="col-md-6" style={{ zIndex: 1000 }}>

                            {/* Listagem de uma despesa */}
                            <div className="items-container" style={{ minHeight: '80vh', maxHeight: '80vh', overflowY: 'auto' }}>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h3 className="mb-0">Despesas</h3>
                                    <strong><span className='m-0' style={{ cursor: 'pointer', fontSize: '32px' }} onClick={toggleCreateDespesa}>+</span></strong>
                                </div>
                                <ExemplosDespesas onVerDetalhes={handleVerDetalhes} />
                            </div>

                            {/* Sumario de despesas quando os detalhes ou criação estão ativos */}
                            {(isFormVisible || selectedDespesa != null) && (
                                <div className='row'>
                                    <div className="col-md-6 my-4">
                                        <div className="items-container">
                                            <h3>Sumário de despesas</h3>
                                            <SumarioDespesas />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-6" style={{ zIndex: 1000 }}>

                            {/* Criação de uma despesa */}
                            <div className='col-md-12 mb-4' style={{ display: isFormVisible ? "block" : "none" }} id="despesaCreate">
                                <div className="form-container">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h3 className="mb-0">Criar uma despesa</h3>
                                        <strong><span className='m-0' style={{ cursor: 'pointer', fontSize: '32px' }} onClick={toggleCreateDespesa}>x</span></strong>
                                    </div>
                                    <form>
                                        <div className="mb-3 mx-5">
                                            <label htmlFor="input1" className="form-label">Data</label>
                                            <input type="date" className="form-control" id="input1" />
                                        </div>
                                        <div className="mb-3 mx-5">
                                            <label htmlFor="input2" className="form-label">Descrição</label>
                                            <input type="text" className="form-control" id="input2" />
                                        </div>
                                        <div className="mb-3 mx-5">
                                            <label htmlFor="input3" className="form-label">Valor</label>
                                            <input type="text" className="form-control" id="input3" />
                                        </div>
                                        <div className="mb-3 mx-5">
                                            <label htmlFor="input3" className="form-label">Anexo</label>
                                            <input type="file" className="form-control" id="input3" />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Criar</button>
                                    </form>
                                </div>
                            </div>

                            {/* Detalhes Despesa */}
                            {selectedDespesa && (
                                <div className='col-md-12 mb-4' id="detalhesDespesa">
                                    <div className="form-container">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h3 className="mb-0">Detalhes da Despesa</h3>
                                            <strong><span className='m-0' style={{ cursor: 'pointer', fontSize: '32px' }} onClick={handleCloseDetalhes}>x</span></strong>
                                        </div>
                                        <DetalhesDespesa despesa={selectedDespesa} />
                                    </div>
                                </div>
                            )}

                            {/* Sumário Despesas */}
                            {(!isFormVisible && selectedDespesa == null) && (
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="items-container">
                                            <h3>Sumário de despesas</h3>
                                            <SumarioDespesas />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetalhesDespesa({ despesa }) {
    return (
        <div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Data:</strong></label>
                <p>{despesa.data}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Descrição:</strong></label>
                <p>{despesa.descricao}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Valor:</strong></label>
                <p>{despesa.valor}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Anexo:</strong></label>
                <p>{despesa.anexo}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Validador:</strong></label>
                <p>{despesa.validador}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Estado:</strong></label>
                <p>{despesa.estado}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Reembolsada por:</strong></label>
                <p>{despesa.reembolsada_por}</p>
            </div>
            <div className="mb-3 mx-5">
                <label className="form-label"><strong>Comentários:</strong></label>
                <p>{despesa.comentarios}</p>
            </div>
        </div>
    );
}

function ExemplosDespesas({ onVerDetalhes }) {
    const getShadowClass = (estado) => {
        switch (estado) {
            case "Aprovada":
                return "shadow-aprovada";
            case "Em análise":
                return "shadow-em-analise";
            case "Rejeitada":
                return "shadow-rejeitada";
            case "Reembolsada":
                return "shadow-reembolsada";
            default:
                return "";
        }
    };

    return (
        <div className="row">
            {despesas.map((despesa, index) => (
                <div key={index} className="col-md-6 mb-3">
                    <div className={`border rounded p-3 ${getShadowClass(despesa.estado)}`}>
                        <div className="row">
                            <div className="col-md-6">
                                <strong>Data:</strong> {despesa.data}
                            </div>
                            <div className="col-md-6">
                                <strong>Valor:</strong> {despesa.valor}
                            </div>
                        </div>
                        <div className="row mt-3 align-items-center">
                            <div className="col-md-6">
                                <strong>Estado:</strong> {despesa.estado}
                            </div>
                            <div className="col-md-6">
                                <button className='btn btn-secondary' onClick={() => onVerDetalhes(despesa)}>Ver detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SumarioDespesas() {
    let valorAprovado = 0;
    let valorRejeitado = 0;
    let valorEmAnalise = 0;
    let valorReembolsado = 0;

    let totalAprovado = 0;
    let totalRejeitado = 0;
    let totalEmAnalise = 0;
    let totalReembolsado = 0;
    despesas.map((despesa) => {
        if (despesa.estado === "Aprovada") {
            valorAprovado += parseFloat(despesa.valor);
            totalAprovado++;
        }
        else if (despesa.estado === "Em análise") {
            valorRejeitado += parseFloat(despesa.valor);
            totalRejeitado++;
        }
        else if (despesa.estado === "Rejeitada") {
            valorEmAnalise += parseFloat(despesa.valor);
            totalEmAnalise++;
        }
        else if (despesa.estado === "Reembolsada") {
            valorReembolsado += parseFloat(despesa.valor);
            totalReembolsado++;
        }
    });
    return (
        <div className="container mb-3 p-3 border rounded">
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Estado:</strong></td>
                        <td><strong>Quantidade</strong></td>
                        <td><strong>Valor</strong></td>
                    </tr>
                    <tr>
                        <td>Reembolsadas</td>
                        <td>{totalReembolsado}</td>
                        <td>{valorReembolsado}€</td>
                    </tr>
                    <tr>
                        <td>Aprovadas</td>
                        <td>{totalAprovado}</td>
                        <td>{valorAprovado}€</td>
                    </tr>
                    <tr>
                        <td>Em análise</td>
                        <td>{totalEmAnalise}</td>
                        <td>{valorEmAnalise}€</td>
                    </tr>
                    <tr>
                        <td>Rejeitadas</td>
                        <td>{totalRejeitado}</td>
                        <td>{valorRejeitado}€</td>
                    </tr>
                </tbody>
            </table>

            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{totalAprovado + totalEmAnalise + totalReembolsado + totalRejeitado}</td>
                        <td>{valorAprovado + valorEmAnalise + valorReembolsado + valorRejeitado}€</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}