import { Route, Routes } from "react-router-dom";
import React from 'react'

import Login from '../Components/Login/Login'
import Registar from "../Components/Registar/Registar";
import Despesas from "../Components/Despesas/Despesas";

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
                <Route path='/despesas' element={<Despesas></Despesas>}>
                </Route>
            </Routes>
        </div>
    )
}