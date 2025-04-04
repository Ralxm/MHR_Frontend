import { Route, Routes } from "react-router-dom";
import React from 'react'

import Login from '../Components/Login/Login'
import Registar from "../Components/Registar/Registar";
import Recuperar from "../Components/Login/RecuperarPass";
import Despesas from "../Components/Despesas/Despesas";
import Calendario from "../Components/Calendario/Calendario";
import Projetos from "../Components/Projetos/Projetos";
import Projeto from "../Components/Projetos/Projeto";
import Vagas from "../Components/Vagas/Vagas";

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
                <Route path='/projetos' element={<Projetos></Projetos>}>
                </Route>
                <Route path='/projeto/:id' element={<Projeto></Projeto>}>
                </Route>
                <Route path='/vagas' element={<Vagas></Vagas>}>
                </Route>
            </Routes>
        </div>
    )
}