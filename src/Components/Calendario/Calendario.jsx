import React, { useEffect, useRef } from 'react';
import { createSwapy } from 'swapy';
import NavBar from "../../Universal/NavBar";
import Footer from "../../Universal/Footer";
import './Calendario.css';
import '../../index.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

let faltas = [{
    id_tipo_falta: "1",
    data_falta: "19-02-2023",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Aprovada",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "2",
    data_falta: "23-11-2024",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Rejeitada",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "1",
    data_falta: "19-02-2023",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Em Análise",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "1",
    data_falta: "19-02-2023",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Aprovada",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "1",
    data_falta: "19-02-2023",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Rejeitada",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
}];

export default function Calendario() {
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
                            <div className='row'>
                                <div data-swapy-slot="form" className='col-md-6'>
                                    <div className="form-container" data-swapy-item="form">
                                        <h3>Criar uma falta  &#8657;</h3>
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

                                <div data-swapy-slot="faltaseferias" className='col-md-6'>
                                    <div className="form-container" data-swapy-item="faltaseferias">
                                        <h3>Criar férias &#8657;</h3>
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
                            </div>

                            <div className='row'>
                                <div className="mt-4 col-md-6" data-swapy-slot="faltas">
                                    <div className="items-container" data-swapy-item="faltas" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <h3>Faltas</h3>
                                        <ExemplosFaltas></ExemplosFaltas>
                                    </div>
                                </div>

                                <div className="mt-4 col-md-6" data-swapy-slot="ferias">
                                    <div className="items-container" data-swapy-item="ferias" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                        <h3>Ferias</h3>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna da direita */}
                        <div className="col-md-6" style={{ zIndex: 1000 }}>
                            <div className="" data-swapy-slot="calendar">
                                <div className="form-container" data-swapy-item="calendar">
                                    <h3>Calendário</h3>
                                    <CalendarComponent></CalendarComponent>
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

function ExemplosFaltas() {
    return faltas.map((falta, index) => (
        <div key={index} className="container mb-3 p-3 border rounded">
            <div className='row'>
                <div className='col-md-6'>
                    <strong>Data: </strong> {falta.data_falta}
                </div>
                <div className='col-md-6'>
                    <strong>Estado: </strong> {falta.estado}
                </div>
            </div>
            <div className='col-md-6'>
                    <strong><a style={{color: 'black', cursor: "pointer"}}>Ver detalhes</a></strong>
            </div>
            
        </div>
    ));
}

/*function SumarioDespesas() {
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
}*/