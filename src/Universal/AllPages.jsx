import { Route, Routes } from "react-router-dom";
import React from 'react'

import Login from '../Components/Login/Login'
import Registar from "../Components/Registar/Registar";
import Recuperar from "../Components/Login/RecuperarPass";

import Despesas from "../Components/Despesas/Despesas";

import Calendario from "../Components/Calendario/Calendario";
import MarcarFalta from "../Components/Calendario/MarcarFalta";
import MarcarFerias from "../Components/Calendario/MarcarFerias";
import FaltasUtilizadores from "../Components/Calendario/FaltasUtilizadores";
import FaltasPessoais from "../Components/Calendario/FaltasPessoais";
import FeriasPessoais from "../Components/Calendario/FeriasPessoais";
import MapaFerias from "../Components/Calendario/MapaFerias";
import PedidosFerias from "../Components/Calendario/PedidoFerias";
import TiposFalta from "../Components/Calendario/TiposFalta";
import Feriados from "../Components/Calendario/Feriados";

import Projetos from "../Components/Projetos/Projetos";
import Projeto from "../Components/Projetos/Projeto";
import EditarProjeto from "../Components/Projetos/EditarProjeto";

import Vagas from "../Components/Vagas/Vagas";
import Vaga from '../Components/Vagas/Vaga'
import CriarVaga from "../Components/Vagas/CriarVaga";
import EditarVaga from "../Components/Vagas/EditarVaga";

import Blog from "../Components/Blog/Blog";
import BlogTodasPublicacoes from "../Components/Blog/BlogTodasPublicacoes";
import BlogPorUtilizador from "../Components/Blog/BlogPorUtilizador";
import BlogPorAprovar from "../Components/Blog/BlogPorAprovar";
import Publicacao from "../Components/Blog/Publicacao";
import EditarPublicacao from "../Components/Blog/EditarPublicacao";

import Perfil from "../Components/Perfil/Perfil";
import Empresa from "../Components/Gestao/Empresa";
import Utilizadores from "../Components/Gestao/Utilizadores";
import Departamentos from "../Components/Gestao/Departamentos";
import AuditLog from "../Components/Gestao/AuditLog";


export default function MainPage(){
    return (
        <div>
            <Routes>
                <Route path='/' element={<Login></Login>}>
                </Route>
                <Route path='/login' element={<Login></Login>}>
                </Route>
                <Route path='/registar' element={<Registar></Registar>}>
                </Route>
                <Route path='/recuperar' element={<Recuperar></Recuperar>}>
                </Route>

                <Route path='/despesas' element={<Despesas></Despesas>}>
                </Route>

                <Route path='/calendario' element={<Calendario></Calendario>}>
                </Route>
                <Route path='/calendario/marcar_falta' element={<MarcarFalta></MarcarFalta>}>
                </Route>
                <Route path='/calendario/marcar_ferias' element={<MarcarFerias></MarcarFerias>}>
                </Route>
                <Route path='/calendario/faltas_utilizadores' element={<FaltasUtilizadores></FaltasUtilizadores>}>
                </Route>
                <Route path='/calendario/faltas_pessoais' element={<FaltasPessoais></FaltasPessoais>}>
                </Route>
                <Route path='/calendario/ferias_pessoais' element={<FeriasPessoais></FeriasPessoais>}>
                </Route>
                <Route path='/calendario/mapa_ferias' element={<MapaFerias></MapaFerias>}>
                </Route>
                <Route path='/calendario/pedidos_ferias' element={<PedidosFerias></PedidosFerias>}>
                </Route>
                <Route path='/calendario/tipos_faltas' element={<TiposFalta></TiposFalta>}>
                </Route>
                <Route path='/calendario/feriados' element={<Feriados></Feriados>}>
                </Route>

                <Route path='/projetos' element={<Projetos></Projetos>}>
                </Route>
                <Route path='/projeto/:id' element={<Projeto></Projeto>}>
                </Route>
                <Route path='/projeto/editar/:id' element={<EditarProjeto></EditarProjeto>}>
                </Route>

                <Route path='/vagas' element={<Vagas></Vagas>}>
                </Route>
                <Route path='/vagas/:id' element={<Vaga></Vaga>}>
                </Route>
                <Route path='/vagas/criar' element={<CriarVaga></CriarVaga>}>
                </Route>
                <Route path='/vagas/editar/:id' element={<EditarVaga></EditarVaga>}>
                </Route>

                <Route path='/blog' element={<Blog></Blog>}>
                </Route>
                <Route path='/blog/todas' element={<BlogTodasPublicacoes></BlogTodasPublicacoes>}>
                </Route>
                <Route path='/blog/por_utilizador' element={<BlogPorUtilizador></BlogPorUtilizador>}>
                </Route>
                <Route path='/blog/por_aprovar' element={<BlogPorAprovar></BlogPorAprovar>}>
                </Route>
                <Route path='/blog/:id' element={<Publicacao></Publicacao>}>
                </Route>
                <Route path='/blog/editar/:id' element={<EditarPublicacao></EditarPublicacao>}>
                </Route>

                
                <Route path='/perfil' element={<Perfil></Perfil>}>
                </Route>
                <Route path='/empresa' element={<Empresa></Empresa>}>
                </Route>
                <Route path='/utilizadores' element={<Utilizadores></Utilizadores>}>
                </Route>
                <Route path='/departamentos' element={<Departamentos></Departamentos>}>
                </Route>
                <Route path='/auditlog' element={<AuditLog></AuditLog>}>
                </Route>
            </Routes>
        </div>
    )
}