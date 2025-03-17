import React, { useEffect, useRef } from 'react';
import { createSwapy } from 'swapy';
import NavBar from "../../Universal/NavBar";
import Footer from "../../Universal/Footer";
import './Despesas.css';
import '../../index.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
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
    const swapy = useRef(null);
    const container = useRef(null);

    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current);

            swapy.current.onSwap((event) => {
                console.log('swap', event);
            });
        }

        return () => {
            swapy.current?.destroy();
        };
    }, []);

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
            <div className="page-container-despesas" ref={container} >
                <div className="container-fluid">
                    <div className="row" >
                        {/* Coluna da esquerda */}
                        <div className="col-md-6" style={{ zIndex: 1000 }}>
                            <div data-swapy-slot="form" className='col-md-12'>
                                <div className="form-container" data-swapy-item="form">
                                    <h3>Criar uma despesa</h3>
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
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>

                            <div className="mt-4" data-swapy-slot="calendar">
                                <div className="form-container" data-swapy-item="calendar">
                                    <h3>Calendário</h3>
                                    <CalendarComponent />
                                </div>
                            </div>
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-6" style={{ zIndex: 1000 }}>
                            <div className="" data-swapy-slot="despesas">
                                <div className="items-container" data-swapy-item="despesas" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    <h3>Despesas</h3>
                                    <ExemplosDespesas />
                                </div>
                            </div>

                            <div className='row'>

                                <div className="my-4 col-md-6" data-swapy-slot="items">
                                    <div className="items-container" data-swapy-item="items" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <h3>Sumário de despesas</h3>
                                        <SumarioDespesas />
                                    </div>
                                </div>

                                <div className="my-4 col-md-6" data-swapy-slot="recente">
                                    <div className="items-container" data-swapy-item="recente" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <h3>Despesa mais recente</h3>
                                        <DespesaRecente />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const CalendarComponent = ({ events }) => {
    moment.locale("pt")
    const localizer = momentLocalizer(moment);
    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

function ExemplosDespesas() {
    return despesas.map((despesa, index) => (
        <div key={index} className="container mb-3 p-3 border rounded">
            <div className="row">
                <div className="col-md-3">
                    <strong>Data:</strong> {despesa.data}
                </div>
                <div className="col-md-3">
                    <strong>Descrição:</strong> {despesa.descricao}
                </div>
                <div className="col-md-2">
                    <strong>Valor:</strong> {despesa.valor}
                </div>
                <div className="col-md-2">
                    <strong>Estado:</strong> {despesa.estado}
                </div>
                <div className="col-md-2">
                    <strong>Reembolsada por:</strong> {despesa.reembolsada_por}
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-md-6">
                    <strong>Validador:</strong> {despesa.validador}
                </div>
                <div className="col-md-6">
                    <strong>Comentários:</strong> {despesa.comentarios}
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-md-12">
                    <strong>Anexo:</strong> <a href={despesa.anexo} target="_blank" rel="noopener noreferrer">Link para o ficheiro</a>
                </div>
            </div>
        </div>
    ));
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

function DespesaRecente() {
    let despesa = despesas[0];
    return (
        <div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <td><strong>Data</strong></td>
                        <td>{despesa.data}</td>
                    </tr>
                    <tr>
                        <td><strong>Descrição</strong></td>
                        <td>{despesa.descricao}</td>
                    </tr>
                    <tr>
                        <td><strong>Valor</strong></td>
                        <td>{despesa.valor}</td>
                    </tr>
                    <tr>
                        <td><strong>Estado</strong></td>
                        <td>{despesa.estado}</td>
                    </tr>
                    <tr>
                        <td><strong>Anexo</strong></td>
                        <td>{despesa.anexo}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}