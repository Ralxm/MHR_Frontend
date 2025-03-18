import React, { useEffect, useRef, useState } from 'react';
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
    data_falta: "05-03-2025",
    justificacao: 'link para o ficheiro',
    motivo: 'Avaria no carro',
    estado: "Justificada",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "2",
    data_falta: "17-03-2025",
    justificacao: 'link para o ficheiro',
    motivo: 'Greve nos transportes públicos',
    estado: "Por Justificar",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "1",
    data_falta: "19-02-2025",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Por Justificar",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "1",
    data_falta: "20-02-2025",
    justificacao: 'link para o ficheiro',
    motivo: 'motivo da falta',
    estado: "Em Análise",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
},
{
    id_tipo_falta: "1",
    data_falta: "24-02-2025",
    justificacao: 'link para o ficheiro',
    motivo: 'Morte do animal de estimação',
    estado: "Injustificada",
    validador: "nome do validador",
    comentarios: "um comentario do validador ou reembolsador"
}];

let ferias = [{
    data_inicio: '24-03-2025',
    data_fim: '28-03-2025',
    estado: "Aprovadas"
}]

export default function Calendario() {
    const swapy = useRef(null);
    const container = useRef(null);
    const [isFaltasFormVisible, setIsFaltasFormVisible] = useState(false);
    const [isFeriasFormVisible, setIsFeriasFormVisible] = useState(false);

    const [selectedFalta, setSelectedFalta] = useState(null);

    const toggleJustificarFaltas = (falta) => {
        setSelectedFalta(falta)
        setIsFaltasFormVisible(true);
    };

    const toggleCreateFerias = () => {
        setIsFeriasFormVisible(!isFeriasFormVisible);
    };

    const handleCloseFaltas = () => {
        setSelectedFalta(null)
        setIsFaltasFormVisible(null);
    };

    const handleCloseFerias = () => {
        setIsFeriasFormVisible(null);
    };

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
                                {selectedFalta &&
                                    <JustificarFalta></JustificarFalta>
                                }

                                <CriarFerias></CriarFerias>
                            </div>

                            <div className='row'>
                                <div className="col-md-6" data-swapy-slot="faltas">
                                    <div className="items-container" data-swapy-item="faltas" style={{height: '80vh', overflowY: 'auto' }}>
                                        <h3 className="mb-4">Faltas</h3>
                                        <ExemplosFaltas justificar={toggleJustificarFaltas}></ExemplosFaltas>
                                    </div>
                                </div>

                                <div className="col-md-6" data-swapy-slot="ferias">
                                    <div className="items-container" data-swapy-item="ferias" style={{ height: '80vh', overflowY: 'auto' }}>
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h3 className="mb-0">Férias</h3>
                                            <button className='btn btn-outline-secondary' onClick={toggleCreateFerias}> Marcar Férias</button>
                                        </div>
                                        <ExemplosFerias></ExemplosFerias>
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

    function ExemplosFaltas({ justificar }) {
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

        return faltas.map((falta) => (
            <div className={`border rounded p-3 mb-3 ${getShadowClass(falta.estado)}`}>
                <div className='row mb-2'>
                    <div className='col-md-6'>
                        <strong>Data: </strong> {falta.data_falta}
                    </div>
                    <div className='col-md-6'>
                        <strong>Estado: </strong> {falta.estado}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <strong>Tipo: </strong> {falta.id_tipo_falta}
                    </div>
                    {falta.estado == "Por Justificar" &&
                        <div className='col-md-6'>
                            <button className='btn btn-warning' onClick={() => justificar(falta)}>Justificar</button>
                        </div>
                    }
                </div>
            </div>
        ));
    }

    function ExemplosFerias() {
        const getShadowClass = (estado) => {
            switch (estado) {
                case "Aprovadas":
                    return "shadow-aprovadas";
                case "Rejeitadas":
                    return "shadow-rejeitadas";
                case "Em Análise":
                    return "shadow-em-analise";
                default:
                    return "";
            }
        };

        return ferias.map((feria) => (
            <div className={`border rounded p-3 mb-3 ${getShadowClass(feria.estado)}`}>
                <div className='row mb-2'>
                    <div className='col-md-6'>
                        <strong>Data Ínicio: </strong> {feria.data_inicio}
                    </div>
                    <div className='col-md-6'>
                        <strong>Data Fim: </strong> {feria.data_fim}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        <strong>Estado: </strong> {feria.estado}
                    </div>
                </div>
            </div>
        ));
    }

    function JustificarFalta() {
        return (
            <div data-swapy-slot="form" className='col-md-6 mb-4' style={{ display: isFaltasFormVisible ? "block" : "none" }}>
                <div className="form-container" data-swapy-item="form">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="mb-0">Justificar a falta</h3>
                        <strong><span className='m-0' style={{ cursor: 'pointer', fontSize: '24px' }} onClick={handleCloseFaltas}>x</span></strong>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-md-6'>
                            <strong>Data:</strong> {selectedFalta.data_falta}
                        </div>
                        <div className='col-md-6'>
                            <strong>Tipo Falta:</strong> {selectedFalta.id_tipo_falta}
                        </div>
                    </div>
                    <strong>Comentário</strong> {selectedFalta.comentarios}
                    <form className='mt-2'>
                        <div className="mb-3 mx-5">
                            <label htmlFor="input3" className="form-label">Motivo</label>
                            <input type="text" className="form-control" id="input3" />
                        </div>
                        <div className="mb-3 mx-5">
                            <label htmlFor="input3" className="form-label">Justificação</label>
                            <input type="file" className="form-control" id="input3" />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">Justificar</button>
                    </form>
                </div>
            </div>
        )
    }

    function CriarFerias() {
        return (
            <div data-swapy-slot="faltaseferias" className='col-md-6 mb-4' style={{ display: isFeriasFormVisible ? "block" : "none" }}>
                <div className="form-container" data-swapy-item="faltaseferias">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="mb-0">Marcar férias</h3>
                        <strong><span className='m-0' style={{ cursor: 'pointer', fontSize: '24px' }} onClick={handleCloseFerias}>x</span></strong>
                    </div>
                    <form>
                        <div className="mb-3 mx-5">
                            <label htmlFor="input1" className="form-label">Data Ínicio</label>
                            <input type="date" className="form-control" id="input1" />
                        </div>
                        <div className="mb-3 mx-5">
                            <label htmlFor="input1" className="form-label">Data Conclusão</label>
                            <input type="date" className="form-control" id="input1" />
                        </div>
                        <button type="submit" className="btn btn-primary">Marcar</button>
                    </form>
                </div>
            </div>
        )
    }
}

const transformFaltasAndFeriasToEvents = (faltas, ferias) => {
    const eventos = [];

    const faltasEvents = faltas.map((falta) => ({
        title: `Falta: ${falta.motivo}`,
        start: new Date(moment(falta.data_falta, "DD-MM-YYYY").toDate()),
        end: new Date(moment(falta.data_falta, "DD-MM-YYYY").toDate()),
        allDay: true,
        resource: falta,
    }));

    const feriasEvents = ferias.map((feria) => ({
        title: 'Férias',
        start: new Date(moment(feria.data_inicio, "DD-MM-YYYY").toDate()),
        end: new Date(moment(feria.data_fim, "DD-MM-YYYY").toDate() + 1),
        allDay: true,
        resource: feria,
    }));

    eventos.push(...faltasEvents, ...feriasEvents);

    return eventos;
};

const CalendarComponent = () => {
    moment.locale("pt")
    const localizer = momentLocalizer(moment);
    const events = transformFaltasAndFeriasToEvents(faltas, ferias);

    const eventPropGetter = (event) => {
        let backgroundColor = '';
        switch (event.resource.estado) {
            case "Justificada":
                backgroundColor = '#28a745';
                break;
            case "Por Justificar":
                backgroundColor = '#ffc107';
                break;
            case "Injustificada":
                backgroundColor = '#dc3545';
                break;
            case "Em Análise":
                backgroundColor = 'orange';
                break;
            case "Aprovadas":
                backgroundColor = '#28a745';
                break;
            default:
                backgroundColor = '#6c757d';
        }

        return {
            style: {
                backgroundColor,
                color: '#fff',
                borderRadius: '4px',
                border: 'none',
            },
        };
    };

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                eventPropGetter={eventPropGetter}
                messages={{
                    today: 'Hoje',
                    previous: 'Anterior',
                    next: 'Próximo',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                }}
            />
        </div>
    );
};

